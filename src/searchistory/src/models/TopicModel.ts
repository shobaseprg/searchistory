import {
  collection,
  serverTimestamp,
  doc,
  setDoc,
  DocumentData,
} from 'firebase/firestore';

import { db } from "../firebase/config";

type TopicStatus = 'pending' | 'finish'

const TOPIC_STATUS = {
  PENDING: 'pending',
  FINISH: 'finish',
} as const;

type TopicStatusWord = '未決' | '解決済'

const TOPIC_STATUS_WORD = {
  pending: "未決",
  finish: "解決済"
} as const

import { PostCoreModel, FileInfo } from "./PostCoreModel"

class TopicModel extends PostCoreModel {
  readonly title: string = "";
  readonly status: TopicStatus = "pending";
  readonly statusWord: TopicStatusWord = "未決";
  readonly authorizedUsers: Array<String> = [];

  constructor(topicObj: DocumentData | "default") {
    super(topicObj);
    switch (typeof topicObj) {
      case "string":
        break;

      default:
        this.title = topicObj.title;
        this.status = topicObj.status;
        this.statusWord = TOPIC_STATUS_WORD[this.status];
        this.authorizedUsers = topicObj.authorizedUsers;
    }
  }

  // 保存
  static async register(
    title: string,
    content: string,
    uid: string,
    name: string,
    files: FileInfo[]
  ) {
    const { existFiles, deleteFiles } = super.splitFiles(files, content);
    super.deleteImgFromStorage(deleteFiles);
    const newTopicRef = doc(collection(db, 'topic'));

    await setDoc(newTopicRef, {
      title,
      content,
      uid,
      name,
      authorizedUsers: [],
      status: TOPIC_STATUS.PENDING,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      docID: newTopicRef.id,
      files: existFiles
    });
  }
  // 更新
  static async update(
    title: string,
    content: string,
    targetTopicFiles: FileInfo[],
    files: FileInfo[],
    docID: string
  ) {
    console.log("▼【ログ】targetTopicFiles");
    console.log(targetTopicFiles);
    console.log("▼【ログ】files");
    console.log(files);

    const margeFiles = targetTopicFiles.concat(files);

    console.log("▼【ログ】margeFiles");
    console.log(margeFiles);

    const { existFiles, deleteFiles } = super.splitFiles(margeFiles, content);
    console.log("▼【ログ】existFiles");
    console.log(existFiles);
    console.log("▼【ログ】deleteFiles");
    console.log(deleteFiles);

    super.deleteImgFromStorage(deleteFiles);
    const updateTopicRef = doc(db, 'topic', docID);

    await setDoc(updateTopicRef, {
      title,
      content,
      files: existFiles,
      updatedAt: serverTimestamp(),
    }, { merge: true });
  }
}
export { TopicModel, TopicStatus, TOPIC_STATUS, TOPIC_STATUS_WORD };
