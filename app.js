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

  await loadLatestWeight();
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

async function addWeight() {

  const value =
    prompt('请输入体重(kg)');

  if (!value) return;

  const weight =
    parseFloat(value);

  if (isNaN(weight)) {
    alert('请输入数字');
    return;
  }

  const {
    data: { user }
  } =
  await supabaseClient.auth.getUser();

  const today =
    new Date()
      .toISOString()
      .split('T')[0];

  const { error } =
    await supabaseClient
      .from('weights')
      .insert([
        {
          user_id: user.id,
          record_date: today,
          weight
        }
      ]);

  if (error) {
    alert(error.message);
    return;
  }

  alert('体重已保存');

  await loadLatestWeight();
}

async function loadLatestWeight() {

  const {
    data: { user }
  } =
  await supabaseClient.auth.getUser();

  const { data } =
    await supabaseClient
      .from('weights')
      .select('*')
      .eq('user_id', user.id)
      .order('record_date', {
        ascending:false
      })
      .limit(1);

  if (!data || !data.length)
    return;

  document
    .getElementById('currentWeight')
    .innerText =
      data[0].weight + 'kg';
}
