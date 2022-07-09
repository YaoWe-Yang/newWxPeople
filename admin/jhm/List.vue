<template>
	<div class="page">
		<u-sticky>
			<u-tabs ref="tabs" :list="tabList" :current="current" :is-scroll="false" font-size="28"
				inactive-color="#323233" bar-width="80" @change="change">
			</u-tabs>
		</u-sticky>

		<div class="list">
			<div class="item" v-for="(item,index) in list.data" v-if="type=='0'">
				<text class="code">{{item.j_code}}</text>
				<div class="copyBut" @click="copy(item.j_code)">点击复制</div>
			</div>

			<div v-for="(item,index) in list.data" v-if="type=='1'">
				<div class="yDiv">
					<div class="demo_badge_title">激活码：<text>{{item.j_code}}</text>
						<br>使用用户：
						<img :src="item.users.avatar" class="jhmYyUserImg">{{item.users.nickname}}
						<div v-if="item.users.wx_version">
							用户系统：{{item.users.wx_version.system}} 微信版本：{{item.users.wx_version.version}}
						</div>
						<div>
							使用时间：{{$u.timeFormat(item.s_time, 'yyyy-mm-dd hh:MM:ss')}}
						</div>
					</div>
				</div>

			</div>
			<u-loadmore :status="status" v-if="list.data.length!=0" />
			<div class="tips" v-if="list.data.length==0">
			<empty description="暂无数据">
			</empty>
			</div>
		</div>

	</div>
</template>

<script>
	import Empty from '@/pages/rm/components/Empty.vue'
	import {
		Base
	} from '@/store/base.js';

	export default {
		components: {
			Empty
		},
		data() {
			return {
				status: 'loading',
				list: {
					loading: false,
					finished: false,
					query: {
						page0: 1,
						page1: 1,
						type: '0',
						word: '',
					},
					total: 0,
					data: []
				},
				tabList: [{
					name: '未使用',
					type: '0'
				}, {
					name: '已使用',
					type: '1'
				}],
				current: 0,
				type: '0',
				name: '',
				wynum:'',
				yynum:'',

			};
		},
		watch: {
			'list.query': {
				handler() {
					this.subPost();
				},
				deep: true
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
		created() {},
		onLoad(e) {
			this.name = decodeURI(e.name);
			this.subPost();
			uni.setNavigationBarTitle({
				title: decodeURI(e.name) + '（' + e.num + '）'
			});
		},
		methods: {
			copy(code) {
				console.log(code);
				uni.setClipboardData({
					data: code,
					success: () => { //复制成功的回调函数
						uni.showToast({ //提示
							title: '复制成功'
						})
					}
				});
			},
			subPost() {
				var base = new Base();
				var that = this;
				if (that.type == '0') {
					var page = that.list.query.page0
				} else {
					var page = that.list.query.page1
				}
				var params = {
					url: 'sys/jhmList',
					type: 'post',
					data: {
						page: page,
						name: that.name,
						type: that.type,
						word: that.list.query.word,
					},
					sCallBack: function(res) {
						that.tabList[0].name = '未使用(' + res.wynum + ')';
						that.tabList[1].name = '已使用(' + res.yynum + ')';
						
						that.wynum = res.wynum;
						that.yynum = res.yynum;
						
						
						if (res.code == 0) {
							if (res.list.data.length < 30) {
								that.status = "nomore"
							} else {
								that.status = "loadmore"
							}
							var arr = new Array();
							if (page == 1) {
								that.list.data = res.list.data
							} else {
								that.list.data = arr.concat(that.list.data, res.list.data)
							}
						} else {
							that.$toast(res.msg);
						}
					}
				}
				base.request(params);
			},
			change(index) {
				this.current = index;
				this.type = this.tabList[index].type;
				this.list.query.page0 = 1;
				this.list.query.page1 = 1;
				this.list.data = [];

				this.subPost();
			},
			onReachBottom() {
				if (this.list.data.length > 0) {
					if (this.type == '0') {
						this.list.query.page0 = this.list.query.page0 + 1
					} else {
						this.list.query.page1 = this.list.query.page1 + 1
					}
				}
			},
			
			// 分享
			// 这里如果写成onShareAppMessage: res => { ... }形式的箭头函数，在内部会无法获得this
			onShareAppMessage(res) {
				if (res.from === 'button') { // 来自页面内分享按钮
					console.log(res.target)
				}
				return {
					title: decodeURI(this.name)+'的激活码（未使用：'+this.wynum+'）',
					imageUrl: 'https://wqrm.oss-cn-shenzhen.aliyuncs.com/share_card/bg1_jhm'
				}
			}
		},
	};
</script>


<style lang="scss" scoped>
	.list {
		display: flex;
		flex-direction: column;
		background: #f8f8f8;
		min-height: 100vh;
		padding: 20rpx;

		.item {
			flex: 1;
			color: white;
			white-space: pre-wrap;
			background-color: #fff;
			padding: 24rpx;
			border-radius: 16rpx;
			margin-bottom: 16rpx;

			.code {
				background-color: #ff6e07;
				color: #fff;
				padding: 8rpx;
				border-radius: 40rpx;
			}

			.copyBut {
				position: absolute;
				padding: 12rpx 16rpx;
				font-size: 24rpx;
				line-height: 40rpx;
				cursor: pointer;
				background-color: #04BE02;
				color: #fff;
				border-radius: 12rpx;
				right: 40rpx;
				margin-top: -48rpx;
			}
		}
	}


	.yDiv {
		flex: 1;
		color: white;
		white-space: pre-wrap;
		background-color: #fff;
		padding: 24rpx;
		border-radius: 16rpx;
		margin-bottom: 16rpx;

		div {
			color: black;

			text {
				color: red;
				font-style: italic;
				text-decoration: line-through;
			}

			div {
				margin-top: 10rpx;
			}

			.jhmYyUserImg {
				position: relative;
				top: 10rpx;
				width: 40rpx;
				height: 40rpx;
				border-radius: 40rpx;
				margin-right: 10rpx;
			}
		}
	}
	
	
</style>
