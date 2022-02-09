import * as fs from 'fs'
import { v4 } from "uuid"
import * as firebase from '@firebase/rules-unit-testing'

// // Firebase JS SDKのserverTimestampを使う
import { serverTimestamp as st, doc, collection, setDoc, getDoc, updateDoc } from 'firebase/firestore'
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

// describe('users collection', () => {
//   it('create: 自身のドキュメントなら作成できる', async () => {
//     const uid = v4()
//     const db = testEnv.authenticatedContext(uid).firestore()
//     await firebase.assertSucceeds(
//       setDoc(doc(db, "users", uid), { capital: true }, { merge: true })
//       // db.doc(`users/${uid}`)
//       // .set({
//       //   createdAt: serverTimestamp(),
//       //   updatedAt: serverTimestamp(),
//       // })
//     )
//   })

//   // it('create: 他人のドキュメントには作成できない', async () => {
//   //   // 別人としてcontextを作成
//   //   const context = testEnv.authenticatedContext(v4())

//   //   const uid = v4()
//   //   await firebase.assertFails(
//   //     context.firestore().doc(`users/${uid}`).set({
//   //       createdAt: serverTimestamp(),
//   //       updatedAt: serverTimestamp(),
//   //     })
//   //   )
//   // })

//   // it('create: 未認証だと作成できない', async () => {
//   //   const context = testEnv.unauthenticatedContext()
//   //   await firebase.assertFails(
//   //     context.firestore().doc(`users/${v4()}`).set({
//   //       createdAt: serverTimestamp(),
//   //       updatedAt: serverTimestamp(),
//   //     })
//   //   )
//   // })

//   // it('update: 自分のデータは編集できる', async () => {
//   //   const uid = v4()

//   //   // データの事前準備はルール向こうのコンテキストを使って行う
//   //   await testEnv.withSecurityRulesDisabled(async context => {
//   //     await context.firestore().doc(`users/${uid}`).set({
//   //       createdAt: serverTimestamp(),
//   //       updatedAt: serverTimestamp(),
//   //     })
//   //   })

//   //   const context = testEnv.authenticatedContext(uid)
//   //   await firebase.assertSucceeds(
//   //     context.firestore().doc(`users/${uid}`).set({
//   //       updatedAt: serverTimestamp(),
//   //     }, { merge: true })
//   //   )
//   // })
// })
  // it('read: 認証だと読み取りできる', async () => {
  //   const db = testEnv.authenticatedContext("authUID").firestore

  //   await firebase.assertSucceeds(doc(db, "user", "authUID"))
  //   // await firebase.assertFails(
  //   //   context.firestore().doc(`users/${v4()}`).set({
  //   //     createdAt: serverTimestamp(),
  //   //     updatedAt: serverTimestamp(),
  //   //   })
  //   // )
  // })
// })
  // it('create: 自身のドキュメントなら作成できる', async () => {
  //   const uid = v4()
  //   const context = testEnv.authenticatedContext(uid)
  //   await firebase.assertSucceeds(
  //     context.firestore().doc(`users/${uid}`).set({
  //       createdAt: serverTimestamp(),
  //       updatedAt: serverTimestamp(),
  //     })
  //   )
  // })

//   it('create: 他人のドキュメントには作成できない', async () => {
//     // 別人としてcontextを作成
//     const context = testEnv.authenticatedContext(v4())

//     const uid = v4()
//     await firebase.assertFails(
//       context.firestore().doc(`users/${uid}`).set({
//         createdAt: serverTimestamp(),
//         updatedAt: serverTimestamp(),
//       })
//     )
//   })

//   it('create: 未認証だと作成できない', async () => {
//     const context = testEnv.unauthenticatedContext()
//     await firebase.assertFails(
//       context.firestore().doc(`users/${v4()}`).set({
//         createdAt: serverTimestamp(),
//         updatedAt: serverTimestamp(),
//       })
//     )
//   })

//   it('update: 自分のデータは編集できる', async () => {
//     const uid = v4()

//     // データの事前準備はルール向こうのコンテキストを使って行う
//     await testEnv.withSecurityRulesDisabled(async context => {
//       await context.firestore().doc(`users/${uid}`).set({
//         createdAt: serverTimestamp(),
//         updatedAt: serverTimestamp(),
//       })
//     })

