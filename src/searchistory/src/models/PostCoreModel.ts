import { DocumentData } from 'firebase/firestore';

import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
const storage = getStorage();

import { v4 as uuidv4 } from 'uuid'

import moment from 'moment';

interface FileData {
  file: File,
  content: string,
}

interface FileInfo {
  id: string,
  url: string
}

class PostCoreModel {
  readonly content: string = "";
  readonly files: FileInfo[] = [];
  readonly uid: string = "";
  readonly name: string = "";
  readonly created_at: moment.Moment = moment();
  readonly updated_at: moment.Moment = moment();
  readonly doc_id: string = "";

  constructor(topicObj: DocumentData | "default") {
    switch (typeof topicObj) {
      case "string":
        break;

      default:
        this.content = topicObj.content;
        this.uid = topicObj.uid;
        this.name = topicObj.uid;
        this.files = topicObj.files;
        this.created_at = moment(topicObj.created_at.toDate());
        this.updated_at = moment(topicObj.updated_at.toDate());
        this.doc_id = topicObj.doc_id;
    }
  }

  static deleteImgFromStorage(deletedFiles: FileInfo[]) {
    deletedFiles.forEach(file => {
      const deleteRef = ref(storage, `images/${file.id}`);
      deleteObject(deleteRef).then(() => {
      }).catch((error) => {
        alert(error);
      });
    });
  }

  static splitFiles(files: FileInfo[], content: string) {
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

  static async uploadImg(fileData: FileData, files: FileInfo[]) {
    const id = uuidv4()

    const storageRef = ref(storage, `images/${id}`);
    const uploadTask = await uploadBytesResumable(storageRef, fileData.file);

    const url = await getDownloadURL(uploadTask.ref)
    const reg = new RegExp('!\\[.*\\]\\(\\d*\\)', 'g');
    const afterContent = fileData.content.replace(reg, `![image](${url})`);
    const afterFiles = [...files, { id, url }]
    return { afterContent, afterFiles }
  }
}
export { PostCoreModel, FileInfo, FileData };
