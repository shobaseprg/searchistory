const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp()

exports.onHistoryCreate = functions.firestore.document('topics/{topicID}/histories/{historyID}').onCreate(async (snapshot, context) => {
  const topicSnap = await admin.firestore().collection("topics").doc(context.params.topicID).get();
  const historyList = topicSnap.data().history_list;
  historyList.push(context.params.historyID)
  admin.firestore().collection("topics").doc(context.params.topicID).update({ updated_at: snapshot.data().updated_at, history_list: historyList })
})

exports.onHistoryDelete = functions.firestore.document('topics/{topicID}/histories/{historyID}').onDelete(async (snapshot, context) => {
  const topicSnap = await admin.firestore().collection("topics").doc(context.params.topicID).get();
  const historyList = topicSnap.data().history_list;
  console.log("⬇︎【ログ】", "historyList"); console.log(historyList);
  const deletedHistoryList = historyList.filter(function (historyID) {
    return historyID !== context.params.historyID;
  });
  console.log("⬇︎【ログ】", "deletedHistoryList"); console.log(deletedHistoryList);
  admin.firestore().collection("topics").doc(context.params.topicID).update({ history_list: deletedHistoryList })
})

exports.onHistoryUpdate = functions.firestore.document('topics/{topicID}/histories/{historyID}').onUpdate(async (change, context) => {
  const parentTopicRef = admin.firestore().collection("topics").doc(context.params.topicID);
  const afterData = change.after.data();
  if (afterData.status === "solved")
    parentTopicRef.update({ updated_at: afterData.updated_at, status: "finish" })
  else {
    parentTopicRef.update({ updated_at: afterData.updated_at })
  }
})
