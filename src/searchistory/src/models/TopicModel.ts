import {
  collection,
  serverTimestamp,
  doc,
  setDoc,
  DocumentData,
} from 'firebase/firestore';

import { db } from "../firebase/config";
import { getMemberInfoList } from "../composable/getUserInfoFromUID";

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

import { PostCoreModel, FileInfo } from "./PostCoreModel"
import { Member } from '../types/Member';

class TopicModel extends PostCoreModel {
  readonly title: string = "";
  readonly status: TopicStatus = TOPIC_STATUS.PENDING;
  readonly statusWord: TopicStatusWord = TOPIC_STATUS_WORD.pending;
  readonly authorizedUIDs: Array<string> = [];
  authorizedMemberInfos: Array<Member> = [];

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
      authorizedUIDs: [uid],
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
    files: FileInfo[],
    docID: string
  ) {
    const { existFiles, deleteFiles } = super.splitFiles(files, content);
    super.deleteImgFromStorage(deleteFiles);
    const updateTopicRef = doc(db, 'topic', docID);

    await setDoc(updateTopicRef, {
      title,
      content,
      files: existFiles,
      updatedAt: serverTimestamp(),
    }, { merge: true });
  }
  // 権限更新
  async updateMembers(authorizedMemberInfos: Member[], uid: string) {
    const authorizedUIDs = authorizedMemberInfos.map((info) => {
      return info.uid;
    }
    )
    authorizedUIDs.push(uid)
    const updateTopicRef = doc(db, 'topic', this.docID);
    await setDoc(updateTopicRef, {
      authorizedUIDs
    }, { merge: true });
  }
  // 最新のメンバー情報を格納
  async setMemberInfo() {
    this.authorizedMemberInfos = await getMemberInfoList(this.authorizedUIDs)
  }
}
export { TopicModel, TopicStatus, TOPIC_STATUS, TOPIC_STATUS_WORD };
