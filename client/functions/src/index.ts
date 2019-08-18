import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
//import { format, addDays, addWeeks, addMonths, endOfToday, startOfToday, getMonth, endOfMonth, addYears, isSaturday, isFriday } from 'date-fns';
//import * as moment from 'moment';
import * as moment from 'moment-timezone';

admin.initializeApp({ credential: admin.credential.applicationDefault() });


//functions.config().firebase)

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

enum Operation {
    Increment,
    Decrement
}

async function getFutureGoals(date:Date) {
    const qs = await admin.firestore().collection("drops").where("date",">",admin.firestore.Timestamp.fromDate(date)).get();
    const goals:Array<any> = [];
    qs.forEach( d => goals.push({...d.data(), id: d.id }));

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
    const start = moment();
    const end = moment(dropa.date.toDate()); 

    const startTS = admin.firestore.Timestamp.fromDate(start.toDate());
    const endTS = admin.firestore.Timestamp.fromDate(end.toDate());

    dropa.goal = { completed: false, totals: [0,0,0,0,0,0,0], tags: {} };

    const qs = await admin.firestore().collection("drops").where("date",">=",startTS).where("date","<",endTS).get()
    
    const drops:any = [];
    qs.forEach( d => drops.push(d.data()));

    // filter the drops that have a least one of the goal tags
    // acummulate the total sum of the tags
    const ds = drops.filter( (d:any) => d.tags.some( (t:any) => dropa.tags.includes(t) ) )
    const goal = ds.reduce( (a:any, d:any) => countAnalyticsDrop(d,a,Operation.Increment), dropa )
    
    return goal;
}

export const settingsUpdate = functions
    .firestore
    .document('settings/{settingsID}')
    .onUpdate((change:any, context) => {
        console.log("setting update...")
        const beforeSetting:any = change.before.data();
        const afterSetting:any = change.after.data();

        console.log("Settings before");
        console.log(beforeSetting);

        console.log("Settings after");
        console.log(afterSetting);
        const date = moment().tz("Europe/Zurich").endOf('month');
        const today = moment().tz("Europe/Zurich").startOf('day');
        const todayTS = admin.firestore.Timestamp.fromDate(today.toDate());
        const dateTS = admin.firestore.Timestamp.fromDate(date.toDate());
        const currentTS = admin.firestore.Timestamp.fromDate(moment().toDate());

        if ((!beforeSetting.system.analytics) && (afterSetting.system.analytics)) {
            // create analytics
            console.log("create analytics")
            return admin.firestore()
            .doc(`drops/ANALYTICS-${ moment().year() }-${ moment().month() }`)
            .set(
            {
                text: "Analytics for " + date.format("MMMM YYYY"),
                type: "ANLY",
                tags: ["ANALYTICS"],
                recurrence: "month",
                analytics: { totals: [0,0,0,0,0,0,0], tags: {} },
                date: dateTS,
                updatedAt: currentTS,
                createdAt: currentTS,
            })
            .catch( (err) => console.log(err) )
            // TODO: create tag analytics
        }
        if ((!afterSetting.system.analytics) && (beforeSetting.system.analytics)) {
            console.log("delete analytics");
            return admin.firestore()
            .doc(`drops/ANALYTICS-${ moment().year() }-${ moment().month() }`)
            .delete()
            .catch( (err) => console.log(err) )
        }
        if ((!beforeSetting.system.day) && (afterSetting.system.day)) {
            // create day
            return admin.firestore()
            .doc(`drops/DAY-${ moment().year() }-${ moment().month() }-${ moment().date() }`)
            .set(
            {
                text: today.format("dddd, D MMMM YYYY"),
                type: "SYS",
                tags: [],
                recurrence: "day",
                date: todayTS,
                updatedAt: currentTS,
                createdAt: currentTS,
            })
            .catch( (err) => console.log(err) )
        }
        if ((beforeSetting.system.day) && (!afterSetting.system.day)) {
            // delete day
            return admin.firestore()
            .doc(`drops/DAY-${ moment().year() }-${ moment().month() }-${ moment().date() }`)
            .delete()
            .catch( (err) => console.log(err) )
        }


        return change;
    });

