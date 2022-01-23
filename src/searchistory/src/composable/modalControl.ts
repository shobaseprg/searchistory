import { ref } from "vue";

const isOpenCreateRef = ref(false);
const isOpenPreviewRef = ref(false);
const isOpenEditRef = ref(false);
const isOpenHistoryCreateRef = ref(false);

const controlOpen = (flag: boolean, type: string) => {
  switch (type) {
    case "create":
      isOpenCreateRef.value = flag;
      break;
    case "preview":
      isOpenPreviewRef.value = flag;
      break;
    case "edit":
      isOpenEditRef.value = flag;
      break;
    case "createHistory":
      isOpenHistoryCreateRef.value = flag;
      break;
    default:
      break;
  }
}

export { isOpenCreateRef, isOpenPreviewRef, isOpenEditRef, isOpenHistoryCreateRef, controlOpen }
