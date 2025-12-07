// miniprogram/pages/login/login.js
const util = require('../../utils/util.js');

Page({
  data: {
    username: "",
    password: ""
  },

  onUsernameInput(e) {
    this.setData({ username: e.detail.value });
  },

  onPasswordInput(e) {
    this.setData({ password: e.detail.value });
  },

  doLogin() {
    const { username, password } = this.data;
    if (!username || !password) {
      wx.showToast({ title: '请输入完整信息', icon: 'none' });
      return;
    }

    // 使用 util.request 统一请求
    util.request('/auth/login', 'POST', { username, password })
      .then(data => {
        // 期望后端返回 { token: "...", user: { ... } }
        if (data && data.token && data.user) {
          util.setLogin(data.token, data.user);
          wx.showToast({ title: '登录成功', icon: 'success' });

          // 先尝试切换到 tab（如果 profile 是 tab），失败则用 navigateTo 回退
          wx.switchTab({
            url: '/pages/profile/profile',
            success() {
              // 已成功切换到 tab
            },
            fail() {
              // 不是 tab 的时候走 navigateTo
              wx.navigateTo({ url: '/pages/profile/profile' });
            }
          });

          return;
        }

        // 兼容：有些后端只返回 user 对象（旧版）
        if (data && data.user) {
          util.setLogin("", data.user); // token 为空
          wx.showToast({ title: '登录成功', icon: 'success' });

          // 同样尝试切换 tab，失败回退
          wx.switchTab({
            url: '/pages/profile/profile',
            success() {},
            fail() { wx.navigateTo({ url: '/pages/profile/profile' }); }
          });

          return;
        }

        // 如果返回既没有 token 也没有 user，尝试解析常见错误字段
        if (data && (data.error || data.msg || data.message)) {
          wx.showToast({ title: data.error || data.msg || data.message, icon: 'none' });
        } else {
          wx.showToast({ title: '登录失败，返回数据异常', icon: 'none' });
        }
      })
      .catch(err => {
        // err 可能是 {statusCode, data, ...} 或网络错误
        if (err && err.data) {
          // 后端返回错误信息
          const d = err.data;
          const msg = d.error || d.msg || d.message || '登录失败';
          wx.showToast({ title: msg, icon: 'none' });
        } else {
          // 网络/连接失败
          wx.showToast({ title: '服务器连接失败', icon: 'none' });
        }
      });
  },

  goRegister() {
    wx.navigateTo({ url: '/pages/register/register' });
  }
});
