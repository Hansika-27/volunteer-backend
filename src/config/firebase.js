const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

if (!admin.apps.length) {
  const configuredPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || 'serviceAccount.json';
  const serviceAccountPath = path.resolve(process.cwd(), configuredPath);

  if (!fs.existsSync(serviceAccountPath)) {
    throw new Error(
      `Firebase service account file not found at ${serviceAccountPath}. Set FIREBASE_SERVICE_ACCOUNT_PATH correctly.`
    );
  }

  const serviceAccount = require(serviceAccountPath);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();
module.exports = { admin, db };
