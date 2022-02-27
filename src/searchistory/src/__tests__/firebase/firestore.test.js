import * as fs from 'fs'
import { v4 } from "uuid"
import * as testing from '@firebase/rules-unit-testing'

import { doc, collection, setDoc, getDoc, updateDoc, query, where, getDocs, deleteDoc, serverTimestamp } from 'firebase/firestore'

//■■■■■■■■■■■■■■■■■ 事前準備 ■■■■■■■■■■■■■■■■■
const projectID = v4()
let testEnv
const uid = "m".repeat(28);
const otherUid = "o".repeat(28);


beforeAll(async () => {
  testEnv = await testing.initializeTestEnvironment({
    projectId: projectID,
    firestore: {
      rules: fs.readFileSync('./firestore.rules', 'utf8'),
      port: 8080,
      host: "localhost"
    }
  })
})

beforeEach(async () => {
  await testEnv.clearFirestore()
})

afterAll(async () => {
  await testEnv.cleanup()
})

const getDB = () => {
  const authenticatedContext = testEnv.authenticatedContext(uid)
  const clientDB = authenticatedContext.firestore()

  const unauthenticatedContext = testEnv.unauthenticatedContext()
  const guestClientDB = unauthenticatedContext.firestore()
  return { clientDB, guestClientDB }
}
//■■■■■■■■■■■■■■■■■ users ■■■■■■■■■■■■■■■■■
describe('users collection', () => {
  const name = "a".repeat(30);
  const name31 = "a".repeat(31);
  //============= users get =============
  describe('get', () => {
    it('get: 未認証では「NG」。', async () => {
      const { guestClientDB } = getDB();
      await testing.assertFails(
        getDoc(doc(guestClientDB, "users", uid))
      )
    })
  })
  //============= users create =============
  describe('create', () => {
    const name = "a".repeat(30);
    const name31 = "a".repeat(31);

    it('create: 認証済みで条件を満たす場合は「OK」', async () => {
      const { clientDB } = getDB();
      await testing.assertSucceeds(
        setDoc(doc(clientDB, "users", uid), { uid, name })
      )
    })
    it('create: 未認証では「NG」。', async () => {
      const { guestClientDB } = getDB();
      await testing.assertFails(
        setDoc(doc(guestClientDB, "users", uid), { uid, name })
      )
    })
    it('create: 認証済み。ドキュメントIDがUIDと異なる値では「NG」。', async () => {
      const { clientDB } = getDB();
      await testing.assertFails(
        setDoc(doc(clientDB, "users", otherUid), { uid, name })
      )
    })
    it('create: 認証済み。uidフィールドがUIDと異なる値では「NG」。', async () => {
      const { clientDB } = getDB();
      await testing.assertFails(
        setDoc(doc(clientDB, "users", uid), { uid: otherUid, name })
      )
    })
    it('create: 認証済み。許可されたフィールド以外は「NG」', async () => {
      const { clientDB } = getDB();
      await testing.assertFails(
        setDoc(doc(clientDB, "users", uid), { email: "email", uid: uid, name })
      )
    })
    it('create: 認証済み。nameが文字列以外は「NG」', async () => {
      const { clientDB } = getDB();
      await testing.assertFails(
        setDoc(doc(clientDB, "users", uid), { uid: uid, name: 111111 })
      )
    })
    it('create: 認証済み。nameが31文字以上は「NG」', async () => {
      const { clientDB } = getDB();
      await testing.assertFails(
        setDoc(doc(clientDB, "users", uid), { uid: uid, name: name31 })
      )
    })
    it('create: 認証済み。nameが2文字以下は「NG」', async () => {
      const { clientDB } = getDB();
      await testing.assertFails(
        setDoc(doc(clientDB, "users", uid), { uid: uid, name: "aa" })
      )
    })
    it('create: 認証済み。nameが3文字以下は「OK」', async () => {
      const { clientDB } = getDB();
      await testing.assertSucceeds(
        setDoc(doc(clientDB, "users", uid), { uid: uid, name: "aaa" })
      )
    })
  })
  //============= user update =============
  describe('update', () => {
    beforeEach(async () => {
      await testEnv.withSecurityRulesDisabled(async context => {
        const noRuleDB = context.firestore()
        await setDoc(doc(noRuleDB, "users", uid), { uid, name })
      })
    })
    it('update: 認証済みで条件を満たす場合は「OK」', async () => {
      const { clientDB } = getDB();
      await testing.assertSucceeds(
        updateDoc(doc(clientDB, "users", uid), { name: "changeName" })
      )
    })
    it('update: 未認証では「NG」', async () => {
      const { guestClientDB } = getDB();
      await testing.assertFails(
        updateDoc(doc(guestClientDB, "users", uid), { name: "changeName" })
      )
    })
    it('update: 認証済み。ドキュメントIDがUIDと異なる値では「NG」。', async () => {
      const { clientDB } = getDB();
      await testing.assertFails(
        updateDoc(doc(clientDB, "users", otherUid), { name: "changeName" })
      )
    })
    it('update: 認証済み。許可されたフィールド以外は「NG」', async () => {
      const { clientDB } = getDB();
      await testing.assertFails(
        updateDoc(doc(clientDB, "users", uid), { uid: "changeUID" })
      )
    })
    it('update: 認証済み。nameが31文字以上は「NG」', async () => {
      const { clientDB } = getDB();
      await testing.assertFails(
        updateDoc(doc(clientDB, "users", uid), { name: name31 })
      )
    })
    it('update: 認証済み。nameが2文字以下は「NG」', async () => {
      const { clientDB } = getDB();
      await testing.assertFails(
        updateDoc(doc(clientDB, "users", uid), { name: "aa" })
      )
    })
    it('update: 認証済み。nameが3文字以下は「OK」', async () => {
      const { clientDB } = getDB();
      await testing.assertSucceeds(
        updateDoc(doc(clientDB, "users", uid), { name: "aaa" })
      )
    })
  })
})
//■■■■■■■■■■■■■■■■■ private_users ■■■■■■■■■■■■■■■■■
describe('private_users collection', () => {
  //============= private_users get =============
  describe('get', () => {
    it('get: 未認証では「NG」。', async () => {
      const { guestClientDB } = getDB();
      await testing.assertFails(
        getDoc(doc(guestClientDB, "private_users", uid))
      )
    })
    it('get: ログインユーザーのUIDと異なるドキュメントIDのドキュメントは「NG」', async () => {
      const { clientDB } = getDB();
      await testing.assertFails(
        getDoc(doc(clientDB, "private_users", otherUid))
      )
    })
    it('get: ログインのUIDと同じドキュメントIDのドキュメントは「OK」', async () => {
      const { clientDB } = getDB();
      await testing.assertSucceeds(
        getDoc(doc(clientDB, "private_users", uid))
      )
    })
  })
  //============= private_users create =============
  describe('create', () => {
    it('create: 認証済みで条件を満たす場合は「OK」', async () => {
      const { clientDB } = getDB();
      await testing.assertSucceeds(
        setDoc(doc(clientDB, "private_users", uid), { uid, member_uid_list: [] })
      )
    })
    it('create: 未認証では「NG」。', async () => {
      const { guestClientDB } = getDB();
      await testing.assertFails(
        setDoc(doc(guestClientDB, "private_users", uid), { uid, member_uid_list: [] })
      )
    })
    it('create: 認証済み。ドキュメントIDがUIDと異なる値では「NG」。', async () => {
      const { clientDB } = getDB();
      await testing.assertFails(
        setDoc(doc(clientDB, "private_users", otherUid), { uid, member_uid_list: [] })
      )
    })
    it('create: 認証済み。uidフィールドがUIDと異なる値では「NG」。', async () => {
      const { clientDB } = getDB();
      await testing.assertFails(
        setDoc(doc(clientDB, "private_users", uid), { uid: otherUid, member_uid_list: [] })
      )
    })
    it('create: 認証済み。許可されたフィールド以外は「NG」', async () => {
      const { clientDB } = getDB();
      await testing.assertFails(
        setDoc(doc(clientDB, "private_users", uid), { email: "email", uid: uid, member_uid_list: [] })
      )
    })
  })
  //============= private_users update =============
  describe('update', () => {
    beforeEach(async () => {
      await testEnv.withSecurityRulesDisabled(async context => {
        const noRuleDB = context.firestore()
        await setDoc(doc(noRuleDB, "private_users", uid), { uid, member_uid_list: [otherUid] })
      })
    })
    it('update: 認証済みで条件を満たす場合は「OK」', async () => {
      const { clientDB } = getDB();
      await testing.assertSucceeds(
        updateDoc(doc(clientDB, "private_users", uid), { member_uid_list: [otherUid, "addUID"] })
      )
    })
    it('update: 未認証では「NG」', async () => {
      const { guestClientDB } = getDB();
      await testing.assertFails(
        updateDoc(doc(guestClientDB, "private_users", uid), { member_uid_list: [otherUid, "addUID"] })
      )
    })
    it('update: 認証済み。ドキュメントIDがUIDと異なる値では「NG」。', async () => {
      const { clientDB } = getDB();
      await testing.assertFails(
        updateDoc(doc(clientDB, "private_users", otherUid), { member_uid_list: [otherUid, "addUID"] })
      )
    })
    it('update: 認証済み。許可されたフィールド以外は「NG」', async () => {
      const { clientDB } = getDB();
      await testing.assertFails(
        updateDoc(doc(clientDB, "private_users", uid), { uid: "changeUID" })
      )
    })
  })
})
//■■■■■■■■■■■■■■■■■ topics ■■■■■■■■■■■■■■■■■
describe('topics collection', () => {
  // 正常オブジェクト(doc_idを除く)
  const validObject = {
    title: "title",
    content: "content",
    authorized_uid_list: [uid],
    files: ["yyyyyyy"],
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
    status: 0,
    uid,
    history_list: [],
  }
  //============= topics list =============
  describe('list', () => {
    it('list:authorized_uid_listにログインユーザーのUIDが含まれれば「OK」 ', async () => {
      const { clientDB } = getDB();
      const q = query(collection(clientDB, "topics"), where("authorized_uid_list", "array-contains", uid));
      await testing.assertSucceeds(
        getDocs(q)
      )
    })
    it('list:authorized_uid_listにログインユーザーのUIDが含まれていない「OK」性があるクエリは「NG」', async () => {
      const { clientDB } = getDB();
      const q = query(collection(clientDB, "topics"));
      await testing.assertFails(
        getDocs(q)
      )
    })
  })
  //============= topics create =============
  describe('create', () => {
    it('create: 認証済みで条件を満たす場合は「OK」', async () => {
      const { clientDB } = getDB();
      const docRef = doc(clientDB, "topics", "topicID");
      const testObject = { ...validObject, doc_id: docRef.id };
      await testing.assertSucceeds(
        setDoc(docRef, testObject)
      )
    })
    it('create: 未認証では「NG」。', async () => {
      const { guestClientDB } = getDB();
      const docRef = doc(guestClientDB, "topics", "topicID");
      const testObject = { ...validObject, doc_id: docRef.id };
      await testing.assertFails(
        setDoc(docRef, testObject)
      )
    })
    // uid
    it('create: uidにログインユーザーのUIDと異なる値を与えるのは「NG」', async () => {
      const { clientDB } = getDB();
      const docRef = doc(clientDB, "topics", "topicID");
      const testObject = { ...validObject, doc_id: docRef.id, uid: otherUid };
      await testing.assertFails(
        setDoc(docRef, testObject)
      )
    })
    // title
    it('create: titleが100文字以下は「OK」', async () => {
      const { clientDB } = getDB();
      const docRef = doc(clientDB, "topics", "topicID");
      const title = "a".repeat(100);
      const testObject = { ...validObject, doc_id: docRef.id, title };
      await testing.assertSucceeds(
        setDoc(docRef, testObject)
      )
    })
    it('create: titleが101文字以上は「NG」', async () => {
      const { clientDB } = getDB();
      const docRef = doc(clientDB, "topics", "topicID");
      const title = "a".repeat(101);
      const testObject = { ...validObject, doc_id: docRef.id, title };
      await testing.assertFails(
        setDoc(docRef, testObject)
      )
    })
    it('create: titleが1文字以上は「OK」', async () => {
      const { clientDB } = getDB();
      const docRef = doc(clientDB, "topics", "topicID");
      const title = "a".repeat(1);
      const testObject = { ...validObject, doc_id: docRef.id, title };
      await testing.assertSucceeds(
        setDoc(docRef, testObject)
      )
    })
    it('create: titleが空欄は「NG」', async () => {
      const { clientDB } = getDB();
      const docRef = doc(clientDB, "topics", "topicID");
      const title = "";
      const testObject = { ...validObject, doc_id: docRef.id, title };
      await testing.assertFails(
        setDoc(docRef, testObject)
      )
    })
    // content
    it('create: contentが10000文字以下は「OK」', async () => {
      const { clientDB } = getDB();
      const docRef = doc(clientDB, "topics", "topicID");
      const content = "a".repeat(10000);
      const testObject = { ...validObject, doc_id: docRef.id, content };
      await testing.assertSucceeds(
        setDoc(docRef, testObject)
      )
    })
    it('create: contentが10001文字以上は「NG」', async () => {
      const { clientDB } = getDB();
      const docRef = doc(clientDB, "topics", "topicID");
      const content = "a".repeat(10001);
      const testObject = { ...validObject, doc_id: docRef.id, content };
      await testing.assertFails(
        setDoc(docRef, testObject)
      )
    })
    it('create: contentが1文字以上は「OK」', async () => {
      const { clientDB } = getDB();
      const docRef = doc(clientDB, "topics", "topicID");
      const content = "a".repeat(1);
      const testObject = { ...validObject, doc_id: docRef.id, content };
      await testing.assertSucceeds(
        setDoc(docRef, testObject)
      )
    })
    it('create: contentが空欄は「NG」', async () => {
      const { clientDB } = getDB();
      const docRef = doc(clientDB, "topics", "topicID");
      const content = "";
      const testObject = { ...validObject, doc_id: docRef.id, content };
      await testing.assertFails(
        setDoc(docRef, testObject)
      )
    })
    it('create: statusがpending以外は「NG」', async () => {
      const { clientDB } = getDB();
      const docRef = doc(clientDB, "topics", "topicID");
      const testObject = { ...validObject, doc_id: docRef.id, status: "finish" };
      await testing.assertFails(
        setDoc(docRef, testObject)
      )
    })
    // authorized_uid_list
    it('create: authorized_uid_listにログインユーザーのUIDが含まれていない場合は「NG」', async () => {
      const { clientDB } = getDB();
      await testing.assertFails(
        setDoc(doc(clientDB, "topics", "topicID"), { title: "title", content: "content", uid: otherUid, authorized_uid_list: [otherUid] })
      )
    })
  })
  //============= topics update =============
  describe('update', () => {
    const validObject = {
      title: "title",
      content: "content",
      authorized_uid_list: [uid],
      files: ["yyyyyyy"],
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
      status: 0,
      uid,
      history_list: [],
    }
    // モック作成
    beforeEach(async () => {
      await testEnv.withSecurityRulesDisabled(async context => {
        const noRuleDB = context.firestore()
        // 自分が作ったドキュメント
        await setDoc(doc(noRuleDB, "topics", "topicID"), { ...validObject, doc_id: "topicID" })
        // 他人が作ったドキュメント
        const otherObject = { ...validObject, uid: otherUid, authorized_uid_list: [otherUid], doc_id: "otherUserTopicID" }
        await setDoc(doc(noRuleDB, "topics", "otherUserTopicID"), otherObject)
      })
    })
    it('update: 認証済みで条件を満たす場合は「OK」', async () => {
      const { clientDB } = getDB();
      await testing.assertSucceeds(
        updateDoc(doc(clientDB, "topics", "topicID"), { title: "changeTitle", content: "changeContent", authorized_uid_list: [uid] })
      )
    })
    it('update: 未認証では「NG」。', async () => {
      const { guestClientDB } = getDB();
      await testing.assertFails(
        updateDoc(doc(guestClientDB, "topics", "topicID"), { title: "title", content: "content", authorized_uid_list: [uid] })
      )
    })
    it('update: 許可されていないフィールドは「NG」', async () => {
      const { clientDB } = getDB();
      await testing.assertFails(
        updateDoc(doc(clientDB, "topics", "topicID"), { uid: otherUid })
      )
    })
    // title
    it('update: titleが空欄は「NG」', async () => {
      const { clientDB } = getDB();
      await testing.assertFails(
        updateDoc(doc(clientDB, "topics", "topicID"), { title: "" })
      )
    })
    it('update: titleが101文字以上は「NG」', async () => {
      const { clientDB } = getDB();
      await testing.assertFails(
        updateDoc(doc(clientDB, "topics", "topicID"), { title: "a".repeat(101) })
      )
    })
    it('update: titleが100文字は「OK」', async () => {
      const { clientDB } = getDB();
      await testing.assertSucceeds(
        updateDoc(doc(clientDB, "topics", "topicID"), { title: "a".repeat(100) })
      )
    })
    // content
    it('update: contentが空欄は「NG」', async () => {
      const { clientDB } = getDB();
      await testing.assertFails(
        updateDoc(doc(clientDB, "topics", "topicID"), { content: "" })
      )
    })
    it('update: contentが10001文字以上は「NG」', async () => {
      const { clientDB } = getDB();
      await testing.assertFails(
        updateDoc(doc(clientDB, "topics", "topicID"), { content: "a".repeat(10001) })
      )
    })
    it('update: contetが10000文字は「OK」', async () => {
      const { clientDB } = getDB();
      await testing.assertSucceeds(
        updateDoc(doc(clientDB, "topics", "topicID"), { content: "a".repeat(10000) })
      )
    })
    it('update: ドキュメントIDの値がログイン中のユーザーと異なるキュメントは「NG」', async () => {
      const { clientDB } = getDB();
      await testing.assertFails(
        updateDoc(doc(clientDB, "topics", "otherUserTopicID"), { title: "title", content: "content", authorized_uid_list: [uid] })
      )
    })
  })
  //============= topics delete =============
  describe('delete', () => {
    // モック作成
    beforeEach(async () => {
      await testEnv.withSecurityRulesDisabled(async context => {
        const noRuleDB = context.firestore()
        await setDoc(doc(noRuleDB, "topics", "topicID"), { uid })
        await setDoc(doc(noRuleDB, "topics", "otherUserTopicID"), { uid: otherUid })
      })
    })
    it('delete: 認証済みで条件を満たす場合は「OK」', async () => {
      const { clientDB } = getDB();
      await testing.assertSucceeds(
        deleteDoc(doc(clientDB, "topics", "topicID"))
      )
    })
    it('delete: 未認証では「NG」。', async () => {
      const { guestClientDB } = getDB();
      await testing.assertFails(
        deleteDoc(doc(guestClientDB, "topics", "topicID"))
      )
    })
    it('delete: uidフィールドの値がログイン中のユーザーと異なるキュメントは「NG」', async () => {
      const { clientDB } = getDB();
      await testing.assertFails(
        deleteDoc(doc(clientDB, "topics", "otherUserTopicID"))
      )
    })
  })
})
//■■■■■■■■■■■■■■■■■ histories ■■■■■■■■■■■■■■■■■
describe('histories collection', () => {
  // topic正常オブジェクト(docID除く)
  const topicValidObject = {
    title: "title",
    content: "content",
    files: ["yyyyyyy"],
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
    status: "pending",
    uid,
    authorized_uid_list: [uid],
    history_list: [],
  }
  // history正常オブジェクト(docID除く)
  const historyValidHistoryObject = {
    url: "url",
    title: "title",
    content: "content",
    files: ["yyyyyyy"],
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
    status: "pending",
    uid,
  }

  let inAuthTopicRef;
  let outAuthTopicRef;

  beforeEach(async () => {
    await testEnv.withSecurityRulesDisabled(async context => {
      const noRuleDB = context.firestore();
      // 自分に権限があるtopicモック
      inAuthTopicRef = doc(collection(noRuleDB, "topics"));
      const testMyTopicObject = { ...topicValidObject, doc_id: inAuthTopicRef.id };
      await setDoc(inAuthTopicRef, testMyTopicObject);
      // 他人に権限がないtopicモック
      outAuthTopicRef = doc(collection(noRuleDB, "topics"));
      const testOtherTopicObject = { ...topicValidObject, uid: otherUid, doc_id: outAuthTopicRef.id, authorized_uid_list: [otherUid] };
      await setDoc(outAuthTopicRef, testOtherTopicObject)
    })
  })
  // list
  describe('list', () => {
    it('list:親topicドキュメントのauthorized_uid_listにログインユーザーのUIDが含まれていたら「OK」', async () => {
      const { clientDB } = getDB();
      const q = query(collection(clientDB, "topics", inAuthTopicRef.id, "histories"));
      await testing.assertSucceeds(
        getDocs(q)
      )
    })
    it('list:親topicドキュメントのauthorized_uid_listにログインユーザーのUIDが含まれていなかったら「NG」', async () => {
      const { clientDB } = getDB();
      const q = query(collection(clientDB, "topics", outAuthTopicRef.id, "histories",));
      await testing.assertFails(
        getDocs(q)
      )
    })
    it('list:authorized_uid_listにログインユーザーのUIDが含まれていない「OK」性があるクエリは「NG」', async () => {
      const { clientDB } = getDB();
      const q = query(collection(clientDB, "topics"));
      await testing.assertFails(
        getDocs(q)
      )
    })
  })
  // create
  describe('create', () => {
    it('create:親topicドキュメントのauthorized_uid_listにログインユーザーのUIDが含まれていたら、サブコレクション (history)ドキュメント作成「OK」', async () => {
      const { clientDB } = getDB();
      const historyDocRef = doc(collection(clientDB, "topics", inAuthTopicRef.id, "histories"));
      await testing.assertSucceeds(
        setDoc(historyDocRef, {
          ...historyValidHistoryObject,
          doc_id: historyDocRef.id,
          topic_doc_id: inAuthTopicRef.id,
        })
      )
    })
    it('create:親topicドキュメントのauthorized_uid_listにログインユーザーのUIDが含まれていなければ、サブコレクション (history)ドキュメント作成「NG」', async () => {
      const { clientDB } = getDB();
      const historyDocRef = doc(collection(clientDB, "topics", outAuthTopicRef.id, "histories"));
      await testing.assertFails(
        setDoc(historyDocRef, {
          ...historyValidHistoryObject,
          doc_id: historyDocRef.id,
          topic_doc_id: outAuthTopicRef.id
        })
      )
    })
    // url
    it('create:urlが空欄では「NG」', async () => {
      const { clientDB } = getDB();
      const historyDocRef = doc(collection(clientDB, "topics", inAuthTopicRef.id, "histories"));
      await testing.assertFails(
        setDoc(historyDocRef, {
          ...historyValidHistoryObject,
          url: "",
          doc_id: historyDocRef.id,
          topic_doc_id: inAuthTopicRef.id,
        })
      )
    })
    it('create:urlが1文字以上は「OK」', async () => {
      const { clientDB } = getDB();
      const historyDocRef = doc(collection(clientDB, "topics", inAuthTopicRef.id, "histories"));
      await testing.assertSucceeds(
        setDoc(historyDocRef, {
          ...historyValidHistoryObject,
          url: "a",
          doc_id: historyDocRef.id,
          topic_doc_id: inAuthTopicRef.id,
        })
      )
    })
    it('create:urlが「501」文字以上は「NG」', async () => {
      const { clientDB } = getDB();
      const historyDocRef = doc(collection(clientDB, "topics", inAuthTopicRef.id, "histories"));
      await testing.assertFails(
        setDoc(historyDocRef, {
          ...historyValidHistoryObject,
          url: "a".repeat(501),
          doc_id: historyDocRef.id,
          topic_doc_id: inAuthTopicRef.id,
        })
      )
    })
    it('create:urlが「500」文字以下は「OK」', async () => {
      const { clientDB } = getDB();
      const historyDocRef = doc(collection(clientDB, "topics", inAuthTopicRef.id, "histories"));
      await testing.assertSucceeds(
        setDoc(historyDocRef, {
          ...historyValidHistoryObject,
          url: "a".repeat(500),
          doc_id: historyDocRef.id,
          topic_doc_id: inAuthTopicRef.id,
        })
      )
    })
    // title
    it('create:titleが「301」文字以上は「NG」', async () => {
      const { clientDB } = getDB();
      const historyDocRef = doc(collection(clientDB, "topics", inAuthTopicRef.id, "histories"));
      await testing.assertFails(
        setDoc(historyDocRef, {
          ...historyValidHistoryObject,
          title: "a".repeat(301),
          doc_id: historyDocRef.id,
          topic_doc_id: inAuthTopicRef.id,
        })
      )
    })
    it('create:titleが「300」文字以下は「OK」', async () => {
      const { clientDB } = getDB();
      const historyDocRef = doc(collection(clientDB, "topics", inAuthTopicRef.id, "histories"));
      await testing.assertSucceeds(
        setDoc(historyDocRef, {
          ...historyValidHistoryObject,
          title: "a".repeat(300),
          doc_id: historyDocRef.id,
          topic_doc_id: inAuthTopicRef.id,
        })
      )
    })
    // content
    it('create:contentが空欄は「NG」', async () => {
      const { clientDB } = getDB();
      const historyDocRef = doc(collection(clientDB, "topics", inAuthTopicRef.id, "histories"));
      await testing.assertFails(
        setDoc(historyDocRef, {
          ...historyValidHistoryObject,
          content: "",
          doc_id: historyDocRef.id,
          topic_doc_id: inAuthTopicRef.id,
        })
      )
    })
    it('create:contentが「1」文字以上は「OK」', async () => {
      const { clientDB } = getDB();
      const historyDocRef = doc(collection(clientDB, "topics", inAuthTopicRef.id, "histories"));
      await testing.assertSucceeds(
        setDoc(historyDocRef, {
          ...historyValidHistoryObject,
          content: "a",
          doc_id: historyDocRef.id,
          topic_doc_id: inAuthTopicRef.id,
        })
      )
    })
    it('create:contentが「10001」文字以上は「NG」', async () => {
      const { clientDB } = getDB();
      const historyDocRef = doc(collection(clientDB, "topics", inAuthTopicRef.id, "histories"));
      await testing.assertFails(
        setDoc(historyDocRef, {
          ...historyValidHistoryObject,
          content: "a".repeat(10001),
          doc_id: historyDocRef.id,
          topic_doc_id: inAuthTopicRef.id,
        })
      )
    })
    it('create:contentが「10000」文字以下は「OK」', async () => {
      const { clientDB } = getDB();
      const historyDocRef = doc(collection(clientDB, "topics", inAuthTopicRef.id, "histories"));
      await testing.assertSucceeds(
        setDoc(historyDocRef, {
          ...historyValidHistoryObject,
          content: "a".repeat(10000),
          doc_id: historyDocRef.id,
          topic_doc_id: inAuthTopicRef.id,
        })
      )
    })
    // status
    it('create:statusがpending以外は「NG」', async () => {
      const { clientDB } = getDB();
      const historyDocRef = doc(collection(clientDB, "topics", inAuthTopicRef.id, "histories"));
      await testing.assertFails(
        setDoc(historyDocRef, {
          ...historyValidHistoryObject,
          status: "a",
          doc_id: historyDocRef.id,
          topic_doc_id: inAuthTopicRef.id,
        })
      )
    })
    // docID
    it('create:docIDフィールドがドキュメントIDと異なる場合は「NG」', async () => {
      const { clientDB } = getDB();
      const historyDocRef = doc(collection(clientDB, "topics", inAuthTopicRef.id, "histories"));
      await testing.assertFails(
        setDoc(historyDocRef, {
          ...historyValidHistoryObject,
          doc_id: "xxx",
          topic_doc_id: inAuthTopicRef.id,
        })
      )
    })
    it('create:uidフィールドがログイン中ユーザーのUIDと異なる場合は「NG」', async () => {
      const { clientDB } = getDB();
      const historyDocRef = doc(collection(clientDB, "topics", inAuthTopicRef.id, "histories"));
      await testing.assertFails(
        setDoc(historyDocRef, {
          ...historyValidHistoryObject,
          uid: otherUid,
          doc_id: historyDocRef.id,
          topic_doc_id: inAuthTopicRef.id,
        })
      )
    })
    it('create:topic_doc_idフィールドが親topicのドキュメントIDと異なる場合は「NG」', async () => {
      const { clientDB } = getDB();
      const historyDocRef = doc(collection(clientDB, "topics", inAuthTopicRef.id, "histories"));
      await testing.assertFails(
        setDoc(historyDocRef, {
          ...historyValidHistoryObject,
          doc_id: historyDocRef.id,
          topic_doc_id: outAuthTopicRef.id,
        })
      )
    })
  })
  // update
  describe('update', () => {
    let inAuthHistoryRef;
    let outAuthHistoryRef;
    // モック作成
    beforeEach(async () => {
      await testEnv.withSecurityRulesDisabled(async context => {
        const noRuleDB = context.firestore();
        // 親topicドキュメントのauthorized_uid_listにログインユーザーのUIDが含まれているhstory
        inAuthHistoryRef = doc(collection(noRuleDB, "topics", inAuthTopicRef.id, "histories"));
        await setDoc(inAuthHistoryRef, { ...historyValidHistoryObject, uid: otherUid, doc_id: inAuthHistoryRef.id });
        // 親topicドキュメントのauthorized_uid_listにログインユーザーのUIDが含まれていないhistory
        outAuthHistoryRef = doc(collection(noRuleDB, "topics", outAuthTopicRef.id, "histories"));
        await setDoc(outAuthHistoryRef, { ...historyValidHistoryObject, uid: otherUid, doc_id: outAuthHistoryRef.id });
      })
    })
    it('update:親topicドキュメントのauthorized_uid_listにログインユーザーのUIDが含まれていたら、サブコレクション (history)ドキュメントの更新「OK」', async () => {
      const { clientDB } = getDB();
      const testUpdateHistoryRef = doc(clientDB, "topics", inAuthTopicRef.id, "histories", inAuthHistoryRef.id);
      await testing.assertSucceeds(
        updateDoc(testUpdateHistoryRef, { content: "changeContent" })
      )
    })
    it('update:親topicドキュメントのauthorized_uid_listにログインユーザーのUIDが含まれていなければ、サブコレクション (history)ドキュメントの更新「NG」', async () => {
      const { clientDB } = getDB();
      const testUpdateHistoryRef = doc(clientDB, "topics", outAuthHistoryRef.id, "histories", outAuthHistoryRef.id);
      await testing.assertFails(
        updateDoc(testUpdateHistoryRef, { content: "changeContent" })
      )
    })
    // title
    it('update:titleが300文字は「OK」', async () => {
      const { clientDB } = getDB();
      const testUpdateHistoryRef = doc(clientDB, "topics", inAuthTopicRef.id, "histories", inAuthHistoryRef.id);
      await testing.assertSucceeds(
        updateDoc(testUpdateHistoryRef, { title: "a".repeat(300) })
      )
    })
    it('update:titleが301文字は「NG」', async () => {
      const { clientDB } = getDB();
      const testUpdateHistoryRef = doc(clientDB, "topics", inAuthTopicRef.id, "histories", inAuthHistoryRef.id);
      await testing.assertFails(
        updateDoc(testUpdateHistoryRef, { title: "a".repeat(301) })
      )
    })
    // content
    it('update:contentが10000文字は「OK」', async () => {
      const { clientDB } = getDB();
      const testUpdateHistoryRef = doc(clientDB, "topics", inAuthTopicRef.id, "histories", inAuthHistoryRef.id);
      await testing.assertSucceeds(
        updateDoc(testUpdateHistoryRef, { content: "a".repeat(10000) })
      )
    })
    it('update:contentが10001文字は「NG」', async () => {
      const { clientDB } = getDB();
      const testUpdateHistoryRef = doc(clientDB, "topics", inAuthTopicRef.id, "histories", inAuthHistoryRef.id);
      await testing.assertFails(
        updateDoc(testUpdateHistoryRef, { title: "a".repeat(10001) })
      )
    })
    it('update:contentが1文字以上は「OK」', async () => {
      const { clientDB } = getDB();
      const testUpdateHistoryRef = doc(clientDB, "topics", inAuthTopicRef.id, "histories", inAuthHistoryRef.id);
      await testing.assertSucceeds(
        updateDoc(testUpdateHistoryRef, { content: "a" })
      )
    })
    it('update:contentが空欄は「NG」', async () => {
      const { clientDB } = getDB();
      const testUpdateHistoryRef = doc(clientDB, "topics", inAuthTopicRef.id, "histories", inAuthHistoryRef.id);
      await testing.assertFails(
        updateDoc(testUpdateHistoryRef, { content: "" })
      )
    })
  })
  //delete
  describe('delete', () => {
    // モック作成
    beforeEach(async () => {
      await testEnv.withSecurityRulesDisabled(async context => {
        const noRuleDB = context.firestore()
        // ログインユーザーが作ったtopic/他人が作ったhistory
        await setDoc(doc(noRuleDB, "topics", "moTopicID"), { title: "title", content: "content", uid, authorized_uid_list: [uid] })
        await setDoc(doc(noRuleDB, "topics", "moTopicID", "histories", "moHistoryID"), { url: "url", content: "content", uid: otherUid })
        //他人が作ったtopic/ログインユーザーが作ったhistory
        await setDoc(doc(noRuleDB, "topics", "omTopicID"), { title: "title", content: "content", uid: otherUid, authorized_uid_list: [otherUid] })
        await setDoc(doc(noRuleDB, "topics", "omTopicID", "histories", "omHistoryID"), { url: "url", content: "content", uid })
        //他人が作ったtopic/他人が作ったhistory
        await setDoc(doc(noRuleDB, "topics", "ooTopicID"), { title: "title", content: "content", uid: otherUid, authorized_uid_list: [otherUid] })
        await setDoc(doc(noRuleDB, "topics", "ooTopicID", "histories", "ooHistoryID"), { url: "url", content: "content", uid: otherUid })
      })
    })
    it('delete:親topicドキュメントのuidがログインユーザーのUIDであれば「OK」', async () => {
      const { clientDB } = getDB();
      const docRef = doc(clientDB, "topics", "moTopicID", "histories", "moHistoryID");
      await testing.assertSucceeds(
        deleteDoc(docRef)
      )
    })
    it('delete:historyドキュメントのuidがログイン中のユーザーであれば「OK」', async () => {
      const { clientDB } = getDB();
      const docRef = doc(clientDB, "topics", "omTopicID", "histories", "omHistoryID");
      await testing.assertSucceeds(
        deleteDoc(docRef)
      )
    })
    it('delete:親topic、history共に他人が作成したものであれば「NG」', async () => {
      const { clientDB } = getDB();
      const docRef = doc(clientDB, "topics", "ooTopicID", "histories", "ooHistoryID");
      await testing.assertFails(
        deleteDoc(docRef)
      )
    })
  })
})
