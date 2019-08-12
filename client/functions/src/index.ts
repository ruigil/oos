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


async function getAnalytics(month:number,year:number) {
    const doc = await admin.firestore().doc("drops/ANALYTICS-"+year+"-"+month).get();
    
    if (doc.exists) return doc.data();
    else return Promise.resolve({ month: month, year: year, totals: [0,0,0,0,0,0,0], tags: {} } );
}

const incDropType = ( d: any, totals: Array<number>) => { 
        /*
         0 -> totals tasks, 
         1 -> total task completed
         2 -> total expenses
         3 -> total incomes
         4 -> total rates
         5 -> total rate values
         6 -> total notes
        */
        switch (d.type) {
            case "NOTE": totals[6] += 1; break;
            case "TASK": totals[0] += 1; totals[1] += d.task.completed ? 1 : 0; break;
            case "TRX": totals[d.transaction.type === "expense" ? 2 : 3] += d.transaction.value; break;
            case "RATE": totals[4] += 1; totals[5] += d.rate.value; break;
        }
        
        return totals;
};
const decDropType = ( d: any, totals: Array<number>) => { 
        console.log( " decDropType totals ");
        console.log( totals );
        
        switch (d.type) {
            case "NOTE": totals[6] -= 1; break;
            case "TASK": totals[0] -= 1; totals[1] -= d.task.completed ? 1 : 0; break;
            case "TRX": totals[d.transaction.type === "expense" ? 2 : 3] -= d.transaction.value; break;
            case "RATE": totals[4] -= 1; totals[5] -= d.rate.value; break;
        }
        
        return totals;
};

const incAnalyticsDrop:any = (drop:any, dropa:any) => {

    dropa.analytics.totals = incDropType(drop, dropa.analytics.totals)
    drop.tags.forEach( (t:any) => dropa.analytics.tags[t] = incDropType(drop, dropa.analytics.tags[t] || [0,0,0,0,0,0,0] ) );
    
    console.log( " incDropType analytics ");
    console.log( dropa.analytics );

    return dropa;
}
const decAnalyticsDrop:any = (drop:any, dropa:any) => {

    dropa.analytics.totals = decDropType(drop, dropa.analytics.totals)
    drop.tags.forEach( (t:any) => dropa.analytics.tags[t] = decDropType(drop, dropa.analytics.tags[t] || [0,0,0,0,0,0,0] ) );

    console.log( " decDropType analytics ");
    console.log( dropa.analytics );

    return dropa;
}

export const statsCreate = functions
    .firestore
    .document('drops/{dropID}')
    .onCreate((snap, context) => {
        console.log("stats create...")

        const drop:any = snap.data();
        const dropDate = drop.date.toDate();

        const month:number = dropDate.getMonth();
        const year:number = dropDate.getFullYear();

        return getAnalytics(month,year).then( (a:any) => {
            return admin.firestore()
            .doc("drops/ANALYTICS-"+year+"-"+month)
            .set(incAnalyticsDrop(drop,a))
            .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
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

        return getAnalytics(month,year).then( (a:any) => {
            return admin.firestore()
            .doc("drops/ANALYTICS-"+year+"-"+month)
            .set(decAnalyticsDrop(drop,a))
            .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
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

        if ( afterMonth <= moment().month() ) {
            if (beforeMonth !== afterMonth) {
                // a drop was updated from different months, updating two analytics
                return Promise.all([getAnalytics(beforeMonth,beforeYear),getAnalytics(afterMonth,afterYear)])
                .then( ([anlyBefore,anlyAfter]) => {

                    admin.firestore()
                    .doc("drops/ANALYTICS-"+beforeYear+"-"+beforeMonth)
                    .set(decAnalyticsDrop(beforeDrop,anlyBefore))
                    .catch((err) => console.log(err));

                    admin.firestore()
                    .doc("drops/ANALYTICS-"+afterYear+"-"+afterMonth)
                    .set(incAnalyticsDrop(afterDrop,anlyAfter))
                    .catch((err) => console.log(err));
                });
            } else {
               // a drop was updated in the current month, just update its count
                return getAnalytics(afterMonth,afterYear).then( (a:any) => {
                    console.log(" same month ... ")
                    // remove analytics from previous drop and add from the current drop
                    const anly = incAnalyticsDrop(afterDrop,decAnalyticsDrop(beforeDrop,a));
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
                .set(decAnalyticsDrop(beforeDrop,a))
                .catch((err) => console.log(err));
            })
            .catch((err) => console.log(err));            
        }
    });

const fillAnalyticsMonth = (endOfMonth:any) => {
    const startOfMonth = moment(endOfMonth).tz("Europe/Zurich").startOf('month'); 

    // there is a difference between the cloud scheduler time, and the timestamp in the function

    const startOfMonthTS = admin.firestore.Timestamp.fromDate(startOfMonth.toDate());
    const endOfMonthTS = admin.firestore.Timestamp.fromDate(endOfMonth.toDate());
    
    return admin.firestore().collection("drops").where("date",">=",startOfMonthTS).where("date","<=",endOfMonthTS).get()
    .then( qs => {
        const drops:any = [];
        qs.forEach( d => drops.push(d.data()));
        const analytics = drops.reduce( (a:any, d:any) => incAnalyticsDrop(d,a) , { month: startOfMonth.month(), year: startOfMonth.year(), totals: [0,0,0,0,0,0,0], tags: {} } );
        
        console.log(analytics);

        const currentTS = admin.firestore.Timestamp.fromDate(moment().toDate());

        admin.firestore()
        .doc("drops/ANALYTICS-"+endOfMonth.year()+"-"+endOfMonth.month())
        .set({
            text: "Analytics for " + endOfMonth.format("MMMM YYYY" ),
            type: "ANLY",
            tags: ["ANALYTICS"],
            recurrence: "month",
            analytics: analytics,
            date: endOfMonthTS,
            updatedAt: currentTS,
            createdAt: currentTS,
        })
        .catch((err) => console.log(err));

    })
    .catch( err => console.log(err));
};


export const timeTrigger = functions.pubsub.topic("oos-time").onPublish(async (message, context) => {
    // there is a difference between the cloud scheduler time, and the timestamp in the function
    // cloud scheduler fires at 00:00 zurich time, but the execution time is utc.
    // so it is 22:00 GMT = 00:00 GMT+2

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

            if (d.type==="SYS") d.text = calculDate.tz("Europe/Zurich").format("dddd, D MMMM YYYY" ); 
            if (d.type==="ANLY") {
                d.text = "Analytics for " + calculDate.tz("Europe/Zurich").format("MMMM YYYY");
                d.analytics = fillAnalyticsMonth(calculDate);
            }

            d.date = admin.firestore.Timestamp.fromDate(calculDate.toDate());
            return admin.firestore().collection("drops").add({...d, updatedAt: endTS, createdAt: endTS })
            .catch( (err) => console.log(err));
        });
    })
    .catch( (err) => console.log(err));
});

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

