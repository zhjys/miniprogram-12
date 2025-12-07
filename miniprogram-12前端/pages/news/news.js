// pages/news/news.js
const util = require('../../utils/util.js');

Page({
  data: { newsList: [] },

  onLoad() { this.fetchNews(); },
  onShow() { /* 可刷新 */ },

  fetchNews() {
    // 优先调用后端 /news，失败时用本地示例数据
    util.request('/news', 'GET')
      .then(res => {
        // 期望后端返回数组 [{id,title,date,summary,image}]
        this.setData({ newsList: Array.isArray(res) ? res : [] });
      })
      .catch(err => {
        console.warn('fetchNews failed, using fallback', err);
        const demo = [
          { id: 1, title: '非遗项目 1：传统织锦', date: '2025-12-01', summary: '织锦的历史与技艺...', image: '/images/news1.png' },
          { id: 2, title: '非遗项目 2：古法造纸', date: '2025-12-03', summary: '古法造纸的保护与传承...', image: '/images/news2.png' },
          { id: 3, title: '非遗项目 3：皮影戏传承', date: '2025-12-05', summary: '皮影戏艺术的时代意义...', image: '/images/news3.png' }
        ];
        this.setData({ newsList: demo });
      });
  },

  openNewsDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/newsdetail/newsdetail?id=${id}` });
  }
});
