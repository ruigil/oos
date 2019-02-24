import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp(functions.config().firebase);

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

export const updateTags = functions.firestore
    .document('drops/{dropID}')
    .onWrite((change, context) => {
      // Get an object with the current document value.
      // If the document does not exist, it has been deleted.
      //const document = change.after.exists ? change.after.data() : null;

      // Get an object with the previous document value (for update or delete)
      //const oldDocument = change.before.data();

      return admin.firestore().collection("tags")
      .get()
      .then( querySnapshot => {
                querySnapshot.forEach(doc => {
                    const data = doc.data();
                    return admin.firestore().doc('tags/'+doc.id).update({ count: data.count + 1 })
                });
      }).catch( error => console.log(error) );

      // perform desired operations ...
    });
