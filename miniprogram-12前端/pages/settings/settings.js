// pages/settings/settings.js
Page({
  data: { enableNotify: !!wx.getStorageSync('enableNotify') },

  onLoad() {
    this.setData({ enableNotify: !!wx.getStorageSync('enableNotify') });
  },

  onToggleNotify(e) {
    const v = e.detail.value;
    wx.setStorageSync('enableNotify', v);
    this.setData({ enableNotify: v });
    wx.showToast({ title: v ? '已开启通知' : '已关闭通知', icon: 'none' });
  },

  clearCache() {
    wx.showModal({
      title: '清除缓存',
      content: '确认清除本地缓存（收藏/作品/帖子/购物车）？',
      success: res => {
        if (!res.confirm) return;
        // 清理自定义 key（谨慎：不要清理登录凭据除非用户确认）
        wx.removeStorageSync('favorites_v1');
        wx.removeStorageSync('myworks_v1');
        wx.removeStorageSync('myposts_v1');
        wx.removeStorageSync('cart_v1');
        wx.showToast({ title: '已清除', icon: 'success' });
      }
    });
  },

  changeNickname() {
    wx.showModal({
      title: '修改昵称',
      content: '请输入新的昵称（示例：用 prompt）',
      success: res => {
        // 小程序 modal 没输入框，这里建议跳转到单独页面或用自定义组件。
        // 简单示例：打开输入框页面或直接提示用户使用 Profile 编辑页面。
        wx.showToast({ title: '请在个人主页修改昵称（示例）', icon: 'none' });
      }
    });
  },

  logout() {
    wx.showModal({
      title: '退出登录',
      content: '确认退出并清除本地用户数据？',
      success: res => {
        if (!res.confirm) return;
        // 清理用户信息（示例 key）
        wx.removeStorageSync('userId');
        wx.removeStorageSync('userInfo');
        wx.showToast({ title: '已退出', icon: 'success' });
        // 返回首页
        wx.reLaunch({ url: '/pages/home/home' });
      }
    });
  }
});
