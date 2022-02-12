const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp()

exports.onBookWrite = functions.firestore.document('topic/{topicID}/history/{historyID}').onWrite(async (change, context) => {
  // 変更されたときはafterに変更後の値が入る
  const beforeDocument = change.after.exists ? change.after.data() : null;
  const document = change.before.data();

  console.log('【Firestore変更】');
})
