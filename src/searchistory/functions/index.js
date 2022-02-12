const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp()

exports.onHistoryCreate = functions.firestore.document('topic/{topicID}/history/{historyID}').onCreate(async (snapshot, context) => {
  admin.firestore().collection("topic").doc(context.params.topicID).update({ updatedAt: snapshot.data().updatedAt })
})

exports.onHistoryUpdate = functions.firestore.document('topic/{topicID}/history/{historyID}').onUpdate(async (change, context) => {
  const parentTopicRef = admin.firestore().collection("topic").doc(context.params.topicID);
  const afterData = change.after.data();
  if (afterData.status === "solved")
    parentTopicRef.update({ updatedAt: afterData.updatedAt, status: "finish" })
  else {
    parentTopicRef.update({ updatedAt: afterData.updatedAt })
  }
})
