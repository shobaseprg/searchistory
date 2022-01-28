import { Ref, ComputedRef } from "vue";
//firebase
import { getAuth, signOut } from 'firebase/auth';
import { db } from "./../firebase/config";
import { orderBy, onSnapshot, collection, query, where, Unsubscribe, Query, DocumentChange, DocumentData } from "firebase/firestore"
import { HistoryModel } from '../models/HistoryModel';
import { TopicModel } from '../models/TopicModel';
import { PostCoreModel } from '../models/PostCoreModel'

const onSnapList = (
  { q, getInstanceFunc, list, targetState, targetStore }:
    {
      q: Query<DocumentData>,
      getInstanceFunc: (change: DocumentChange<DocumentData>) => TopicModel | HistoryModel,
      list: Ref<PostCoreModel[]>,
      targetState: ComputedRef,
      targetStore: any,
    }
) => {
  return onSnapshot(q, (querySnapshot) => {
    querySnapshot.docChanges().forEach((change) => {

      // added
      if (change.type == "added") {
        const addData = getInstanceFunc(change)
        list.value.push(addData);
        if (targetState.value.docID === addData.docID) {
          targetStore.setTarget(addData);
        }
      }

      // modified
      if (change.type == "modified") {
        const modifyData = getInstanceFunc(change)
        const modifyIndex = list.value.findIndex((data) => {
          return data.docID === modifyData.docID
        }
        )
        list.value[modifyIndex] = modifyData;
        if (targetState.value.docID === modifyData.docID) {
          targetStore.setTarget(modifyData);
        }
      }
    })
  });
};

export default onSnapList;
