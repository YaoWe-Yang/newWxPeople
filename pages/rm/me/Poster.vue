<template>
	<div class="page safe-area-inset-bottom" v-if="user">
		<div class="topTips">
			<i>&#xe651;</i>点击图片长按分享（仅图片推广有效）
		</div>
		<div class="TipsTop" v-if="visible" @click="hide">
			<div class="invite_tips">
				<div class="text">
					点击右上角
					<br />分享给你的好友或朋友圈
				</div>
				<div class="img">
					<img src="http://shiyinet-oss.oss-cn-shenzhen.aliyuncs.com/default/20210205/1612505877410721" />
				</div>
			</div>
		</div>

		<u-swiper :list="list" @click="$imagePreview(list,imgId)" :effect3d="true" height="1100" bg-color=""
			@change="shareImg()"></u-swiper>


		<div class="bottom" style="display: none;">
			<div class="tips">
				<!-- 还可以直接分享链接 -->
				点击图片长按分享
			</div>


			<div class="btns">
				<div class="btn">
					<u-button open-type="share" @click="sharePoster('F')" class="shareBottonL" hair-line="false"
						plain="false" ripple="true" :custom-style="shareBottonL" />
					<div class="icon"><img
							src="http://shiyinet-oss.oss-cn-shenzhen.aliyuncs.com/default/20210415/1618478543342874">
					</div>
					<div class="text">好友/微信群</div>
				</div>
				<div class="btn">
					<u-button @click="show()" class="shareBottonR" hair-line="false" plain="false" ripple="true"
						:custom-style="shareBottonR" />
					<div class="icon"><img
							src="http://shiyinet-oss.oss-cn-shenzhen.aliyuncs.com/default/20210415/1618478591758614">
					</div>
					<div class="text">朋友圈</div>
				</div>
				<!-- <div class="btn copybtn" :data-clipboard-text="mylink">
					<div class="icon"><img
							src="http://shiyinet-oss.oss-cn-shenzhen.aliyuncs.com/default/20210415/1618479910674936">
					</div>
					<div class="text">复制链接</div>
				</div> -->
			</div>
		</div>
	</div>
</template>

<script>
	import {
		Base
	} from '@/store/base.js';
	export default {
		data() {
			return {
				list: [],
				visible: false,
				swiperOption: {
					slidesPerView: 1.4,
					centeredSlides: true
				},
				imgId: 0,
				shareBottonL: {
					position: 'absolute',
					width: '50%',
					height: '135rpx',
					backgroundColor: '#ffffff00',
					bottom: '0',
					color: '#ffffff00',
					left: '0'
				},
				shareBottonR: {
					position: 'absolute',
					width: '50%',
					height: '135rpx',
					backgroundColor: '#ffffff00',
					bottom: '0',
					color: '#ffffff00',
					right: '0'
				},
				share: 'F',
			};
		},
		computed: {
			user() {
				return this.$store.state.user;
			},
			mylink() {
				// return window.location.origin + '/' + this.user.id + '/';
			}
		},
		created() {
			this.getPoster();
		},
		methods: {
			onNavBarRightBtnClick() {
				this.$go('/me/friend')
			},
			getPoster() {
				var self = this;
				var base = new Base();
				var params = {
					url: 'getPoster',
					sCallBack: function(res) {
						self.list = res.list;
					}
				}
				base.request(params);
			},
			shareImg(index) {
				this.imgId = index;
			},
			sharePoster(type) {
				this.share = type;
				// if(type = 'F'){
				// this.$u.mpShare = {
				// 	title: uni.getStorageSync('sysInfo').title, 
				// 	path: '/pages/index/index?id=' + uni.getStorageSync('userInfo').uid, 
				// 	imageUrl: uni.getStorageSync('sysInfo').share_img 
				// }
				// }
			},
			show() {
				this.visible = true;
			},
			hide() {
				console.log('1');
				this.visible = false;
			}

		},
		// 这里如果写成onShareAppMessage: res => { ... }形式的箭头函数，在内部会无法获得this
		onShareAppMessage(res) {
			if (res.from === 'button') { // 来自页面内分享按钮
				console.log(res.target)
			}
			return {
				title: this.$store.state.config.title,
				path: '/pages/index/index?id=' + this.$store.state.user.uid,
				imageUrl: this.$store.state.config.share_img
			}
		},
		onShareTimeline(res) {
			console.log(this.share);
			if (res.from === 'button') { // 来自页面内分享按钮
				console.log(res.target)
			}
			return {
				title: this.$store.state.config.title,
				path: '/pages/index/index?id=' + this.$store.state.user.uid,
				imageUrl: this.$store.state.config.share_img
			}
		},
	};
</script>

