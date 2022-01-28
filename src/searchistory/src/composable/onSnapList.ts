// import { Ref } from "vue";
// //firebase
// import { getAuth, signOut } from 'firebase/auth';
// import { db } from "./../firebase/config";
// import { orderBy, onSnapshot, collection, query, where, Unsubscribe, Query, DocumentData } from "firebase/firestore"
// import { HistoryModel } from '../models/HistoryModel';
// import { TopicModel } from '../models/TopicModel';

// type SnapType = "history" | "topic";

// const onSnapList = async (query: Query<DocumentData>, snapType: SnapType, list: Ref<HistoryModel[]> | Ref<TopicModel[]>, targetStore) => {
//   onSnapshot(query, (querySnapshot) => {
//     querySnapshot.docChanges().forEach((change) => {

//       // added
//       if (change.type == "added") {
//         // let addData: any
//         // switch (snapType) {
//         //   case "topic":
//         //     addData = new TopicModel(change.doc.data(({ serverTimestamps: "estimate" })))
//         //     addData.setMemberInfo();
//         //     break;
//         //   case "history":
//         //     addData = new HistoryModel(change.doc.data(({ serverTimestamps: "estimate" })));
//         //     break;
//         // }
//         // list.value.push(addData);

//         // if (targetStore.value.docID === addData.docID) {
//         //   targetHistoryStore.setTargetHistory(targetHistory.value);
//         // }
//       }
//       // modified
//       if (change.type == "modified") {
//         // const modifyHistory = new HistoryModel(change.doc.data(({ serverTimestamps: "estimate" })))
//         // const modifyIndex = histories.value.findIndex((history) => {
//         //   return history.docID === modifyHistory.docID
//         // }
//         // )
//         // histories.value[modifyIndex] = modifyHistory;
//         // if (targetHistory.value.docID === modifyHistory.docID) {
//         //   targetHistoryStore.setTargetHistory(modifyHistory);
//         // }
//       }
//     });
//   });
// };

// export default onSnapList;
