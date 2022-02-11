import * as fs from 'fs'
import { v4 } from "uuid"
import * as testing from '@firebase/rules-unit-testing'

import { doc, collection, setDoc, getDoc, updateDoc, query, where, getDocs, deleteDoc } from 'firebase/firestore'

const projectID = v4()
let testEnv
const uid = v4()
const otherUid = v4()

beforeAll(async () => {
  // テストプロジェクト環境の作成
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
  // ログイン情報つきのContextを作成し、そこから Firestore インスタンスを得る
  const authenticatedContext = testEnv.authenticatedContext(uid)
  const clientDB = authenticatedContext.firestore()

  // ゲストContextを作成し、そこから Firestore インスタンスを得る
  const unauthenticatedContext = testEnv.unauthenticatedContext()
  const guestClientDB = unauthenticatedContext.firestore()
  return { clientDB, guestClientDB }
}

describe('userPrivate collection', () => {
  // get
  describe('get', () => {
    it('get: 未認証では不可。', async () => {
      const { guestClientDB } = getDB();
      await testing.assertFails(
        getDoc(doc(guestClientDB, "userPrivate", uid))
      )
    })
    it('get: 認証済みでもログインユーザーのUIDと異なるドキュメントIDのドキュメントは不可', async () => {
      const { clientDB } = getDB();
      await testing.assertFails(
        getDoc(doc(clientDB, "userPrivate", otherUid))
      )
    })
    it('get: 認証済みでログインのUIDと同じドキュメントIDのドキュメントは可能', async () => {
      const { clientDB } = getDB();
      await testing.assertSucceeds(
        getDoc(doc(clientDB, "userPrivate", uid))
      )
    })
  })
  // create
  describe('create', () => {
    it('create: 認証済みで条件を満たす場合は可能', async () => {
      const { clientDB } = getDB();
      await testing.assertSucceeds(
        setDoc(doc(clientDB, "userPrivate", uid), { email: "123456789012345678901234567890", uid })
      )
    })
    it('create: 未認証ではcreate不可。', async () => {
      const { guestClientDB } = getDB();
      await testing.assertFails(
        setDoc(doc(guestClientDB, "userPrivate", uid), { email: "otherEmail", uid })
      )
    })
    it('create: 認証済み。ドキュメントIDがUIDと異なる値では不可。', async () => {
      const { guestClientDB } = getDB();
      await testing.assertFails(
        setDoc(doc(guestClientDB, "userPrivate", otherUid), { email: "otherEmail", uid })
      )
    })
    it('create: 認証済み。uidフィールドがUIDと異なる値では不可。', async () => {
      const { guestClientDB } = getDB();
      await testing.assertFails(
        setDoc(doc(guestClientDB, "userPrivate", uid), { email: "otherEmail", uid: otherUid })
      )
    })
    it('create: 認証済み。emailが31文字以上不可。', async () => {
      const { guestClientDB } = getDB();
      await testing.assertFails(
        setDoc(doc(guestClientDB, "userPrivate", uid), { email: "1234567890123456789012345678901", uid: uid })
      )
    })
    it('create: 認証済み。許可されたフィールド以外は不可', async () => {
      const { guestClientDB } = getDB();
      await testing.assertFails(
        setDoc(doc(guestClientDB, "userPrivate", uid), { email: "1234567890123456789012345678901", uid: uid, age: 20 })
      )
    })
  })
  // update
  describe('update', () => {
    beforeEach(async () => {
      await testEnv.withSecurityRulesDisabled(async context => {
        const noRuleDB = context.firestore()
        await setDoc(doc(noRuleDB, "userPrivate", uid), { email: "authEmail", uid })
      })
    })
    it('update: 認証済みで条件を満たす場合は可能', async () => {
      const { clientDB } = getDB();
      await testing.assertSucceeds(
        updateDoc(doc(clientDB, "userPrivate", uid), { email: "changeEmail" })
      )
    })
    it('update: 未認証ではupdate不可', async () => {
      const { guestClientDB } = getDB();
      await testing.assertFails(
        updateDoc(doc(guestClientDB, "userPrivate", uid), { email: "changeEmail" })
      )
    })
    it('update: 認証済み。ドキュメントIDがUIDと異なる値では不可。', async () => {
      const { clientDB } = getDB();
      await testing.assertFails(
        updateDoc(doc(clientDB, "userPrivate", otherUid), { email: "changeEmail" })
      )
    })
    it('update: 認証済み。emailが文字列でない場合不可。', async () => {
      const { clientDB } = getDB();
      await testing.assertFails(
        updateDoc(doc(clientDB, "userPrivate", uid), { email: 0 })
      )
    })
    it('update: 認証済み。emailが31文字以上不可。', async () => {
      const { clientDB } = getDB();
      await testing.assertFails(
        updateDoc(doc(clientDB, "userPrivate", uid), { email: "1234567890123456789012345678901" })
      )
    })
    it('update: 認証済み。許可されたフィールド以外は不可', async () => {
      const { clientDB } = getDB();
      await testing.assertFails(
        updateDoc(doc(clientDB, "userPrivate", uid), { email: "changeEmail", uid: "changeUID" })
      )
    })
  })
})
// topic
describe('topic collection', () => {
  // list
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
  // create
  describe('create', () => {
    it('create: 認証済みで条件を満たす場合は可能', async () => {
      const { clientDB } = getDB();
      await testing.assertSucceeds(
        setDoc(doc(clientDB, "topic", "topicID"), { title: "title", content: "content", uid, authorizedUIDs: [uid] })
      )
    })
    it('create: 未認証では不可。', async () => {
      const { guestClientDB } = getDB();
      await testing.assertFails(
        setDoc(doc(guestClientDB, "topic", "topicID"), { title: "title", content: "content", uid, authorizedUIDs: [uid] })
      )
    })
    it('create: uidにログインユーザーのUIDと異なる値を与えるのは不可', async () => {
      const { clientDB } = getDB();
      await testing.assertFails(
        setDoc(doc(clientDB, "topic", "topicID"), { title: "title", content: "content", uid: otherUid, authorizedUIDs: [uid] })
      )
    })
    it('create: authorizedUIDsにログインユーザーのUIDが含まれていない場合は不可', async () => {
      const { clientDB } = getDB();
      await testing.assertFails(
        setDoc(doc(clientDB, "topic", "topicID"), { title: "title", content: "content", uid: otherUid, authorizedUIDs: [otherUid] })
      )
    })
  })
  // update
  describe('update', () => {
    // モック作成
    beforeEach(async () => {
      await testEnv.withSecurityRulesDisabled(async context => {
        const noRuleDB = context.firestore()
        await setDoc(doc(noRuleDB, "topic", "topicID"), { title: "title", content: "content", uid, authorizedUIDs: [uid] })
        await setDoc(doc(noRuleDB, "topic", "otherUserTopicID"), { title: "title", content: "content", uid: otherUid, authorizedUIDs: [otherUid] })
      })
    })
    it('update: 認証済みで条件を満たす場合は可能', async () => {
      const { clientDB } = getDB();
      await testing.assertSucceeds(
        updateDoc(doc(clientDB, "topic", "topicID"), { title: "title", content: "content", authorizedUIDs: [uid] })
      )
    })
    it('update: 未認証では不可。', async () => {
      const { guestClientDB } = getDB();
      await testing.assertFails(
        updateDoc(doc(guestClientDB, "topic", "topicID"), { title: "title", content: "content", authorizedUIDs: [uid] })
      )
    })
    it('update: uidの変更は不可', async () => {
      const { clientDB } = getDB();
      await testing.assertFails(
        updateDoc(doc(clientDB, "topic", "topicID"), { title: "title", content: "content", uid: otherUid, authorizedUIDs: [uid] })
      )
    })
    it('update: uidフィールドの値がログイン中のユーザーと異なるキュメントは不可', async () => {
      const { clientDB } = getDB();
      await testing.assertFails(
        updateDoc(doc(clientDB, "topic", "otherUserTopicID"), { title: "title", content: "content", authorizedUIDs: [uid] })
      )
    })
  })
  // // delete
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

// history
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
    describe('delete', () => {
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
        const docRef = doc(clientDB, "topic", "ooTopicID", "history", "omHistoryID");
        await testing.assertFails(
          deleteDoc(docRef)
        )
      })
    })
  })
})
