Page({
  data: {
    videos: []
  },

  onLoad() {
    this.setData({
      videos: [
        { filePath: './video/video1.mp4', name: '视频1' },
        { filePath: './video/video2.mp4', name: '视频2' }
      ]
    });
  },

  onNameInput(e) {
    const idx = e.currentTarget.dataset.index;
    const value = e.detail.value;
    const videos = this.data.videos;
    videos[idx].name = value;
    this.setData({ videos });
  },

  onDeleteTap(e) {
    const idx = e.currentTarget.dataset.index;
    const videos = this.data.videos;
    videos.splice(idx, 1);
    this.setData({ videos });
  }
});
