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
      email,
      options: {
        emailRedirectTo: window.location.origin
      }
    });

  if (error) {
    msg.innerHTML =
      '发送失败：' + error.message;
    return;
  }

  msg.innerHTML =
    '登录链接已发送，请查看邮箱';
}

async function loadDashboard(session) {

  const loginPage =
    document.getElementById('loginPage');

  const dashboard =
    document.getElementById('dashboard');

  loginPage.style.display = 'none';

  dashboard.style.display = 'block';

  document
    .getElementById('userEmail')
    .innerText =
      session.user.email;
}

supabaseClient.auth.onAuthStateChange(
  async (event, session) => {

    if (session) {
      await loadDashboard(session);
    }
  }
);

(async () => {
  const {
    data: { session }
  } =
  await supabaseClient.auth.getSession();

  if (session) {
    await loadDashboard(session);
  }
})();
