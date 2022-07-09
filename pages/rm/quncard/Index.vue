<template>
	<view>
		<!-- <van-notify id="van-notify"/> -->

		<u-sticky>
			<view class="">
				<!-- 顶部提示 -->
				<view class="save-tips" style="display: none;">
					<u-icon name="close"></u-icon>
					<view>
						<text style="float: left;">点"···"，再点"收藏"，下次访问不迷路</text>
						<i style="float: left;">&#xe65f;</i>
					</view>
				</view>

				<!-- 搜索 -->
				<view class="search">
					<u-search placeholder="输入关键词搜索微信群" :show-action="true" :animation="true" :clearabled="true"
						@search="search" @custom="search"></u-search>
				</view>

				<!-- 公告 -->
				<u-notice-bar :list="noteList" :is-circular="true" :speed="100"></u-notice-bar>

			</view>
		</u-sticky>

		<!-- 广告代发 -->
		<view class="ad">
			<!-- <image src="http://shiyinet-oss.oss-cn-shenzhen.aliyuncs.com/default/20210101/1609487604935343.png"
				class="icon" mode="heightFix"></image> -->
			<u-image src="@/static/ad.png"
				mode="widthFix" width="64"></u-image>
			<view class="info">
				<view class="state">广告代发</view>
				<view class="time">你的广告我们来帮你发</view>
			</view>
			<u-button type="primary" shape="circle" size="medium" :ripple="true" :custom-style="btnStyle"
				@click="$go('/pages/rm/ad/Mgr')">了解一下
			</u-button>
		</view>

		<!-- 推荐 -->
		<div class="quncardtop p40" v-if="quncard_top_list.length>0">
			<div class="title">
				<div class="left">推荐群</div>
			</div>
			<div class="list">
				<swiper class="swiper">
					<swiper-item v-for="(item, key) in quncard_top_list" :key="key" class="item">
						<div class="topInfo">
							<div class="info">
								<div class="avatar">
									<u-lazy-load :image="item.user.avatar" mode="widthFix" width="16"></u-lazy-load>
								</div>
								<div class="nickname">{{item.user.nickname}}</div>
								<img class="vip"
									src="http://shiyinet-oss.oss-cn-shenzhen.aliyuncs.com/default/20210419/1618823596957416">
							</div>
							<div class="desc">{{item.name}}</div>
							<div class="qrcode-wrap" @click="$refs.qrcode.show(item)">
								<div class="avatar">
									<u-lazy-load :image="item.avatar" mode="widthFix" width="20"></u-lazy-load>
								</div>
								<u-image class="qrcode" :src="'data:image/png;base64,' +item.qrcode" width="100%"
									mode="widthFix"></u-image>
							</div>
						</div>
					</swiper-item>
				</swiper>
			</div>
		</div>

		<!-- tab内容页 -->
		<view>
			<view>
				<u-tabs-swiper ref="uTabs" :list="list" :current="current" @change="tabsChange" :is-scroll="false"
					font-size="28" inactive-color="#323233" bar-width="80" active-color="#323233" :bar-style='barStyle'>
				</u-tabs-swiper>
			</view>
			<swiper :style="{'height':swiperHeight +'rpx'}" :current="swiperCurrent" @transition="transition"
				@animationfinish="animationfinish">
				<swiper-item class="swiper-item" v-for="(qun, index) in tabs" :key="index">
					<scroll-view scroll-y @scrolltolower="getQun(index)">
						<view v-for="(item,i) in qun" :key="item.id">

							<view class="qItem">
								<view class="avatar">
									<u-lazy-load :image="item.avatar" mode="widthFix"></u-lazy-load>
								</view>
								<view class="profile">
									<view class="nickname">
										<i v-if="item.type == '1'" style="float: left;color:#07c160">&#xe660;</i>
										<i v-else style="float: left;color:#0085DD">&#xe6af;</i>
										<text>{{item.name}}</text>
									</view>
									<view class="summary">
										<view class="summaryNum">
											<i>&#xe6da; <text>{{item.num}}人</text></i>
											<text>{{item.refresh_time | formatDiffDate}}</text>
										</view>
									</view>
								</view>
								<view class="btn">
									<u-button v-if="item.note==null" type="success" size="medium" :ripple="true"
										@click="showQrcode(item)">加群
									</u-button>
									<u-button v-else type="warning" size="medium" @click="$refs.qrcode.show(item)">已查看
									</u-button>
								</view>
								<!-- <div class="btn">
							  <van-button v-if="item.note==null" type="primary" size="small" @click="showQrcode(item)">加群</van-button>
							  <van-button v-else type="warning" size="small" @click="$refs.qrcode.show(item)">已查看</van-button>
							</div> -->
							</view>
							
							<view v-if="$isAdDisplay(i,config.qunad_num)">
							<ad-custom unit-id="adunit-ee658640adbfd4ea" v-if="config.adswitch"></ad-custom>
							</view>

						</view>

						<u-loadmore :status="status" />
					</scroll-view>
				</swiper-item>
			</swiper>

		</view>
		<!-- 新消息 -->
		<NewMsg ref="NewMsg" />

		<!-- 群码 -->
		<qrcode title="扫码加群" ref="qrcode" />

		<!-- 广告 -->
		<OpenAd ref="OpenAd" />
 
		<view class="container">
			<tabBar :currentPage="1"></tabBar>
		</view>
	</view>
