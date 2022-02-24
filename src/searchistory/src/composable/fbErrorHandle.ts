const fbErrorHandle = (errorMessage: string) => {

  const permissionReg = /insufficient permissions./;
  const invalidEmailReg = /invalid-email/;
  const missingEmailReg = /missing-email/;
  const userNotFoundReg = /user-not-found/;
  const wrongPasswordReg = /wrong-password/;
  const weakPasswordReg = /weak-password/;

  if (permissionReg.test(errorMessage)) {
    alert(`アクセスする権限がありません。`);
  } else if (invalidEmailReg.test(errorMessage)
    || userNotFoundReg.test(errorMessage)
    || missingEmailReg.test(errorMessage)) {
    console.log(errorMessage);
    alert(`メールアドレスが正しくありません。`);
  } else if (wrongPasswordReg.test(errorMessage)) {
    console.log(console.error);
    alert(`パスワードが正しくありません。`);
  } else if (weakPasswordReg.test(errorMessage)) {
    console.log(console.error);
    alert(`パスワードは6文字以上で入力してください。`);
  } else {
    console.log(console.error);
    alert(`エラーが発生しました。(${errorMessage})`);
  }
}
export { fbErrorHandle };