//     const context = testEnv.authenticatedContext(uid)
//     await firebase.assertSucceeds(
//       context.firestore().doc(`users/${uid}`).set({
//         updatedAt: serverTimestamp(),
//       }, { merge: true })
//     )
//   })
// })



// // import { v4 as randomString } from 'uuid'
// // import * as firebase from '@firebase/rules-unit-testing'

// // const projectId = randomString()

// // // テストプロジェクト環境の作成
// // const testEnv = firebase.initializeTestEnvironment({
// //   projectId,
// //   firestore: {
// //     rules: fs.readFileSync('./firestore.rules', 'utf8')
// //   }
// // })

// // // ログイン情報つきのContextを作成し、そこから Firestore インスタンスを得る
// // const authenticatedContext = testEnv.authenticatedContext('uid string')
// // const clientDB = authenticatedContext.firestore()

// // // ゲストContextを作成し、そこから Firestore インスタンスを得る
// // const unauthenticatedContext = testEnv.unauthenticatedContext()
// // const guestClientDB = unauthenticatedContext.firestore()

// // // ルールをバイパスしたContextを作成し、そこから Firestore インスタンスを得る
// // await testEnv.withSecurityRulesDisabled(async context => {
// //   // v1での adminDB のように振る舞えるDB。実態としては Client SDK からのルールが適用されない Firestore インスタンス。
// //   const noRuleDB = context.firestore()
// //   // 事前データの作成など
// // })

// // // Firestoreのデータ削除
// // await testEnv.clearFirestore()

// import * as fs from 'fs'
// import * as firebase from '@firebase/rules-unit-testing'

// import { getDoc, setDoc, updateDoc } from "firebase/firestore";

// const initEnv = () => {
//   return firebase.initializeTestEnvironment({
//     projectId: "demo-project-1234",
//     firestore: {
//       rules: fs.readFileSync("firestore.rules", "utf8"),
//       port: 8080,
//       host: "localhost"
//     }
//   });
// }

// describe("userコレクションテスト", () => {
//   // 読み取り
//   it("未認証ユーザーは読み取り不可", async () => {
//     const testEnv = await initEnv();
//     const unauthenticatedUser = testEnv.unauthenticatedContext();
//     const db = unauthenticatedUser.firestore();
//     const clientUserRef = db.collection('user').doc("unauthenticatedUID")
//     await firebase.assertFails(getDoc(clientUserRef));
//     await testEnv.cleanup()
//   })
//   it("認証済みユーザーは読み取り可能", async () => {
//     const testEnv = await initEnv();
//     const authenticatedUser = testEnv.authenticatedContext("authenticatedUID");
//     const db = authenticatedUser.firestore()
//     const clientUserRef = db.collection('user').doc("authenticatedUID")
//     await firebase.assertSucceeds(getDoc(clientUserRef));
//     await testEnv.cleanup()
//   })
//   // 作成 // 更新
//   it("未認証ユーザーは作成不可3", async () => {
//     const testEnv = await initEnv();
//     const unauthenticatedContext = testEnv.unauthenticatedContext();
//     const db = unauthenticatedContext.firestore();
//     const clientUserRef = db.collection('user').doc("unauthenticatedUID")
//     await firebase.assertFails(setDoc(clientUserRef, { uid: "unauthenticatedUID" }));
//     await testEnv.cleanup()

//   })
//   it("ログインユーザーのUIDと同じドキュメントIDで作成可能", async () => {
//     const testEnv = await initEnv();
//     const authenticatedUser = testEnv.authenticatedContext("authenticatedUID");
//     const db = authenticatedUser.firestore();
//     const clientUserRef = db.collection('user').doc("authenticatedUID")
//     await firebase.assertSucceeds(setDoc(clientUserRef, { name: "name", uid: "authenticatedUID" }));
//     await testEnv.cleanup()

//   })
//   it("ログインユーザーのUIDと異なるドキュメントIDで作成不可", async () => {
//     const testEnv = await initEnv();
//     const authenticatedUser = testEnv.authenticatedContext("authenticatedUID");
//     const db = authenticatedUser.firestore();
//     const clientUserRef = db.collection('user').doc("otherUID")
//     await firebase.assertFails(setDoc(clientUserRef, { uid: "authenticatedUID" }));
//     await testEnv.cleanup()

