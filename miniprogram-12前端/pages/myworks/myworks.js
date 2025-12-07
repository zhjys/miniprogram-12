// pages/myworks/myworks.js
const util = require('../../utils/util.js');

const STORAGE_KEY = 'myworks_v1';

Page({
  data: {
    works: []
  },

  onLoad() {
    this.loadWorks();
  },

  onShow() {
    this.loadWorks();
  },

  loadWorks() {
    const list = wx.getStorageSync(STORAGE_KEY) || [];
    // 保证 imageLocal 格式安全
    const mapped = (list || []).map(w => ({
      ...w,
      imageLocal: util.safeImage(w.imageLocal || w.imageUrl || w.image || '/images/default-artwork.png')
    }));
    this.setData({ works: mapped });
  },

  openCreate() {
    // 跳转到创建页面（用 query 携带 mode=create）
    wx.navigateTo({ url: '/pages/myworks/edit?mode=create' });
  },

  editWork(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/myworks/edit?mode=edit&id=${id}` });
  },

  deleteWork(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '删除作品',
      content: '确认删除该作品？',
      success: res => {
        if (!res.confirm) return;
        let list = wx.getStorageSync(STORAGE_KEY) || [];
        list = list.filter(w => w.id !== id);
        wx.setStorageSync(STORAGE_KEY, list);
        wx.showToast({ title: '已删除', icon: 'none' });
        this.loadWorks();
      }
    });
  }
});
