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


async function getAnalytics(month:number,year:number) {
    var doc = await admin.firestore().doc("analytics/"+year+"-"+month).get();
    
    if (doc.exists) 
        return doc.data();
    else 
        return Promise.resolve({ month: month, year: year, totals: [0,0,0], days: [  ], tags: [ ] } );
}

type Days = { day: number, totals: Array<number> }
type Tags = { tag: string, totals: Array<number> }
type Drop = { date: Date, tags: Array<string>, type: string }

export const updateStats = functions.firestore
    .document('drops/{dropID}')
    .onWrite((change, context) => {

        var drop:Drop = { date: new Date(), tags: ["AAA", "CCC"], type:"TRX" }
        console.log(drop.date);
        var day:number = drop.date.getDate();
        var month:number = drop.date.getMonth() + 1;
        var year:number = drop.date.getFullYear();

        getAnalytics(month,year).then( a => {

/**
if new add date and tag
if delete substract date and tag

if updated
 if date changed subtract before date, add new Date
 if tags changed substract removed tags, add new tags
 */

            var type:number = 0;
            switch(drop.type) {
                case "NOTE": type = 0; break;
                case "TASK": type = 1; break;
                case "TRX": type = 2; break;
            }

            const addType = function(totals: Array<number>, t:number){ return totals.map((v,i) =>  i === t ? ++v : v)}
            if (a) {
                a.totals[type]++;
                // update days structure
                var dayExist:boolean  = a.days.filter( (d:Days) => d.day == day).length != 0;
                
                if (dayExist) {
                    a.days = a.days.map( (d:Days) => d.day == day ? { day: day, totals: addType(d.totals,type) } : d )
                } else 
                    a.days.push( { day: day, totals: addType([0,0,0],type)});

                // update tag structure
                drop.tags.map( (tag:string) => {
                    var tagExist:boolean = a.tags.filter( (t:Tags) => t.tag === tag).length != 0;
                    
                    if (tagExist) {
                        a.tags = a.tags.map( (t:Tags) => t.tag === tag ? { tag: tag, totals: addType(t.totals,type) } : t )
                    } else 
                        a.tags.push( { tag: tag, totals: addType([0,0,0],type) } );
                }); 

                console.log(a);
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
      // Get an object with the current document value.
      // If the document does not exist, it has been deleted.
      let document = null;
      let oldDocument = null;
      
      if (change.after) document = change.after.data();
      if (change.before) oldDocument = change.before.data();

      let newTags = document ? document.tags : [];
      let oldTags = oldDocument ? oldDocument.tags : [];

      return admin.firestore().collection("tags")
      .get()
      .then( querySnapshot => {
                querySnapshot.forEach(doc => {
                    const data = doc.data();
                    if (newTags.includes(data.name) && !oldTags.includes(data.name))
                        return admin.firestore().doc('tags/'+doc.id).update({ count: data.count + 1, updatedAt: admin.firestore.FieldValue.serverTimestamp() })
                    if (!newTags.includes(data.name) && oldTags.includes(data.name))
                        return admin.firestore().doc('tags/'+doc.id).update({ count: data.count - 1 })
                    return null;
                });
      }).catch( error => console.log(error) );

      // perform desired operations ...
    });
