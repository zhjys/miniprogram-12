// pages/myposts/myposts.js
const STORAGE_KEY = 'myposts_v1';

Page({
  data: { posts: [] },

  onLoad() { this.loadPosts(); },
  onShow() { this.loadPosts(); },

  loadPosts() {
    const list = wx.getStorageSync(STORAGE_KEY) || [];
    this.setData({ posts: list.sort((a,b)=>b.createdAt - a.createdAt) });
  },

  openCreate() {
    wx.navigateTo({ url: '/pages/myposts/edit?mode=create' });
  },

  editPost(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/myposts/edit?mode=edit&id=${id}` });
  },

  deletePost(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '删除帖子',
      content: '确认删除该帖子？',
      success: res => {
        if (!res.confirm) return;
        let list = wx.getStorageSync(STORAGE_KEY) || [];
        list = list.filter(p => p.id !== id);
        wx.setStorageSync(STORAGE_KEY, list);
        wx.showToast({ title: '已删除', icon: 'none' });
        this.loadPosts();
      }
    });
  }
});