//   })
//   it("ログインユーザーのUIDと同じ値のみuidフィールドに作成可能", async () => {
//     const testEnv = await initEnv();
//     const authenticatedUser = testEnv.authenticatedContext("authenticatedUID");
//     const db = authenticatedUser.firestore();
//     const clientUserRef = db.collection('user').doc("authenticatedUID")
//     await firebase.assertSucceeds(setDoc(clientUserRef, { name: "authenticatedName", uid: "authenticatedUID" }));
//     await testEnv.cleanup()

//   })
//   it("ログインユーザーのUIDと異なる値はuidフィールドに作成不可", async () => {
//     const testEnv = await initEnv();
//     const authenticatedUser = testEnv.authenticatedContext("authenticatedUID");
//     const db = authenticatedUser.firestore();
//     const clientUserRef = db.collection('user').doc("authenticatedUID")
//     await firebase.assertFails(setDoc(clientUserRef, { uid: "otherUID" }));
//     await testEnv.cleanup()

//   })
//   it("nameとuidフィールドは作成可能", async () => {
//     const testEnv = await initEnv();
//     const authenticatedUser = testEnv.authenticatedContext("authenticatedUID");
//     const db = authenticatedUser.firestore();
//     const clientUserRef = db.collection('user').doc("authenticatedUID")
//     await firebase.assertSucceeds(setDoc(clientUserRef, { name: "authenticatedName", uid: "authenticatedUID" }));
//     await testEnv.cleanup()

//   })
//   it("nameとuidフィールド以外のフィールドは作成不可", async () => {
//     const testEnv = await initEnv();
//     const authenticatedUser = testEnv.authenticatedContext("authenticatedUID");
//     const db = authenticatedUser.firestore();
//     const clientUserRef = db.collection('user').doc("authenticatedUID")
//     await firebase.assertFails(setDoc(clientUserRef, { email: "authenticatedEmail", name: "authenticatedName", uid: "authenticatedUID" }));
//     await testEnv.cleanup()

//   })
//   it("nameが文字列以外は不可", async () => {
//     const testEnv = await initEnv();
//     const authenticatedUser = testEnv.authenticatedContext("authenticatedUID");
//     const db = authenticatedUser.firestore();
//     const clientUserRef = db.collection('user').doc("authenticatedUID")
//     await firebase.assertFails(setDoc(clientUserRef, { name: 0, uid: "authenticatedUID" }));
//     await testEnv.cleanup()

//   })
//   it("nameが文字列以外は不可", async () => {
//     const testEnv = await initEnv();
//     const authenticatedUser = testEnv.authenticatedContext("authenticatedUID");
//     const db = authenticatedUser.firestore();
//     const clientUserRef = db.collection('user').doc("authenticatedUID")
//     await firebase.assertFails(setDoc(clientUserRef, { name: 0, uid: "authenticatedUID" }));
//     await testEnv.cleanup()

//   })
//   it("nameが21文字以上は不可", async () => {
//     const testEnv = await initEnv();
//     const authenticatedUser = testEnv.authenticatedContext("authenticatedUID");
//     const db = authenticatedUser.firestore();
//     const clientUserRef = db.collection('user').doc("authenticatedUID")
//     await firebase.assertFails(setDoc(clientUserRef, { name: "123456789012345678901", uid: "authenticatedUID" }));
//     await testEnv.cleanup()

//   })
//   it("nameが20文字以下は可能", async () => {
//     const testEnv = await initEnv();
//     const authenticatedUser = testEnv.authenticatedContext("authenticatedUID");
//     const db = authenticatedUser.firestore();
//     const clientUserRef = db.collection('user').doc("authenticatedUID")
//     await firebase.assertSucceeds(setDoc(clientUserRef, { name: "12345678901234567890", uid: "authenticatedUID" }));
//     await testEnv.cleanup()
//   })
//   afterAll(async () => await testEnv.cleanup())
// })

