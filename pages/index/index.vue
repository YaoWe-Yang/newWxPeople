<template>
	<view class="content">
		<view class="dy">
			<view class="gz">
				<view v-if="!sysInfo.cs || !userInfo.wemp_openid">
					<u-button type="warning" shape="circle" size="mini" :ripple="true" @click="$follow()">关注公众号
					</u-button>
					<view class="text">
						<text v-if="!sysInfo.cs">系统升级中，关注获取最新动态</text>
						<text v-else>关注订阅，通知消息不遗漏</text>
					</view>
				</view>
			</view>
		</view>


		<view>

			<view :class="[!sysInfo.cs?'body90':[userInfo.wemp_openid?'body40':'body90']]">


				<!-- 公告 -->
				<u-notice-bar mode="horizontal" type="primary" :list="list"></u-notice-bar>

				<view v-if="sysInfo.cs == '1'">
					<!-- 顶部tab -->
					<!-- <u-tabs :list="toptab" :is-scroll="false" :current="current" @change="change"></u-tabs>
				<view class="p20 t20">
					<scroll-view scroll-x="true" class="scroll">
						<view class="box">
							<view class="imgTop images">
								<u-icon name="play-circle-fill" class="videoIcon"></u-icon>
								<view class="videoTitle">这个是个什么项目1</view>
							</view>
							<img src="http://mmbiz.qpic.cn/mmbiz_jpg/ogI4UgDlzzymlv0hQMZwO4hzf9jHibqlgicibKfyhD37SWuazvL9BrSoIjwzBT10Hy55816VylwGYgxMibIo07SUvA/0?wx_fmt=jpeg"
								class="images">
						</view>
						<view class="box">
							<view class="imgTop images">
								<u-icon name="play-circle-fill" class="videoIcon"></u-icon>
								<view class="videoTitle">这个是个什么项目1</view>
							</view>
							<img src="http://mmbiz.qpic.cn/mmbiz_jpg/ogI4UgDlzzymlv0hQMZwO4hzf9jHibqlgicibKfyhD37SWuazvL9BrSoIjwzBT10Hy55816VylwGYgxMibIo07SUvA/0?wx_fmt=jpeg" class="images">
						</view>
						<view class="box">
							<view class="imgTop images">
								<u-icon name="play-circle-fill" class="videoIcon"></u-icon>
								<view class="videoTitle">这个是个什么项目1</view>
							</view>
							<img src="http://mmbiz.qpic.cn/mmbiz_jpg/ogI4UgDlzzymlv0hQMZwO4hzf9jHibqlgicibKfyhD37SWuazvL9BrSoIjwzBT10Hy55816VylwGYgxMibIo07SUvA/0?wx_fmt=jpeg"
								class="images">
						</view>
					</scroll-view>
				</view> -->
				</view>


				<!-- 广告图 -->
				<view class="p20 t20">
					<u-swiper :list="swiperList" :effect3d="true" height="200" @click="onLinkImg(swiperList,current)"
						@change="change()">
					</u-swiper>
				</view>


				<!-- 用户广告图 -->
				<view class="p20 t20">
					<view v-for="(item,ad_image) in adList" :key="ad_image">
						<view class="u-body-item u-flex u-border-bottom u-row-between" @tap="adGetInfo" :id="item.id">
							<view class="u-body-item-title u-line-2">{{item.ad_text}}</view>
							<image :src="item.ad_image" mode="aspectFill" class="u-body-itemImage"></image>
						</view>

						<view v-if="$isAdDisplay(ad_image,5)">
							<ad unit-id="adunit-d6399fd2c20f4101" v-if="config.adswitch"></ad>
						</view>
					</view>
					<u-loadmore :status="status" :icon-type="iconType" :load-text="loadText" margin-top="40"
						margin-bottom="40" />
				</view>

			</view>

		</view>

		<!-- <view v-else class="weQrcode"> -->
		<!-- <web-view
				src="http://mp.weixin.qq.com/s?__biz=Mzg4NTYwMTY4Nw==&mid=100000074&idx=1&sn=608e2636a7b50ca3910b39a162eae97e&chksm=4fa725b278d0aca4083d208786256cba3cea61222db4b4f8aacd9ef0bd59c7b4b2af5930d402#rd">
			</web-view> -->

		<!-- <view class="weView">
				<view class="weTitle">
					关注公众号获取最新动态
				</view>
				<image class="weImg" src="/static/qrcode.jpg" mode="widthFix" lazy-load="true"
					show-menu-by-longpress="true"></image>
				<view class="weTitle">
					<u-icon name="arrow-upward"></u-icon>
					<u-icon name="arrow-upward"></u-icon>
					<u-icon name="arrow-upward"></u-icon>
					长按识别
					<u-icon name="arrow-upward"></u-icon>
					<u-icon name="arrow-upward"></u-icon>
					<u-icon name="arrow-upward"></u-icon>
				</view>
			</view>
		</view> -->

		<u-popup v-model="adshow" mode="center" border-radius="14" closeable="true">
			<view class="adinfo">
				<u-lazy-load :image="adInfo.ad_image" img-mode="widthFix" @tap="fdimg(adInfo.ad_image)">
				</u-lazy-load>
				<view class="adtitle">{{adInfo.ad_text}}</view>
			</view>
		</u-popup>

		<u-back-top :scroll-top="scrollTop" top="600"></u-back-top>

		<view class="">
			<ad-custom unit-id="adunit-9a6b25a555f8b4be" v-if="sysInfo.adswitch"></ad-custom>
		</view>
		

		<u-tabbar :list="tabbar" :mid-button="true"></u-tabbar>
	</view>
