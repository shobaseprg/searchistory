import {
  collection,
  serverTimestamp,
  doc,
  setDoc,
  DocumentData,
} from 'firebase/firestore';

import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
const storage = getStorage();

import { db } from "../firebase/config";

import { v4 as uuidv4 } from 'uuid'

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

interface FileData {
  file: File,
  content: string,
}

interface FileInfo {
  id: string,
  url: string
}

const _deleteImgFromStorage = (deletedFiles: FileInfo[]) => {
  deletedFiles.forEach(file => {
    const deleteRef = ref(storage, `images/${file.id}`);
    deleteObject(deleteRef).then(() => {
    }).catch((error) => {
      console.log(error);
    });
  });
}

const _splitFiles = (files: FileInfo[], content: string) => {
  const existFiles: FileInfo[] = [];
  const deleteFiles: FileInfo[] = [];
  for (let i = 0; i < files.length; i++) {
    if (content.includes(files[i].url)) {
      existFiles.push(files[i])
    } else {
      deleteFiles.push(files[i])
    }
  }
  return { existFiles, deleteFiles }
};

class TopicModel {
  readonly content: string = "";
  readonly title: string = "";
  readonly files: FileInfo[] = [];
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
        this.files = topicObj.files;
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
    uid: string,
    files: FileInfo[]
  ) {
    const { existFiles, deleteFiles } = _splitFiles(files, content);
    _deleteImgFromStorage(deleteFiles);
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
      files: existFiles
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

  static async uploadImg(fileData: FileData, files: FileInfo[]) {
    const id = uuidv4()

    const storageRef = ref(storage, `images/${id}`);
    const uploadTask = await uploadBytesResumable(storageRef, fileData.file);

    const url = await getDownloadURL(uploadTask.ref)
    const reg = new RegExp('!\\[.*\\]\\(\\d*\\)', 'g');
    const afterContent = fileData.content.replace(reg, `<img src="${url}">`);
    const afterFiles = [...files, { id, url }]
    return { afterContent, afterFiles }
  }
}
export { TopicModel, TopicStatus, TOPIC_STATUS, disWord, FileInfo };
