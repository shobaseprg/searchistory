import {
  collection,
  serverTimestamp,
  doc,
  setDoc,
  DocumentData,
} from 'firebase/firestore';
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

class TopicModel {
  private _content: string;
  private _title: string;
  private _uid: string;
  private _status: TopicStatus;
  private _statusWord: TopicStatusWord;
  private _authorizedUsers: Array<String>;
  private _createdAt: moment.Moment;
  private _updatedAt: moment.Moment;
  private _docID: string;

  constructor(topicObj: DocumentData) {
    this._content = topicObj.content;
    this._title = topicObj.title;
    this._uid = topicObj.uid;
    this._status = topicObj.status;
    this._statusWord = disWord[this._status];
    this._authorizedUsers = topicObj.authorizedUsers;
    this._createdAt = moment(topicObj.createdAt.toDate());
    this._updatedAt = moment(topicObj.updatedAt.toDate());
    this._docID = topicObj.docID;
  }

  get getTopic() {
    return {
      content: this._content,
      title: this._title,
      uid: this._uid,
      status: this._status,
      statusWord: this._statusWord,
      authorizedUsers: this._authorizedUsers,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
      docID: this._docID,
    };
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
}
export { TopicModel, TopicStatus, TOPIC_STATUS, disWord };
