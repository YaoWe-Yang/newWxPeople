<template>
	<view>
		<!-- <pageIcon></pageIcon> -->
	</view>
</template>
<script>
	export default {
		created() {
			console.log('created：');
		},
		onLaunch: function(options) {
			console.log('App onLaunch')
			const scene = decodeURIComponent(options.query.scene);
			if (options.query.id) {
				var share_id = options.query.id;
			} else {
				var share_id = scene.slice(3);
			}
			console.log(share_id);
			uni.setStorageSync('share_id', share_id)
			uni.setStorageSync('system', this.$u.sys())
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
	}
</script>

<style lang="scss">
	@import "uview-ui/index.scss";
	@import "//at.alicdn.com/t/font_2373129_oorutxviqoi.css";

	@font-face {
		font-family: 'myfont';
		/* Project id 2373129 */
		src: url('//at.alicdn.com/t/font_2373129_zijdk5c4ris.woff2?t=1628672602681') format('woff2'),
			url('//at.alicdn.com/t/font_2373129_zijdk5c4ris.woff?t=1628672602681') format('woff'),
			url('//at.alicdn.com/t/font_2373129_zijdk5c4ris.ttf?t=1628672602681') format('truetype');
	}

	.myfont {
		/* 引用上面声明的"custom-icon"字体 */
		font-family: "myfont" !important;
		font-size: 16px;
		font-style: normal;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}

	@font-face {
		font-family: "iconfont";
		/* project id 2295299 */
		src: url("//at.alicdn.com/t/font_2295299_j89jox4v6p.eot");
		src: url("//at.alicdn.com/t/font_2295299_j89jox4v6p.eot?#iefix") format("embedded-opentype"),
			url("//at.alicdn.com/t/font_2295299_j89jox4v6p.woff2") format("woff2"),
			url("//at.alicdn.com/t/font_2295299_j89jox4v6p.woff") format("woff"),
			url("//at.alicdn.com/t/font_2295299_j89jox4v6p.ttf") format("truetype"),
			url("//at.alicdn.com/t/font_2295299_j89jox4v6p.svg#iconfont") format("svg");
	}
	
	@-webkit-keyframes zy {
	    10% {
	        transform: rotate(15deg);
	    }
	    20% {
	        transform: rotate(-10deg);
	    }
	    30% {
	        transform: rotate(5deg);
	    }
	    40% {
	        transform: rotate(-5deg);
	    }
	    50%, 100% {
	        transform: rotate(0deg);
	    }
	}

	i {
		font-family: "iconfont";
		font-size: 28upx;
		font-style: normal;
	}


	/*每个页面公共css */
	body {
		margin: 0;
		font-family: -apple-system, BlinkMacSystemFont, Helvetica Neue, Helvetica, Segoe UI, Arial, Roboto, PingFang SC, miui, Hiragino Sans GB, Microsoft Yahei, sans-serif;
	}

	image {
		will-change: transform
	}

	.p20 {
		padding: 0 20upx;
	}

	.t20 {
		padding-top: 20upx;
	}

	// 底部弹出层标题
	.vipTitle {
		-webkit-flex-shrink: 0;
		flex-shrink: 0;
		font-weight: 500;
		font-size: 16px;
		line-height: 48px;
		text-align: center;
	}
</style>