</template>

<script>
	import tabBar from '@/pages/rm/tabBar/tabBar.vue';
	import NewMsg from '@/pages/rm/components/NewMsg.vue';
	import Qrcode from '@/pages/rm/components/_qrcode.vue';
	import OpenAd from '@/pages/rm/components/OpenAd.vue';
	import {
		Base
	} from '@/store/base.js';
	export default {
		components: {
			tabBar,
			NewMsg,
			Qrcode,
			OpenAd,
		},
		data() {
			return {
				timer: '',
				wxTabBar: this.$store.state.wxTabBar,
				noteList: [this.$store.state.config.notice],
				barStyle: {
					backgroundColor: '#ee0a24',
				},
				list: [{
					name: '实时更新'
				}, {
					name: '百人群'
				}, {
					name: '企业群'
				}],
				// 因为内部的滑动机制限制，请将tabs组件和swiper组件的current用不同变量赋值
				current: 0, // tabs组件的current值，表示当前活动的tab选项
				swiperCurrent: 0, // swiper组件的current值，表示当前那个swiper-item是活动的
				swiperHeight: '5300',
				swiperHRow: '5300',
				tabs: '',
				qlist: '',
				quncard_top_list: [],

				status: 'loading',
				listNum: 30,
				page_all: 1,
				page_good: 1,
				page_qyqun: 1,
				query: {
					words: '',
					type: null,
				},
			}
		},
		computed: {
			user() {
				return this.$store.state.user;
			},
			config() {
				return this.$store.state.config;
			},

		},
		created() {
			uni.setNavigationBarTitle({
				title: this.config.title
			});
			this.getQuncardTopList();
		},
		methods: {

			// tabs通知swiper切换
			tabsChange(index) {
				this.swiperCurrent = index;
				console.log(index)
				this.getQun();
			},
			// swiper-item左右移动，通知tabs的滑块跟随移动
			transition(e) {
				let dx = e.detail.dx;
				this.$refs.uTabs.setDx(dx);

			},
			// 由于swiper的内部机制问题，快速切换swiper不会触发dx的连续变化，需要在结束时重置状态
			// swiper滑动结束，分别设置tabs和swiper的状态
			animationfinish(e) {
				let current = e.detail.current;
				this.$refs.uTabs.setFinishCurrent(current);
				this.swiperCurrent = current;
				this.current = current;
				
				this.getQun();
			},
			// scroll-view到底部加载更多
			onreachBottom() {

			},

			// 加载群列表
			getQun() {
				this.status = "loading";
				// #ifdef H5
				let modeType = 'H5'
				// #endif
				// #ifdef MP-WEIXIN
				let modeType = 'MP-WEIXIN'
				// #endif
				console.log(modeType)
				const self = this;
				if (self.swiperCurrent == 1) {
					var type = 'good';
					var page = self.page_good;
				} else if (self.swiperCurrent == 2) {
					var type = 'qyqun'
					var page = self.page_qyqun;
				} else {
					var type = 'all'
					var page = self.page_all;
				}
				if (page >= 1) {
					var base = new Base();
					var params = {
						url: 'getQun?page=' + page + '&type=' + type + '&words=' + this.query.words+'&modeType='+ modeType,
						sCallBack: function(res) {
							var res = res.list
							if (res.data.length < 30) {
								self.status = "nomore"
							} else {
								self.status = "loadmore"
							}

							var arr = new Array();
							if (self.swiperCurrent == 1) {
								if (self.good) {
									self.good = arr.concat(self.good, res.data)
								} else {
									self.good = res.data;
								}
							} else if (self.swiperCurrent == 2) {
								if (self.qyqun) {
									self.qyqun = arr.concat(self.qyqun, res.data)
								} else {
									self.qyqun = res.data;
								}
							} else {
								if (self.all) {
									self.all = arr.concat(self.all, res.data)
								} else {
									self.all = res.data;
								}
							}
							self.tabs = [self.all, self.good, self.qyqun];

							// uni.stopPullDownRefresh();
						}
					}
					base.request(params);
				}
			},
			getQuncardTopList() {
				var base = new Base();
				var that = this;
				var params = {
					url: 'getQunTopList',
					sCallBack: function(res) {
						that.quncard_top_list = res.list;
					}
				}
				base.request(params);
			},
			showQrcode(item) {
				if (this.query.words != '' && this.user.is_vip == 0) {
					this.$dialog.confirm({
						title: '提示',
						message: '非会员不支持查看精准群',
						cancelButtonText: '暂不需要',
						confirmButtonText: '开通会员'
					}).then(() => {
						this.$refs.openVip.show();
					});
					return;
				}
				this.$refs.qrcode.show(item)
			},

			search(text) {
				console.log(text);
				this.query.words = text;
				if (this.swiperCurrent == 1) {
					this.good = '';
				} else if (this.swiperCurrent == 2) {
					this.qyqun = '';
				} else {
					this.all = '';
				}
				this.getQun();

			},

			getLookAd() {
				var base = new Base();
				var that = this;
				var params = {
					url: 'getLookAd',
					sCallBack: function(res) {
						if (res.ad) {
							that.$refs.OpenAd.show(res.ad);
						}
					}
				}
				base.request(params);
			},
			toJSON() {
				return this;
			},
			getMsg() {
				var base = new Base();
				var that = this;
				var params = {
					url: 'getLookMsg',
					sCallBack: function(res) {
						if (res.code == '0') {
							that.$refs.NewMsg.show(res.list)
						}
					}
				}
				base.request(params,true,false);
			},
		},
		//下拉	
		onReachBottom() {
			//避免多次触发
			// #ifdef MP-WEIXIN
			if (this.status == 'loading' || this.status == 'nomore') {
				return;
			}
			if (this.swiperCurrent == 1) {
				this.page_good = this.page_good + 1
			} else if (this.swiperCurrent == 2) {
				this.page_qyqun = this.page_qyqun + 1
			} else {
				this.page_all = this.page_all + 1
			}
			this.getQun();
			this.swiperHeight = this.swiperHeight * 1 + this.swiperHRow * 1;
			// console.log(this.swiperHeight);
			// #endif
		},
		onShow() {
			this.timer = setInterval(this.getMsg, 5000)
		},
		onHide() {
			if (this.timer) {
				clearTimeout(this.timer);
				this.timer = null;
			}
		},
		onUnload() {
			if (this.timer) {
				clearTimeout(this.timer);
				this.timer = null;
			}
		},
		onLoad() {
			this.getLookAd();
			this.getQun();


			console.log(this.swiperHeight);
			console.log(this.noteList);
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
		onPullDownRefresh() {
			console.log('refresh');
			this.getQun();
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000);
		}
	}
