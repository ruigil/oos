import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as moment from 'moment-timezone';

admin.initializeApp({ credential: admin.credential.applicationDefault() });

enum Operation {
    Increment,
    Decrement
}

async function getFutureGoals(date:Date) {
    const qs = await admin.firestore().collection("drops").where("date",">",admin.firestore.Timestamp.fromDate(date)).where("type","==","GOAL").get();
    const goals:Array<any> = [];
    qs.forEach( d => goals.push({...d.data(), id: d.id }));
    console.log("getting goals");
    console.log(goals);
    return goals;
}

async function getAnalytics(month:number,year:number) {
    const doc = await admin.firestore().doc("drops/ANALYTICS-"+year+"-"+month).get();
    
    if (doc.exists) return doc.data();
    else throw Error(` No Analytics found for month[${ month }] and year [${ year }] `);
}

const countTotalsType = ( d: any, totals: Array<number>, operation: Operation ) => { 
        /*
         0 -> totals tasks, 
         1 -> total task completed
         2 -> total expenses
         3 -> total incomes
         4 -> total rates
         5 -> total rate values
         6 -> total notes
        */
        const f = operation === Operation.Increment ? 1 : -1;
        switch (d.type) {
            case "NOTE": totals[6] += f; break;
            case "TASK": totals[0] += f; totals[1] += f * (d.task.completed ? 1 : 0); break;
            case "TRX": totals[d.transaction.type === "expense" ? 2 : 3] += f*d.transaction.value; break;
            case "RATE": totals[4] += f; totals[5] += f*d.rate.value; break;
        }
        
        return totals;
};

const countAnalyticsDrop:any = (drop:any, dropa:any, operation: Operation) => {

    if (dropa.type === "ANLY") {
        dropa.analytics.totals = countTotalsType(drop, dropa.analytics.totals,operation)
        drop.tags
        .forEach( (t:any) => dropa.analytics.tags[t] = countTotalsType(drop, dropa.analytics.tags[t] || [0,0,0,0,0,0,0], operation ) );
    }
    if (dropa.type === "GOAL") {
        dropa.goal.totals = countTotalsType(drop, dropa.goal.totals,operation)
        drop.tags
        .filter( (t:any) => dropa.tags.includes(t) )
        .forEach( (t:any) => dropa.goal.tags[t] = countTotalsType(drop, dropa.goal.tags[t] || [0,0,0,0,0,0,0], operation ) );
    }
    
    return dropa;
}

const fillAnalyticsMonth = async (dropa:any) => {
    const endOfMonth = moment(dropa.date.toDate()).tz("Europe/Zurich").endOf('month');
    const startOfMonth = moment(endOfMonth).tz("Europe/Zurich").startOf('month'); 

    // there is a difference between the cloud scheduler time, and the timestamp in the function

    const startOfMonthTS = admin.firestore.Timestamp.fromDate(startOfMonth.toDate());
    const endOfMonthTS = admin.firestore.Timestamp.fromDate(endOfMonth.toDate());
    
    dropa.analytics = { month: startOfMonth.month(), year: startOfMonth.year(), totals: [0,0,0,0,0,0,0], tags: {} };
    
    const qs = await admin.firestore().collection("drops").where("date",">=",startOfMonthTS).where("date","<=",endOfMonthTS).get()
    
    const drops:any = [];
    qs.forEach( d => drops.push(d.data()));
    
    return drops.reduce( (a:any, d:any) => countAnalyticsDrop(d,a,Operation.Increment), dropa );
};

const fillGoal = async (dropa:any) => {
    const start = moment(dropa.createdAt.toDate());
    const end = moment(dropa.date.toDate()); 

    const startTS = admin.firestore.Timestamp.fromDate(start.toDate());
    const endTS = admin.firestore.Timestamp.fromDate(end.toDate());

    dropa.goal = { system: true, completed: false, totals: [0,0,0,0,0,0,0], tags: {} };

    const qs = await admin.firestore().collection("drops").where("date",">=",startTS).where("date","<",endTS).get()
    
    const drops:any = [];
    qs.forEach( d => drops.push(d.data()));

    // filter the drops that have a least one of the goal tags
    // acummulate the total sum of the tags
    const ds = drops.filter( (d:any) => d.tags.some( (t:any) => dropa.tags.includes(t) ) )
    const goal = ds.reduce( (a:any, d:any) => countAnalyticsDrop(d,a,Operation.Increment), dropa )
    
    return goal;
}


