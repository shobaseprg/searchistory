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
//■■■■■■■■■■■■■■■■■ user ■■■■■■■■■■■■■■■■■
describe('user collection', () => {
  const name = "a".repeat(30);
  const name31 = "a".repeat(31);
  //============= user get =============
  describe('get', () => {
    it('get: 未認証では「NG」。', async () => {
      const { guestClientDB } = getDB();
      await testing.assertFails(
        getDoc(doc(guestClientDB, "user", uid))
      )
    })
  })
  //============= user create =============
  describe('create', () => {
    const name = "a".repeat(30);
    const name31 = "a".repeat(31);

    it('create: 認証済みで条件を満たす場合は「OK」', async () => {
      const { clientDB } = getDB();
      await testing.assertSucceeds(
        setDoc(doc(clientDB, "user", uid), { uid, name })
      )
    })
    it('create: 未認証では「NG」。', async () => {
      const { guestClientDB } = getDB();
      await testing.assertFails(
        setDoc(doc(guestClientDB, "user", uid), { uid, name })
      )
    })
    it('create: 認証済み。ドキュメントIDがUIDと異なる値では「NG」。', async () => {
      const { clientDB } = getDB();
      await testing.assertFails(
        setDoc(doc(clientDB, "user", otherUid), { uid, name })
      )
    })
    it('create: 認証済み。uidフィールドがUIDと異なる値では「NG」。', async () => {
      const { clientDB } = getDB();
      await testing.assertFails(
        setDoc(doc(clientDB, "user", uid), { uid: otherUid, name })
      )
    })
    it('create: 認証済み。許可されたフィールド以外は「NG」', async () => {
      const { clientDB } = getDB();
      await testing.assertFails(
        setDoc(doc(clientDB, "user", uid), { email: "email", uid: uid, name })
      )
    })
    it('create: 認証済み。nameが文字列以外は「NG」', async () => {
      const { clientDB } = getDB();
      await testing.assertFails(
        setDoc(doc(clientDB, "user", uid), { uid: uid, name: 111111 })
      )
    })
    it('create: 認証済み。nameが31文字以上は「NG」', async () => {
      const { clientDB } = getDB();
      await testing.assertFails(
        setDoc(doc(clientDB, "user", uid), { uid: uid, name: name31 })
      )
    })
    it('create: 認証済み。nameが2文字以下は「NG」', async () => {
      const { clientDB } = getDB();
      await testing.assertFails(
        setDoc(doc(clientDB, "user", uid), { uid: uid, name: "aa" })
      )
    })
    it('create: 認証済み。nameが3文字以下は「OK」', async () => {
      const { clientDB } = getDB();
      await testing.assertSucceeds(
        setDoc(doc(clientDB, "user", uid), { uid: uid, name: "aaa" })
      )
    })
  })
  //============= user update =============
  describe('update', () => {
    beforeEach(async () => {
      await testEnv.withSecurityRulesDisabled(async context => {
        const noRuleDB = context.firestore()
        await setDoc(doc(noRuleDB, "user", uid), { uid, name })
      })
    })
    it('update: 認証済みで条件を満たす場合は「OK」', async () => {
      const { clientDB } = getDB();
      await testing.assertSucceeds(
        updateDoc(doc(clientDB, "user", uid), { name: "changeName" })
      )
    })
    it('update: 未認証では「NG」', async () => {
      const { guestClientDB } = getDB();
      await testing.assertFails(
        updateDoc(doc(guestClientDB, "user", uid), { name: "changeName" })
      )
    })
    it('update: 認証済み。ドキュメントIDがUIDと異なる値では「NG」。', async () => {
      const { clientDB } = getDB();
      await testing.assertFails(
        updateDoc(doc(clientDB, "user", otherUid), { name: "changeName" })
      )
    })
    it('update: 認証済み。許可されたフィールド以外は「NG」', async () => {
      const { clientDB } = getDB();
      await testing.assertFails(
        updateDoc(doc(clientDB, "user", uid), { uid: "changeUID" })
      )
    })
    it('update: 認証済み。nameが31文字以上は「NG」', async () => {
      const { clientDB } = getDB();
      await testing.assertFails(
        updateDoc(doc(clientDB, "user", uid), { name: name31 })
      )
    })
    it('update: 認証済み。nameが2文字以下は「NG」', async () => {
      const { clientDB } = getDB();
      await testing.assertFails(
        updateDoc(doc(clientDB, "user", uid), { name: "aa" })
      )
    })
    it('update: 認証済み。nameが3文字以下は「OK」', async () => {
      const { clientDB } = getDB();
      await testing.assertSucceeds(
        updateDoc(doc(clientDB, "user", uid), { name: "aaa" })
      )
    })
  })
})
//■■■■■■■■■■■■■■■■■ userPrivate ■■■■■■■■■■■■■■■■■
describe('userPrivate collection', () => {
  //============= userPrivate get =============
  describe('get', () => {
    it('get: 未認証では「NG」。', async () => {
      const { guestClientDB } = getDB();
      await testing.assertFails(
        getDoc(doc(guestClientDB, "userPrivate", uid))
      )
    })
    it('get: ログインユーザーのUIDと異なるドキュメントIDのドキュメントは「NG」', async () => {
      const { clientDB } = getDB();
      await testing.assertFails(
        getDoc(doc(clientDB, "userPrivate", otherUid))
      )
    })
    it('get: ログインのUIDと同じドキュメントIDのドキュメントは「OK」', async () => {
      const { clientDB } = getDB();
      await testing.assertSucceeds(
        getDoc(doc(clientDB, "userPrivate", uid))
      )
    })
  })
  //============= userPrivate create =============
  describe('create', () => {
    it('create: 認証済みで条件を満たす場合は「OK」', async () => {
      const { clientDB } = getDB();
      await testing.assertSucceeds(
        setDoc(doc(clientDB, "userPrivate", uid), { uid, memberUIDs: [] })
      )
    })
    it('create: 未認証では「NG」。', async () => {
      const { guestClientDB } = getDB();
      await testing.assertFails(
        setDoc(doc(guestClientDB, "userPrivate", uid), { uid, memberUIDs: [] })
      )
    })
    it('create: 認証済み。ドキュメントIDがUIDと異なる値では「NG」。', async () => {
      const { clientDB } = getDB();
      await testing.assertFails(
        setDoc(doc(clientDB, "userPrivate", otherUid), { uid, memberUIDs: [] })
      )
    })
    it('create: 認証済み。uidフィールドがUIDと異なる値では「NG」。', async () => {
      const { clientDB } = getDB();
      await testing.assertFails(
        setDoc(doc(clientDB, "userPrivate", uid), { uid: otherUid, memberUIDs: [] })
      )
    })
    it('create: 認証済み。許可されたフィールド以外は「NG」', async () => {
      const { clientDB } = getDB();
      await testing.assertFails(
        setDoc(doc(clientDB, "userPrivate", uid), { email: "email", uid: uid, memberUIDs: [] })
      )
    })
  })
  //============= userPrivate update =============
  describe('update', () => {
    beforeEach(async () => {
      await testEnv.withSecurityRulesDisabled(async context => {
        const noRuleDB = context.firestore()
        await setDoc(doc(noRuleDB, "userPrivate", uid), { uid, memberUIDs: [otherUid] })
      })
    })
    it('update: 認証済みで条件を満たす場合は「OK」', async () => {
      const { clientDB } = getDB();
      await testing.assertSucceeds(
        updateDoc(doc(clientDB, "userPrivate", uid), { memberUIDs: [otherUid, "addUID"] })
      )
    })
    it('update: 未認証では「NG」', async () => {
      const { guestClientDB } = getDB();
      await testing.assertFails(
        updateDoc(doc(guestClientDB, "userPrivate", uid), { memberUIDs: [otherUid, "addUID"] })
      )
    })
    it('update: 認証済み。ドキュメントIDがUIDと異なる値では「NG」。', async () => {
      const { clientDB } = getDB();
      await testing.assertFails(
        updateDoc(doc(clientDB, "userPrivate", otherUid), { memberUIDs: [otherUid, "addUID"] })
      )
    })
    it('update: 認証済み。許可されたフィールド以外は「NG」', async () => {
      const { clientDB } = getDB();
      await testing.assertFails(
        updateDoc(doc(clientDB, "userPrivate", uid), { uid: "changeUID" })
      )
    })
  })
})
//■■■■■■■■■■■■■■■■■ topic ■■■■■■■■■■■■■■■■■
describe('topic collection', () => {
  // 正常オブジェクト(docID除く)
  const validObject = {
    title: "title",
    content: "content",
    authorizedUIDs: [uid],
    files: ["yyyyyyy"],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    status: "pending",
    uid,
    historyList: [],
  }
  //============= topic list =============
  describe('list', () => {
    it('list:authorizedUIDsにログインユーザーのUIDが含まれれば「OK」 ', async () => {
      const { clientDB } = getDB();
      const q = query(collection(clientDB, "topic"), where("authorizedUIDs", "array-contains", uid));
      await testing.assertSucceeds(
        getDocs(q)
      )
    })
    it('list:authorizedUIDsにログインユーザーのUIDが含まれていない「OK」性があるクエリは「NG」', async () => {
      const { clientDB } = getDB();
      const q = query(collection(clientDB, "topic"));
      await testing.assertFails(
        getDocs(q)
      )
    })
  })
  //============= topic create =============
  describe('create', () => {
    it('create: 認証済みで条件を満たす場合は「OK」', async () => {
      const { clientDB } = getDB();
      const docRef = doc(clientDB, "topic", "topicID");
      const testObject = { ...validObject, docID: docRef.id };
      await testing.assertSucceeds(
        setDoc(docRef, testObject)
      )
    })
    it('create: 未認証では「NG」。', async () => {
      const { guestClientDB } = getDB();
      const docRef = doc(guestClientDB, "topic", "topicID");
      const testObject = { ...validObject, docID: docRef.id };
      await testing.assertFails(
        setDoc(docRef, testObject)
      )
    })
    // uid
    it('create: uidにログインユーザーのUIDと異なる値を与えるのは「NG」', async () => {
      const { clientDB } = getDB();
      const docRef = doc(clientDB, "topic", "topicID");
      const testObject = { ...validObject, docID: docRef.id, uid: otherUid };
      await testing.assertFails(
        setDoc(docRef, testObject)
      )
    })
    // title
    it('create: titleが100文字以下は「OK」', async () => {
      const { clientDB } = getDB();
      const docRef = doc(clientDB, "topic", "topicID");
      const title = "a".repeat(100);
      const testObject = { ...validObject, docID: docRef.id, title };
      await testing.assertSucceeds(
        setDoc(docRef, testObject)
      )
    })
    it('create: titleが101文字以上は「NG」', async () => {
      const { clientDB } = getDB();
      const docRef = doc(clientDB, "topic", "topicID");
      const title = "a".repeat(101);
      const testObject = { ...validObject, docID: docRef.id, title };
      await testing.assertFails(
        setDoc(docRef, testObject)
      )
    })
    it('create: titleが1文字以上は「OK」', async () => {
      const { clientDB } = getDB();
      const docRef = doc(clientDB, "topic", "topicID");
      const title = "a".repeat(1);
      const testObject = { ...validObject, docID: docRef.id, title };
      await testing.assertSucceeds(
        setDoc(docRef, testObject)
      )
    })
    it('create: titleが空欄は「NG」', async () => {
      const { clientDB } = getDB();
      const docRef = doc(clientDB, "topic", "topicID");
      const title = "";
      const testObject = { ...validObject, docID: docRef.id, title };
      await testing.assertFails(
        setDoc(docRef, testObject)
      )
    })
    // content
    it('create: contentが10000文字以下は「OK」', async () => {
      const { clientDB } = getDB();
      const docRef = doc(clientDB, "topic", "topicID");
      const content = "a".repeat(10000);
      const testObject = { ...validObject, docID: docRef.id, content };
      await testing.assertSucceeds(
        setDoc(docRef, testObject)
      )
    })
    it('create: contentが10001文字以上は「NG」', async () => {
      const { clientDB } = getDB();
      const docRef = doc(clientDB, "topic", "topicID");
      const content = "a".repeat(10001);
      const testObject = { ...validObject, docID: docRef.id, content };
      await testing.assertFails(
        setDoc(docRef, testObject)
      )
    })
    it('create: contentが1文字以上は「OK」', async () => {
      const { clientDB } = getDB();
      const docRef = doc(clientDB, "topic", "topicID");
      const content = "a".repeat(1);
      const testObject = { ...validObject, docID: docRef.id, content };
      await testing.assertSucceeds(
        setDoc(docRef, testObject)
      )
    })
    it('create: contentが空欄は「NG」', async () => {
      const { clientDB } = getDB();
      const docRef = doc(clientDB, "topic", "topicID");
      const content = "";
      const testObject = { ...validObject, docID: docRef.id, content };
      await testing.assertFails(
        setDoc(docRef, testObject)
      )
    })
    it('create: statusがpending以外は「NG」', async () => {
      const { clientDB } = getDB();
      const docRef = doc(clientDB, "topic", "topicID");
      const testObject = { ...validObject, docID: docRef.id, status: "finish" };
      await testing.assertFails(
        setDoc(docRef, testObject)
      )
    })
    // authorizedUIDs
    it('create: authorizedUIDsにログインユーザーのUIDが含まれていない場合は「NG」', async () => {
      const { clientDB } = getDB();
      await testing.assertFails(
        setDoc(doc(clientDB, "topic", "topicID"), { title: "title", content: "content", uid: otherUid, authorizedUIDs: [otherUid] })
      )
    })
  })
  //============= topic update =============
  describe('update', () => {
    const validObject = {
      title: "title",
      content: "content",
      authorizedUIDs: [uid],
      files: ["yyyyyyy"],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      status: "pending",
      uid,
      historyList: [],
    }
    // モック作成
    beforeEach(async () => {
      await testEnv.withSecurityRulesDisabled(async context => {
        const noRuleDB = context.firestore()
        // 自分が作ったドキュメント
        await setDoc(doc(noRuleDB, "topic", "topicID"), { ...validObject, docID: "topicID" })
        // 他人が作ったドキュメント
        const otherObject = { ...validObject, uid: otherUid, authorizedUIDs: [otherUid], docID: "otherUserTopicID" }
        await setDoc(doc(noRuleDB, "topic", "otherUserTopicID"), otherObject)
      })
    })
    it('update: 認証済みで条件を満たす場合は「OK」', async () => {
      const { clientDB } = getDB();
      await testing.assertSucceeds(
        updateDoc(doc(clientDB, "topic", "topicID"), { title: "changeTitle", content: "changeContent", authorizedUIDs: [uid] })
      )
    })
    it('update: 未認証では「NG」。', async () => {
      const { guestClientDB } = getDB();
      await testing.assertFails(
        updateDoc(doc(guestClientDB, "topic", "topicID"), { title: "title", content: "content", authorizedUIDs: [uid] })
      )
    })
    it('update: 許可されていないフィールドは「NG」', async () => {
      const { clientDB } = getDB();
      await testing.assertFails(
        updateDoc(doc(clientDB, "topic", "topicID"), { uid: otherUid })
      )
    })
    // title
    it('update: titleが空欄は「NG」', async () => {
      const { clientDB } = getDB();
      await testing.assertFails(
        updateDoc(doc(clientDB, "topic", "topicID"), { title: "" })
      )
    })
    it('update: titleが101文字以上は「NG」', async () => {
      const { clientDB } = getDB();
      await testing.assertFails(
        updateDoc(doc(clientDB, "topic", "topicID"), { title: "a".repeat(101) })
      )
    })
    it('update: titleが100文字は「OK」', async () => {
      const { clientDB } = getDB();
      await testing.assertSucceeds(
        updateDoc(doc(clientDB, "topic", "topicID"), { title: "a".repeat(100) })
      )
    })
    // content
    it('update: contentが空欄は「NG」', async () => {
      const { clientDB } = getDB();
      await testing.assertFails(
        updateDoc(doc(clientDB, "topic", "topicID"), { content: "" })
      )
    })
    it('update: contentが10001文字以上は「NG」', async () => {
      const { clientDB } = getDB();
      await testing.assertFails(
        updateDoc(doc(clientDB, "topic", "topicID"), { content: "a".repeat(10001) })
      )
    })
    it('update: contetが10000文字は「OK」', async () => {
      const { clientDB } = getDB();
      await testing.assertSucceeds(
        updateDoc(doc(clientDB, "topic", "topicID"), { content: "a".repeat(10000) })
      )
    })
    it('update: ドキュメントIDの値がログイン中のユーザーと異なるキュメントは「NG」', async () => {
      const { clientDB } = getDB();
      await testing.assertFails(
        updateDoc(doc(clientDB, "topic", "otherUserTopicID"), { title: "title", content: "content", authorizedUIDs: [uid] })
      )
    })
  })
  //============= topic delete =============
  describe('delete', () => {
    // モック作成
    beforeEach(async () => {
      await testEnv.withSecurityRulesDisabled(async context => {
        const noRuleDB = context.firestore()
        await setDoc(doc(noRuleDB, "topic", "topicID"), { uid })
        await setDoc(doc(noRuleDB, "topic", "otherUserTopicID"), { uid: otherUid })
      })
    })
    it('delete: 認証済みで条件を満たす場合は「OK」', async () => {
      const { clientDB } = getDB();
      await testing.assertSucceeds(
        deleteDoc(doc(clientDB, "topic", "topicID"))
      )
    })
    it('delete: 未認証では「NG」。', async () => {
      const { guestClientDB } = getDB();
      await testing.assertFails(
        deleteDoc(doc(guestClientDB, "topic", "topicID"))
      )
    })
    it('delete: uidフィールドの値がログイン中のユーザーと異なるキュメントは「NG」', async () => {
      const { clientDB } = getDB();
      await testing.assertFails(
        deleteDoc(doc(clientDB, "topic", "otherUserTopicID"))
      )
    })
  })
})
//■■■■■■■■■■■■■■■■■ history ■■■■■■■■■■■■■■■■■
describe('history collection', () => {
  // topic正常オブジェクト(docID除く)
  const topicValidObject = {
    title: "title",
    content: "content",
    files: ["yyyyyyy"],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    status: "pending",
    uid,
    authorizedUIDs: [uid],
    historyList: [],
  }
  // history正常オブジェクト(docID除く)
  const historyValidHistoryObject = {
    url: "url",
    title: "title",
    content: "content",
    files: ["yyyyyyy"],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    status: "pending",
    uid,
  }

  let inAuthTopicRef;
  let outAuthTopicRef;

  beforeEach(async () => {
    await testEnv.withSecurityRulesDisabled(async context => {
      const noRuleDB = context.firestore();
      // 自分に権限があるtopicモック
      inAuthTopicRef = doc(collection(noRuleDB, "topic"));
      const testMyTopicObject = { ...topicValidObject, docID: inAuthTopicRef.id };
      await setDoc(inAuthTopicRef, testMyTopicObject);
      // 他人に権限がないtopicモック
      outAuthTopicRef = doc(collection(noRuleDB, "topic"));
      const testOtherTopicObject = { ...topicValidObject, uid: otherUid, docID: outAuthTopicRef.id, authorizedUIDs: [otherUid] };
      await setDoc(outAuthTopicRef, testOtherTopicObject)
    })
  })
  // list
  describe('list', () => {
    it('list:親topicドキュメントのauthorizedUIDsにログインユーザーのUIDが含まれていたら「OK」', async () => {
      const { clientDB } = getDB();
      const q = query(collection(clientDB, "topic", inAuthTopicRef.id, "history"));
      await testing.assertSucceeds(
        getDocs(q)
      )
    })
    it('list:親topicドキュメントのauthorizedUIDsにログインユーザーのUIDが含まれていなかったら「NG」', async () => {
      const { clientDB } = getDB();
      const q = query(collection(clientDB, "topic", outAuthTopicRef.id, "history",));
      await testing.assertFails(
        getDocs(q)
      )
    })
    it('list:authorizedUIDsにログインユーザーのUIDが含まれていない「OK」性があるクエリは「NG」', async () => {
      const { clientDB } = getDB();
      const q = query(collection(clientDB, "topic"));
      await testing.assertFails(
        getDocs(q)
      )
    })
  })
  // create
  describe('create', () => {
    it('create:親topicドキュメントのauthorizedUIDsにログインユーザーのUIDが含まれていたら、サブコレクション (history)ドキュメント作成「OK」', async () => {
      const { clientDB } = getDB();
      const historyDocRef = doc(collection(clientDB, "topic", inAuthTopicRef.id, "history"));
      await testing.assertSucceeds(
        setDoc(historyDocRef, {
          ...historyValidHistoryObject,
          docID: historyDocRef.id,
          topicDocID: inAuthTopicRef.id,
        })
      )
    })
    it('create:親topicドキュメントのauthorizedUIDsにログインユーザーのUIDが含まれていなければ、サブコレクション (history)ドキュメント作成「NG」', async () => {
      const { clientDB } = getDB();
      const historyDocRef = doc(collection(clientDB, "topic", outAuthTopicRef.id, "history"));
      await testing.assertFails(
        setDoc(historyDocRef, {
          ...historyValidHistoryObject,
          docID: historyDocRef.id,
          topicDocID: outAuthTopicRef.id
        })
      )
    })
    // url
    it('create:urlが空欄では「NG」', async () => {
      const { clientDB } = getDB();
      const historyDocRef = doc(collection(clientDB, "topic", inAuthTopicRef.id, "history"));
      await testing.assertFails(
        setDoc(historyDocRef, {
          ...historyValidHistoryObject,
          url: "",
          docID: historyDocRef.id,
          topicDocID: inAuthTopicRef.id,
        })
      )
    })
    it('create:urlが1文字以上は「OK」', async () => {
      const { clientDB } = getDB();
      const historyDocRef = doc(collection(clientDB, "topic", inAuthTopicRef.id, "history"));
      await testing.assertSucceeds(
        setDoc(historyDocRef, {
          ...historyValidHistoryObject,
          url: "a",
          docID: historyDocRef.id,
          topicDocID: inAuthTopicRef.id,
        })
      )
    })
    it('create:urlが「501」文字以上は「NG」', async () => {
      const { clientDB } = getDB();
      const historyDocRef = doc(collection(clientDB, "topic", inAuthTopicRef.id, "history"));
      await testing.assertFails(
        setDoc(historyDocRef, {
          ...historyValidHistoryObject,
          url: "a".repeat(501),
          docID: historyDocRef.id,
          topicDocID: inAuthTopicRef.id,
        })
      )
    })
    it('create:urlが「500」文字以下は「OK」', async () => {
      const { clientDB } = getDB();
      const historyDocRef = doc(collection(clientDB, "topic", inAuthTopicRef.id, "history"));
      await testing.assertSucceeds(
        setDoc(historyDocRef, {
          ...historyValidHistoryObject,
          url: "a".repeat(500),
          docID: historyDocRef.id,
          topicDocID: inAuthTopicRef.id,
        })
      )
    })
    // title
    it('create:titleが「301」文字以上は「NG」', async () => {
      const { clientDB } = getDB();
      const historyDocRef = doc(collection(clientDB, "topic", inAuthTopicRef.id, "history"));
      await testing.assertFails(
        setDoc(historyDocRef, {
          ...historyValidHistoryObject,
          title: "a".repeat(301),
          docID: historyDocRef.id,
          topicDocID: inAuthTopicRef.id,
        })
      )
    })
    it('create:titleが「300」文字以下は「OK」', async () => {
      const { clientDB } = getDB();
      const historyDocRef = doc(collection(clientDB, "topic", inAuthTopicRef.id, "history"));
      await testing.assertSucceeds(
        setDoc(historyDocRef, {
          ...historyValidHistoryObject,
          title: "a".repeat(300),
          docID: historyDocRef.id,
          topicDocID: inAuthTopicRef.id,
        })
      )
    })
    // content
    it('create:contentが空欄は「NG」', async () => {
      const { clientDB } = getDB();
      const historyDocRef = doc(collection(clientDB, "topic", inAuthTopicRef.id, "history"));
      await testing.assertFails(
        setDoc(historyDocRef, {
          ...historyValidHistoryObject,
          content: "",
          docID: historyDocRef.id,
          topicDocID: inAuthTopicRef.id,
        })
      )
    })
    it('create:contentが「1」文字以上は「OK」', async () => {
      const { clientDB } = getDB();
      const historyDocRef = doc(collection(clientDB, "topic", inAuthTopicRef.id, "history"));
      await testing.assertSucceeds(
        setDoc(historyDocRef, {
          ...historyValidHistoryObject,
          content: "a",
          docID: historyDocRef.id,
          topicDocID: inAuthTopicRef.id,
        })
      )
    })
    it('create:contentが「10001」文字以上は「NG」', async () => {
      const { clientDB } = getDB();
      const historyDocRef = doc(collection(clientDB, "topic", inAuthTopicRef.id, "history"));
      await testing.assertFails(
        setDoc(historyDocRef, {
          ...historyValidHistoryObject,
          content: "a".repeat(10001),
          docID: historyDocRef.id,
          topicDocID: inAuthTopicRef.id,
        })
      )
    })
    it('create:contentが「10000」文字以下は「OK」', async () => {
      const { clientDB } = getDB();
      const historyDocRef = doc(collection(clientDB, "topic", inAuthTopicRef.id, "history"));
      await testing.assertSucceeds(
        setDoc(historyDocRef, {
          ...historyValidHistoryObject,
          content: "a".repeat(10000),
          docID: historyDocRef.id,
          topicDocID: inAuthTopicRef.id,
        })
      )
    })
    // status
    it('create:statusがpending以外は「NG」', async () => {
      const { clientDB } = getDB();
      const historyDocRef = doc(collection(clientDB, "topic", inAuthTopicRef.id, "history"));
      await testing.assertFails(
        setDoc(historyDocRef, {
          ...historyValidHistoryObject,
          status: "a",
          docID: historyDocRef.id,
          topicDocID: inAuthTopicRef.id,
        })
      )
    })
    // docID
    it('create:docIDフィールドがドキュメントIDと異なる場合は「NG」', async () => {
      const { clientDB } = getDB();
      const historyDocRef = doc(collection(clientDB, "topic", inAuthTopicRef.id, "history"));
      await testing.assertFails(
        setDoc(historyDocRef, {
          ...historyValidHistoryObject,
          docID: "xxx",
          topicDocID: inAuthTopicRef.id,
        })
      )
    })
    it('create:uidフィールドがログイン中ユーザーのUIDと異なる場合は「NG」', async () => {
      const { clientDB } = getDB();
      const historyDocRef = doc(collection(clientDB, "topic", inAuthTopicRef.id, "history"));
      await testing.assertFails(
        setDoc(historyDocRef, {
          ...historyValidHistoryObject,
          uid: otherUid,
          docID: historyDocRef.id,
          topicDocID: inAuthTopicRef.id,
        })
      )
    })
    it('create:topicDocIDフィールドが親topicのドキュメントIDと異なる場合は「NG」', async () => {
      const { clientDB } = getDB();
      const historyDocRef = doc(collection(clientDB, "topic", inAuthTopicRef.id, "history"));
      await testing.assertFails(
        setDoc(historyDocRef, {
          ...historyValidHistoryObject,
          docID: historyDocRef.id,
          topicDocID: outAuthTopicRef.id,
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
        // 親topicドキュメントのauthorizedUIDsにログインユーザーのUIDが含まれているhstory
        inAuthHistoryRef = doc(collection(noRuleDB, "topic", inAuthTopicRef.id, "history"));
        await setDoc(inAuthHistoryRef, { ...historyValidHistoryObject, uid: otherUid, docID: inAuthHistoryRef.id });
        // 親topicドキュメントのauthorizedUIDsにログインユーザーのUIDが含まれていないhistory
        outAuthHistoryRef = doc(collection(noRuleDB, "topic", outAuthTopicRef.id, "history"));
        await setDoc(outAuthHistoryRef, { ...historyValidHistoryObject, uid: otherUid, docID: outAuthHistoryRef.id });
      })
    })
    it('update:親topicドキュメントのauthorizedUIDsにログインユーザーのUIDが含まれていたら、サブコレクション (history)ドキュメントの更新「OK」', async () => {
      const { clientDB } = getDB();
      const testUpdateHistoryRef = doc(clientDB, "topic", inAuthTopicRef.id, "history", inAuthHistoryRef.id);
      await testing.assertSucceeds(
        updateDoc(testUpdateHistoryRef, { content: "changeContent" })
      )
    })
    it('update:親topicドキュメントのauthorizedUIDsにログインユーザーのUIDが含まれていなければ、サブコレクション (history)ドキュメントの更新「NG」', async () => {
      const { clientDB } = getDB();
      const testUpdateHistoryRef = doc(clientDB, "topic", outAuthHistoryRef.id, "history", outAuthHistoryRef.id);
      await testing.assertFails(
        updateDoc(testUpdateHistoryRef, { content: "changeContent" })
      )
    })
    // title
    it('update:titleが300文字は「OK」', async () => {
      const { clientDB } = getDB();
      const testUpdateHistoryRef = doc(clientDB, "topic", inAuthTopicRef.id, "history", inAuthHistoryRef.id);
      await testing.assertSucceeds(
        updateDoc(testUpdateHistoryRef, { title: "a".repeat(300) })
      )
    })
    it('update:titleが301文字は「NG」', async () => {
      const { clientDB } = getDB();
      const testUpdateHistoryRef = doc(clientDB, "topic", inAuthTopicRef.id, "history", inAuthHistoryRef.id);
      await testing.assertFails(
        updateDoc(testUpdateHistoryRef, { title: "a".repeat(301) })
      )
    })
    // content
    it('update:contentが10000文字は「OK」', async () => {
      const { clientDB } = getDB();
      const testUpdateHistoryRef = doc(clientDB, "topic", inAuthTopicRef.id, "history", inAuthHistoryRef.id);
      await testing.assertSucceeds(
        updateDoc(testUpdateHistoryRef, { content: "a".repeat(10000) })
      )
    })
    it('update:contentが10001文字は「NG」', async () => {
      const { clientDB } = getDB();
      const testUpdateHistoryRef = doc(clientDB, "topic", inAuthTopicRef.id, "history", inAuthHistoryRef.id);
      await testing.assertFails(
        updateDoc(testUpdateHistoryRef, { title: "a".repeat(10001) })
      )
    })
    it('update:contentが1文字以上は「OK」', async () => {
      const { clientDB } = getDB();
      const testUpdateHistoryRef = doc(clientDB, "topic", inAuthTopicRef.id, "history", inAuthHistoryRef.id);
      await testing.assertSucceeds(
        updateDoc(testUpdateHistoryRef, { content: "a" })
      )
    })
    it('update:contentが空欄は「NG」', async () => {
      const { clientDB } = getDB();
      const testUpdateHistoryRef = doc(clientDB, "topic", inAuthTopicRef.id, "history", inAuthHistoryRef.id);
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
        await setDoc(doc(noRuleDB, "topic", "moTopicID"), { title: "title", content: "content", uid, authorizedUIDs: [uid] })
        await setDoc(doc(noRuleDB, "topic", "moTopicID", "history", "moHistoryID"), { url: "url", content: "content", uid: otherUid })
        //他人が作ったtopic/ログインユーザーが作ったhistory
        await setDoc(doc(noRuleDB, "topic", "omTopicID"), { title: "title", content: "content", uid: otherUid, authorizedUIDs: [otherUid] })
        await setDoc(doc(noRuleDB, "topic", "omTopicID", "history", "omHistoryID"), { url: "url", content: "content", uid })
        //他人が作ったtopic/他人が作ったhistory
        await setDoc(doc(noRuleDB, "topic", "ooTopicID"), { title: "title", content: "content", uid: otherUid, authorizedUIDs: [otherUid] })
        await setDoc(doc(noRuleDB, "topic", "ooTopicID", "history", "ooHistoryID"), { url: "url", content: "content", uid: otherUid })
      })
    })
    it('delete:親topicドキュメントのuidがログインユーザーのUIDであれば「OK」', async () => {
      const { clientDB } = getDB();
      const docRef = doc(clientDB, "topic", "moTopicID", "history", "moHistoryID");
      await testing.assertSucceeds(
        deleteDoc(docRef)
      )
    })
    it('delete:historyドキュメントのuidがログイン中のユーザーであれば「OK」', async () => {
      const { clientDB } = getDB();
      const docRef = doc(clientDB, "topic", "omTopicID", "history", "omHistoryID");
      await testing.assertSucceeds(
        deleteDoc(docRef)
      )
    })
    it('delete:親topic、history共に他人が作成したものであれば「NG」', async () => {
      const { clientDB } = getDB();
      const docRef = doc(clientDB, "topic", "ooTopicID", "history", "ooHistoryID");
      await testing.assertFails(
        deleteDoc(docRef)
      )
    })
  })
})
