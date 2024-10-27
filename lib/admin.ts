import admin from "firebase-admin";

const credentials = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_CREDENTIALS!);

if (admin.apps.length === 0) {
    admin.initializeApp({
        credential: admin.credential.cert(credentials),
    });
}

export const db = admin.firestore();
