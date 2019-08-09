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
        
        switch (d.type) {
            case "NOTE": totals[6]++; break;
            case "TASK": totals[0]++; totals[1] += d.task.complete ? 1 : 0; break;
            case "TRX": totals[d.transaction.type === "expense" ? 2 : 3] += d.transaction.value; break;
            case "RATE": totals[4]++; totals[5] += d.rate.value; break;
        }
        
        return totals;
};
const decDropType = ( d: any, totals: Array<number>) => { 
        
        switch (d.type) {
            case "NOTE": totals[6]--; break;
            case "TASK": totals[0]--; totals[1] -= d.task.complete ? 1 : 0; break;
            case "TRX": totals[d.transaction.type === "expense" ? 2 : 3] -= d.transaction.value; break;
            case "RATE": totals[4]--; totals[5] -= d.rate.value; break;
        }
        
        return totals;
};

const incAnalyticsDrop:any = (drop:any, analytics:any) => {
    analytics.totals = incDropType(drop,analytics.totals)
    drop.tags.forEach( (t:any) => analytics.tags[t] = incDropType(drop, analytics.tags[t] || [0,0,0,0,0,0,0] ) );

    return analytics;
}
const decAnalyticsDrop:any = (drop:any, analytics:any) => {
    analytics.totals = decDropType(drop,analytics.totals)
    drop.tags.forEach( (t:any) => analytics.tags[t] = decDropType(drop, analytics.tags[t] || [0,0,0,0,0,0,0] ) );

    return analytics;
}

/*
const incType = function(totals: Array<number>, t:number, val:number) { return totals.map((v,i) =>  i === t ? v+val : v) }
const decType = function(totals: Array<number>, t:number, val:number) { return totals.map((v,i) =>  i === t ? v-val : v) }

const incDayType = function(days:Array<Days>, day:number, type:number, value:number) {
    const dayExist:boolean  = days.filter( (d:Days) => d.day === day).length !== 0;

    if (dayExist) {
        return days.map( (d:Days) => d.day === day ? { day: day, totals: incType(d.totals,type,value) } : d )
    } else {
        days.push( { day: day, totals: incType([0,0,0],type,value)} );
        return days;
    }
    
}

const incTagType = (tags:Array<Tags>, tag:string, type:number, value:number) => {
    const tagExist:boolean = tags.filter( (t:Tags) => t.tag === tag ).length !== 0;

    if (tagExist) {
        return tags.map( (t:Tags) => t.tag === tag ? { tag: tag, totals: incType(t.totals,type,value) } : t )
    } else {
        tags.push( { tag: tag, totals: incType([0,0,0],type,value) } );
        return tags;
    }
    
}

const decDayType = function(days:Array<Days>, day:number, type:number, value:number) {
    return days.map( (d:Days) => d.day === day ? { day: day, totals: decType(d.totals,type,value) } : d )
                .filter( (d:Days) => !d.totals.every( v => v === 0) );
}

const decTagType = function(tags:Array<Tags>, tag:string, type:number, value:number) {
    return tags.map( (t:Tags) => t.tag === tag ? { tag: tag, totals: decType(t.totals,type,value) } : t )
                .filter( (t:Tags) => !t.totals.every( v => v === 0) );
}

const getTypeDrop = function(drop:Drop):number {
    let type:number = -1;
    switch(drop.type) {
        case "NOTE": type = 0; break;
        case "TASK": type = 1; break;
        case "TRX": type = 2; break;
    }
    return type;
}

const getValueDrop = (drop:any) => drop.type === "TRX" ? drop.transaction.value : 1;
*/

