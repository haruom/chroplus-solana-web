// utils/firebaseAdmin.js

import admin from 'firebase-admin';
import serviceAccount from '../../chro-plus-firebase-adminsdk.json'; // Update the path as needed

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    });
}

export default admin;
