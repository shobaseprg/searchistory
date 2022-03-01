import { getAuth, signOut } from 'firebase/auth';
const auth = getAuth();

const fbErrorHandle = (errorMessage: string) => {

  const permissionReg = /insufficient permissions./;
  const invalidEmailReg = /invalid-email/;
  const missingEmailReg = /missing-email/;
  const emailAlreadyInUse = /email-already-in-use/;
  const userNotFoundReg = /user-not-found/;
  const wrongPasswordReg = /wrong-password/;
  const weakPasswordReg = /weak-password/;
  const requiresRecentLoginReg = /requires-recent-login/;

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
  } else if (emailAlreadyInUse.test(errorMessage)) {
    console.log(console.error);
    alert(`そのメールアドレスは既に存在しています。`);
  } else if (weakPasswordReg.test(errorMessage)) {
    console.log(console.error);
    alert(`パスワードは6文字以上で入力してください。`);
  } else if (requiresRecentLoginReg.test(errorMessage)) {
    console.log(console.error);
    alert(`エラーが発生しました。前回ログインから一定期間が経過していますので、再度ログインして下さい。`);
    signOut(auth).then(() => {
      location.reload()
    });
  } else {
    console.log(console.error);
    alert(`エラーが発生しました。(${errorMessage})`);
  }
}
export { fbErrorHandle };