// describe("userPrivateコレクションテスト", () => {
//   it("未認証ユーザーは読み取り不可", async () => {
//     const testEnv = await initEnv();
//     const unauthenticatedUser = testEnv.unauthenticatedContext();
//     const db = unauthenticatedUser.firestore();
//     const clientUserRef = db.collection('userPrivate').doc("unauthenticatedUID")
//     await firebase.assertFails(getDoc(clientUserRef));
//   })
//   it("認証済みユーザーは自分のドキュメントを読み取り可能", async () => {
//     const testEnv = await initEnv();
//     const authenticatedUser = testEnv.authenticatedContext("authenticatedUID");
//     const db = authenticatedUser.firestore()
//     const clientUserRef = db.collection('userPrivate').doc("authenticatedUID")
//     await firebase.assertSucceeds(getDoc(clientUserRef));
//   })
//   it("他人のドキュメントは取得不可", async () => {
//     const testEnv = await initEnv();
//     const authenticatedUser = testEnv.authenticatedContext("authenticatedUID");
//     const db = authenticatedUser.firestore()
//     const clientUserRef = db.collection('userPrivate').doc("anotherUID")
//     await firebase.assertFails(getDoc(clientUserRef));
//   })
//   //   // 作成 // 更新
//   it("未認証ユーザーは作成不可", async () => {
//     const testEnv = await initEnv();
//     const unauthenticatedContext = testEnv.unauthenticatedContext();
//     const db = unauthenticatedContext.firestore();
//     const clientUserRef = db.collection('userPrivate').doc("unauthenticatedUID")
//     await firebase.assertFails(setDoc(clientUserRef, { uid: "unauthenticatedUID" }));
//   })
//   it("ログインユーザーのUIDと同じドキュメントIDで作成可能", async () => {
//     const testEnv = await initEnv();
//     const authenticatedUser = testEnv.authenticatedContext("authenticatedUI");
//     const db = authenticatedUser.firestore();
//     const clientUserRef = db.collection('userPrivate').doc("authenticatedUI")
//     await firebase.assertSucceeds(setDoc(clientUserRef, { email: "authenticatedEmail", uid: "authenticatedUI" }));
//   })
//   it("ログインユーザーのUIDと異なるドキュメントIDで作成不可", async () => {
//     const testEnv = await initEnv();
//     const authenticatedUser = testEnv.authenticatedContext("authenticatedUID");
//     const db = authenticatedUser.firestore();
//     const clientUserRef = db.collection('userPrivate').doc("otherUID")
//     await firebase.assertFails(setDoc(clientUserRef, { email: "authenticatedEmail", uid: "authenticatedUID" }));
//   })
//   it("ログインユーザーのUIDと同じ値のみuidフィールドに作成可能", async () => {
//     const testEnv = await initEnv();
//     const authenticatedUser = testEnv.authenticatedContext("authenticatedUID");
//     const db = authenticatedUser.firestore();
//     const clientUserRef = db.collection('userPrivate').doc("authenticatedUID")
//     await firebase.assertSucceeds(setDoc(clientUserRef, { email: "authenticatedEmail", uid: "authenticatedUID" }));
//   })
//   it("ログインユーザーのUIDと異なる値はuidフィールドに作成不可", async () => {
//     const testEnv = await initEnv();
//     const authenticatedUser = testEnv.authenticatedContext("authenticatedUID");
//     const db = authenticatedUser.firestore();
//     const clientUserRef = db.collection('userPrivate').doc("authenticatedUID")
//     await firebase.assertFails(setDoc(clientUserRef, { email: "authenticatedEmail", uid: "otherUID" }));
//   })
//   it("emailとuidフィールドは作成可能", async () => {
//     const testEnv = await initEnv();
//     const authenticatedUser = testEnv.authenticatedContext("authenticatedUID");
//     const db = authenticatedUser.firestore();
//     const clientUserRef = db.collection('userPrivate').doc("authenticatedUID")
//     await firebase.assertSucceeds(setDoc(clientUserRef, { email: "authenticatedEmail", uid: "authenticatedUID" }));
//   })
//   it("nameとuidフィールド以外のフィールドは作成不可", async () => {
//     const testEnv = await initEnv();
//     const authenticatedUser = testEnv.authenticatedContext("authenticatedUID");
//     const db = authenticatedUser.firestore();
//     const clientUserRef = db.collection('userPrivate').doc("authenticatedUID")
//     await firebase.assertFails(setDoc(clientUserRef, { name: "authenticatedName", email: "authenticatedEmail", uid: "authenticatedUID" }));
//   })
//   it("emailが文字列以外は不可", async () => {
//     const testEnv = await initEnv();
//     const authenticatedUser = testEnv.authenticatedContext("authenticatedUID");
//     const db = authenticatedUser.firestore();
//     const clientUserRef = db.collection('userPrivate').doc("authenticatedUID")
//     await firebase.assertFails(setDoc(clientUserRef, { email: 0, uid: "authenticatedUID" }));
//   })
//   it("emailが51文字以上は不可", async () => {
//     const testEnv = await initEnv();
//     const authenticatedUser = testEnv.authenticatedContext("authenticatedUID");
//     const db = authenticatedUser.firestore();
//     const clientUserRef = db.collection('userPrivate').doc("authenticatedUID")
//     await firebase.assertFails(setDoc(clientUserRef, { email: "123456789012345678901234567890123456789012345678901", uid: "authenticatedUID" }));
//   })
//   it("emailが50文字以下は可能", async () => {
//     const testEnv = await initEnv();
//     const authenticatedUser = testEnv.authenticatedContext("authenticatedUID");
//     const db = authenticatedUser.firestore();
//     const clientUserRef = db.collection('userPrivate').doc("authenticatedUID")
//     await firebase.assertSucceeds(setDoc(clientUserRef, { email: "12345678901234567890123456789012345678901234567890", uid: "authenticatedUID" }));
//   })
//   //   beforeEach(async () => await testEnv.cleanup())
//   //   afterAll(async () => await testEnv.cleanup())
// })

