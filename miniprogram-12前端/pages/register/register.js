// miniprogram/pages/register/register.js
const util = require('../../utils/util.js');

Page({
  data: { username: "", password: "", password2: "" },

  onUsernameInput(e) { this.setData({ username: e.detail.value }); },
  onPasswordInput(e) { this.setData({ password: e.detail.value }); },
  onPassword2Input(e) { this.setData({ password2: e.detail.value }); },

  doRegister() {
    const { username, password, password2 } = this.data;
    if (!username || !password || !password2) { wx.showToast({ title: '请输入完整信息', icon: 'none' }); return; }
    if (password !== password2) { wx.showToast({ title: '两次密码不一致', icon: 'none' }); return; }

    util.request('/auth/register', 'POST', { username, password })
      .then(data => {
        wx.showToast({ title: (data.msg || '注册成功'), icon: 'success' });
        setTimeout(() => { wx.navigateTo({ url: '/pages/login/login' }); }, 600);
      })
      .catch(err => {
        if (err && err.data) { wx.showToast({ title: err.data.error || '注册失败', icon: 'none' }); }
        else { wx.showToast({ title: '服务器连接失败', icon: 'none' }); }
      });
  },

  goLogin() { wx.navigateTo({ url: '/pages/login/login' }); }
});
