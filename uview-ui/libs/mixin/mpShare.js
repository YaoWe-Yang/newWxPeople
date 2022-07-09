module.exports = {
	onLoad() {
		// 设置默认的转发参数
		console.log('===分享开始加载===');	
		console.log(this.$store.state.user)
		let id = this.$store.state.user.uid;
		if(!id && id == null && id == undefined){
			id = 0;
		}
		this.$u.mpShare = {
			title: this.$store.state.config.title, // 默认为小程序名称
			path: 'pages/index/index?id=' + id, // 默认为当前页面路径
			imageUrl: this.$store.state.config.share_img // 默认为当前页面的截图
		}
		
		console.log('===加载分享结束===');
	},
	onShareAppMessage() {
		return this.$u.mpShare
	},
	// #ifdef MP-WEIXIN
	onShareTimeline() {
		return this.$u.mpShare
	}
	// #endif
}
