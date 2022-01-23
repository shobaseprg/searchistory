import { ref } from "vue";
import { HistoryModel } from "../models/HistoryModel"
import { TopicModel } from "../models/TopicModel"
import { FileInfo } from "../models/PostCoreModel"
import { controlOpen } from "./modalControl";

const url = ref("");
const title = ref("");
const content = ref("");
const files = ref<FileInfo[]>([]);

const registerTopic = async (uid: string, name: string) => {
  await TopicModel.register(title.value, content.value, uid, name, files.value)
  clearForm();
  alert("登録しました。");
  controlOpen(false, "create");
}

const updateTopic = async (targetTopic: TopicModel) => {
  await TopicModel.update(title.value, content.value, targetTopic.docID)
  clearForm();
  alert("更新しました。");
  controlOpen(false, "edit");
}

const registerHistory = async (uid: string, name: string, topicDocID: string) => {
  await HistoryModel.register(url.value, content.value, uid, name, files.value, topicDocID)
  clearForm();
  alert("登録しました。");
  controlOpen(false, "historyCreate");
}

const updateHistory = async (targetHistory: HistoryModel) => {
  await HistoryModel.update(url.value, content.value, targetHistory.docID)
  clearForm();
  alert("更新しました。");
  controlOpen(false, "historyEdit");
}

const imgAdd = async (_: string, imgfile: File) => {
  const fileData = {
    file: imgfile,
    content: content.value,
  }
  const { afterContent, afterFiles } = await HistoryModel.uploadImg(fileData, files.value);
  content.value = afterContent;
  files.value = afterFiles;
};

const clearForm = () => {
  url.value = "";
  title.value = "";
  content.value = "";
}

const stopEvent = (event: any) => {
  event.stopPropagation();
};

export { url, title, content, files, registerTopic, updateTopic, registerHistory, updateHistory, imgAdd, stopEvent }
