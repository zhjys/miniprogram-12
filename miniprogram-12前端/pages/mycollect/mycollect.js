// pages/mycollect/mycollect.js
const util = require('../../utils/util.js');

Page({
  data: { favorites: [] },

  onLoad() { this.loadData(); },
  onShow() { this.loadData(); },

  loadData() {
    util.getFavoritesServer()
      .then(list => {
        const mapped = (list || []).map(i => ({
          id: i.id,
          artworkId: i.artworkId || i.artwork_id,
          title: i.title,
          author: i.author,
          era: i.era,
          imageLocal: util.safeImage(i.imageUrl || i.image_url || i.imageLocal)
        }));
        this.setData({ favorites: mapped });
      })
      .catch(err => {
        console.warn('getFavoritesServer failed, fallback to local', err);
        const local = (util.getFavorites() || []).map(i => ({
          id: i.id, artworkId: i.artworkId, title: i.title,
          imageLocal: util.safeImage(i.imageLocal)
        }));
        this.setData({ favorites: local });
      });
  },

  removeFavorite(e) {
    const artworkId = e.currentTarget.dataset.id;
    util.removeFavoriteServer(artworkId)
      .then(() => {
        wx.showToast({ title: '已取消收藏', icon: 'none' });
        this.loadData();
      })
      .catch(err => {
        console.warn('removeFavoriteServer failed, fallback local', err);
        util.toggleFavoriteLocal({ artworkId });
        this.loadData();
      });
  },

  viewDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/detail/detail?id=${id}` });
  }
});
