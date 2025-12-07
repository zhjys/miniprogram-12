// pages/home/home.js
Page({
  data: {
    // 首页轮播图，本地图片
    banners: [
      { imageLocal: '/images/banner1.png' },
      { imageLocal: '/images/banner2.png' },
      { imageLocal: '/images/banner3.png' }
    ],

    // 首页推荐作品
    artworks: [
      { id: 1, title: '鸟笼A', author: '匠人A', era: '清代', imageLocal: '/images/artwork1.png' },
      { id: 2, title: '鸟笼B', author: '匠人B', era: '民国', imageLocal: '/images/artwork2.png' },
      { id: 3, title: '鸟笼C', author: '匠人C', era: '现代', imageLocal: '/images/artwork3.png' }
    ]
  },

  // 跳转到作品详情页（从 data-id 获取）
  openDetail(e) {
    const id = e.currentTarget.dataset.id;
    if (!id) {
      wx.showToast({ title: '作品 id 缺失', icon: 'none' });
      return;
    }
    wx.navigateTo({
      url: `/pages/detail/detail?id=${id}`
    });
  },

  // 六宫格：视频管理
  openGallery() {
    wx.navigateTo({ url: '/pages/gallery/gallery' });
  },

  // 六宫格：九宫格
  openNinePalace() {
    wx.navigateTo({ url: '/pages/nine/nine' });
  },

  // 六宫格：快捷入口
  openQuick() {
    wx.navigateTo({ url: '/pages/quick/quick' });
  },

  // 六宫格：分类文化页
  openCategory() {
    wx.navigateTo({ url: '/pages/culture/culture' });
  },

  // 六宫格：作品列表页
  openArtworks() {
    wx.navigateTo({ url: '/pages/artlist/artlist' });
  },

  // 六宫格：文章页
  openArticles() {
    wx.navigateTo({ url: '/pages/article/article' });
  }
});