export const statsCreate = functions
    .firestore
    .document('drops/{dropID}')
    .onCreate((snap, context) => {
        console.log("stats create...")

        /**
        if drop goal type fill the analytics of the drop, between the creation date (now) and the drop date
        if drop analytics month type fill the anaéytics from the beginnign of the month to the end of the month

        else 
            get future goals, if some tags present update goals
            update monthty analytics
         */

        const drop:any = snap.data();
        const dropDate = drop.date.toDate();

        const month:number = dropDate.getMonth();
        const year:number = dropDate.getFullYear();

        const currentTS = admin.firestore.Timestamp.fromDate(moment().toDate())

        if (drop.type === "ANLY") {
            console.log("fill analytics")
            console.log(drop);
            return fillAnalyticsMonth(drop).then( dropa => {
                snap.ref.set({...dropa, updatedAt: currentTS, createdAt: currentTS })
                .catch( (err) => console.log(err));
            })
            .catch( (err) => console.log(err));
        } else if (drop.type === "GOAL") {
            return fillGoal(drop).then( dropa => {
                snap.ref.set({...dropa, updatedAt: currentTS, createdAt: currentTS })
                .catch( (err) => console.log(err));
            })
            .catch( (err) => console.log(err));
        } else {
            return Promise.all( [ getFutureGoals(dropDate), getAnalytics(month,year) ] )
            .then( ([goals,a]) => {
                
                const promises:any = goals
                .filter( g => drop.tags.some( (t:any) => g.tags.includes(t)))
                .map( g => admin.firestore().doc("drops/"+g.id).set(countAnalyticsDrop(drop,g,Operation.Increment) ) );

                promises.push(admin.firestore().doc("drops/ANALYTICS-"+year+"-"+month).set(countAnalyticsDrop(drop,a,Operation.Increment)))
                        
                return Promise.all(promises).catch( (err) => console.log(err) );
            })
            .catch((err) => console.log(err));
        }
        return drop;
    });

export const statsDelete = functions
    .firestore
    .document('drops/{dropID}')
    .onDelete((snap, context) => {
        console.log("stats delete...")

        const drop:any = snap.data();
        const dropDate = drop.date.toDate();

        const month:number = dropDate.getMonth();
        const year:number = dropDate.getFullYear();

        if ((drop.type !== "ANLY") && (drop.type !== "GOAL")) {
            return Promise.all( [ getFutureGoals(dropDate),getAnalytics(month,year)] )
            .then( ([goals,a]) => {
                
                const promises:any = goals
                .filter( g => drop.tags.some( (t:any) => g.tags.includes(t)))
                .map( g => admin.firestore().doc("drops/"+g.id).set(countAnalyticsDrop(drop,g,Operation.Decrement) ) );

                promises.push(admin.firestore().doc("drops/ANALYTICS-"+year+"-"+month).set(countAnalyticsDrop(drop,a,Operation.Decrement)))
                        
                return Promise.all(promises).catch( (err) => console.log(err) );
            })
            .catch((err) => console.log(err));
        }
        return drop;
    });


