Component({
  methods: {
    goHome(){ wx.navigateTo({ url:'/pages/home/home' }); },
    goCulture(){ wx.navigateTo({ url:'/pages/culture/culture' }); },
    goDetailDemo(){ wx.navigateTo({ url:'/pages/detail/detail?id=1' }); },
    goProfile(){ wx.navigateTo({ url:'/pages/profile/profile' }); },
    goCart(){ wx.navigateTo({ url:'/pages/cart/cart' }); },
    goNews(){ wx.navigateTo({ url:'/pages/news/news' }); },
    goArtisans(){ wx.navigateTo({ url:'/pages/artisans/artisans' }); }
  }
});
