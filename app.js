async function login() {

  const email =
    document.getElementById('emailInput')
      .value
      .trim();

  if (!email) {
    alert('请输入邮箱');
    return;
  }

  const msg =
    document.getElementById('loginMsg');

  msg.innerHTML = '发送中...';

  const { error } =
    await supabaseClient.auth.signInWithOtp({
      email
    });

  if (error) {
    msg.innerHTML =
      '发送失败：' + error.message;
    return;
  }

  msg.innerHTML =
    '登录链接已发送，请查看邮箱';
}

async function checkLogin() {

  const {
    data: { session }
  } =
  await supabaseClient.auth.getSession();

  if (!session) return;

  document
    .getElementById('loginPage')
    .classList.add('hidden');

  document
    .getElementById('dashboard')
    .classList.remove('hidden');

  document
    .getElementById('userEmail')
    .innerText =
      session.user.email;
}

checkLogin();
