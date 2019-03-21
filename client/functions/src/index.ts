import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp(functions.config().firebase);

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

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
