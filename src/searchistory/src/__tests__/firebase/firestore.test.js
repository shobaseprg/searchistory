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
    it('get: 未認証では不可。', async () => {
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

    it('create: 認証済みで条件を満たす場合は可能', async () => {
      const { clientDB } = getDB();
      await testing.assertSucceeds(
        setDoc(doc(clientDB, "user", uid), { uid, name })
      )
    })
    it('create: 未認証では不可。', async () => {
      const { guestClientDB } = getDB();
      await testing.assertFails(
        setDoc(doc(guestClientDB, "user", uid), { uid, name })
      )
    })
    it('create: 認証済み。ドキュメントIDがUIDと異なる値では不可。', async () => {
      const { clientDB } = getDB();
      await testing.assertFails(
        setDoc(doc(clientDB, "user", otherUid), { uid, name })
      )
    })
    it('create: 認証済み。uidフィールドがUIDと異なる値では不可。', async () => {
      const { clientDB } = getDB();
      await testing.assertFails(
        setDoc(doc(clientDB, "user", uid), { uid: otherUid, name })
      )
    })
    it('create: 認証済み。許可されたフィールド以外は不可', async () => {
      const { clientDB } = getDB();
      await testing.assertFails(
        setDoc(doc(clientDB, "user", uid), { email: "email", uid: uid, name })
      )
    })
    it('create: 認証済み。nameが文字列以外は不可', async () => {
      const { clientDB } = getDB();
      await testing.assertFails(
        setDoc(doc(clientDB, "user", uid), { uid: uid, name: 111111 })
      )
    })
    it('create: 認証済み。nameが31文字以上は不可', async () => {
      const { clientDB } = getDB();
      await testing.assertFails(
        setDoc(doc(clientDB, "user", uid), { uid: uid, name: name31 })
      )
    })
    it('create: 認証済み。nameが2文字以下は不可', async () => {
      const { clientDB } = getDB();
      await testing.assertFails(
        setDoc(doc(clientDB, "user", uid), { uid: uid, name: "aa" })
      )
    })
    it('create: 認証済み。nameが3文字以下は可能', async () => {
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
    it('update: 認証済みで条件を満たす場合は可能', async () => {
      const { clientDB } = getDB();
      await testing.assertSucceeds(
        updateDoc(doc(clientDB, "user", uid), { name: "changeName" })
      )
    })
    it('update: 未認証では不可', async () => {
      const { guestClientDB } = getDB();
      await testing.assertFails(
        updateDoc(doc(guestClientDB, "user", uid), { name: "changeName" })
      )
    })
    it('update: 認証済み。ドキュメントIDがUIDと異なる値では不可。', async () => {
      const { clientDB } = getDB();
      await testing.assertFails(
        updateDoc(doc(clientDB, "user", otherUid), { name: "changeName" })
      )
    })
    it('update: 認証済み。許可されたフィールド以外は不可', async () => {
      const { clientDB } = getDB();
      await testing.assertFails(
        updateDoc(doc(clientDB, "user", uid), { uid: "changeUID" })
      )
    })
    it('update: 認証済み。nameが31文字以上は不可', async () => {
      const { clientDB } = getDB();
      await testing.assertFails(
        updateDoc(doc(clientDB, "user", uid), { name: name31 })
      )
    })
    it('update: 認証済み。nameが2文字以下は不可', async () => {
      const { clientDB } = getDB();
      await testing.assertFails(
        updateDoc(doc(clientDB, "user", uid), { name: "aa" })
      )
    })
    it('update: 認証済み。nameが3文字以下は可能', async () => {
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
    it('get: 未認証では不可。', async () => {
      const { guestClientDB } = getDB();
      await testing.assertFails(
        getDoc(doc(guestClientDB, "userPrivate", uid))
      )
    })
    it('get: ログインユーザーのUIDと異なるドキュメントIDのドキュメントは不可', async () => {
      const { clientDB } = getDB();
      await testing.assertFails(
        getDoc(doc(clientDB, "userPrivate", otherUid))
      )
    })
    it('get: ログインのUIDと同じドキュメントIDのドキュメントは可能', async () => {
      const { clientDB } = getDB();
      await testing.assertSucceeds(
        getDoc(doc(clientDB, "userPrivate", uid))
      )
    })
  })
  //============= userPrivate create =============
  describe('create', () => {
    it('create: 認証済みで条件を満たす場合は可能', async () => {
      const { clientDB } = getDB();
      await testing.assertSucceeds(
        setDoc(doc(clientDB, "userPrivate", uid), { uid, memberUIDs: [] })
      )
    })
    it('create: 未認証では不可。', async () => {
      const { guestClientDB } = getDB();
      await testing.assertFails(
        setDoc(doc(guestClientDB, "userPrivate", uid), { uid, memberUIDs: [] })
      )
    })
    it('create: 認証済み。ドキュメントIDがUIDと異なる値では不可。', async () => {
      const { clientDB } = getDB();
      await testing.assertFails(
        setDoc(doc(clientDB, "userPrivate", otherUid), { uid, memberUIDs: [] })
      )
    })
    it('create: 認証済み。uidフィールドがUIDと異なる値では不可。', async () => {
      const { clientDB } = getDB();
      await testing.assertFails(
        setDoc(doc(clientDB, "userPrivate", uid), { uid: otherUid, memberUIDs: [] })
      )
    })
    it('create: 認証済み。許可されたフィールド以外は不可', async () => {
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
    it('update: 認証済みで条件を満たす場合は可能', async () => {
      const { clientDB } = getDB();
      await testing.assertSucceeds(
        updateDoc(doc(clientDB, "userPrivate", uid), { memberUIDs: [otherUid, "addUID"] })
      )
    })
    it('update: 未認証では不可', async () => {
      const { guestClientDB } = getDB();
      await testing.assertFails(
        updateDoc(doc(guestClientDB, "userPrivate", uid), { memberUIDs: [otherUid, "addUID"] })
      )
    })
    it('update: 認証済み。ドキュメントIDがUIDと異なる値では不可。', async () => {
      const { clientDB } = getDB();
      await testing.assertFails(
        updateDoc(doc(clientDB, "userPrivate", otherUid), { memberUIDs: [otherUid, "addUID"] })
      )
    })
    it('update: 認証済み。許可されたフィールド以外は不可', async () => {
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
    it('list:authorizedUIDsにログインユーザーのUIDが含まれれば可能 ', async () => {
      const { clientDB } = getDB();
      const q = query(collection(clientDB, "topic"), where("authorizedUIDs", "array-contains", uid));
      await testing.assertSucceeds(
        getDocs(q)
      )
    })
    it('list:authorizedUIDsにログインユーザーのUIDが含まれていない可能性があるクエリは不可', async () => {
      const { clientDB } = getDB();
      const q = query(collection(clientDB, "topic"));
      await testing.assertFails(
        getDocs(q)
      )
    })
  })
  //============= topic create =============
  describe('create', () => {
    it('create: 認証済みで条件を満たす場合は可能', async () => {
      const { clientDB } = getDB();
      const docRef = doc(clientDB, "topic", "topicID");
      const testObject = { ...validObject, docID: docRef.id };
      await testing.assertSucceeds(
        setDoc(docRef, testObject)
      )
    })
    it('create: 未認証では不可。', async () => {
      const { guestClientDB } = getDB();
      const docRef = doc(guestClientDB, "topic", "topicID");
      const testObject = { ...validObject, docID: docRef.id };
      await testing.assertFails(
        setDoc(docRef, testObject)
      )
    })
    // uid
    it('create: uidにログインユーザーのUIDと異なる値を与えるのは不可', async () => {
      const { clientDB } = getDB();
      const docRef = doc(clientDB, "topic", "topicID");
      const testObject = { ...validObject, docID: docRef.id, uid: otherUid };
      await testing.assertFails(
        setDoc(docRef, testObject)
      )
    })
    // title
    it('create: titleが100文字以下は可能', async () => {
      const { clientDB } = getDB();
      const docRef = doc(clientDB, "topic", "topicID");
      const title = "a".repeat(100);
      const testObject = { ...validObject, docID: docRef.id, title };
      await testing.assertSucceeds(
        setDoc(docRef, testObject)
      )
    })
    it('create: titleが101文字以上は不可', async () => {
      const { clientDB } = getDB();
      const docRef = doc(clientDB, "topic", "topicID");
      const title = "a".repeat(101);
      const testObject = { ...validObject, docID: docRef.id, title };
      await testing.assertFails(
        setDoc(docRef, testObject)
      )
    })
    it('create: titleが1文字以上は可能', async () => {
      const { clientDB } = getDB();
      const docRef = doc(clientDB, "topic", "topicID");
      const title = "a".repeat(1);
      const testObject = { ...validObject, docID: docRef.id, title };
      await testing.assertSucceeds(
        setDoc(docRef, testObject)
      )
    })
    it('create: titleが空欄は不可', async () => {
      const { clientDB } = getDB();
      const docRef = doc(clientDB, "topic", "topicID");
      const title = "";
      const testObject = { ...validObject, docID: docRef.id, title };
      await testing.assertFails(
        setDoc(docRef, testObject)
      )
    })
    // content
    it('create: contentが10000文字以下は可能', async () => {
      const { clientDB } = getDB();
      const docRef = doc(clientDB, "topic", "topicID");
      const content = "a".repeat(10000);
      const testObject = { ...validObject, docID: docRef.id, content };
      await testing.assertSucceeds(
        setDoc(docRef, testObject)
      )
    })
    it('create: contentが10001文字以上は不可', async () => {
      const { clientDB } = getDB();
      const docRef = doc(clientDB, "topic", "topicID");
      const content = "a".repeat(10001);
      const testObject = { ...validObject, docID: docRef.id, content };
      await testing.assertFails(
        setDoc(docRef, testObject)
      )
    })
    it('create: contentが1文字以上は可能', async () => {
      const { clientDB } = getDB();
      const docRef = doc(clientDB, "topic", "topicID");
      const content = "a".repeat(1);
      const testObject = { ...validObject, docID: docRef.id, content };
      await testing.assertSucceeds(
        setDoc(docRef, testObject)
      )
    })
    it('create: contentが空欄は不可', async () => {
      const { clientDB } = getDB();
      const docRef = doc(clientDB, "topic", "topicID");
      const content = "";
      const testObject = { ...validObject, docID: docRef.id, content };
      await testing.assertFails(
        setDoc(docRef, testObject)
      )
    })
    it('create: statusがpending以外は不可', async () => {
      const { clientDB } = getDB();
      const docRef = doc(clientDB, "topic", "topicID");
      const testObject = { ...validObject, docID: docRef.id, status: "finish" };
      await testing.assertFails(
        setDoc(docRef, testObject)
      )
    })
    // authorizedUIDs
    it('create: authorizedUIDsにログインユーザーのUIDが含まれていない場合は不可', async () => {
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
    it('update: 認証済みで条件を満たす場合は可能', async () => {
      const { clientDB } = getDB();
      await testing.assertSucceeds(
        updateDoc(doc(clientDB, "topic", "topicID"), { title: "changeTitle", content: "changeContent", authorizedUIDs: [uid] })
      )
    })
    it('update: 未認証では不可。', async () => {
      const { guestClientDB } = getDB();
      await testing.assertFails(
        updateDoc(doc(guestClientDB, "topic", "topicID"), { title: "title", content: "content", authorizedUIDs: [uid] })
      )
    })
    it('update: 許可されていないフィールドは不可', async () => {
      const { clientDB } = getDB();
      await testing.assertFails(
        updateDoc(doc(clientDB, "topic", "topicID"), { uid: otherUid })
      )
    })
    // title
    it('update: titleが空欄は不可', async () => {
      const { clientDB } = getDB();
      await testing.assertFails(
        updateDoc(doc(clientDB, "topic", "topicID"), { title: "" })
      )
    })
    it('update: titleが101文字以上は不可', async () => {
      const { clientDB } = getDB();
      await testing.assertFails(
        updateDoc(doc(clientDB, "topic", "topicID"), { title: "a".repeat(101) })
      )
    })
    it('update: titleが100文字は可能', async () => {
      const { clientDB } = getDB();
      await testing.assertSucceeds(
        updateDoc(doc(clientDB, "topic", "topicID"), { title: "a".repeat(100) })
      )
    })
    // content
    it('update: contentが空欄は不可', async () => {
      const { clientDB } = getDB();
      await testing.assertFails(
        updateDoc(doc(clientDB, "topic", "topicID"), { content: "" })
      )
    })
    it('update: contentが10001文字以上は不可', async () => {
      const { clientDB } = getDB();
      await testing.assertFails(
        updateDoc(doc(clientDB, "topic", "topicID"), { content: "a".repeat(10001) })
      )
    })
    it('update: contetが10000文字は可能', async () => {
      const { clientDB } = getDB();
      await testing.assertSucceeds(
        updateDoc(doc(clientDB, "topic", "topicID"), { content: "a".repeat(10000) })
      )
    })
    it('update: ドキュメントIDの値がログイン中のユーザーと異なるキュメントは不可', async () => {
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
        await setDoc(doc(noRuleDB, "topic", "topicID"), { title: "title", content: "content", uid, authorizedUIDs: [uid] })
        await setDoc(doc(noRuleDB, "topic", "otherUserTopicID"), { title: "title", content: "content", uid: otherUid, authorizedUIDs: [otherUid] })
      })
    })
    it('delete: 認証済みで条件を満たす場合は可能', async () => {
      const { clientDB } = getDB();
      await testing.assertSucceeds(
        deleteDoc(doc(clientDB, "topic", "topicID"))
      )
    })
    it('delete: 未認証では不可。', async () => {
      const { guestClientDB } = getDB();
      await testing.assertFails(
        deleteDoc(doc(guestClientDB, "topic", "topicID"))
      )
    })
    it('delete: uidフィールドの値がログイン中のユーザーと異なるキュメントは不可', async () => {
      const { clientDB } = getDB();
      await testing.assertFails(
        deleteDoc(doc(clientDB, "topic", "otherUserTopicID"))
      )
    })
  })
})
//■■■■■■■■■■■■■■■■■ history ■■■■■■■■■■■■■■■■■
describe('history collection', () => {
  // list
  describe('list', () => {
    // モック作成
    beforeEach(async () => {
      await testEnv.withSecurityRulesDisabled(async context => {
        const noRuleDB = context.firestore()
        await setDoc(doc(noRuleDB, "topic", "topicID"), { title: "title", content: "content", uid, authorizedUIDs: [uid] })
        await setDoc(doc(noRuleDB, "topic", "outOfAuthTopicID"), { title: "title", content: "content", uid: otherUid, authorizedUIDs: [otherUid] })
      })
    })
    it('list:親topicドキュメントのauthorizedUIDsにログインユーザーのUIDが含まれていたら可能', async () => {
      const { clientDB } = getDB();
      const q = query(collection(clientDB, "topic", "topicID", "history"));
      await testing.assertSucceeds(
        getDocs(q)
      )
    })
    it('list:親topicドキュメントのauthorizedUIDsにログインユーザーのUIDが含まれていなかったら不可', async () => {
      const { clientDB } = getDB();
      const q = query(collection(clientDB, "topic", "outOfAuthTopicID", "history",));
      await testing.assertFails(
        getDocs(q)
      )
    })
    it('list:authorizedUIDsにログインユーザーのUIDが含まれていない可能性があるクエリは不可', async () => {
      const { clientDB } = getDB();
      const q = query(collection(clientDB, "topic"));
      await testing.assertFails(
        getDocs(q)
      )
    })
  })
  // create
  describe('create', () => {
    // モック作成
    beforeEach(async () => {
      await testEnv.withSecurityRulesDisabled(async context => {
        const noRuleDB = context.firestore()
        await setDoc(doc(noRuleDB, "topic", "topicID"), { title: "title", content: "content", uid, authorizedUIDs: [uid] })
        await setDoc(doc(noRuleDB, "topic", "outOfAuthTopicID"), { title: "title", content: "content", uid: otherUid, authorizedUIDs: [otherUid] })
      })
    })
    it('create:親topicドキュメントのauthorizedUIDsにログインユーザーのUIDが含まれていたら、サブコレクション (history)ドキュメント作成可能', async () => {
      const { clientDB } = getDB();
      const docRef = doc(clientDB, "topic", "topicID", "history", "mmhistoryID");
      await testing.assertSucceeds(
        setDoc(docRef, {
          url: "url",
          title: "タイトル",
          content: "content",
          status: "pending",
          files: [],
          updatedAt: serverTimestamp(),
          createdAt: serverTimestamp(),
          docID: docRef.id, uid,
          topicDocID: "topicID"
        })
      )
    })
    it('create:親topicドキュメントのauthorizedUIDsにログインユーザーのUIDが含まれていなければ、サブコレクション (history)ドキュメント作成不可', async () => {
      const { clientDB } = getDB();
      const docRef = doc(clientDB, "topic", "outOfAuthTopicID", "history", "mmhistoryID");
      await testing.assertFails(
        setDoc(docRef, { url: "url", content: "content", uid })
      )
    })
    it('create:uidにログインユーザーのUIDと異なる値を与えるのは不可', async () => {
      const { clientDB } = getDB();
      const docRef = doc(clientDB, "topic", "topicID", "history", "mmhistoryID");
      await testing.assertFails(
        setDoc(docRef, { url: "url", content: "content", uid: otherUid })
      )
    })
  })
  // update
  describe('update', () => {
    // モック作成
    beforeEach(async () => {
      await testEnv.withSecurityRulesDisabled(async context => {
        const noRuleDB = context.firestore()
        // 親topicドキュメントのauthorizedUIDsにログインユーザーのUIDが含まれている場合
        await setDoc(doc(noRuleDB, "topic", "topicID"), { title: "title", content: "content", uid, authorizedUIDs: [uid] })
        await setDoc(doc(noRuleDB, "topic", "topicID", "history", "historyID"), { url: "url", content: "content", uid: otherUid })
        // 親topicドキュメントのauthorizedUIDsにログインユーザーのUIDが含まれていない場合
        await setDoc(doc(noRuleDB, "topic", "outOfAuthTopicID"), { title: "title", content: "content", uid, authorizedUIDs: [otherUid] })
        await setDoc(doc(noRuleDB, "topic", "outOfAuthTopicID", "history", "historyID"), { url: "url", content: "content", uid: otherUid })
      })
    })
    it('update:親topicドキュメントのauthorizedUIDsにログインユーザーのUIDが含まれていたら、サブコレクション (history)ドキュメントの更新可能', async () => {
      const { clientDB } = getDB();
      const docRef = doc(clientDB, "topic", "topicID", "history", "historyID");
      await testing.assertSucceeds(
        updateDoc(docRef, { url: "url", content: "content" })
      )
    })
    it('update:親topicドキュメントのauthorizedUIDsにログインユーザーのUIDが含まれていなければ、サブコレクション (history)ドキュメントの更新不可', async () => {
      const { clientDB } = getDB();
      const docRef = doc(clientDB, "topic", "outOfAuthTopicID", "history", "historyID");
      await testing.assertFails(
        updateDoc(docRef, { url: "url", content: "content" })
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
    it('delete:親topicドキュメントのuidがログインユーザーのUIDであれば可能', async () => {
      const { clientDB } = getDB();
      const docRef = doc(clientDB, "topic", "moTopicID", "history", "moHistoryID");
      await testing.assertSucceeds(
        deleteDoc(docRef)
      )
    })
    it('delete:historyドキュメントのuidがログイン中のユーザーであれば可能', async () => {
      const { clientDB } = getDB();
      const docRef = doc(clientDB, "topic", "omTopicID", "history", "omHistoryID");
      await testing.assertSucceeds(
        deleteDoc(docRef)
      )
    })
    it('delete:親topic、history共に他人が作成したものであれば不可', async () => {
      const { clientDB } = getDB();
      const docRef = doc(clientDB, "topic", "ooTopicID", "history", "ooHistoryID");
      await testing.assertFails(
        deleteDoc(docRef)
      )
    })
  })
})
