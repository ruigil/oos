import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
//import { addDays } from 'date-fns';

admin.initializeApp(functions.config().firebase);

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
    var doc = await admin.firestore().doc("analytics/"+year+"-"+month).get();
    
    if (doc.exists) return doc.data();
    else return Promise.resolve({ month: month, year: year, totals: [0,0,0], days: [  ], tags: [ ] } );
}

const incType = function(totals: Array<number>, t:number) { return totals.map((v,i) =>  i === t ? ++v : v) }
const decType = function(totals: Array<number>, t:number) { return totals.map((v,i) =>  i === t ? --v : v) }

const incDayType = function(days:Array<Days>, day:number, type:number) {
    var dayExist:boolean  = days.filter( (d:Days) => d.day == day).length != 0;

    if (dayExist) {
        days = days.map( (d:Days) => d.day == day ? { day: day, totals: incType(d.totals,type) } : d )
    } else 
        days.push( { day: day, totals: incType([0,0,0],type)});
    
    return days;
}

const incTagType = function(tags:Array<Tags>, tag:string, type:number) {
    var tagExist:boolean = tags.filter( (t:Tags) => t.tag === tag ).length != 0;

    if (tagExist) {
        tags = tags.map( (t:Tags) => t.tag === tag ? { tag: tag, totals: incType(t.totals,type) } : t )
    } else 
        tags.push( { tag: tag, totals: incType([0,0,0],type) } );
    
    return tags;
}

const decDayType = function(days:Array<Days>, day:number, type:number) {
    days = days.map( (d:Days) => d.day == day ? { day: day, totals: decType(d.totals,type) } : d );
    days = days.filter( (d:Days) => !d.totals.every( v => v == 0) );
    return days;
}

const decTagType = function(tags:Array<Tags>, tag:string, type:number) {
    tags = tags.map( (t:Tags) => t.tag == tag ? { tag: tag, totals: decType(t.totals,type) } : t );
    tags = tags.filter( (t:Tags) => !t.totals.every( v => v == 0) );
    return tags;
}

const getTypeDrop = function(drop:Drop):number {
    var type:number = 0;
    switch(drop.type) {
        case "NOTE": type = 0; break;
        case "TASK": type = 1; break;
        case "TRX": type = 2; break;
    }
    return type;
}

export const statsCreate = functions.firestore
    .document('drops/{dropID}')
    .onCreate((snap, context) => {
        //const sdrop = snap.data();
        //const drop:Drop = { date: new Date(), tags: ["AAA", "CCC"], type:"TRX" }

        const drop:any = snap.data();
        const dropDate = drop.date.toDate();

        var day:number = dropDate.getDate();
        var month:number = dropDate.getMonth() + 1;
        var year:number = dropDate.getFullYear();

        getAnalytics(month,year).then( (a:any) => {

            const type:number = getTypeDrop(drop);

            a.totals[type]++;
            // update days structure
            a.days = incDayType(a.days, day, type)
            // update tag structure
            drop.tags.map( (tag:string) => {
                a.tags = incTagType(a.tags, tag, type)
            });
            admin.firestore().doc("analytics/"+year+"-"+month).set(a);
        });
        return drop;
    });

export const statsDelete = functions.firestore
    .document('drops/{dropID}')
    .onDelete((snap, context) => {
        //const sdrop = snap.data();
        //const drop:Drop = { date: new Date(), tags: ["AAA", "CCC"], type:"TRX" }

        const drop:any = snap.data();
        const dropDate = drop.date.toDate();

        var day:number = dropDate.getDate();
        var month:number = dropDate.getMonth() + 1;
        var year:number = dropDate.getFullYear();

        getAnalytics(month,year).then( (a:any) => {
            const type:number = getTypeDrop(drop);

            a.totals[type]--;
            // update days structure
            a.days = decDayType(a.days, day, type)
            // update tag structure
            drop.tags.map( (tag:string) => {
                a.tags = decTagType(a.tags, tag, type)
            });
            admin.firestore().doc("analytics/"+year+"-"+month).set(a);
        });
        return drop;
    });


