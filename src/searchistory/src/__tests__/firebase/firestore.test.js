// import { v4 as randomString } from 'uuid'
// import * as firebase from '@firebase/rules-unit-testing'

// const projectId = randomString()

// // テストプロジェクト環境の作成
// const testEnv = firebase.initializeTestEnvironment({
//   projectId,
//   firestore: {
//     rules: fs.readFileSync('./firestore.rules', 'utf8')
//   }
// })

// // ログイン情報つきのContextを作成し、そこから Firestore インスタンスを得る
// const authenticatedContext = testEnv.authenticatedContext('uid string')
// const clientDB = authenticatedContext.firestore()

// // ゲストContextを作成し、そこから Firestore インスタンスを得る
// const unauthenticatedContext = testEnv.unauthenticatedContext()
// const guestClientDB = unauthenticatedContext.firestore()

// // ルールをバイパスしたContextを作成し、そこから Firestore インスタンスを得る
// await testEnv.withSecurityRulesDisabled(async context => {
//   // v1での adminDB のように振る舞えるDB。実態としては Client SDK からのルールが適用されない Firestore インスタンス。
//   const noRuleDB = context.firestore()
//   // 事前データの作成など
// })

// // Firestoreのデータ削除
// await testEnv.clearFirestore()

import * as fs from 'fs'
import * as firebase from '@firebase/rules-unit-testing'

import { getDoc, setDoc } from "firebase/firestore";

const initEnv = () => {
  return firebase.initializeTestEnvironment({
    projectId: "demo-project-1234",
    firestore: {
      rules: fs.readFileSync("firestore.rules", "utf8"),
      host: "localhost",
      port: "8080",
    },
  });
}

describe("userコレクションテスト", () => {
  // 読み取り
  it("認証済みユーザーは読み取り可能", async () => {
    const testEnv = await initEnv();
    const authenticatedUser = testEnv.authenticatedContext("authenticatedUser");
    const db = authenticatedUser.firestore()
    const clientUserRef = db.collection('user').doc("authenticatedUser")
    await firebase.assertSucceeds(getDoc(clientUserRef));
  })
  it("未認証ユーザーは読み取り不可", async () => {
    const testEnv = await initEnv();
    const unauthenticatedContext = testEnv.unauthenticatedContext();
    const db = unauthenticatedContext.firestore();
    const clientUserRef = db.collection('user').doc("unauthenticatedContext")
    await firebase.assertFails(getDoc(clientUserRef));
  })
  // 書き込み
  it("未認証ユーザーは作成不可", async () => {
    const testEnv = await initEnv();
    const unauthenticatedContext = testEnv.unauthenticatedContext();
    const db = unauthenticatedContext.firestore();
    const clientUserRef = db.collection('user').doc("unauthenticatedContext")
    await firebase.assertFails(setDoc(clientUserRef, { uid: "unauthenticatedContext" }));
  })
  it("ログインユーザーのUIDと同じドキュメントIDで作成可能", async () => {
    const testEnv = await initEnv();
    const authenticatedUser = testEnv.authenticatedContext("authenticatedUser");
    const db = authenticatedUser.firestore();
    const clientUserRef = db.collection('user').doc("authenticatedUser")
    await firebase.assertSucceeds(setDoc(clientUserRef, { uid: "authenticatedUser" }));
  })
  it("ログインユーザーのUIDと異なるドキュメントIDで作成不可", async () => {
    const testEnv = await initEnv();
    const authenticatedUser = testEnv.authenticatedContext("authenticatedUser");
    const db = authenticatedUser.firestore();
    const clientUserRef = db.collection('user').doc("otherUID")
    await firebase.assertFails(setDoc(clientUserRef, { uid: "authenticatedUser" }));
  })
  it("ログインユーザーのUIDと同じ値のみuidフィールドに作成可能", async () => {
    const testEnv = await initEnv();
    const authenticatedUser = testEnv.authenticatedContext("authenticatedUser");
    const db = authenticatedUser.firestore();
    const clientUserRef = db.collection('user').doc("authenticatedUser")
    await firebase.assertSucceeds(setDoc(clientUserRef, { uid: "authenticatedUser" }));
  })
  it("ログインユーザーのUIDと異なる値はuidフィールドに作成不可", async () => {
    const testEnv = await initEnv();
    const authenticatedUser = testEnv.authenticatedContext("authenticatedUser");
    const db = authenticatedUser.firestore();
    const clientUserRef = db.collection('user').doc("authenticatedUser")
    await firebase.assertFails(setDoc(clientUserRef, { uid: "otherUID" }));
  })
  // beforeEach(async () => await testEnv.cleanup())
  // afterAll(async () => await testEnv.cleanup())
})

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
