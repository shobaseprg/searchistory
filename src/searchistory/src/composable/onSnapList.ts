import { Ref, ComputedRef, ref } from "vue";
//firebase


import { onSnapshot, Query, DocumentData, QueryDocumentSnapshot } from "firebase/firestore"
import { HistoryModel } from '../models/HistoryModel';
import { TopicModel } from '../models/TopicModel';
import { PostCoreModel } from '../models/PostCoreModel'

const topics = ref<TopicModel[]>([]);


const onSnapList = (
  { q, getInstanceFunc, list, targetState, targetStore }:
    {
      q: Query<DocumentData>,
      getInstanceFunc: (doc: QueryDocumentSnapshot<DocumentData>) => TopicModel | HistoryModel,
      list: Ref<PostCoreModel[]>,
      targetState: ComputedRef,
      targetStore: any,
    }
) => {
  return onSnapshot(q, (querySnapshot) => {
    list.value = []
    console.log("on snap")
    querySnapshot.forEach(doc => {
      console.log("foreach")
      const addData = getInstanceFunc(doc);
      list.value.push(addData);
      if (targetState.value.docID === addData.docID) {
        targetStore.setTarget(addData);
      }
    });
    // querySnapshot.docChanges().forEach((change) => {
    // added
    // if (change.type == "added") {
    //   const addData = getInstanceFunc(change)
    //   list.value.push(addData);
    //   if (targetState.value.docID === addData.docID) {
    //     targetStore.setTarget(addData);
    //   }
    //   list.value
    // }
    // // modified
    // if (change.type == "modified") {
    //   const modifyData = getInstanceFunc(change)
    //   console.log(list.value.length)
    //   const modifyIndex = list.value.findIndex((data) => {
    //     return data.docID === modifyData.docID
    //   }
    //   )
    //   list.value[modifyIndex] = modifyData;
    //   list.value

    //   if (targetState.value.docID === modifyData.docID) {
    //     targetStore.setTarget(modifyData);
    //   }
    // }
    // //   delete
    // if (change.type == "removed") {
    //   const deleteData = getInstanceFunc(change)
    //   const deleteIndex = list.value.findIndex((data) => {
    //     console.log(data)
    //     return data.docID === deleteData.docID
    //   })
    //   delete list.value[deleteIndex]
    //   list.value
    // }
    // })
  })
}

export { onSnapList, topics };