export const statsUpdate = functions.firestore
    .document('drops/{dropID}')
    .onUpdate((change:any, context) => {

        const beforeDrop:any = change.before.data();
        const beforeDropDate = beforeDrop.date.toDate();

        const afterDrop:any = change.after.data();
        const afterDropDate = afterDrop.date.toDate();

        var beforeDay:number = beforeDropDate.getDate();
        var beforeMonth:number = beforeDropDate.getMonth() + 1;
        var beforeYear:number = beforeDropDate.getFullYear();

        var afterDay:number = afterDropDate.getDate();
        var afterMonth:number = afterDropDate.getMonth() + 1;
        var afterYear:number = afterDropDate.getFullYear();

        /**
        
        if month changed, delete previous day,tag bucket add new day,tag bucket
        else 
            if day changed dec previous day, add new day
            if tag changed dec previous tag, add new tag
        
        */

        if (beforeMonth != afterMonth) {
            getAnalytics(beforeMonth,beforeYear).then( (a:any) => {
                const type:number = getTypeDrop(beforeDrop);

                a.totals[type]--;
                // update days structure
                a.days = decDayType(a.days, beforeDay, type)
                // update tag structure
                beforeDrop.tags.map( (tag:string) => {
                    a.tags = decTagType(a.tags, tag, type)
                });
                admin.firestore().doc("analytics/"+beforeYear+"-"+beforeMonth).set(a);
            });
            getAnalytics(afterMonth,afterYear).then( (a:any) => {
                const type:number = getTypeDrop(afterDrop);

                a.totals[type]++;
                // update days structure
                a.days = incDayType(a.days, afterDay, type)
                // update tag structure
                afterDrop.tags.map( (tag:string) => {
                    a.tags = incTagType(a.tags, tag, type)
                });
                admin.firestore().doc("analytics/"+afterYear+"-"+afterMonth).set(a);
            });
        } else {
            getAnalytics(afterMonth,afterYear).then( (a:any) => {
                const type:number = getTypeDrop(afterDrop);

                if (beforeDay != afterDay) {
                    // update days structure
                    a.days = decDayType(a.days, beforeDay, type)
                    a.days = incDayType(a.days, afterDay, type)
                }

                let decTags =  beforeDrop.tags.filter( (bt:string) => afterDrop.tags.every( (at:string) => at !== bt ) );
                let incTags =  afterDrop.tags.filter( (at:string) => beforeDrop.tags.every( (bt:string) => bt !== at ) );

                incTags.map( (tag:string) => { a.tags = incTagType(a.tags, tag, type)  });
                decTags.map( (tag:string) => { a.tags = decTagType(a.tags, tag, type)  });

                admin.firestore().doc("analytics/"+afterYear+"-"+afterMonth).set(a);
            });
        }
        return afterDrop;
    });

export const timeTrigger = functions.pubsub.topic("oos-time").onPublish(async message => {
    console.log(Buffer.from(message.data,'base64').toString());

    return admin.firestore().collection("drops").add(
        { 
            text: "This is a minute drop...", 
            tags: ["Note"], 
            recurrence: "none",
            completed: null,
            date: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
});

export const updateTags = functions.firestore
    .document('drops/{dropID}')
    .onWrite((change, context) => {
      let newDoc = change.after ? change.after.exists ? change.after.data() : null : null;
      let oldDoc = change.before ? change.before.exists ? change.before.data() : null : null;

      let newTags:Array<string> =  newDoc ? newDoc.tags : [];
      let oldTags:Array<string> = oldDoc ? oldDoc.tags : [];

      // increment those that are in the new and not in the old
      let inc = newTags.filter( nt => oldTags.every( ot => ot !== nt ) )
      let incTags = inc.map( t => admin.firestore().doc("tags/"+t).get() );
      Promise.all(incTags).then( docs => {
          docs.map( d => d.data() ).map( (t:any) => admin.firestore().doc("tags/"+t.name).update({ count: ++t.count, updatedAt: admin.firestore.FieldValue.serverTimestamp()}) )
      });
      
      // decrement those that are in the old and not in the new
      let dec = oldTags.filter( ot => newTags.every( nt => nt !== ot ) );
      let decTags = dec.map( t => admin.firestore().doc("tags/"+t).get() );
      Promise.all(decTags).then( docs => {
          docs.map( d => d.data() ).map( (t:any) => admin.firestore().doc("tags/"+t.name).update({ count: --t.count}) )
      });

      return 0;

    });
