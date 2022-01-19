import {
  collection,
  serverTimestamp,
  doc,
  setDoc,
  DocumentData,
} from 'firebase/firestore';
import { db } from "../firebase/config";

// type topicType = {
//   author: string;
//   content: string;
//   title: string;
//   uid: string;
//   status: string;
//   authorizedUsers: Array<String>;
//   createdAt: Date;
//   updatedAt: Date;
//   docID: string;
// };

const TOPIC_STATUS = {
  PENDING: 'pending',
  FINISH: 'finish',
} as const;

// type TopicStatus = 'pending' | 'finish';

class TopicModel {
  private _author: string;
  private _content: string;
  private _title: string;
  private _uid: string;
  private _status: string;
  private _authorizedUsers: Array<String>;
  private _createdAt: Date;
  private _updatedAt: Date;
  private _docID: string;

  constructor(topicObj: DocumentData) {
    this._author = topicObj.author;
    this._content = topicObj.content;
    this._title = topicObj.title;
    this._uid = topicObj.uid;
    this._status = topicObj.status;
    this._authorizedUsers = topicObj.authorizedUsers;
    this._createdAt = topicObj.createdAt.toDate();
    this._updatedAt = topicObj.updatedAt.toDate();
    this._docID = topicObj.docID;
  }

  get getTopic() {
    return {
      author: this._author,
      content: this._content,
      title: this._title,
      uid: this._uid,
      status: this._status,
      authorizedUsers: this._authorizedUsers,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
      docID: this._docID,
    };
  }

  static async register(
    title: string,
    content: string,
    author: string,
    uid: string
  ) {
    const newTopicRef = doc(collection(db, 'topic'));

    await setDoc(newTopicRef, {
      title,
      content,
      author,
      uid,
      authorizedUsers: [],
      status: TOPIC_STATUS.PENDING,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      docID: newTopicRef.id,
    });
  }
}
export default TopicModel;
