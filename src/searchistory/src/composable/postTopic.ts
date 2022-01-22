import { ref } from "vue";
import { TopicModel, FileInfo } from "../models/TopicModel"

const title = ref("");
const content = ref("");
const files = ref<FileInfo[]>([]);

const registerTopic = async (controlOpen: (flag: boolean, type: string) => void, uid: string) => {
  await TopicModel.register(title.value, content.value, uid, files.value)
  clearForm();
  alert("登録しました。");
  controlOpen(false, "create");
}

const updateTopic = async (controlOpen: (flag: boolean, type: string) => void, targetTopic: TopicModel) => {
  await TopicModel.update(title.value, content.value, targetTopic.docID)
  clearForm();
  alert("更新しました。");
  controlOpen(false, "preview");
  controlOpen(false, "edit");
}

const imgAdd = async (_: string, imgfile: File) => {
  const fileData = {
    file: imgfile,
    content: content.value,
  }
  const { afterContent, afterFiles } = await TopicModel.uploadImg(fileData, files.value);
  content.value = afterContent;
  files.value = afterFiles;
};

const clearForm = () => {
  title.value = "";
  content.value = "";
}

const stopEvent = (event: any) => {
  event.stopPropagation();
};

export { title, content, files, registerTopic, updateTopic, imgAdd, stopEvent }
