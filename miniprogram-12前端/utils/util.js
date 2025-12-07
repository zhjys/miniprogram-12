// miniprogram/utils/util.js
// 注意：在真机调试时请将 localhost 改为电脑局域网 IP
const BASE_URL = "http://localhost:8080/api";

// ============================
// 网络请求
// ============================
function request(url, method = "GET", data = null) {
  return new Promise((resolve, reject) => {
    const path = url.startsWith("/") ? url : "/" + url;
    wx.request({
      url: BASE_URL + path,
      method,
      data,
      header: {
        "content-type": "application/json",
        "Authorization": wx.getStorageSync("token") || ""
      },
      success(res) {
        if (res.statusCode >= 200 && res.statusCode < 300) resolve(res.data);
        else reject(res);
      },
      fail(err) { reject(err); }
    });
  });
}

// ============================
// 图片安全处理
// ============================
function safeImage(imgPath) {
  if (!imgPath) return "/images/default-artwork.png";
  const s = (imgPath || "").toString().trim();
  const lower = s.toLowerCase();
  if (lower.startsWith("http://") || lower.startsWith("https://")) return s;
  if (s.startsWith("/")) return s;
  return "/images/" + s.replace(/.*[\\\/]/, "");
}

// ============================
// 购物车（本地）
// ============================
const CART_KEY = "cart_v1";
function getCart() { return wx.getStorageSync(CART_KEY) || []; }
function saveCart(c) { wx.setStorageSync(CART_KEY, Array.isArray(c) ? c : []); }
function addToCart(item) {
  let cart = getCart();
  const idx = cart.findIndex(x => (x.artworkId || x.id) === (item.artworkId || item.id));
  if (idx >= 0) cart[idx].quantity = (cart[idx].quantity || 1) + 1;
  else cart.push({
    id: item.id || null,
    artworkId: item.artworkId || item.id || null,
    title: item.title || item.name || "未知",
    imageLocal: item.imageLocal || "/images/default-artwork.png",
    price: item.price || 0,
    quantity: 1
  });
  saveCart(cart);
  wx.showToast({ title: "已加入购物车", icon: "success" });
}
function removeFromCart(itemId) { saveCart(getCart().filter(c => (c.artworkId || c.id) !== itemId)); }
function updateCartQuantity(itemId, quantity) {
  let cart = getCart();
  const idx = cart.findIndex(c => (c.artworkId || c.id) === itemId);
  if (idx === -1) return;
  if (quantity <= 0) cart.splice(idx, 1);
  else cart[idx].quantity = quantity;
  saveCart(cart);
}
function clearCart() { saveCart([]); }

// ============================
// 收藏（本地）
// ============================
const FAV_KEY = "favorites_v1";
function getFavorites() { return wx.getStorageSync(FAV_KEY) || []; }
function saveFavorites(f) { wx.setStorageSync(FAV_KEY, Array.isArray(f) ? f : []); }
function toggleFavoriteLocal(item) {
  let favs = getFavorites();
  const key = item.artworkId || item.id;
  const idx = favs.findIndex(f => (f.artworkId || f.id) === key);
  if (idx >= 0) { favs.splice(idx, 1); saveFavorites(favs); wx.showToast({ title: "已取消收藏", icon: "none" }); return false; }
  favs.push({
    id: item.id || null,
    artworkId: key,
    title: item.title || item.name || "未知",
    imageLocal: item.imageLocal || "/images/default-artwork.png"
  });
  saveFavorites(favs); wx.showToast({ title: "已收藏", icon: "success" }); return true;
}
function isFavoriteLocal(itemId) { return getFavorites().some(f => (f.artworkId || f.id) === itemId); }

// ============================
// 收藏（服务端示例）
// ============================
function getFavoritesServer() { return request("/favorites", "GET"); }
function toggleFavoriteServer(item) { const id = item.artworkId || item.id; return request(`/favorites/${id}/toggle`, "POST"); }
function removeFavoriteServer(id) { return request(`/favorites/${id}`, "DELETE"); }

// ============================
// 登录/注册存储
// ============================
function setLogin(token, user) {
  if (token) wx.setStorageSync("token", token);
  if (user) wx.setStorageSync("user", user);
}
function getToken() { return wx.getStorageSync("token") || ""; }
function getUser() { return wx.getStorageSync("user") || null; }
function logout() { wx.removeStorageSync("token"); wx.removeStorageSync("user"); }

// ============================
// 导出
// ============================
module.exports = {
  request, apiBase: BASE_URL, safeImage,
  getCart, saveCart, addToCart, removeFromCart, updateCartQuantity, clearCart,
  getFavorites, saveFavorites, toggleFavoriteLocal, isFavoriteLocal,
  getFavoritesServer, toggleFavoriteServer, removeFavoriteServer,
  setLogin, getToken, getUser, logout
};
