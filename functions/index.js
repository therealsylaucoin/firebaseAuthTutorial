const functions = require('firebase-functions');

//SDK 
const admin = require('firebase-admin');
//initialize it so that we can use it
admin.initializeApp();

//create a function that will add an admin role to a specific user
//tell if the current user is an admin by using the context  (aka only admins can call the makeadmin function)
exports.addAdminRole = functions.https.onCall((data, context) => {
    if ( context.auth.token.admin !== true ){
        return { error: 'only admins can set admin permissions.'}
    }
    //get user and add custom claim (admin)
    return admin.auth().getUserByEmail(data.email)
    .then(user => {
        return admin.auth().setCustomUserClaims(user.uid, {
            admin: true
        })
    }).then(() => { //what happens once the user is an admin
        return {
            message: `Success! ${data.email} has been made an admin.`
        }
    }).catch(err => {
        return err;
    });
});