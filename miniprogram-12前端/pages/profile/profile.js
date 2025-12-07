// pages/profile/profile.js
const util = require("../../utils/util");

Page({
  data: {
    user: null,     // { id, username, avatarUrl, bio, role }
    nickname: "",
    avatarUrl: "/images/avatar-placeholder.png",
    bio: ""
  },

  onShow() {
    // 检查登录状态
    const token = util.getToken();
    const user = util.getUser();

    if (!token || !user) {
      wx.showToast({ title: "请先登录", icon: "none" });
      setTimeout(() => {
        wx.navigateTo({ url: "/pages/login/login" });
      }, 800);
      return;
    }

    this.setData({
      user,
      nickname: user.username,
      avatarUrl: user.avatarUrl || "/images/avatar-placeholder.png",
      bio: user.bio || ""
    });
  },

  /** 打开：我的收藏 */
  openCollect() {
    wx.navigateTo({
      url: '/pages/mycollect/mycollect'
    });
  },

  /** 打开：我的作品 */
  openWorks() {
    wx.navigateTo({
      url: '/pages/myworks/myworks'
    });
  },

  /** 打开：我的帖子 */
  openPosts() {
    wx.navigateTo({
      url: '/pages/myposts/myposts'
    });
  },

  /** 打开：购物车 */
  openCart() {
    wx.navigateTo({
      url: '/pages/cart/cart'
    });
  },

  /** 打开：系统设置 */
  openSettings() {
    wx.navigateTo({
      url: '/pages/settings/settings'
    });
  }
});
