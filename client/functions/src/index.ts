import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
//import { format, addDays, addWeeks, addMonths, endOfToday, startOfToday, getMonth, endOfMonth, addYears, isSaturday, isFriday } from 'date-fns';
import * as moment from 'moment';
//import * as moment from 'moment-timezone';

admin.initializeApp({ credential: admin.credential.applicationDefault() });


//functions.config().firebase)

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });


type Days = { day: number, totals: Array<number> }
type Tags = { tag: string, totals: Array<number> }
type Drop = { date: Date, tags: Array<string>, type: string }

async function getAnalytics(month:number,year:number) {
    const doc = await admin.firestore().doc("analytics/"+year+"-"+month).get();
    
    if (doc.exists) return doc.data();
    else return Promise.resolve({ month: month, year: year, totals: [0,0,0], days: [  ], tags: [ ] } );
}

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

const incTagType = function(tags:Array<Tags>, tag:string, type:number, value:number) {
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

export const statsCreate = functions
    .firestore
    .document('drops/{dropID}')
    .onCreate((snap, context) => {
        //const sdrop = snap.data();
        //const drop:Drop = { date: new Date(), tags: ["AAA", "CCC"], type:"TRX" }

        const drop:any = snap.data();
        const dropDate = drop.date.toDate();

        const day:number = dropDate.getDate();
        const month:number = dropDate.getMonth() + 1;
        const year:number = dropDate.getFullYear();

        getAnalytics(month,year)
        .then( (a:any) => {

            const type:number = getTypeDrop(drop);
            const value: number = getValueDrop(drop);

            if (type >= 0) a.totals[type] += value;
            // update days structure
            a.days = (type >= 0) ? incDayType(a.days, day, type, 1) : a.days;
            // update tag structure
            drop.tags.map( (tag:string) => {
                a.tags = (type >= 0) ? incTagType(a.tags, tag, type, value) : a.tags;
            });
            admin.firestore()
            .doc("analytics/"+year+"-"+month)            
            .set(a)
            .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
        return drop;
    });

export const statsDelete = functions
    .firestore
    .document('drops/{dropID}')
    .onDelete((snap, context) => {
        //const sdrop = snap.data();
        //const drop:Drop = { date: new Date(), tags: ["AAA", "CCC"], type:"TRX" }

        const drop:any = snap.data();
        const dropDate = drop.date.toDate();

        const day:number = dropDate.getDate();
        const month:number = dropDate.getMonth() + 1;
        const year:number = dropDate.getFullYear();

        getAnalytics(month,year).then( (a:any) => {
            const type:number = getTypeDrop(drop);
            const value:number = getValueDrop(drop);

            if (type >= 0) a.totals[type] -= value;
            // update days structure
            a.days = (type >= 0) ? decDayType(a.days, day, type, 1) : a.days;
            // update tag structure
            drop.tags.map( (tag:string) => {
                a.tags = (type >= 0) ? decTagType(a.tags, tag, type, value) : a.tags;
            });
            admin.firestore().doc("analytics/"+year+"-"+month).set(a)
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

        const beforeDay:number = beforeDropDate.getDate();
        const beforeMonth:number = beforeDropDate.getMonth() + 1;
        const beforeYear:number = beforeDropDate.getFullYear();

        const afterDay:number = afterDropDate.getDate();
        const afterMonth:number = afterDropDate.getMonth() + 1;
        const afterYear:number = afterDropDate.getFullYear();
        /**
        
        if month changed, delete previous day,tag bucket add new day,tag bucket
        else 
            if day changed dec previous day, add new day
            if tag changed dec previous tag, add new tag
        
        */
        if (beforeMonth !== afterMonth) {
            getAnalytics(beforeMonth,beforeYear).then( (a:any) => {
                const type:number = getTypeDrop(beforeDrop);
                const value: number = getValueDrop(beforeDrop);

                if (type >= 0) a.totals[type] -= value;
                // update days structure
                a.days = (type >= 0) ? decDayType(a.days, beforeDay, type, 1) : a.days;
                // update tag structure
                beforeDrop.tags.map( (tag:string) => {
                    a.tags = (type >= 0) ? decTagType(a.tags, tag, type, value) : a.tags;
                });
                admin.firestore().doc("analytics/"+beforeYear+"-"+beforeMonth).set(a)
                .catch((err) => console.log(err));
            })
            .catch((err) => console.log(err));

            getAnalytics(afterMonth,afterYear).then( (a:any) => {
                const type:number = getTypeDrop(afterDrop);
                const value: number = getValueDrop(afterDrop);

                if (type >= 0) a.totals[type] += value;
                // update days structure
                a.days = (type >= 0) ? incDayType(a.days, afterDay, type, 1) : a.days;
                // update tag structure
                afterDrop.tags.map( (tag:string) => {
                    a.tags = (type >= 0) ? incTagType(a.tags, tag, type, value) : a.tags;
                });
                admin.firestore().doc("analytics/"+afterYear+"-"+afterMonth).set(a)
                .catch((err) => console.log(err));
            })
            .catch((err) => console.log(err));

        } else {
            getAnalytics(afterMonth,afterYear).then( (a:any) => {
                const type:number = getTypeDrop(afterDrop);
                const value: number = getValueDrop(afterDrop);

                // if it is a transaction, the value may have changed
                if (type === 2) {
                    a.totals[type] -= getValueDrop(beforeDrop);
                    a.totals[type] += value;
                }

                if (beforeDay !== afterDay) {
                    // update days structure
                    a.days = (type >= 0) ? decDayType(a.days, beforeDay, type, 1) : a.days;
                    a.days = (type >= 0) ? incDayType(a.days, afterDay, type, 1) : a.days;
                }

                const decTags =  beforeDrop.tags.filter( (bt:string) => afterDrop.tags.every( (at:string) => at !== bt ) );
                const incTags =  afterDrop.tags.filter( (at:string) => beforeDrop.tags.every( (bt:string) => bt !== at ) );

                incTags.map( (tag:string) => { a.tags = (type >= 0) ? incTagType(a.tags, tag, type, value) : a.tags  });
                decTags.map( (tag:string) => { a.tags = (type >= 0) ? decTagType(a.tags, tag, type, value) : a.tags  });

                admin.firestore().doc("analytics/"+afterYear+"-"+afterMonth).set(a)
                .catch((err) => console.log(err));
            })
            .catch((err) => console.log(err));
        }
        return afterDrop;
    });

export const timeTrigger = functions.pubsub.topic("oos-time").onPublish(async (message, context) => {
    // there is a difference between the cloud scheduler time, and the timestamp in the function
    //moment.tz.setDefault("Europe/London");

    const current = moment().utcOffset(-60);
    console.log("current["+ current.toDate().toString() +"]");

    const endDate = moment().endOf('day');
    const startDate = moment().startOf('day');

    console.log("currentDate["+ new Date().toString()+"]")
    console.log("startDate["+startDate.toDate().toString()+"]")
    console.log("endDate["+endDate.toDate().toString()+"]")

    const startTS = admin.firestore.Timestamp.fromDate(startDate.toDate());
    const endTS = admin.firestore.Timestamp.fromDate(endDate.toDate());
    
    admin.firestore().collection("drops").where("date",">=",startTS).where("date","<=",endTS).get()
    .then( qs => {
        const drops:any = [];
        qs.forEach( d => drops.push(d.data()));
        drops.filter( (d:any) => d.recurrence !== "none").map( (d:any) => {
            const calculDate = moment(d.date.toDate());
            if (d.type==="TASK") d.task.completed = false;
            switch(d.recurrence) {
                case "day": calculDate.add(1,'days'); break;
                case "week": calculDate.add(1,'weeks'); break;
                case "month": calculDate.add(1,'months'); break;
                case "year": calculDate.add(1,'years'); break;
                case "weekend": startDate.day() === 6 ? calculDate.add(1,'days'): calculDate.add(6,'days'); break;
                case "weekdays": startDate.day() === 5 ? calculDate.add(3,'days'): calculDate.add(1,'days'); break;
            }
            console.log(d.type);
            console.log(calculDate.toDate());
            d.date = admin.firestore.Timestamp.fromDate(calculDate.toDate());
            if (d.type==="SYS") d.text = calculDate.format("dddd, D MMMM YYYY" ); 
            admin.firestore().collection("drops").add({...d, updatedAt: endTS, createdAt: endTS })
            .catch( (err) => console.log(err));
        });
    })
    .catch( (err) => console.log(err));
    // stupid timezones...
    admin.firestore().collection("drops").add(
        {
            text: startDate.format("dddd, D MMMM YYYY" ),
            type: "SYS",
            tags: [],
            recurrence: "day",
            date: startTS,
            updatedAt: startTS,
            createdAt: startTS,
        })
    .catch( (err) => console.log(err))
});


export const createAnalytics = functions.https.onCall( (data, context) => {
    const currentDate = moment().startOf('day'); //startOfToday();
    const currentMonth = moment().endOf('month'); //endOfMonth(currentDate);

    // there is a difference between the cloud scheduler time, and the timestamp in the function
    console.log("CurrentDate["+currentDate.toString()+"]")
    console.log("CurrentMonth["+currentMonth.toString()+"]")

    const currentTS = admin.firestore.Timestamp.fromDate(currentDate.toDate());
    const currentMonthTS = admin.firestore.Timestamp.fromDate(currentMonth.toDate());

    admin.firestore().collection("drops").add(
        {
            text: currentDate.format("dddd, D MMMM YYYY" ),
            type: "SYS",
            tags: [],
            recurrence: "day",
            date: currentTS,
            updatedAt: currentTS,
            createdAt: currentTS,
        })
    .catch( (err) => console.log(err))
    return admin.firestore().collection("drops").add(
        {
            text: "Analytics for " + currentDate.format("MMMM YYYY" ),
            type: "ANLY",
            tags: ["ANALYTICS"],
            recurrence: "month",
            analytics: { month: currentDate.month(), totals: [0,0,0], tags: [ { tag: "OOS", totals: [1,5,-54.32] } ]},
            date: currentMonthTS,
            updatedAt: currentMonthTS,
            createdAt: currentMonthTS,
        });
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

