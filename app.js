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
await loadProfile();
await loadLatestWeight();
await loadLatestWaist();
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

async function addWaist() {

  const value =
    prompt('请输入腰围(cm)');

  if (!value) return;

  const waist =
    parseFloat(value);

  if (isNaN(waist)) {
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
      .from('measurements')
      .insert([
        {
          user_id: user.id,
          record_date: today,
          waist
        }
      ]);

  if (error) {
    alert(error.message);
    return;
  }

  alert('腰围已保存');

  await loadLatestWaist();
}

async function loadLatestWaist() {

  const {
    data: { user }
  } =
  await supabaseClient.auth.getUser();

  const { data } =
    await supabaseClient
      .from('measurements')
      .select('*')
      .eq('user_id', user.id)
      .order('record_date', {
        ascending:false
      })
      .limit(1);

  if (!data || !data.length)
    return;

  document
    .getElementById('currentWaist')
    .innerText =
      data[0].waist + 'cm';

  calculateBodyFat(data[0].waist);
  calculateWHtR(data[0].waist);
}

function calculateBodyFat(waist) {

  const weightText =
    document
      .getElementById('currentWeight')
      .innerText;

  const weight =
    parseFloat(weightText);

  if (!weight || !waist)
    return;

  const height = 174;
  const age = 38;

  const bmi =
    weight /
    Math.pow(height/100,2);

  const bodyFat =
    (1.2 * bmi)
    + (0.23 * age)
    - 16.2;

  document
    .getElementById('bodyFat')
    .innerText =
      bodyFat.toFixed(1) + '%';
}

let profile = null;

async function loadProfile() {

  const {
    data: { user }
  } =
  await supabaseClient.auth.getUser();

  const { data } =
    await supabaseClient
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

  profile = data;
}

function calculateWHtR(waist) {

  if (!profile) return;

  const whtr =
    waist / profile.height_cm;

  document
    .getElementById('whtr')
    .innerText =
      whtr.toFixed(2);
}