/*
export const migrateData = functions.pubsub.topic("oos-time").onPublish(async (message, context) => {
    
    return admin.firestore().collection("drops").limit(10000).get()
    .then( qs => {
        const drops:any = [];
        qs.forEach( d => drops.push({ ...d.data(), id: d.id } ) );
        console.log("Total drops: " + drops.length);

        const promises:any = [];

        drops.map( (drop:any) => { 
            let id = drop.id; 
            delete drop.id; 
            if (!id) console.log(" id is -> " + id);
            //console.log("update id " + id);
            promises.push(admin.firestore().doc("drops/"+id).set( {...drop, deleted: false } ));
        }); 
        return Promise.all(promises).then( s => console.log(drops.length + " drops updated."));
    });    
});
*/

export const updateSettings = functions
    .firestore
    .document('settings/{settingsID}')
    .onWrite((change:any, context) => {
        console.log("setting update...")
        const afterSetting = change.after ? change.after.exists ? change.after.data() : null : null;
        const beforeSetting = change.before ? change.before.exists ? change.before.data() : null : null;

        console.log("Settings before");
        console.log(beforeSetting);

        console.log("Settings after");
        console.log(afterSetting);
        const date = moment().tz("Europe/Zurich").endOf('month');
        const today = moment().tz("Europe/Zurich").startOf('day');
        const todayTS = admin.firestore.Timestamp.fromDate(today.toDate());
        const dateTS = admin.firestore.Timestamp.fromDate(date.toDate());
        const currentTS = admin.firestore.Timestamp.fromDate(moment().toDate());

        let promises:any = [];

        if ((!beforeSetting.system.analytics) && (afterSetting.system.analytics)) {
            // create analytics
            console.log("create analytics drop")
            promises.push(admin.firestore()
            .doc(`drops/ANALYTICS-${ moment().year() }-${ moment().month() }`)
            .set(
            {
                text: "Analytics for " + date.format("MMMM YYYY"),
                type: "ANLY",
                tags: ["ANALYTICS"],
                recurrence: "month",
                analytics: { totals: [0,0,0,0,0,0,0], tags: {} },
                date: dateTS,
                deleted: false,
                uid: afterSetting.uid,
                updatedAt: currentTS,
                createdAt: currentTS,
            }));            
            // TODO: create tag analytics
        }
        if ((!afterSetting.system.analytics) && (beforeSetting.system.analytics)) {
            console.log("delete analytics drop");
            promises.push(admin.firestore()
            .doc(`drops/ANALYTICS-${ moment().year() }-${ moment().month() }`)
            .delete());
            
        }
        if ((!beforeSetting.system.day) && (afterSetting.system.day)) {
            console.log("create day drop");
            // create day
            promises.push(admin.firestore()
            .doc(`drops/DAY-${ moment().year() }-${ moment().month() }-${ moment().date() }`)
            .set(
            {
                text: today.format("dddd, D MMMM YYYY"),
                type: "SYS",
                tags: [],
                recurrence: "day",
                date: todayTS,
                deleted: false,
                uid: afterSetting.uid,
                updatedAt: currentTS,
                createdAt: currentTS,
            }));
            
        }
        if ((beforeSetting.system.day) && (!afterSetting.system.day)) {
            console.log("delete day drop");
            // delete day
            promises.push_(admin.firestore()
            .doc(`drops/DAY-${ moment().year() }-${ moment().month() }-${ moment().date() }`)
            .delete());            
        }

        return Promise.all(promises).then( (r:any) => console.log(" settings updated ")).catch( err => {console.log(" error updateding settings "); console.log(err); } );
    });


