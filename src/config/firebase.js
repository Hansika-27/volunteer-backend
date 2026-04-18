const admin = require('firebase-admin');
require('dotenv').config();

if (!admin.apps.length) {
  const serviceAccount = require(process.env.FIREBASE_SERVICE_ACCOUNT_PATH || '../../serviceAccount.json');
  
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();
module.exports = { admin, db };