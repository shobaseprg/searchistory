import * as fs from 'fs'
import { v4 } from "uuid"
import * as firebase from '@firebase/rules-unit-testing'

// // Firebase JS SDKのserverTimestampを使う
import { serverTimestamp as st, doc, collection, setDoc, getDoc, updateDoc, query, where, getDocs } from 'firebase/firestore'
// const serverTimestamp = () => st()

const projectID = v4()
let testEnv
const uid = v4()
const otherUid = v4()

beforeAll(async () => {
  // テストプロジェクト環境の作成
  testEnv = await firebase.initializeTestEnvironment({
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
    it('get: 未認証ではget不可。', async () => {
      const { guestClientDB } = getDB();
      await firebase.assertFails(
        getDoc(doc(guestClientDB, "userPrivate", uid))
      )
    })
    it('get: 未認証済みでも自分のUIDと異なるドキュメントIDのドキュメントはget不可', async () => {
      const { clientDB } = getDB();
      await firebase.assertFails(
        getDoc(doc(clientDB, "userPrivate", otherUid))
      )
    })
    it('get: 未認証済みで自分のUIDと同じドキュメントIDのドキュメントはget可能', async () => {
      const { clientDB } = getDB();
      await firebase.assertSucceeds(
        getDoc(doc(clientDB, "userPrivate", uid))
      )
    })
  })
  // create
  describe('create', () => {
    it('create: 認証済みで条件を満たす場合create可能', async () => {
      const { clientDB } = getDB();
      await firebase.assertSucceeds(
        setDoc(doc(clientDB, "userPrivate", uid), { email: "123456789012345678901234567890", uid })
      )
    })
    it('create: 未認証ではcreate不可。', async () => {
      const { guestClientDB } = getDB();
      await firebase.assertFails(
        setDoc(doc(guestClientDB, "userPrivate", uid), { email: "otherEmail", uid })
      )
    })
    it('create: 認証済み。ドキュメントIDがUIDと異なる値ではcreate不可。', async () => {
      const { guestClientDB } = getDB();
      await firebase.assertFails(
        setDoc(doc(guestClientDB, "userPrivate", otherUid), { email: "otherEmail", uid })
      )
    })
    it('create: 認証済み。uidフィールドがUIDと異なる値ではcreate不可。', async () => {
      const { guestClientDB } = getDB();
      await firebase.assertFails(
        setDoc(doc(guestClientDB, "userPrivate", uid), { email: "otherEmail", uid: otherUid })
      )
    })
    it('create: 認証済み。emailが31文字以上不可。', async () => {
      const { guestClientDB } = getDB();
      await firebase.assertFails(
        setDoc(doc(guestClientDB, "userPrivate", uid), { email: "1234567890123456789012345678901", uid: uid })
      )
    })
    it('create: 認証済み。許可されたフィールど以外は不可', async () => {
      const { guestClientDB } = getDB();
      await firebase.assertFails(
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
    it('update: 認証済みで条件を満たす場合update可能', async () => {
      const { clientDB } = getDB();
      await firebase.assertSucceeds(
        updateDoc(doc(clientDB, "userPrivate", uid), { email: "changeEmail" })
      )
    })
    it('update: 未認証ではupdate不可。', async () => {
      const { guestClientDB } = getDB();
      await firebase.assertFails(
        updateDoc(doc(guestClientDB, "userPrivate", uid), { email: "changeEmail" })
      )
    })
    it('update: 認証済み。ドキュメントIDがUIDと異なる値ではupdate不可。', async () => {
      const { clientDB } = getDB();
      await firebase.assertFails(
        updateDoc(doc(clientDB, "userPrivate", otherUid), { email: "changeEmail" })
      )
    })
    it('update: 認証済み。emailが文字列出ない場合不可。', async () => {
      const { clientDB } = getDB();
      await firebase.assertFails(
        updateDoc(doc(clientDB, "userPrivate", uid), { email: 0 })
      )
    })
    it('update: 認証済み。emailが31文字以上不可。', async () => {
      const { clientDB } = getDB();
      await firebase.assertFails(
        updateDoc(doc(clientDB, "userPrivate", uid), { email: "1234567890123456789012345678901" })
      )
    })
    it('update: 認証済み。許可されたフィールド以外は不可', async () => {
      const { clientDB } = getDB();
      await firebase.assertFails(
        updateDoc(doc(clientDB, "userPrivate", uid), { email: "changeEmail", uid: "changeUID" })
      )
    })
  })
})

// topic
describe('topic collection', () => {
  // get
  describe('list', () => {
    it('list:authorizedUIDsに自分のUIDが含まれればlist可能 ', async () => {
      const { clientDB } = getDB();
      const q = query(collection(clientDB, "topic"), where("authorizedUIDs", "array-contains", uid));
      await firebase.assertSucceeds(
        getDocs(q)
      )
    })
    it('list:authorizedUIDsに自分のUIDが含まれていない可能性があるクエリはlistは不可', async () => {
      const { clientDB } = getDB();
      const q = query(collection(clientDB, "topic"));
      await firebase.assertFails(
        getDocs(q)
      )
    })
    // it('get: 未認証済みでも自分のUIDと異なるドキュメントIDのドキュメントはget不可', async () => {
    //   const { clientDB } = getDB();
    //   await firebase.assertFails(
    //     getDoc(doc(clientDB, "userPrivate", otherUid))
    //   )
    // })
    // it('get: 未認証済みで自分のUIDと同じドキュメントIDのドキュメントはget可能', async () => {
    //   const { clientDB } = getDB();
    //   await firebase.assertSucceeds(
    //     getDoc(doc(clientDB, "userPrivate", uid))
    //   )
    // })
  })
  // create
  // describe('create', () => {
  //   it('create: 認証済みで条件を満たす場合create可能', async () => {
  //     const { clientDB } = getDB();
  //     await firebase.assertSucceeds(
  //       setDoc(doc(clientDB, "userPrivate", uid), { email: "123456789012345678901234567890", uid })
  //     )
  //   })
  //   it('create: 未認証ではcreate不可。', async () => {
  //     const { guestClientDB } = getDB();
  //     await firebase.assertFails(
  //       setDoc(doc(guestClientDB, "userPrivate", uid), { email: "otherEmail", uid })
  //     )
  //   })
  //   it('create: 認証済み。ドキュメントIDがUIDと異なる値ではcreate不可。', async () => {
  //     const { guestClientDB } = getDB();
  //     await firebase.assertFails(
  //       setDoc(doc(guestClientDB, "userPrivate", otherUid), { email: "otherEmail", uid })
  //     )
  //   })
  //   it('create: 認証済み。uidフィールドがUIDと異なる値ではcreate不可。', async () => {
  //     const { guestClientDB } = getDB();
  //     await firebase.assertFails(
  //       setDoc(doc(guestClientDB, "userPrivate", uid), { email: "otherEmail", uid: otherUid })
  //     )
  //   })
  //   it('create: 認証済み。emailが31文字以上不可。', async () => {
  //     const { guestClientDB } = getDB();
  //     await firebase.assertFails(
  //       setDoc(doc(guestClientDB, "userPrivate", uid), { email: "1234567890123456789012345678901", uid: uid })
  //     )
  //   })
  //   it('create: 認証済み。許可されたフィールど以外は不可', async () => {
  //     const { guestClientDB } = getDB();
  //     await firebase.assertFails(
  //       setDoc(doc(guestClientDB, "userPrivate", uid), { email: "1234567890123456789012345678901", uid: uid, age: 20 })
  //     )
  //   })
  // })
  // // update
  // describe('update', () => {
  //   beforeEach(async () => {
  //     await testEnv.withSecurityRulesDisabled(async context => {
  //       const noRuleDB = context.firestore()
  //       await setDoc(doc(noRuleDB, "userPrivate", uid), { email: "authEmail", uid })
  //     })
  //   })
  //   it('update: 認証済みで条件を満たす場合update可能', async () => {
  //     const { clientDB } = getDB();
  //     await firebase.assertSucceeds(
  //       updateDoc(doc(clientDB, "userPrivate", uid), { email: "changeEmail" })
  //     )
  //   })
  //   it('update: 未認証ではupdate不可。', async () => {
  //     const { guestClientDB } = getDB();
  //     await firebase.assertFails(
  //       updateDoc(doc(guestClientDB, "userPrivate", uid), { email: "changeEmail" })
  //     )
  //   })
  //   it('update: 認証済み。ドキュメントIDがUIDと異なる値ではupdate不可。', async () => {
  //     const { clientDB } = getDB();
  //     await firebase.assertFails(
  //       updateDoc(doc(clientDB, "userPrivate", otherUid), { email: "changeEmail" })
  //     )
  //   })
  //   it('update: 認証済み。emailが文字列出ない場合不可。', async () => {
  //     const { clientDB } = getDB();
  //     await firebase.assertFails(
  //       updateDoc(doc(clientDB, "userPrivate", uid), { email: 0 })
  //     )
  //   })
  //   it('update: 認証済み。emailが31文字以上不可。', async () => {
  //     const { clientDB } = getDB();
  //     await firebase.assertFails(
  //       updateDoc(doc(clientDB, "userPrivate", uid), { email: "1234567890123456789012345678901" })
  //     )
  //   })
  //   it('update: 認証済み。許可されたフィールド以外は不可', async () => {
  //     const { clientDB } = getDB();
  //     await firebase.assertFails(
  //       updateDoc(doc(clientDB, "userPrivate", uid), { email: "changeEmail", uid: "changeUID" })
  //     )
  //   })
  // })
})