export const statsUpdate = functions
    .firestore
    .document('drops/{dropID}')
    .onUpdate((change:any, context) => {
        console.log("stats update...")

        const beforeDrop:any = change.before.data();
        const afterDrop:any = change.after.data();

        const beforeDropDate = beforeDrop.date.toDate();
        const afterDropDate = afterDrop.date.toDate();

        const beforeMonth:number = beforeDropDate.getMonth();
        const beforeYear:number = beforeDropDate.getFullYear();

        const afterMonth:number = afterDropDate.getMonth();
        const afterYear:number = afterDropDate.getFullYear();



        if ((afterDrop.type !== "GOAL") || (afterDrop.type !== "ANLY")) {
            /*
            get future goals
            if after and not before just inc
            if before and not after just dec
            if drop date between goal creation date and goal date dec/inc
            */
            getFutureGoals(moment().toDate())
            .then( (goals:any) => {
                const isBetween = (date:any, g:any )  => moment(date).isBetween(moment(g.createAt.toDate()), moment(g.date.toDate()) )
        
                const promises:any = goals
                .filter( (g:any) => afterDrop.tags.some( (t:any) => g.tags.includes(t)) )
                .flatMap( (g:any) => {
                    // if the drop is before the goal finish date and it was before the creation date (not counted)
                    // then just count it
                    if (isBetween(afterDropDate,g) && !isBetween(beforeDropDate,g )) {
                        return [ admin.firestore().doc("drops/"+g.id).set(countAnalyticsDrop(afterDrop,g,Operation.Increment) ) ]
                    } else if (!isBetween(afterDropDate,g) && isBetween(beforeDropDate,g) ) {
                        return [ admin.firestore().doc("drops/"+g.id).set(countAnalyticsDrop(beforeDrop,g,Operation.Decrement) ) ]
                    } else 
                        return [ 
                            admin.firestore().doc("drops/"+g.id).set(countAnalyticsDrop(beforeDrop,g,Operation.Decrement) ),
                            admin.firestore().doc("drops/"+g.id).set(countAnalyticsDrop(afterDrop,g,Operation.Increment) ),
                         ]
                });
                return Promise.all(promises).catch( (err) => console.log(err) );
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
                        .set(countAnalyticsDrop(beforeDrop,anlyBefore,Operation.Decrement))
                        .catch((err) => console.log(err));

                        admin.firestore()
                        .doc("drops/ANALYTICS-"+afterYear+"-"+afterMonth)
                        .set(countAnalyticsDrop(afterDrop,anlyAfter,Operation.Increment))
                        .catch((err) => console.log(err));
                    });
                } else {
                // a drop was updated in the current month, just update its count
                    return getAnalytics(afterMonth,afterYear).then( (a:any) => {
                        console.log(" same month ... ")
                        // remove analytics from previous drop and add from the current drop
                        const anly = countAnalyticsDrop(afterDrop,countAnalyticsDrop(beforeDrop,a,Operation.Decrement),Operation.Increment);
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
                    .set(countAnalyticsDrop(beforeDrop,a, Operation.Decrement))
                    .catch((err) => console.log(err));
                })
                .catch((err) => console.log(err));            
            }
        }
        return afterDrop;
    });

export const timeTrigger = functions.pubsub.topic("oos-time").onPublish(async (message, context) => {
    // there is a difference between the cloud scheduler time, and the timestamp in the function
    // cloud scheduler fires at 00:00 zurich time, but the execution time is utc.
    // so it is 22:00 GMT = 00:00 GMT+2
    // check if we can use schedule cloud function

    console.log(moment().startOf("day").tz("Europe/Zurich").toDate());
    console.log(admin.firestore.Timestamp.fromDate(moment().startOf("day").tz("Europe/Zurich").toDate()));

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
                
                return admin.firestore().collection("drops").add({...d, updatedAt: endTS, createdAt: endTS })
                .catch( (err) => console.log(err));

            }
        });
    })
    .catch( (err) => console.log(err));
});

/*
export const initAnalytics = functions.https.onRequest((req, res) => {
    console.log("initAnalytics");
    const endOfMonth = moment().tz("Europe/Zurich").endOf('month');
    const currentTS = admin.firestore.Timestamp.fromDate(moment().toDate());
    const endOfMonthTS = admin.firestore.Timestamp.fromDate(endOfMonth.toDate());

    let dropa = {
        text: "Analytics for " + endOfMonth.format("MMMM YYYY"),
        type: "ANLY",
        tags: ["ANALYTICS"],
        recurrence: "month",
        analytics: {},
        date: endOfMonthTS,
        updatedAt: currentTS,
        createdAt: currentTS,
    }
    
    return fillAnalyticsMonth(dropa).then( d => {
        return admin.firestore()
        .doc("drops/ANALYTICS-"+endOfMonth.year()+"-"+endOfMonth.month())
        .set(d)
        .catch((err) => console.log(err));
    });

});
*/
export const updateTagCount = functions
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
          docs.map( d => d.data() ).map( (t:any) => admin.firestore().doc("tags/"+t.name).update({ count: ++t.count, updatedAt: admin.firestore.FieldValue.serverTimestamp()}) )
      })
      .catch((err) => console.log(err));

      
      // decrement those that are in the old and not in the new
      const dec = oldTags.filter( ot => newTags.every( nt => nt !== ot ) );
      const decTags = dec.map( t => admin.firestore().doc("tags/"+t).get() );
      Promise.all(decTags).then( docs => {
          docs.map( d => d.data() ).map( (t:any) => admin.firestore().doc("tags/"+t.name).update({ count: --t.count}) )
      })
      .catch((err) => console.log(err));


      return 0;

    });

