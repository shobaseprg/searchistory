import {
  collection,
  serverTimestamp,
  doc,
  setDoc,
  DocumentData,
  deleteDoc,
  updateDoc
} from 'firebase/firestore';

import { db } from "../firebase/config";

type HistoryStatus = 'all' | 'pending' | 'unsolved' | 'solved'

const HISTORY_STATUS = {
  ALL: 'all',
  PENDING: 'pending',
  UNSOLVED: 'unsolved',
  SOLVED: 'solved',
} as const;

type HistoryStatusWord = '全て' | '未調査' | '未解決' | '解決'

const HISTORY_STATUS_WORD = {
  all: "全て",
  pending: "未調査",
  unsolved: "未解決",
  solved: "解決"
} as const

import { PostCoreModel, FileInfo } from "./PostCoreModel"

class HistoryModel extends PostCoreModel {
  readonly url: string = "";
  readonly title: string = "";
  readonly status: HistoryStatus = "pending";
  readonly statusWord: HistoryStatusWord = "未調査";
  readonly topicDocID: string = "";

  constructor(topicObj: DocumentData | "default") {
    super(topicObj);
    switch (typeof topicObj) {
      case "string":
        break;

      default:
        this.url = topicObj.url;
        this.title = topicObj.title;
        this.status = topicObj.status;
        this.statusWord = HISTORY_STATUS_WORD[this.status];
        this.topicDocID = topicObj.topicDocID;
    }
  }
  // 登録
  static async register(
    url: string,
    title: string,
    content: string,
    uid: string,
    files: FileInfo[],
    topicDocID: string,
  ) {
    const { existFiles, deleteFiles } = super.splitFiles(files, content);
    super.deleteImgFromStorage(deleteFiles);
    const newHistoryRef = doc(collection(db, 'topic', topicDocID, 'history'));

    await setDoc(newHistoryRef, {
      url,
      title,
      content,
      uid,
      status: HISTORY_STATUS.PENDING,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      docID: newHistoryRef.id,
      files: existFiles,
      topicDocID
    });
  }
  // 更新
  static async update(
    url: string,
    title: string,
    content: string,
    targetHistoryFiles: FileInfo[],
    files: FileInfo[],
    docID: string,
    topicDocID: string,
    status: HistoryStatus
  ) {
    console.log("⬇︎【ログ】", "");

    const margeFiles = [...targetHistoryFiles, ...files]
    const { existFiles, deleteFiles } = super.splitFiles(margeFiles, content);
    super.deleteImgFromStorage(deleteFiles);
    const updateHistoryRef = doc(db, 'topic', topicDocID, 'history', docID);
    await updateDoc(updateHistoryRef, {
      url,
      title,
      content,
      files: existFiles,
      updatedAt: serverTimestamp(),
      status
    });
  }
  // 削除
  async delete(topicDocID: string) {
    const updateHistoryRef = doc(db, 'topic', topicDocID, 'history', this.docID);
    await deleteDoc(updateHistoryRef)

  };
}
export { HistoryModel, HistoryStatus, HISTORY_STATUS, HISTORY_STATUS_WORD };