// describe("topicコレクションテスト", () => {
//   it("ダミーデータを作成する。", async () => {
//     const testEnv = await initEnv();
//     await testEnv.withSecurityRulesDisabled(async context => {
//       const noRuleDB = context.firestore()
//       const clientUserRef = noRuleDB.collection('topic').doc("testTopicDoc")
//       await firebase.assertSucceeds(setDoc(clientUserRef, {
//         authorizedUIDs: ["testUserUID1", "testUserUID2"]
//       }))
//     })
//   })
//   it("未認証ユーザーは読み取り不可", async () => {
//     const testEnv = await initEnv();
//     const unauthenticatedContext = testEnv.unauthenticatedContext();
//     const db = unauthenticatedContext.firestore();
//     const clientUserRef = db.collection('topic').doc("topic1")
//     await firebase.assertFails(getDoc(clientUserRef));
//   })
  // // 書き込み
  // it("未認証ユーザーは書き込み不可", async () => {
  //   const testEnv = await initEnv();
  //   const unauthenticatedContext = testEnv.unauthenticatedContext();
  //   const db = unauthenticatedContext.firestore();
  //   const clientUserRef = db.collection('user').doc("unauthenticatedContext")
  //   await firebase.assertFails(setDoc(clientUserRef, { uid: "unauthenticatedContext" }));
  // })
  // it("ログインユーザーのUIDと同じドキュメントIDで書き込み可能", async () => {
  //   const testEnv = await initEnv();
  //   const authenticatedUser = testEnv.authenticatedContext("authenticatedUser");
  //   const db = authenticatedUser.firestore();
  //   const clientUserRef = db.collection('user').doc("authenticatedUser")
  //   await firebase.assertSucceeds(setDoc(clientUserRef, { uid: "authenticatedUser" }));
  // })
  // it("ログインユーザーのUIDと異なるドキュメントIDで書き込み不可", async () => {
  //   const testEnv = await initEnv();
  //   const authenticatedUser = testEnv.authenticatedContext("authenticatedUser");
  //   const db = authenticatedUser.firestore();
  //   const clientUserRef = db.collection('user').doc("otherUID")
  //   await firebase.assertFails(setDoc(clientUserRef, { uid: "authenticatedUser" }));
  // })
  // it("ログインユーザーのUIDと同じ値のみuidフィールドに書き込み可能", async () => {
  //   const testEnv = await initEnv();
  //   const authenticatedUser = testEnv.authenticatedContext("authenticatedUser");
  //   const db = authenticatedUser.firestore();
  //   const clientUserRef = db.collection('user').doc("authenticatedUser")
  //   await firebase.assertSucceeds(setDoc(clientUserRef, { uid: "authenticatedUser" }));
  // })
  // it("ログインユーザーのUIDと異なる値はuidフィールドに書き込み不可", async () => {
  //   const testEnv = await initEnv();
  //   const authenticatedUser = testEnv.authenticatedContext("authenticatedUser");
  //   const db = authenticatedUser.firestore();
  //   const clientUserRef = db.collection('user').doc("authenticatedUser")
  //   await firebase.assertFails(setDoc(clientUserRef, { uid: "otherUID" }));
  // })
  // beforeEach(async () => await testEnv.cleanup())
  // afterAll(async () => await testEnv.cleanup())
// })