</template>

<script>
	// 在页面中定义插屏广告
	let interstitialAd = null
	import {
		Base
	} from '@/store/base.js';
	export default {
		data() {
			return {
				tabbar: this.$store.state.tabbar,
				list: ['本平台为营销推广分享平台，欢迎大家积极分享营销信息；本平台禁止一切黄赌毒事项，禁止借用本平台从事违法违规事务，如有发现一律封号处理！'],
				toptab: [{
					name: '最新'
				}, {
					name: '热门'
				}, {
					name: '学习'
				}, {
					name: '网赚'
				}, {
					name: '杂货'
				}],
				current: 0, // tabs组件的current值，表示当前活动的tab选
				swiperList: {},
				adList: '',
				adInfo: '',
				adshow: false,
				status: 'loadmore',
				loadText: {
					// loadmore: '轻轻上拉',
					loading: '努力加载中',
					nomore: '没有更多了'
				},
				page: 1,
				scrollTop: 0,
				userInfo: this.$store.state.user,
				sysInfo: this.$store.state.config,
				timer: null
			}
		},
		computed: {
			user() {
				return this.$store.state.user;
			},
			config() {
				return this.$store.state.config;
			}

		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		//下拉
		onPullDownRefresh() {
			this.page = 1
			this.adList = []
			this.getAd()
		},
		//下拉	
		onReachBottom() {
			//避免多次触发
			if (this.status == 'loading' || this.status == 'nomore') {
				return;
			}
			this.getAd()
		},
		methods: {
			change(index) {
				this.current = index;
			},

			onLinkImg(item, id) {
				let url = item[id];
				console.log(url.linktype);
				if (url.linktype == '1') {
					uni.navigateTo({
						url: url.link
					});
				}

				if (url.linktype == '2') {
					uni.navigateTo({
						url: "/components/linkOthers/linkOthers?url=" + encodeURIComponent(url.link)
					});
				}
			},
			// 获取banner列表
			getBanner() {
				const self = this;
				var base = new Base();
				var params = {
					url: 'getBanner',
					sCallBack: function(res) {
						self.swiperList = res;
					}
				}
				base.request(params);
			},
			// 获取广告列表
			getAd() {
				this.status = "loading";
				const self = this;
				var base = new Base();
				var params = {
					url: 'getAd',
					data: {
						page: self.page,
					},
					sCallBack: function(res) {
						if (res.length < 15) {
							self.status = "nomore"
						} else {
							self.page = self.page + 1
							self.status = "loadmore"
						}
						var arr = new Array();
						if (self.adList) {
							self.adList = arr.concat(self.adList, res);
						} else {
							self.adList = res;
						}

						console.log(self.adList);
						uni.stopPullDownRefresh();
						// self.adList = res;
						// console.log(res);
					}
				}
				base.request(params);
			},
			// 弹出广告详情
			adGetInfo: function(e) {
				const self = this;
				var base = new Base();
				self.adshow = true;
				var params = {
					url: 'getAdId',
					data: {
						id: e.currentTarget.id,
					},
					sCallBack: function(res) {
						var adNote = {
							url: 'adNote',
							data: {
								id: e.currentTarget.id,
							},
							sCallBack: function(data) {
								console.log(data)
							}
						}
						base.request(adNote);
						// 绑定广告信息
						self.adInfo = res;
					}
				}
				base.request(params);
			},
			fdimg(img) {
				var base = new Base();
				base._previewImage(img);
			},

			// 获取用户信息
			_userInfo() {
				const self = this
				var base = new Base();
				var params = {
					url: 'userInfo',
					sCallBack: function(res) {
						self.userInfo = res;
					}
				}
				base.request(params);
			},

			_sysInfo() {
				const self = this
				var base = new Base();
				var params = {
					url: 'getSysInfo',
					sCallBack: function(res) {
						self.sysInfo = res;
						if (res.adswitch) {
							self.timer = setInterval(() => {
								// 在适合的场景显示插屏广告
								if (interstitialAd) {
									interstitialAd.show().catch((err) => {
										console.error(err)
									})
								}
							}, 16000)
						}
					}
				}
				base.request(params);
			},
		},
		onReady() {
			uni.setNavigationBarColor({
				frontColor: '#ffffff',
				backgroundColor: '#2979ff',
				animation: { //动画效果
					duration: 400,
					timingFunc: 'easeIn'
				}
			})

		},
		onShow() {
			this.updata = uni.getStorageSync('updata');
			this._userInfo();
			this._sysInfo();
			this.getAd();
			this.getBanner();



		},
		onLoad() {

			// 在页面onLoad回调事件中创建插屏广告实例
			if (wx.createInterstitialAd) {
				interstitialAd = wx.createInterstitialAd({
					adUnitId: 'adunit-1e750701d1dba1d4'
				})
				interstitialAd.onLoad(() => {})
				interstitialAd.onError((err) => {})
				interstitialAd.onClose(() => {})
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
			if (res.from === 'button') { // 来自页面内分享按钮
				console.log(res.target)
			}
			return {
				title: this.$store.state.config.title,
				path: '/pages/index/index?id=' + this.$store.state.user.uid,
				imageUrl: this.$store.state.config.share_img
			}
		},
		onUnload() {
			if (this.timer) {
				clearTimeout(this.timer);
				this.timer = null;
			}
		},
		onHide() {
			if (this.timer) {
				clearTimeout(this.timer);
				this.timer = null;
			}
		}
	}
</script>

<style lang="scss" scoped>
	.body40 {
		padding: 40rpx 0;
	}

	.body90 {
		padding: 90rpx 0;
	}

	.scroll {
		width: 100%;
		overflow: hidden;
		white-space: nowrap;
	}

	.box {
		display: inline-block;
		width: 300upx;
		height: 180upx;
		background: #cecece;
		margin-right: 20upx;
		border-radius: 10upx;
	}

	.box:last-child {
		margin-right: 0;
	}

	.images {
		width: 300upx;
		height: 180upx;
		border-radius: 10upx;
	}

	.imgTop {
		position: absolute;
		background-color: #00000073;
	}

	.videoIcon {
		font-size: 80upx;
		color: #ffffffad;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.videoTitle {
		padding: 4upx 10upx;
		color: #FFFFFF;
		bottom: 0;
		position: absolute;
	}

	.indexAdImg {
		width: 100%;
		height: 100upx;
		border-radius: 10upx;
	}

	.adList {
		width: 100%;
		height: 100upx;
	}

	.adList image {
		width: 100%;
		border-radius: 10upx;
	}

	.u-card-wrap {
		background-color: $u-bg-color;
		padding: 2rpx;
	}

	.u-body-item {
		font-size: 32rpx;
		color: #333;
		padding: 20rpx 10rpx;
	}

	.u-body-item image {
		width: 120rpx;
		flex: 0 0 120rpx;
		height: 120rpx;
		border-radius: 8rpx;
		margin-left: 12rpx;
	}

	.u-body-itemImage {
		width: 120rpx;
		flex: 0 0 120rpx;
		height: 120rpx;
		border-radius: 8rpx;
		margin-left: 12rpx;
	}

	.adinfo {
		padding: 20rpx;
		text-align: center;
	}

	.adtitle {
		text-align: left;
		width: 500rpx;
	}

	.u-lazy-item {
		width: 500rpx !important;
	}

	.weQrcode {
		margin: 40rpx;
		text-align: center;
	}

	.weView {
		padding: 40rpx;
		background-image: linear-gradient(135deg, #0089ff 0, #143698 99%, #062350);
		border-radius: 40rpx;
		color: #fff;
		font-size: 40rpx;
		font-weight: bold;
	}

	.weImg {
		width: 400rpx;
		border-radius: 26rpx;
		height: 400rpx;
		padding: 20rpx;
		background-color: #fff;
	}

	.weTitle {
		padding: 26rpx 0rpx;
	}

	.dy {
		position: fixed;
		z-index: 3;
		left: 0;
		right: 0;
		top: -20rpx;
	}

	.gz {
		padding: 20rpx;
		background-color: #2979ff;
		color: #fff;
		border-radius: 0 0 20% 20%;

		.text {
			float: right;
			padding-top: 12rpx;
		}
	}
</style>
