import { ref } from "vue";
import { HistoryModel } from "../models/HistoryModel"
import { TopicModel } from "../models/TopicModel"
import { FileInfo, PostCoreModel } from "../models/PostCoreModel"
import { controlOpen, MODAL_TYPE } from "./modalControl";

const url = ref("");
const title = ref("");
const content = ref("");
const files = ref<FileInfo[]>([]);

// topic登録
const registerTopic = async (uid: string, name: string) => {
  await TopicModel.register(title.value, content.value, uid, name, files.value)
  clearForm();
  alert("登録しました。");
  controlOpen(false, MODAL_TYPE.TOPIC_CREATE);
}
// topic更新
const updateTopic = async (targetTopic: TopicModel) => {
  await TopicModel.update(title.value, content.value, files.value, targetTopic.docID)
  clearForm();
  alert("更新しました。");
  controlOpen(false, MODAL_TYPE.TOPIC_EDIT);
}
// history登録
const registerHistory = async (uid: string, name: string, topicDocID: string) => {
  await HistoryModel.register(url.value, content.value, uid, name, files.value, topicDocID)
  clearForm();
  alert("登録しました。");
  controlOpen(false, MODAL_TYPE.HISTORY_CREATE);
}
// history更新
const updateHistory = async (targetHistory: HistoryModel) => {
  await HistoryModel.update(url.value, content.value, files.value, targetHistory.files, targetHistory.docID, targetHistory.topicDocID)
  clearForm();
  alert("更新しました。");
  controlOpen(false, MODAL_TYPE.HISTORY_EDIT);
}
// 写真追加時発火
const imgAdd = async (_: string, imgfile: File) => {
  const fileData = {
    file: imgfile,
    content: content.value,
  }
  const { afterContent, afterFiles } = await PostCoreModel.uploadImg(fileData, files.value);
  content.value = afterContent;
  files.value = afterFiles;
  console.log("▼【ログ】files.value");
  console.log(files.value);
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
