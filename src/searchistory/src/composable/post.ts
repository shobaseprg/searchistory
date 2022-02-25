import { ref } from "vue";
import { HistoryModel, HistoryStatus } from "../models/HistoryModel"
import { TopicModel } from "../models/TopicModel"
import { FileInfo, PostCoreModel } from "../models/PostCoreModel"
import { controlOpen, MODAL_TYPE } from "./modalControl";

const url = ref("");
const title = ref("");
const content = ref("");
const files = ref<FileInfo[]>([]);

//■■■■■■■■■■■■■■■■■ topic ■■■■■■■■■■■■■■■■■

// topic登録
const registerTopic = async (uid: string) => {
  const result = await TopicModel.register(title.value, content.value, uid, files.value);
  if (!result) return;
  clearForm();
  alert("登録しました。");
  controlOpen(false, MODAL_TYPE.TOPIC_CREATE);
}
// topic更新
const updateTopic = async (targetTopic: TopicModel) => {
  const result = await TopicModel.update(title.value, content.value, files.value, targetTopic.docID);
  if (!result) return;
  clearForm();
  alert("更新しました。");
  controlOpen(false, MODAL_TYPE.TOPIC_EDIT);
}
//■■■■■■■■■■■■■■■■■ history ■■■■■■■■■■■■■■■■■

// history登録
const registerHistory = async (uid: string, topicDocID: string) => {
  const result = await HistoryModel.register(url.value, title.value, content.value, uid, files.value, topicDocID);
  if (!result) return;
  clearForm();
  alert("登録しました。");
  controlOpen(false, MODAL_TYPE.HISTORY_CREATE);
}
// history更新
const updateHistory = async (targetHistory: HistoryModel, selectedStatus: HistoryStatus) => {
  const result = await HistoryModel.update(url.value, title.value, content.value, files.value, targetHistory.files, targetHistory.docID, targetHistory.topicDocID, selectedStatus);
  if (!result) return;
  clearForm();
  alert("更新しました。");
  controlOpen(false, MODAL_TYPE.HISTORY_EDIT);
}
//■■■■■■■■■■■■■■■■■ 共通 ■■■■■■■■■■■■■■■■■

// 写真追加時発火
const imgAdd = async (_: string, imgfile: File) => {
  const fileData = {
    file: imgfile,
    content: content.value,
  }
  const { afterContent, afterFiles } = await PostCoreModel.uploadImg(fileData, files.value);
  content.value = afterContent;
  files.value = afterFiles;
};
// フォームリセット
const clearForm = () => {
  url.value = "";
  title.value = "";
  content.value = "";
  files.value = []
}
// 伝播ストップ
const stopEvent = (event: any) => {
  event.stopPropagation();
};

export { url, title, content, files, registerTopic, updateTopic, registerHistory, updateHistory, imgAdd, stopEvent, clearForm }
