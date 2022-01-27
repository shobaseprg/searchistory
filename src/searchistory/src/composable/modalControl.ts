import { ref } from "vue";

const isOpenTopicCreateRef = ref(false);
const isOpenTopicEditRef = ref(false);
const isOpenEditRef = ref(false);
const isOpenHistoryCreateRef = ref(false);
const isOpenHistoryEditRef = ref(false);
const isOpenHistoryPreviewRef = ref(false);
const isOpenPersonalSettingRef = ref(false);
const isOpenMemberEditRef = ref(false);
const isOpenAuthorityRef = ref(false);

const MODAL_TYPE = {
  TOPIC_CREATE: 'topicCreate',
  TOPIC_EDIT: 'topicEdit',
  HISTORY_CREATE: 'historyCreate',
  HISTORY_EDIT: 'historyEdit',
  HISTORY_PREVIEW: 'HistoryPreview',
  PERSONAL_SETTING: 'personalSetting',
  MEMBER_EDIT: "member_edit",
  AUTHORITY: "authority"

} as const;
type MODAL_TYPE = typeof MODAL_TYPE[keyof typeof MODAL_TYPE];

const controlOpen = (flag: boolean, type: MODAL_TYPE) => {
  console.log(type)
  console.log(flag)
  switch (type) {
    case MODAL_TYPE.TOPIC_CREATE:
      isOpenTopicCreateRef.value = flag;
      break;
    case MODAL_TYPE.TOPIC_EDIT:
      isOpenTopicEditRef.value = flag;
      break;
    case MODAL_TYPE.HISTORY_CREATE:
      isOpenHistoryCreateRef.value = flag;
      break;
    case MODAL_TYPE.HISTORY_EDIT:
      isOpenHistoryEditRef.value = flag;
      break;
    case MODAL_TYPE.HISTORY_PREVIEW:
      isOpenHistoryPreviewRef.value = flag;
      break;
    case MODAL_TYPE.PERSONAL_SETTING:
      isOpenPersonalSettingRef.value = flag;
      break;
    case MODAL_TYPE.MEMBER_EDIT:
      isOpenMemberEditRef.value = flag;
      break;
    case MODAL_TYPE.AUTHORITY:
      isOpenAuthorityRef.value = flag;
      break;
    default:
      break;
  }
}

export { isOpenTopicCreateRef, isOpenTopicEditRef, isOpenEditRef, isOpenHistoryCreateRef, isOpenHistoryEditRef, isOpenHistoryPreviewRef, isOpenPersonalSettingRef, isOpenMemberEditRef, isOpenAuthorityRef, controlOpen, MODAL_TYPE }