<style lang="scss" scoped>
	.page {
		display: flex;
		flex-direction: column;
		// height: calc(100vh - 46px);
		overflow: hidden;
	}

	.swiper {
		flex: 1;
		width: 100%;
		overflow: hidden;
		margin: 10px 0;

		.swiper-slide {
			text-align: center;
			font-size: 18px;
			display: flex;
			justify-content: center;
			align-items: center;
			transition: 300ms;
			transform: scale(0.8);

			.poster {
				width: 100%;
			}
		}

		.swiper-slide-active,
		.swiper-slide-duplicate-active {
			transform: scale(1);
		}
	}

	.bottom {
		height: 100px;
		background: #f1f1f1;
		bottom: 0;
		position: absolute;
		width: 100%;

		.tips {
			text-align: center;
			font-size: 12px;
			color: #999;
			padding: 6px 0;
			border-bottom: 1px solid #ebeef5;
		}

		.btns {
			display: flex;
			justify-content: space-around;
			padding: 10px 0;

			.btn {
				text-align: center;

				.icon {
					img {
						width: 30px;
						height: 30px;
					}
				}

				.text {
					font-size: 12px;
				}
			}
		}
	}

	.TipsTop {
		position: absolute;
		z-index: 9;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba($color: #000000, $alpha: 0.8);
	}

	.shareBottonL {
		position: absolute !important;
		width: 100% !important;
		height: 144rpx !important;
		background-color: #ffffff00 !important;
		bottom: 0 !important;
		color: #ffffff00 !important;
		left: 0 !important;
	}

	.shareBottonR {
		position: absolute !important;
		width: 100% !important;
		height: 144rpx !important;
		background-color: #ffffff00 !important;
		bottom: 0 !important;
		color: #ffffff00 !important;
		right: 0 !important;
	}

	.invite_tips {
		.text {
			box-sizing: border-box;
			position: absolute;
			top: 8rpx;
			right: 20px;
			width: 265px;
			padding: 55px 0 0;
			background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAACICAMAAABQgAwUAAAAMFBMVEUAAADY2NjY2NjY2NjY2NjY2NjY2NjY2NjX19fY2NjY2NjY2NjY2NjY2NjY2NjY2Njr/TvvAAAAD3RSTlMAxy89c9CdTRyG7lvcD7FzqbJAAAACFklEQVR42uWYy4rkMBAErZdlPdzx/3+7LAw0tH0Y2orDsnnyKQlSVaWytoc6xrEpigFoinUAIBnWABAE5woW9o6GPbGwI1jYGSzsgoV9goU9wMLe0bA7FnYCC7uBhV2wsE+wsAdY2AENGyzsBBZ2Q8MuWNgH94pLbgELO6Bhg4VdwcJuaNgTCzuChZ3Bwg5o2GBhV7CwdzTsjoUdwcLOYGEXLOwTLOwBFvaOht2xsBNY2I1f6lhaenvhrfpkAblab+k9b/OD0iuX2F9/x8D+7ZL2pmpbuj+6o3Vg//oWmPU9p65VkXL6+oIJ8S738nwj62Pb1lvHACH+fBs7sG59U3yrVD3rce3GVcp8qGkPAGTprQUYy6xfaE8i82b6S7/pfZnzdYQIHeOXdfYKpHoFcmrvWlM8RW+CDO8JMWoNM/+FeyB4UfMpL48g5qG1Iqc29YI3mqq2knXvEJu2onJoQy9ok4mkQZf/GjqitUvQyqN6SU8NOvOhHq25xNCWj6LFQdLiyKuaZWpxBC2OrFVHxdryElbQsVtBx6KN0qAd4a71yo610uxa2b0s5xg052I5p26d4MCqusZFwzrAnqQhSogSMnkNcr+GUS3kEKWS62NJFlNCToWLZpWMe14RReGqdjz2PfNECbkGbrQ/Nj5q5y7j8/HRTW5UhvHfA7Mdzitji8rfWsgX3gVZ91eO22odKed6LLf9A/sRnc74RV7lAAAAAElFTkSuQmCC) no-repeat right 80rpx top;
			background-size: 45px 68px;
			line-height: 24px;
			color: #fff;
		}

		.img {
			margin: 150px 20px;
			border-radius: 8px;
			overflow: hidden;
		}

		.img img {
			width: 100%;
		}
	}
	
	.topTips{
		    width: 100%;
		    font-size: 13px;
		    padding: 10px 16px;
		    background-color: #fef0f0;
		    color: #ff8d00;
		    margin-top: 0;
		    text-align: left;
			i{
				margin-right: 10rpx;
				    font-size: 12px;
				    color: #edb060;
				    float: left;
			}
	}
</style>