</script>

<style lang="scss">
	@import "@/pages/rm/index.scss";


	.quncardtop {
		margin: 16px;
		margin-bottom: 0;

		.title {
			display: flex;
			justify-content: space-between;
			align-items: center;

			.left {
				font-weight: 700;
				font-size: 14px;

				span {
					font-size: 12px;
					color: #c0c4cc;
					font-weight: 400;
				}
			}

			.right {
				a {}
			}
		}

		.list {
			margin: 10px 0;

			.item {
				width: 26% !important;
				height: auto !important;
				padding-right: 10px !important;

				.topInfo {

					border: 1px solid #f1f1f1;
					box-shadow: 1px 1px 6px #f1f1f1;
					border-radius: 4px;
				}

				.info {
					display: flex;
					padding: 6px;
					padding-bottom: 2px;
					background: #f8f8f8;
					position: relative;

					.avatar {
						width: 16px;
						height: 16px;
						border-radius: 3px;
						display: inline-block;
						margin-right: 8px;
						overflow: hidden;

						img {
							width: 100%;
						}
					}

					.vip {
						width: 13px;
						height: 13px;
						position: absolute;
						left: 0;
						top: 0;
						transform: rotate(-37deg);
					}

					.nickname {
						word-break: keep-all;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
						font-size: 12px;
						flex: 1;
						padding-top: 0 !important;
					}
				}

				.desc {
					font-size: 12px;
					color: rgb(139, 139, 142);
					display: -webkit-box;
					-webkit-line-clamp: 1;
					-webkit-box-orient: vertical;
					overflow: hidden;
					text-overflow: ellipsis;
					margin: 0 6px;
					margin-top: 3px;
				}

				.qrcode-wrap {
					position: relative;
					background: #fff;
					padding: 2px;

					.avatar {
						position: absolute;
						width: 20px;
						height: 20px;
						top: 50%;
						left: 50%;
						margin-left: -10px;
						margin-top: -10px;
						border-radius: 4px;
						border: 2px solid #fff;
						z-index: 2;
					}

					.qrcode {
						width: 100%;
						vertical-align: middle;
					}
				}
			}

			.item:last-child {
				margin-right: 16px;
			}
		}
	}
	
	.profile>view+view {
		position: absolute;
	    margin-top: 12upx;
	}
</style>
