// pages/artisans/artisans.js
const util = require('../../utils/util.js');

Page({
  data: { artisansList: [] },

  onLoad() { this.fetchArtisans(); },

  fetchArtisans() {
    util.request('/artisans', 'GET')
      .then(res => {
        this.setData({ artisansList: Array.isArray(res) ? res : [] });
      })
      .catch(err => {
        console.warn('fetchArtisans failed, fallback demo', err);
        const demo = [
          { id: 1, name: '匠人A', skill: '木雕', summary: '从师学艺三十年...', image: '/images/artisan1.png' },
          { id: 2, name: '匠人B', skill: '陶艺', summary: '坚持手拉坯...', image: '/images/artisan2.png' },
          { id: 3, name: '匠人C', skill: '刺绣', summary: '用细针讲故事...', image: '/images/artisan3.png' }
        ];
        this.setData({ artisansList: demo });
      });
  },

  openArtisanDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/artisandetail/artisandetail?id=${id}` });
  }
});
