const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp()

exports.onHistoryCreate = functions.firestore.document('topic/{topicID}/history/{historyID}').onCreate(async (snapshot, context) => {
  const topicSnap = await admin.firestore().collection("topic").doc(context.params.topicID).get();
  const historyList = topicSnap.data().historyList;
  historyList.push(context.params.historyID)
  admin.firestore().collection("topic").doc(context.params.topicID).update({ updatedAt: snapshot.data().updatedAt, historyList })
})

exports.onHistoryDelete = functions.firestore.document('topic/{topicID}/history/{historyID}').onDelete(async (snapshot, context) => {
  const topicSnap = await admin.firestore().collection("topic").doc(context.params.topicID).get();
  const historyList = topicSnap.data().historyList;
  console.log("⬇︎【ログ】", "historyList"); console.log(historyList);
  const deletedHistoryList = historyList.filter(function (historyID) {
    return historyID !== context.params.historyID;
  });
  console.log("⬇︎【ログ】", "deletedHistoryList"); console.log(deletedHistoryList);
  admin.firestore().collection("topic").doc(context.params.topicID).update({ historyList: deletedHistoryList })
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
