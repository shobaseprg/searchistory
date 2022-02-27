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
    querySnapshot.docChanges().forEach((change) => {
      const clone = [...list.value];
      // added
      if (change.type == "added") {
        const addData = getInstanceFunc(change.doc)
        clone.push(addData);
      }
      // modified
      if (change.type == "modified") {
        const modifyData = getInstanceFunc(change.doc)
        const modifyIndex = clone.findIndex((data) => {
          return data.doc_id === modifyData.doc_id
        }
        )
        clone[modifyIndex] = modifyData;
        if (targetState.value.doc_id === modifyData.doc_id) {
          targetStore.setTarget(modifyData);
        }
      }
      //   delete
      if (change.type == "removed") {
        const deleteData = getInstanceFunc(change.doc)
        const deleteIndex = clone.findIndex((data) => {
          return data.doc_id === deleteData.doc_id
        })
        clone.splice(deleteIndex, 1)
      }
      list.value = clone;
    })
    list.value.sort((a, b) => a.updated_at < b.updated_at ? 1 : -1)
  })
}

export { onSnapList, topics };