export const statsCreate = functions
    .firestore
    .document('drops/{dropID}')
    .onCreate((snap, context) => {

        const drop:any = snap.data();
        const dropDate = drop.date.toDate();

        const month:number = dropDate.getMonth();
        const year:number = dropDate.getFullYear();

        getAnalytics(month,year).then( (a:any) => {
            admin.firestore()
            .doc("drops/ANALYTICS-"+year+"-"+month)
            .set(incAnalyticsDrop(drop,a))
            .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
        return drop;
    });

export const statsDelete = functions
    .firestore
    .document('drops/{dropID}')
    .onDelete((snap, context) => {

        const drop:any = snap.data();
        const dropDate = drop.date.toDate();

        const month:number = dropDate.getMonth();
        const year:number = dropDate.getFullYear();

        getAnalytics(month,year).then( (a:any) => {
            admin.firestore()
            .doc("drops/ANALYTICS-"+year+"-"+month)
            .set(decAnalyticsDrop(drop,a))
            .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
        return drop;
    });


export const statsUpdate = functions
    .firestore
    .document('drops/{dropID}')
    .onUpdate((change:any, context) => {

        const beforeDrop:any = change.before.data();
        const beforeDropDate = beforeDrop.date.toDate();

        const afterDrop:any = change.after.data();
        const afterDropDate = afterDrop.date.toDate();

        const beforeMonth:number = beforeDropDate.getMonth();
        const beforeYear:number = beforeDropDate.getFullYear();

        const afterMonth:number = afterDropDate.getMonth();
        const afterYear:number = afterDropDate.getFullYear();
        /**
        
        if month changed, delete previous day,tag bucket add new day,tag bucket
        else 
            if day changed dec previous day, add new day
            if tag changed dec previous tag, add new tag
        
        */

        if ( afterMonth < moment().month() ) {
            if (beforeMonth !== afterMonth) {
                // remove from previous month
                getAnalytics(beforeMonth,beforeYear).then( (a:any) => {
                    admin.firestore()
                    .doc("drops/ANALYTICS-"+beforeYear+"-"+beforeMonth)
                    .set(decAnalyticsDrop(beforeDrop,a))
                    .catch((err) => console.log(err));
                })
                .catch((err) => console.log(err));
                // add to next month
                getAnalytics(afterMonth,afterYear).then( (a:any) => {
                    admin.firestore()
                    .doc("drops/"+afterYear+"-"+afterMonth)
                    .set(incAnalyticsDrop(afterDrop,a))
                    .catch((err) => console.log(err));
                })
                .catch((err) => console.log(err));

            } else {
                getAnalytics(afterMonth,afterYear).then( (a:any) => {
                    
                    // remove analytics from previous drop
                    let anly = decAnalyticsDrop(beforeDrop,a);
                    // remove analytics from previous drop
                    anly = incAnalyticsDrop(afterDrop,a);

                    admin.firestore()
                    .doc("drops/ANALYTICS-"+afterYear+"-"+afterMonth)
                    .set(anly)
                    .catch((err) => console.log(err));
                })
                .catch((err) => console.log(err));
            }
        }

        return afterDrop;
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
                case "weekend": startDate.tz("Europe/Zurich").day() === 6 ? calculDate.add(1,'days'): calculDate.add(7,'days'); break;
                case "weekday": startDate.tz("Europe/Zurich").day() === 5 ? calculDate.add(3,'days'): calculDate.add(1,'days'); break;
            }

            if (d.type==="SYS") d.text = calculDate.tz("Europe/Zurich").format("dddd, D MMMM YYYY" ); 
            if (d.type==="ANLY") {
                d.text = "Analytics for " + calculDate.tz("Europe/Zurich").format("MMMM YYYY");
                d.analytics = fillAnalyticsMonth(calculDate);
            }

            d.date = admin.firestore.Timestamp.fromDate(calculDate.toDate());
            /*
            if (d.recurrence === "weekday") {
                console.log(d.type);
                console.log(d.text);
                console.log(d.date.toDate());
                console.log(startDate.tz("Europe/Zurich").day());
            }
            */
            admin.firestore().collection("drops").add({...d, updatedAt: endTS, createdAt: endTS })
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