export const updateStatistics = functions
    .firestore
    .document('drops/{dropID}')
    .onWrite((change:any, context) => {
        console.log("statistics update...")
        const newDrop = change.after ? change.after.exists ? change.after.data() : null : null;
        const oldDrop = change.before ? change.before.exists ? change.before.data() : null : null;

        if ((!newDrop) && (oldDrop)) { // delete
            if ((oldDrop.type !== "ANLY") && (oldDrop.type !== "GOAL")) {
                const dropDate = oldDrop.date.toDate();

                const month:number = dropDate.getMonth();
                const year:number = dropDate.getFullYear();
                
                return Promise.all( [ getFutureGoals(dropDate),getAnalytics(month,year)] )
                .then( ([goals,a]) => {
                    
                    const promises:any = goals
                    .filter( g => oldDrop.tags.some( (t:any) => g.tags.includes(t)))
                    .map( g => admin.firestore().doc("drops/"+g.id).set(countAnalyticsDrop(oldDrop,g,Operation.Decrement) ) );

                    promises.push(admin.firestore().doc("drops/ANALYTICS-"+year+"-"+month).set(countAnalyticsDrop(oldDrop,a,Operation.Decrement)))
                            
                    return Promise.all(promises).catch( (err) => console.log(err) );
                })
                .catch((err) => console.log(err));
            }
        }

        if ((newDrop) && (!oldDrop)) { // create
            /**
            if drop goal type fill the analytics of the drop, between the creation date (now) and the drop date
            if drop analytics month type fill the anaéytics from the beginnign of the month to the end of the month

            else 
                get future goals, if some tags present update goals
                update monthty analytics
            */

            const dropDate = newDrop.date.toDate();

            const month:number = dropDate.getMonth();
            const year:number = dropDate.getFullYear();

            const currentTS = admin.firestore.Timestamp.fromDate(moment().toDate())

            if (newDrop.type === "ANLY") {
                console.log("fill analytics")
                console.log(newDrop);
                return fillAnalyticsMonth(newDrop).then( dropa => {
                    change.after.ref.set({...dropa, updatedAt: currentTS, createdAt: currentTS })
                    .catch( (err:any) => console.log(err));
                })
                .catch( (err) => console.log(err));
            } else if (newDrop.type === "GOAL") {
                return fillGoal(newDrop).then( dropa => {
                    change.after.ref.set({...dropa, updatedAt: currentTS, createdAt: currentTS })
                    .catch( (err:any) => console.log(err));
                })
                .catch( (err) => console.log(err));
            } else {
                return Promise.all( [ getFutureGoals(dropDate), getAnalytics(month,year) ] )
                .then( ([goals,a]) => {
                    
                    const promises:any = goals
                    .filter( g => newDrop.tags.some( (t:any) => g.tags.includes(t)))
                    .map( g => admin.firestore().doc("drops/"+g.id).set(countAnalyticsDrop(newDrop,g,Operation.Increment) ) );

                    promises.push(admin.firestore().doc("drops/ANALYTICS-"+year+"-"+month).set(countAnalyticsDrop(newDrop,a,Operation.Increment)))
                            
                    return Promise.all(promises).catch( (err) => console.log(err) );
                })
                .catch((err) => console.log(err));
            }

        }

        if ((newDrop) && (oldDrop)) { // update
            const beforeDropDate = oldDrop.date.toDate();
            const afterDropDate = newDrop.date.toDate();

            const beforeMonth:number = beforeDropDate.getMonth();
            const beforeYear:number = beforeDropDate.getFullYear();

            const afterMonth:number = afterDropDate.getMonth();
            const afterYear:number = afterDropDate.getFullYear();

            // updating a goal requires recalculation of all the tags, and the time span.
            if ((newDrop.type === "GOAL") && (!newDrop.goal.system) ) {
                console.log(" user goal update... ")
                const currentTS = admin.firestore.Timestamp.fromDate(moment().toDate())
                return fillGoal(newDrop).then( dropa => {
                    change.after.ref.set({...dropa, updatedAt: currentTS })
                    .catch( (err:any) => console.log(err));
                })
                .catch( (err) => console.log(err));
            } else if (newDrop.type === "GOAL") {
                console.log(" system goal update ...");
            }

            if ((newDrop.type !== "GOAL") && (newDrop.type !== "ANLY")) {
                /*
                get future goals
                if after and not before just inc
                if before and not after just dec
                if drop date between goal creation date and goal date dec/inc
                */
                getFutureGoals(moment().toDate())
                .then( (goals:any) => {
                    console.log("updating goals ");
                    const promises:any = goals
                    .filter( (g:any) => newDrop.tags.some( (t:any) => g.tags.includes(t)) )
                    .map( (g:any) => {
                        const isBetween = (date:any, ga:any )  => moment(date).isBetween(moment(ga.createdAt.toDate()), moment(ga.date.toDate()) )
                        // if the drop is between the creation and goal date, as was not just coun it
                        console.log("goal")
                        console.log(g);
                        if (isBetween(afterDropDate,g) && !isBetween(beforeDropDate,g )) {
                            console.log(" goal increment ");
                            return [ admin.firestore().doc("drops/"+g.id).set(countAnalyticsDrop(newDrop,g,Operation.Increment) ) ]
                        // if the drop was between the creation and goal date, as now is not not just uncount it
                        } else if (!isBetween(afterDropDate,g) && isBetween(beforeDropDate,g) ) {
                            console.log(" goal decrement ");
                            return [ admin.firestore().doc("drops/"+g.id).set(countAnalyticsDrop(oldDrop,g,Operation.Decrement) ) ]
                        } else 
                            console.log(" goal decrement/increment ");
                        // if the drop is between the creation and goal date, ajust update
                            return [ 
                                admin.firestore().doc("drops/"+g.id).set(countAnalyticsDrop(oldDrop,g,Operation.Decrement) ),
                                admin.firestore().doc("drops/"+g.id).set(countAnalyticsDrop(newDrop,g,Operation.Increment) ),
                                ]
                    });
                    const flat = (array:Array<any>) => [].concat(...array);

                    return Promise.all( flat(promises) ).catch( (err) => console.log(err) );
                })
                .catch((err) => console.log(err));

                // TODO: refactor the between month to find symmetries with between goals

                if ( afterMonth <= moment().month() ) {
                    if (beforeMonth !== afterMonth) {
                        // a drop was updated from different months, updating two analytics
                        return Promise.all([getAnalytics(beforeMonth,beforeYear),getAnalytics(afterMonth,afterYear)])
                        .then( ([anlyBefore,anlyAfter]) => {

                            admin.firestore()
                            .doc("drops/ANALYTICS-"+beforeYear+"-"+beforeMonth)
                            .set(countAnalyticsDrop(oldDrop,anlyBefore,Operation.Decrement))
                            .catch((err) => console.log(err));

                            admin.firestore()
                            .doc("drops/ANALYTICS-"+afterYear+"-"+afterMonth)
                            .set(countAnalyticsDrop(newDrop,anlyAfter,Operation.Increment))
                            .catch((err) => console.log(err));
                        });
                    } else {
                    // a drop was updated in the current month, just update its count
                        return getAnalytics(afterMonth,afterYear).then( (a:any) => {
                            console.log(" same month ... ")
                            // remove analytics from previous drop and add from the current drop
                            const anly = countAnalyticsDrop(newDrop,countAnalyticsDrop(oldDrop,a,Operation.Decrement),Operation.Increment);
                            console.log(" persist analytics ... ")
                            console.log(anly.analytics);

                            admin.firestore()
                            .doc("drops/ANALYTICS-"+afterYear+"-"+afterMonth)
                            .set(anly)
                            .catch((err) => console.log(err));
                        })
                        .catch((err) => console.log(err));
                    }
                } else {
                    // a drop was moved beyond the range of analytics, just remove its count
                    return getAnalytics(afterMonth,afterYear).then( (a:any) => {
                        admin.firestore()
                        .doc("drops/ANALYTICS-"+beforeYear+"-"+beforeMonth)
                        .set(countAnalyticsDrop(oldDrop,a, Operation.Decrement))
                        .catch((err) => console.log(err));
                    })
                    .catch((err) => console.log(err));            
                }
            }
        }

        return null; // we get here when it is an analytics drop 
    });

