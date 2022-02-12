const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp()

exports.fetchBookInfo = functions.https.onRequest(async (request, response) => {
  // GETリクエストじゃない場合
  if (request.method !== 'GET') {
    response.status(400).send("リクエストタイプが不正です")
  }

  // クエリがない場合
  // ※本来はこれに加えてISBN番号の形式ではないものは受け付けないように、バリデーションをする必要があります
  const query = request.query.isbn
  if (query === undefined) {
    response.status(400).send("クエリが不正です")
  }

  try {
    const db = admin.firestore()
    const doc = await db.collection('books').doc(query).get()

    const bookInfo = doc.data()
    response.send(bookInfo)
  } catch (e) {
    console.error(e);
    response.status(500).send(e)
  }
});

exports.addBookInfo = functions.https.onRequest(async (request, response) => {
  // POSTリクエストじゃない場合
  if (request.method !== 'POST') {
    response.status(400).send("リクエストタイプが不正です")
  }

  // bodyがない場合
  // ※本来はこれに加えて各値の、バリデーションをする必要があります
  const body = request.body
  if (body === undefined) {
    response.status(400).send("bodyの中身が不正です")
  }

  const isbn = Object.keys(body)[0]
  const bookInfo = body[isbn]

  try {
    const db = admin.firestore()
    await db.collection('books').doc(isbn).set({ bookInfo }, { merge: true })

    response.send("Complete")
  } catch (e) {
    console.error(e);
    response.status(500).send(e)
  }
});

exports.onBookWrite = functions.firestore.document('books/{isbn}').onWrite(async (change, context) => {
  // 変更されたときはafterに変更後の値が入る
  const document = change.after.exists ? change.after.data() : null;
  const oldDocument = change.before.data();

  console.log('【Firestore変更】');
  console.log(document);
  console.log(oldDocument);
})
