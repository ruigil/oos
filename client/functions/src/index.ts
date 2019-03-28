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
    var doc = await admin.firestore().doc("analytics/"+month+year).get();
    console.log("await done.");
    if (doc.exists) { 
        console.log("return doc.");
        return doc.data();
    } else {
        return Promise.resolve({ totals: [0,0,0], days: [  ], tags: [ ] } );
    }
}

export const updateStats = functions.firestore
    .document('drops/{dropID}')
    .onWrite((change, context) => {

        return admin.firestore().doc("drops/aCag1iLYarTc1NlGcm6z").get().then(d => {
            var dr = d.data();
            var date = dr ? dr.date.toDate() : new Date();

            var day = date.getDay();
            var month = Number(date.getMonth());
            var year = Number(date.getFullYear());

            console.log(month);
            console.log(year);

            getAnalytics(month,year).then( (a) => {
                console.log("doing a");
                console.log(a);
                var type = 0;
                switch(dr ? dr.type: "NOTE") {
                    case "NOTE": type = 0; break;
                    case "TASK": type = 1; break;
                    case "TRX": type = 2; break;
                }
                type Days = { day: number, totals: Array<number> }
                type Tags = { tag: string, totals: Array<number> }
                var tot = [0,0,0].splice(0,3,1);
                console.log(tot);
                if (a) {
                    a.totals[type]++;
                    // update days structure
                    var dayExist:boolean  = a.days.filter( (d:Days) => d.day == 1).length != 0;
                    if (dayExist) {
                        a.days = a.days.map( (d:Days) => d.day == day ? { day: day, totals: d.totals.map((v,i) =>  i === type ? ++v : v) } : d )
                    } else a.days.push( { day: day, totals: [0,0,0].map((v,i) =>  i === type ? ++v : v)});
                    // update tag structure
                    if (dr) dr.tags.map( (tag:string) => {
                        var tagExist:boolean = a.tags.filter( (t:Tags) => t.tag === tag).length != 0;
                        if (tagExist) {
                            a.tags = a.tags.map( (t:Tags) => t.tag === tag ? { tag: tag, totals: t.totals.map((v,i) =>  i === type ? ++v : v) } : d )
                        } else a.tags.push( { tag: tag, totals: [0,0,0].map((v,i) =>  i === type ? ++v : v) } );
                    }); 

                    admin.firestore().doc("analytics/"+month+year).set(a);
                console.log(a);
                console.log(a.days);
                console.log(a.tags);
                }               
            });


            /**
                get the month and the year and the day
                see if there is a analytics bucket for This
                if there is update it ifnot create one

                update the totals by type
                update the tags map with each tag of the drop and the type 
                update the day map with the day and type 
             */
        });
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
