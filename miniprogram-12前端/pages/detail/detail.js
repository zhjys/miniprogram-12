const util = require('../../utils/util.js');

Page({
  data: {
    artwork: {},
    isCollected: false,
    cartQuantity: 0 // 当前购物车数量
  },

  onLoad(options) {
    const id = options.id;
    if (!id) { wx.showToast({ title: '未提供ID', icon: 'none' }); return; }
    this.loadDetail(id);
    this.checkCollected(id);
    this.updateCartQuantity(id);
  },

  /** 加载作品详情 */
  loadDetail(id) {
    util.request(`/artworks/${id}`, 'GET')
      .then(item => {
        if (!item) { wx.showToast({ title: '未找到作品', icon: 'none' }); return; }
        item.imageLocal = util.safeImage(item.imageUrl || item.image || item.imageLocal);
        this.setData({ artwork: item });
      })
      .catch(err => {
        console.error('loadDetail error', err);
        wx.showToast({ title: '加载失败', icon: 'none' });
      });
  },

  /** 检查收藏状态 */
  checkCollected(id) {
    util.getFavoritesServer()
      .then(list => {
        const found = Array.isArray(list) && list.some(f => (f.artworkId || f.artwork_id) == id);
        this.setData({ isCollected: !!found });
      })
      .catch(err => {
        console.warn('getFavoritesServer failed, fallback local', err);
        const local = util.isFavoriteLocal(id);
        this.setData({ isCollected: !!local });
      });
  },

  /** 切换收藏 */
  toggleCollect() {
    const art = this.data.artwork;
    if (!art || (!art.id && !art.artworkId)) return wx.showToast({ title: '作品数据异常', icon: 'none' });

    util.toggleFavoriteServer(art)
      .then(res => {
        if (res.added) this.setData({ isCollected: true });
        else if (res.removed) this.setData({ isCollected: false });
        else { 
          // fallback local
          const status = util.toggleFavoriteLocal({
            id: art.id, artworkId: art.artworkId, title: art.title, imageLocal: art.imageLocal
          });
          this.setData({ isCollected: !!status });
        }
      })
      .catch(err => {
        console.error('toggleFavoriteServer error', err);
        const status = util.toggleFavoriteLocal({
          id: art.id, artworkId: art.artworkId, title: art.title, imageLocal: art.imageLocal
        });
        this.setData({ isCollected: !!status });
      });
  },

  /** 更新购物车数量显示 */
  updateCartQuantity(id) {
    const cart = util.getCart();
    const item = cart.find(c => c.id === id || c.artworkId === id);
    this.setData({ cartQuantity: item ? item.quantity : 0 });
  },

  /** 加入购物车 */
  addToCart() {
    const art = this.data.artwork;
    util.addToCart({
      id: art.id,
      artworkId: art.artworkId,
      title: art.title,
      imageLocal: art.imageLocal,
      price: art.price || 0
    });
    this.updateCartQuantity(art.id || art.artworkId);
  },

  /** 增加数量 */
  increaseQuantity() {
    const art = this.data.artwork;
    let qty = this.data.cartQuantity + 1;
    util.updateCartQuantity(art.id || art.artworkId, qty);
    this.setData({ cartQuantity: qty });
  },

  /** 减少数量 */
  decreaseQuantity() {
    const art = this.data.artwork;
    let qty = this.data.cartQuantity - 1;
    if (qty <= 0) {
      util.removeFromCart(art.id || art.artworkId);
      qty = 0;
    } else {
      util.updateCartQuantity(art.id || art.artworkId, qty);
    }
    this.setData({ cartQuantity: qty });
  }
});