export const timeTrigger = functions.pubsub.topic("oos-time").onPublish(async (message, context) => {
    // there is a difference between the cloud scheduler time, and the timestamp in the function
    // cloud scheduler fires at 00:00 zurich time, but the execution time is utc.
    // so it is 22:00 GMT = 00:00 CET+2
    // check if we can use schedule cloud function

    // every 15 minutes in utc, check all the users that have timezone offset of current time until midnight
    // so if it is 22h, check if the offset plus the time equal midnight.
    // if it is run the copy clone for all these users.

    const endDate = moment().endOf('day').subtract(2,'hours');
    const startDate = moment().startOf('day').subtract(2,'hours');

    const startTS = admin.firestore.Timestamp.fromDate(startDate.toDate());
    const endTS = admin.firestore.Timestamp.fromDate(endDate.toDate());

    console.log("start["+startDate.toDate()+"]")
    console.log("end["+endDate.toDate()+"]")
    
    return admin.firestore().collection("drops").where("date",">=",startTS).where("date","<=",endTS).get()
    .then( qs => {
        const drops:any = [];
        qs.forEach( d => drops.push(d.data()));
        console.log("qs");
        console.log( drops );
        drops.filter( (d:any) => d.recurrence !== "none").map( (d:any) => {
            const calculDate = moment(d.date.toDate());
            if (d.type==="TASK") d.task.completed = false;
            if (d.type==="RATE") { d.rate.value = 0; d.text = ""; };
            switch(d.recurrence) {
                case "day": calculDate.add(1,'days'); break;
                case "week": calculDate.add(1,'weeks'); break;
                case "month": calculDate.add(1,'months'); break;
                case "year": calculDate.add(1,'years'); break;
                case "weekend": startDate.tz("Europe/Zurich").day() === 6 ? calculDate.add(1,'days'): calculDate.add(6,'days'); break;
                case "weekday": startDate.tz("Europe/Zurich").day() === 5 ? calculDate.add(3,'days'): calculDate.add(1,'days'); break;
            }
            d.date = admin.firestore.Timestamp.fromDate(calculDate.toDate());

            if (d.type==="SYS") {
                d.text = calculDate.tz("Europe/Zurich").format("dddd, D MMMM YYYY" ); 
                return admin.firestore().doc(`drops/DAY-${ calculDate.year() }-${ calculDate.month() }-${ calculDate.date() }`)
                .set({...d, updatedAt: endTS, createdAt: endTS })
                .catch( (err) => console.log(err));

            } else 
            
            if (d.type==="ANLY") {
                d.text = "Analytics for " + calculDate.tz("Europe/Zurich").format("MMMM YYYY");
                return admin.firestore().doc(`drops/ANALYTICS-${ calculDate.year() }-${ calculDate.month() }`)
                .set({...d, updatedAt: endTS, createdAt: endTS })
                .catch( (err) => console.log(err));

            } else {
                console.log(d);
                
                return admin.firestore().collection("drops").add({...d, updatedAt: endTS, createdAt: endTS })
                .catch( (err) => console.log(err));

            }
        });
    })
    .catch( (err) => console.log(err));
});

