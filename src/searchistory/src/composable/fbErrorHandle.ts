const fbErrorHandle = (errorMessage: string) => {

  const permissionReg = /insufficient permissions./;
  const invalidEmailReg = /invalid-email/;
  const missingEmail = /missing-email/;
  const userNotFoundReg = /user-not-found/;
  const wrongPasswordReg = /wrong-password/;
  const weakPassword = /weak-password/;

  if (permissionReg.test(errorMessage)) {
    alert(`アクセスする権限がありません。(${errorMessage})`);
  } else if (invalidEmailReg.test(errorMessage)
    || userNotFoundReg.test(errorMessage)
    || missingEmail.test(errorMessage)) {
    alert(`メールアドレスが正しくありません。(${errorMessage})`);
  } else if (wrongPasswordReg.test(errorMessage)) {
    alert(`パスワードが正しくありません。(${errorMessage})`);
  } else if (weakPassword.test(errorMessage)) {
    alert(`パスワードは6文字以上で入力してください。(${errorMessage})`);
  } else {
    alert(`エラーが発生しました。(${errorMessage})`);
  }
}
export { fbErrorHandle };
