import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { randomBytes } from 'crypto';
import FieldValue = admin.firestore.FieldValue;

admin.initializeApp();

export const authorizationOnCreate = functions.auth.user().onCreate( async (user) => {
    const userCollection = admin.firestore().collection('users');
    const customClaims = {
        neglected: false,
        beginner: false,
        medium: false
    };

    await userCollection.doc(user.uid).set({
        email: user.email,
        claims: customClaims
    });

    await admin.auth().setCustomUserClaims(user.uid, customClaims);
});

export const updateTokenOfUserClaim = functions.firestore.document('users/{userId}').onUpdate( async (change, context) => {
    const user = change.after.data();
    const uid = context.params.userId;

    if( user ) {
        await admin.auth().setCustomUserClaims(uid, user.claims);
    }
});

export const deleteUserAuth = functions.auth.user().onDelete( async (user) => {
    const userCollection = admin.firestore().collection('users');

    await userCollection.doc(user.uid).delete()

});

export const generateToken = functions.firestore.document('users/{userId}').onUpdate( async (change, context) => {
    const userAfter = change.after.data();
    const userBefore = change.before.data();
    const uid = context.params.userId;

    if( userAfter && userBefore ){
        if(!userBefore.claims.expert && userAfter.claims.expert) {
            randomBytes(48, async function(err, buffer) {
                const token = buffer.toString('hex');

                await admin.firestore()
                    .collection('users')
                    .doc(uid)
                    .update({
                        tokenHub: token
                    })

            });
        } else if (userBefore.claims.expert && !userAfter.claims.expert) {
            await admin.firestore()
                .collection('users')
                .doc(uid)
                .update({
                    tokenHub: FieldValue.delete()
                })
        }

    }

});