export const updateTags = functions
    .firestore
    .document('drops/{dropID}')
    .onWrite((change, context) => {
      const newDoc = change.after ? change.after.exists ? change.after.data() : null : null;
      const oldDoc = change.before ? change.before.exists ? change.before.data() : null : null;

      const newTags:Array<string> =  newDoc ? newDoc.tags : [];
      const oldTags:Array<string> = oldDoc ? oldDoc.tags : [];

      // increment those that are in the new and not in the old
      const inc = newTags.filter( nt => oldTags.every( ot => ot !== nt ) )
      const incTags = inc.map( t => admin.firestore().doc("tags/"+t).get() );
      Promise.all(incTags).then( docs => {
          docs.map( d => d.data() ).map( (t:any) => admin.firestore().doc("tags/"+t.name).update({ count: ++t.count, updatedAt: admin.firestore.Timestamp.fromDate(moment().toDate())}) )
      })
      .catch((err) => console.log(err));

      
      // decrement those that are in the old and not in the new
      const dec = oldTags.filter( ot => newTags.every( nt => nt !== ot ) );
      const decTags = dec.map( t => admin.firestore().doc("tags/"+t).get() );
      Promise.all(decTags).then( docs => {
          docs.map( d => d.data() ).map( (t:any) => admin.firestore().doc("tags/"+t.name).update({ count: --t.count }) )
      })
      .catch((err) => console.log(err));


      return 0;

    });

