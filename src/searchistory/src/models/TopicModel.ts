import {
  collection,
  serverTimestamp,
  doc,
  setDoc,
  DocumentData,
  deleteDoc,
  getDocs,
  updateDoc
} from 'firebase/firestore';

import { db } from "../firebase/config";
import { getMemberInfoList } from "../composable/getUserInfoFromUID";
import { sanitize, reSanitize } from "../composable/sanitize"

type TopicStatus = 'all' | 'pending' | 'finish'

const TOPIC_STATUS = {
  ALL: 'all',
  PENDING: 'pending',
  FINISH: 'finish',
} as const;

type TopicStatusWord = '全て' | '未決' | '解決済'

const TOPIC_STATUS_WORD = {
  all: "全て",
  pending: "未決",
  finish: "解決済"
} as const

const TOPIC_OWNER = {
  all: "all",
  me: "me",
  other: "other"
} as const

type TopicOwner = "all" | "me" | "other";

import { PostCoreModel, FileInfo } from "./PostCoreModel"
import { Member } from '../types/Member';
class TopicModel extends PostCoreModel {
  readonly title: string = "";
  readonly status: TopicStatus = TOPIC_STATUS.PENDING;
  readonly statusWord: TopicStatusWord = TOPIC_STATUS_WORD.pending;
  readonly authorizedUIDs: Array<string> = [];
  authorizedMemberInfos: Array<Member> = [];
  readonly historyList: Array<string> = [];

  constructor(topicObj: DocumentData | "default") {
    super(topicObj);
    switch (typeof topicObj) {
      case "string":
        break;

      default:
        this.title = topicObj.title;
        this.status = topicObj.status;
        this.statusWord = TOPIC_STATUS_WORD[this.status];
        this.authorizedUIDs = topicObj.authorizedUIDs;
        this.historyList = topicObj.historyList;
    }
  }
  // 保存
  static async register(
    title: string,
    content: string,
    uid: string,
    files: FileInfo[]
  ) {
    const { existFiles, deleteFiles } = super.splitFiles(files, content);
    super.deleteImgFromStorage(deleteFiles);
    const newTopicRef = doc(collection(db, 'topic'));

    const scontent = sanitize(content);

    await setDoc(newTopicRef, {
      title,
      content: scontent,
      uid,
      authorizedUIDs: [uid],
      status: TOPIC_STATUS.PENDING,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      docID: newTopicRef.id,
      files: existFiles,
      historyList: []
    });
  }
  // 更新
  static async update(
    title: string,
    content: string,
    files: FileInfo[],
    docID: string
  ) {
    const { existFiles, deleteFiles } = super.splitFiles(files, content);
    super.deleteImgFromStorage(deleteFiles);
    const updateTopicRef = doc(db, 'topic', docID);
    const scontent = sanitize(content);

    await updateDoc(updateTopicRef, {
      title,
      content: scontent,
      files: existFiles,
      updatedAt: serverTimestamp(),
    });
  }
  // 削除
  async delete() {
    const historyColRef = collection(db, 'topic', this.docID, 'history');
    const querySnapshot = await getDocs(historyColRef);
    querySnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref)
    }
    )
    const updateTopicRef = doc(db, 'topic', this.docID);
    await deleteDoc(updateTopicRef)
  };
  // 権限更新
  async updateMembers(authorizedMemberInfos: Member[], uid: string) {
    const authorizedUIDs = authorizedMemberInfos.map((info) => {
      return info.uid;
    }
    )
    authorizedUIDs.push(uid)
    const updateTopicRef = doc(db, 'topic', this.docID);
    await updateDoc(updateTopicRef, {
      authorizedUIDs
    });
  }
  // 最新のメンバー情報を格納
  async setMemberInfo() {
    this.authorizedMemberInfos = await getMemberInfoList(this.authorizedUIDs)
  }
}
export { TopicModel, TopicStatus, TOPIC_STATUS, TOPIC_STATUS_WORD, TOPIC_OWNER, TopicOwner };
