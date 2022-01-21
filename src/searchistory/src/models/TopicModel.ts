import {
  collection,
  serverTimestamp,
  doc,
  setDoc,
  DocumentData,
} from 'firebase/firestore';

import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
const storage = getStorage();

import { db } from "../firebase/config";

import moment from 'moment';

type TopicStatus = 'pending' | 'finish'

const TOPIC_STATUS = {
  PENDING: 'pending',
  FINISH: 'finish',
} as const;

type TopicStatusWord = '未決' | '解決済'

const disWord = {
  pending: "未決",
  finish: "解決済"
} as const

type Topic = {
  content: string,
  title: string,
  uid: string,
  status: TopicStatus,
  authorizedUsers: Array<String>,
  createdAt: moment.Moment,
  updatedAt: moment.Moment,
  docID: string,
}

class TopicModel {
  readonly content: string = "";
  readonly title: string = "";
  readonly uid: string = "";
  readonly status: TopicStatus = "pending";
  readonly statusWord: TopicStatusWord = "未決";
  readonly authorizedUsers: Array<String> = [];
  readonly createdAt: moment.Moment = moment();
  readonly updatedAt: moment.Moment = moment();
  readonly docID: string = "";

  constructor(topicObj: DocumentData | "default") {
    switch (typeof topicObj) {
      case "string":
        break;

      default:
        this.content = topicObj.content;
        this.title = topicObj.title;
        this.uid = topicObj.uid;
        this.status = topicObj.status;
        this.statusWord = disWord[this.status];
        this.authorizedUsers = topicObj.authorizedUsers;
        this.createdAt = moment(topicObj.createdAt.toDate());
        this.updatedAt = moment(topicObj.updatedAt.toDate());
        this.docID = topicObj.docID;
    }

  }

  static async register(
    title: string,
    content: string,
    uid: string
  ) {
    const newTopicRef = doc(collection(db, 'topic'));

    await setDoc(newTopicRef, {
      title,
      content,
      uid,
      authorizedUsers: [],
      status: TOPIC_STATUS.PENDING,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      docID: newTopicRef.id,
    });
  }

  static async update(
    title: string,
    content: string,
    docID: string
  ) {
    const updateTopicRef = doc(db, 'topic', docID);

    await setDoc(updateTopicRef, {
      title,
      content,
      updatedAt: serverTimestamp(),
    }, { merge: true });
  }

  static async uploadImg(file: File) {
    const storageRef = ref(storage, 'images/rivers.jpg');
    const uploadTask = uploadBytesResumable(storageRef, file);

    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
      console.log('File available at', downloadURL);
    });
  }
}
export { TopicModel, TopicStatus, TOPIC_STATUS, disWord };
