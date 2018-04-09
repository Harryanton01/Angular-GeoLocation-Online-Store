"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GeoFire = require('geofire');
const functions = require("firebase-functions");
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
const geoFire = new GeoFire(admin.database().ref(`/items`));
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
/*exports.userSignup = functions.auth.user().onCreate((event, context) => {
    return admin.firestore().doc(`/users/${event.uid}`).set({
        email: event.email
      });
});*/
exports.AddItemLocation = functions.firestore.document('/items/{itemid}')
    .onCreate(event => {
    const location = event.data().location;
    return geoFire.set(event.id, [location.latitude, location.longitude]);
});
/*exports.updateRestaurantToRTDB = functions.firestore.document('/restaurants/{restaurantID}')
    .onUpdate(event => {
        const location = event.data.data().location;
        return geoFire.set(event.data.id, [location.latitude, location.longitude])
})

exports.deleteRestaurantToRTDB = functions.firestore.document('/restaurants/{restaurantID}')
    .onDelete(event => {
        //const location = event.data.data().location;
        //return geoFire.set(event.data.id, [location.latitude, location.longitude])
        return geoFire.remove(event.data.id)
})*/
//# sourceMappingURL=index.js.map