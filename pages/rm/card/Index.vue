<template>
	<view>
		<u-sticky>
			<view class="">
				<!-- 搜索 -->
				<view class="search">
					<u-search placeholder="输入关键词搜索名片" :show-action="true" :animation="true" :clearabled="true" @search="search" @custom="search"></u-search>
				</view>

			</view>


			<!-- <view style="background-color:#ffffff">
					<u-dropdown style="display: flex;box-shadow: 0 2px 12px rgba(100,101,102,.12);" active-color="#19be6b">
						<u-dropdown-item v-model="value1" title="地区" :options="options1"></u-dropdown-item>
						<u-dropdown-item v-model="value2" title="性别" :options="options2"></u-dropdown-item>
						<u-dropdown-item v-model="value3" title="筛选" :options="options3"></u-dropdown-item>
					</u-dropdown>
				</view> -->
		</u-sticky>


		<!-- tab内容页 -->
		<view>

			<view v-for="(item, index) in tabs" :key="index">
				<view class="qItem">
				<view class="avatar">
					<u-lazy-load :image="item.avatar" mode="widthFix" @tap="imgAvatar(item.avatar)"></u-lazy-load>
				</view>
				<view class="profile">
					<view class="nickname">
						<text class="userCardNickname">{{item.nickname}}</text>
						<i class="sexIcon man" v-if="item.sex=='男'" style="float:left">&#xe7b2;</i>
						<i class="sexIcon woman" v-else-if="item.sex=='女'">&#xe7b1;</i>
					</view>
					<view class="region" v-if="item.region!=''">{{item.region?item.region:''}}</view>
					<view class="summary" v-if="item.summary!=''">{{item.summary?item.summary:''}}</view>
				</view>
				<view class="btn">
					<u-button v-if="item.note==null" type="success" size="medium" @click="showQrcode(item,index)">加好友
					</u-button>
					<u-button v-else type="warning" size="medium" @click="$refs.qrcode.show(item.qrcode)">已查看</u-button>
				</view>
				</view>
				
				<view v-if="$isAdDisplay(index,config.qunad_num)">
				<ad-custom unit-id="adunit-ee658640adbfd4ea" v-if="config.adswitch"></ad-custom>
				</view>
			</view>
			
			
			<u-loadmore :status="status" />

		</view>

		<u-popup v-model="AvatarShow" mode="center" border-radius="14" closeable="true">
			<view class="imgInfo">
				<u-lazy-load :image="AvatarImage" img-mode="heightFix" height="600rpx" border-radius="8"></u-lazy-load>
			</view>
		</u-popup>

		<qrcode title="扫码加好友" ref="qrcode" />


		<view class="container">
			<tabBar :currentPage="2"></tabBar>
		</view>
	</view>
</template>

<script>
	import tabBar from '@/pages/rm/tabBar/tabBar.vue';
	import OpenAgent from '@/pages/rm/components/OpenAgent.vue';
	import OpenVip from '@/pages/rm/components/OpenVip.vue';
	import RegionList from '@/plugins/region.js';
	import Qrcode from '@/pages/rm/components/ShowQrcode.vue';
	import {
		Base
	} from '@/store/base.js';
	export default {
		components: {
			tabBar,
			Qrcode,
			OpenAgent,
			OpenVip,
		},
		data() {
			return {
				wxTabBar: this.$store.state.wxTabBar,
				AvatarShow: false,
				AvatarImage: '',
				value1: 1,
				value2: 2,
				value3: 3,
				options1: [{
						label: '默认排序',
						value: 1,
					},
					{
						label: '距离优先',
						value: 2,
					}
				],
				options2: [{
						label: '不限',
						value: 1,
					},
					{
						label: '男',
						value: 2,
					},
					{
						label: '女',
						value: 3,
					},
				],
				options3: [{
					label: '过滤已查看过的名片',
					value: 1,
				}, ],

				swiperHeight: '4700',
				swiperHRow: '4700',
				tabs: '',

				status: 'loading',
				listNum: 30,
				page: 1,
				list: {
					loading: false,
					finished: false,
					page: 1,
					query: {
						words: '',
						region: null,
						sex: null,
						hidden_seen: false,
					},
					total: 0,
					data: []
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
		methods: {
			open(index) {
				// 展开某个下来菜单时，先关闭原来的其他菜单的高亮
				// 同时内部会自动给当前展开项进行高亮
				this.$refs.uDropdown.highlight();
			},
			close(index) {
				// 关闭的时候，给当前项加上高亮
				// 当然，您也可以通过监听dropdown-item的@change事件进行处理
				this.$refs.uDropdown.highlight(index);
			},
			change() {
				// 更多的细节，如有需要请自行根据业务逻辑进行处理
				// this.$refs.uDropdown.highlight(xxx);
			},
			showQrcode(item, index) {
				if (this.list.query.words != '' && this.user.is_vip == 0) {
					uni.showModal({
						title: '提示',
						content: '非会员不支持查看精准名片',
						cancelText: '暂不需要',
						confirmText: '开通会员',
						success: function(res) {
							this.$refs.openVip.show();
						}
					});
					return;
				}
				this.tabs[index].note = 1;
				this.$refs.qrcode.show(item.qrcode)
			},
			// 加载群列表
			getUserCard() {
				this.status = "loading";
				const self = this;
				var base = new Base();
				var params = {
					url: 'getCardList?page=' + self.page + '&words=' + this.list.query.words + '&hidden_seen=false',
					sCallBack: function(ress) {
						var res = ress.list;
						if (res.data.length < 30) {
							self.status = "nomore"
						} else {
							self.status = "loadmore"
						}

						var arr = new Array();
						if (self.tabs) {
							self.tabs = arr.concat(self.tabs, res.data)
						} else {
							self.tabs = res.data;
						}

						uni.stopPullDownRefresh();
					}
				}
				base.request(params);
			},
			imgAvatar(img) {
				console.log(img);
				this.AvatarImage = img;
				this.AvatarShow = true;
			},

			search(text) {
				this.list.query.words = text;
				this.tabs = '';
				this.getUserCard();

			}
		},
		//下拉	
		onReachBottom() {
			//避免多次触发
			if (this.status == 'loading' || this.status == 'nomore') {
				return;
			}
			this.page = this.page + 1
			this.getUserCard();
			this.swiperHeight = this.swiperHeight * 1 + this.swiperHRow * 1;
			// console.log(this.swiperHeight);
		},
		onLoad() {
			this.getUserCard();
			console.log(this.swiperHeight);
			uni.setNavigationBarTitle({
				title: this.config.title
			});
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
			this.getUserCard();
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000);
		}
	}
</script>

<style lang="scss">
	@import "@/pages/rm/index.scss";

	.imgInfo {
		padding: 20rpx;
		text-align: center;
	}
</style>
