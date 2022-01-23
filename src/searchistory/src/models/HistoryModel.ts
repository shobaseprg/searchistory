import {
  collection,
  serverTimestamp,
  doc,
  setDoc,
  DocumentData,
} from 'firebase/firestore';

import { db } from "../firebase/config";

type HistoryStatus = 'pending' | 'unsolved' | 'solved'

const HISTORY_STATUS = {
  PENDING: 'pending',
  UNSOLVED: 'unsolved',
  SOLVED: 'solved',
} as const;

type HistoryStatusWord = '未調査' | '未解決' | '解決'

const HISTORY_STATUS_WORD = {
  pending: "未調査",
  unsolved: "未解決",
  solved: "解決"
} as const

import { PostCoreModel, FileInfo } from "./PostCoreModel"

class HistoryModel extends PostCoreModel {
  readonly url: string = "";
  readonly status: HistoryStatus = "pending";
  readonly statusWord: HistoryStatusWord = "未調査";

  constructor(topicObj: DocumentData | "default") {
    super(topicObj);
    switch (typeof topicObj) {
      case "string":
        break;

      default:
        this.url = topicObj.title;
        this.status = topicObj.status;
        this.statusWord = HISTORY_STATUS_WORD[this.status];
    }
  }

  static async register(
    url: string,
    content: string,
    uid: string,
    name: string,
    files: FileInfo[],
    topicDocID: string,
  ) {
    const { existFiles, deleteFiles } = super.splitFiles(files, content);
    super.deleteImgFromStorage(deleteFiles);
    const newHistoryRef = doc(collection(db, 'topic', topicDocID, 'history'));

    await setDoc(newHistoryRef, {
      url,
      content,
      uid,
      name,
      status: HISTORY_STATUS.PENDING,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      docID: newHistoryRef.id,
      files: existFiles,
      topicDocID
    });
  }

  static async update(
    url: string,
    content: string,
    docID: string
  ) {
    const updateTopicRef = doc(db, 'topic', docID);

    await setDoc(updateTopicRef, {
      url,
      content,
      updatedAt: serverTimestamp(),
    }, { merge: true });
  }
}
export { HistoryModel, HistoryStatus, HISTORY_STATUS, HISTORY_STATUS_WORD };
