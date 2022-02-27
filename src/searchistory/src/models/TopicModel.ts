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
import { sanitize, reSanitize } from "../composable/sanitize";
import { topicVali } from "../composable/validate";
import cutWord from "../composable/cutWord";

type TopicStatus = 'all' | 'pending' | 'finish'

const TOPIC_STATUS = {
  ALL: 'all',
  PENDING: 'pending',
  FINISH: 'finish',
} as const;

type TopicStatusWord = '全て' | '未解決' | '解決済';

const topicStatusList = [TOPIC_STATUS.PENDING, TOPIC_STATUS.FINISH];

const TOPIC_STATUS_WORD = {
  all: "全て",
  pending: "未解決",
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
  readonly authorized_uid_list: Array<string> = [];
  authorizedMemberInfos: Array<Member> = [];
  readonly history_list: Array<string> = [];

  constructor(topicObj: DocumentData | "default") {
    super(topicObj);
    switch (typeof topicObj) {
      case "string":
        break;

      default:
        this.title = topicObj.title;
        this.status = topicStatusList[topicObj.status];
        this.statusWord = TOPIC_STATUS_WORD[this.status];
        this.authorized_uid_list = topicObj.authorized_uid_list;
        this.history_list = topicObj.history_list;
    }
  }

  //============= 登録 =============
  static async register(
    title: string,
    content: string,
    uid: string,
    files: FileInfo[]
  ) {

    const valiResult = topicVali(title, content);
    if (valiResult !== "") {
      alert(valiResult);
      return false;
    }

    const { existFiles, deleteFiles } = super.splitFiles(files, content);
    super.deleteImgFromStorage(deleteFiles);
    const newTopicRef = doc(collection(db, 'topics'));

    try {
      await setDoc(newTopicRef, {
        title,
        content: sanitize(content),
        uid,
        authorized_uid_list: [uid],
        status: 0,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
        doc_id: newTopicRef.id,
        files: existFiles,
        history_list: []
      });
      return true;
    } catch (e) {
      console.log(e);
      alert("エラーが発生しました。");
      return false;
    }
  }
  //============= 更新 =============
  static async update(
    title: string,
    content: string,
    files: FileInfo[],
    doc_id: string
  ) {

    const valiResult = topicVali(title, content);
    if (valiResult !== "") {
      alert(valiResult);
      return false;
    }

    const { existFiles, deleteFiles } = super.splitFiles(files, content);
    super.deleteImgFromStorage(deleteFiles);
    const updateTopicRef = doc(db, 'topics', doc_id);

    try {
      await updateDoc(updateTopicRef, {
        title,
        content: sanitize(content),
        files: existFiles,
        updated_at: serverTimestamp(),
      });
      return true;
    } catch (e) {
      console.log(e);
      alert("エラーが発生しました。");
      return false;
    }
  }
  //============= 削除 =============
  async delete() {
    const shotWord = cutWord(this.title, 20);

    if (!confirm(`${shotWord}を削除しますか?`)) return;

    const historyColRef = collection(db, 'topics', this.doc_id, 'histories');
    try {
      const querySnapshot = await getDocs(historyColRef);
      // 紐づくhistory削除
      querySnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref)
      }
      )
      // topic削除
      const updateTopicRef = doc(db, 'topics', this.doc_id);
      await deleteDoc(updateTopicRef);
      alert(`${shotWord}を削除しました。`)
    } catch (e) {
      console.log(e);
      alert("エラーが発生しました。");
    }
  };
  //============= 権限更新 =============
  async updateMembers(authorizedMemberInfos: Member[], uid: string) {
    const authorized_uid_list = authorizedMemberInfos.map((info) => {
      return info.uid;
    }
    )
    authorized_uid_list.push(uid)
    const updateTopicRef = doc(db, 'topics', this.doc_id);
    await updateDoc(updateTopicRef, {
      authorized_uid_list
    });
  }
  // 最新のメンバー情報を格納
  async setMemberInfo() {
    this.authorizedMemberInfos = await getMemberInfoList(this.authorized_uid_list)
  }
}
export { TopicModel, TopicStatus, topicStatusList, TOPIC_STATUS, TOPIC_STATUS_WORD, TOPIC_OWNER, TopicOwner };
