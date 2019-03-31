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
    
    if (doc.exists) 
        return doc.data();
    else 
        return Promise.resolve({ month: month, year: year, totals: [0,0,0], days: [  ], tags: [ ] } );
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
        const drop:Drop = { date: new Date(), tags: ["AAA", "CCC"], type:"TRX" }

        var day:number = drop.date.getDate();
        var month:number = drop.date.getMonth() + 1;
        var year:number = drop.date.getFullYear();

        getAnalytics(month,year).then( a => {

            const type:number = getTypeDrop(drop);

            if (a) {
                a.totals[type]++;
                // update days structure
                a.days = incDayType(a.days, day, type)
                // update tag structure
                drop.tags.map( (tag:string) => {
                    a.tags = incTagType(a.tags, tag, type)
                });
                console.log("stats create")
                console.log(a.totals);
                console.log(a.days);
                console.log(a.tags);
                admin.firestore().doc("analytics/"+year+"-"+month).set(a);
            }
        });
        return drop;
    });

export const statsDelete = functions.firestore
    .document('drops/{dropID}')
    .onCreate((snap, context) => {
        //const sdrop = snap.data();
        const drop:Drop = { date: new Date(), tags: ["AAA", "CCC"], type:"TRX" }

        var day:number = drop.date.getDate();
        var month:number = drop.date.getMonth() + 1;
        var year:number = drop.date.getFullYear();

        getAnalytics(month,year).then( a => {
            const type:number = getTypeDrop(drop);

            if (a) {
                a.totals[type]--;
                // update days structure
                a.days = decDayType(a.days, day, type)
                // update tag structure
                drop.tags.map( (tag:string) => {
                    a.tags = decTagType(a.tags, tag, type)
                });
                console.log("stats delete");
                console.log(a.totals);
                console.log(a.days);
                console.log(a.tags);
                admin.firestore().doc("analytics/"+year+"-"+month).set(a);
            }
        });
        return drop;
    });

// updateStats({ before: {foo: "old"}, after: {foo: "new"} })

/**

{ 
    text: 'This is a minute drop...',
    date: Timestamp { _seconds: 1553202600, _nanoseconds: 0 },
    recurrence: 'none',
    tags: [ 'Project', 'AAA' ],
    completed: null,
    createdAt: Timestamp { _seconds: 1553202645, _nanoseconds: 192000000 },
    updatedAt: Timestamp { _seconds: 1553276303, _nanoseconds: 822000000 }
}

*/

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
