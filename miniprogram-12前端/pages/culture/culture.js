// pages/culture/culture.js
const util = require('../../utils/util.js');

Page({
  data: {
    categories: [],
    activeCategory: 1,         // 默认宫廷流派
    allArtworks: [],           // 全部作品
    artworks: []               // 当前显示的作品
  },

  onLoad() {
    // 左侧固定分类
    this.setData({
      categories: [
        { id: 1, name: "宫廷流派" },
        { id: 2, name: "民间流派" },
        { id: 3, name: "文人流派" }
      ]
    });

    this.fetchArtworks();
  },

  /** 从后端获取全部 artworks */
  fetchArtworks() {
    util.request('/artworks')
      .then(res => {
        const list = Array.isArray(res) ? res.map(item => {
          const raw = item.imageUrl || item.image_url || item.image || '';
          let local = '/images/default-artwork.png';

          if (typeof raw === 'string' && raw.trim()) {
            const s = raw.trim();
            const lower = s.toLowerCase();

            if (lower.startsWith('http://') || lower.startsWith('https://')) {
              local = '/images/default-artwork.png';
            } else {
              let filename = s.replace(/^(\.\/|\/)+/, '');
              filename = filename.replace(/^images\//i, '');
              local = '/images/' + filename;
            }
          }

          return {
            ...item,
            imageLocal: util.safeImage(local)
          };
        }) : [];

        this.setData({ allArtworks: list });

        // 按分类过滤
        this.applyCategoryFilter();
      })
      .catch(err => {
        console.error('fetchArtworks error', err);
        wx.showToast({ title: '加载失败', icon: 'none' });
      });
  },

  /** 分类过滤（无 category_id，用 id 范围代替） */
  applyCategoryFilter() {
    const { allArtworks, activeCategory } = this.data;

    let filtered = [];

    if (activeCategory === 1) {
      // 宫廷流派：ID 1 - 7
      filtered = allArtworks.filter(a => a.id >= 1 && a.id <= 7);
    } else if (activeCategory === 2) {
      // 民间流派：ID 8 - 14
      filtered = allArtworks.filter(a => a.id >= 8 && a.id <= 14);
    } else if (activeCategory === 3) {
      // 文人流派：ID 15 - 20
      filtered = allArtworks.filter(a => a.id >= 15 && a.id <= 20);
    }

    this.setData({ artworks: filtered });
  },

  /** 左侧分类点击 */
  selectCategory(e) {
    const categoryId = e.currentTarget.dataset.id;
    this.setData({ activeCategory: categoryId });

    this.applyCategoryFilter();
  },

  /** 打开详情页 */
  openDetail(e) {
    const id = e.currentTarget.dataset.id;
    if (id) wx.navigateTo({ url: `/pages/detail/detail?id=${id}` });
  }
});
