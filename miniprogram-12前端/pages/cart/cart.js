// pages/cart/cart.js
const util = require('../../utils/util.js');

Page({
  data: {
    cartItems: [],
    totalQuantity: 0
  },

  onShow() { this.loadCart(); },

  loadCart() {
    let cart = [];
    if (typeof util.getCart === 'function') cart = util.getCart() || [];
    else cart = wx.getStorageSync('cart') || [];

    let total = 0;
    cart = (cart || []).map(item => {
      let local = item.imageLocal || item.imageUrl || item.image || '';
      if (typeof local === 'string' && local.trim()) {
        let s = local.trim();
        if (!s.startsWith('/images/') && !s.startsWith('http://') && !s.startsWith('https://')) {
          s = s.replace(/^(\.\/|\/)+/, '');
          s = s.replace(/^images\//i, '');
          s = '/images/' + s;
        }
        local = s;
      } else {
        local = '/images/default-artwork.png';
      }
      item.imageLocal = (typeof util.safeImage === 'function') ? util.safeImage(local) : local;

      item.quantity = item.quantity || 1;
      total += Number(item.quantity) || 0;
      return item;
    });

    this.setData({ cartItems: cart, totalQuantity: total });
  },

  increase(e) {
    const id = e.currentTarget.dataset.id;
    let cart = (typeof util.getCart === 'function') ? util.getCart() : wx.getStorageSync('cart') || [];
    const idx = cart.findIndex(c => c.id === id || c.artworkId === id);
    if (idx >= 0) {
      cart[idx].quantity = (cart[idx].quantity || 1) + 1;
      if (typeof util.saveCart === 'function') util.saveCart(cart); else wx.setStorageSync('cart', cart);
      this.loadCart();
    }
  },

  decrease(e) {
    const id = e.currentTarget.dataset.id;
    let cart = (typeof util.getCart === 'function') ? util.getCart() : wx.getStorageSync('cart') || [];
    const idx = cart.findIndex(c => c.id === id || c.artworkId === id);
    if (idx >= 0) {
      if ((cart[idx].quantity || 1) > 1) cart[idx].quantity -= 1;
      else cart.splice(idx, 1);
      if (typeof util.saveCart === 'function') util.saveCart(cart); else wx.setStorageSync('cart', cart);
      this.loadCart();
    }
  },

  removeItem(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '删除',
      content: '确认删除该商品？',
      success: res => {
        if (res.confirm) {
          if (typeof util.removeFromCart === 'function') util.removeFromCart(id);
          else {
            let cart = wx.getStorageSync('cart') || [];
            cart = cart.filter(c => c.id !== id && c.artworkId !== id);
            wx.setStorageSync('cart', cart);
          }
          this.loadCart();
        }
      }
    });
  },

  clearCart() {
    wx.showModal({
      title: '清空购物车',
      content: '确认清空购物车所有商品？',
      success: res => {
        if (res.confirm) {
          if (typeof util.clearCart === 'function') util.clearCart();
          else wx.setStorageSync('cart', []);
          this.loadCart();
        }
      }
    });
  },

  checkout() {
    wx.showModal({
      title: '结算',
      content: `确认结算 共 ${this.data.totalQuantity} 件？（示例）`,
      success: res => {
        if (res.confirm) {
          if (typeof util.clearCart === 'function') util.clearCart();
          else wx.setStorageSync('cart', []);
          this.loadCart();
          wx.showToast({ title: '结算完成（示例）', icon: 'success' });
        }
      }
    });
  }
});
