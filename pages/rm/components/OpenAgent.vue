<template>
	<div>
		
	<u-popup v-if="config" v-model="visible" mode="bottom" border-radius="32" safe-area-inset-bottom="true"
		closeable="true">
		
		<u-icon name="gift-fill" class="left" @click="showJhm = true;visible = false"></u-icon>
		<view class="vipTitle">{{title}}</view>
		<div class="level">
			<div class="title">好友消费分成说明：</div>
			<u-table border-color="#edb060" align="left" color="#323233">
				<u-tr>
					<u-th>代理级别</u-th>
					<u-th>一级好友</u-th>
					<u-th>二级好友</u-th>
				</u-tr>
				<u-tr>
					<u-td>普通用户</u-td>
					<u-td>{{config.agent.default_commission_ratio.direct*100}}%</u-td>
					<u-td>-</u-td>
				</u-tr>
				<u-tr v-for="(item, key) in config.agent.charge" :key="key">
					<u-td>{{item.name}}</u-td>
					<u-td>{{item.commission_ratio.direct*100}}%</u-td>
					<u-td v-if="item.commission_ratio.indirect">{{item.commission_ratio.indirect*100}}%</u-td>
					<u-td v-else>-</u-td>
				</u-tr>
			</u-table>
			<div class="tips">一级好友表示你邀请的好友，二级好友表示你的好友邀请的好友，好友在平台的所有消费都有提成。</div>
		</div>
		<div class="wrap">
			<div class="tips2">
				<span>限时活动</span>现在开通代理即赠送永久会员
			</div>
			<div class="list">
				<div class="item" v-for="(item, key) in config.agent.charge" :key="key"
					:class="{active:charge_key==key}" @click="charge_key=key">
					<div class="vip" v-if="item.vip==1">送会员</div>
					<div class="price">
						<span>¥</span>{{item.price/100}}
					</div>
					<div class="pldprice">
						<span>¥</span>{{item.original_price/100}}
					</div>
					<div class="name">{{item.name}}<span>永久</span></div>
				</div>
			</div>

			<view class="btn" type="primary" @click="createOrder()">确认开通</view>
		</div>
		
		
	</u-popup>
	
	<u-modal v-model="showJhm" title="激活码" show-cancel-button="true" @confirm="JhPost">
		<div class="jhmDiv">
			<input type="text" placeholder="请输入激活码" @input="onKeyInput" />
			<!-- <div>目前系统默认开卡{{config.code_num}}个</div> -->
		</div>
	</u-modal>
	
	</div>
	
</template>

<script>
	import {
		Base
	} from '@/store/base.js';
	export default {
		props: {
			title: {
			  type: String,
			  default: '二维码'
			},
		},
		data() {
			return {
				showJhm: false,
				visible: false,
				charge_key: null,
				jhmText:'',
			};
		},
		computed: {
			config() {
				return this.$store.state.config;
			}
		},
		created() {},
		methods: {
			onKeyInput: function(event) {
				this.jhmText = event.target.value
			},
			JhPost() {
				var base = new Base();
				var that = this;
				var params = {
					url: 'JhPost',
					type: 'post',
					data: {
						text: that.jhmText
					},
					sCallBack: function(res) {
						if (res.code == 0) {
							uni.showToast({ //提示
								title: res.msg,
								duration: 3000,
								success() {
									uni.redirectTo({
									    url: '/pages/rm/me/Index'
									});
								}
							})
							
						} else {
							that.$toast(res.msg);
						}
					}
				}
				base.request(params);
			},
			show() {
				this.visible = true;
				this.charge_key = this.config.agent.charge.length - 1;
			},
			hide() {
				this.visible = false;
			},
			getGoodsList() {
				this.$get("/Finance/getGoodsList", res => {
					this.goods_list = res.agent_list;
					this.goods = this.goods_list[this.goods_list.length - 1];
				});
			},
			createOrder() {
				const self = this;
				var base = new Base();
				var params = {
					url: 'createOrder',
					type: 'post',
					data: {
						type: 'agent',
						charge_key: self.charge_key
					},
					sCallBack: function(res) {
						uni.navigateTo({
							url:'/pages/rm/Pay?trade_no='+ res.trade_no
						})
					}
				}
				base.request(params);
			}
		},
	};
</script>
<style lang="scss" scoped>
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

	i {
		font-family: "iconfont";
		font-size: 28upx;
		font-style: normal;
	}
	
	.left{
		position: absolute;
		padding: 26rpx;
		font-size: 40rpx;
		color: #f56c6c;
		animation: zy 2.5s .15s linear infinite;
	}

	.vipTitle {
		-webkit-flex-shrink: 0;
		flex-shrink: 0;
		font-weight: 500;
		font-size: 16px;
		line-height: 48px;
		text-align: center;
	}

	.level {
		padding: 0 16px;

		.title {
			font-size: 14px;
			margin-bottom: 6px;
		}

		.tips {
			font-size: 12px;
			margin-top: 6px;
			color: #999;
		}
	}
	.wrap {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 40upx;
		border-top: 1px solid #f1f1f1;

		.tips2 {
			font-size: 13px;
			margin-top: 6px;
			width: 100%;
			border: 1px solid #f56c6c;
			border-radius: 3px;

			span {
				background: #f56c6c;
				padding: 2px 6px;
				height: 100%;
				display: inline-block;
				color: #fff;
				margin-right: 8px;
			}
		}

		.list {
			display: flex;
			flex-wrap: wrap;
			width: 100%;
			padding-top: 10px;
			justify-content: space-between;

			.item {
				text-align: center;
				border: 1px solid rgba(237, 176, 96, 0.2);
				border-radius: 4px;
				overflow: hidden;
				position: relative;

				width: 31%;

				.price {
					font-size: 26px;
					color: rgb(237, 176, 96);
					font-weight: 600;
					padding-top: 25px;
					padding-bottom: 10px;

					span {
						font-size: 14px;
						font-weight: 300;
						margin-right: 3px;
					}
				}

				.pldprice {
					padding-bottom: 14px;
					color: #909399;
					text-decoration: line-through;
				}

				.name {
					background: rgb(249, 236, 219);
					padding: 6px 0;

					span {
						font-size: 12px;
						margin-left: 5px;
						border: 1px solid #6b6b40;
						border-radius: 3px;
						padding: 2px 3px;
					}
				}

				.vip {
					position: absolute;
					top: 0px;
					left: -26px;
					width: 80px;
					height: 24px;
					line-height: 26px;
					transform: rotate(-40deg);
					font-size: 12px;
					background: rgb(249, 236, 219);
				}
			}

			.item.active {
				border: 1px solid rgba(237, 176, 96, 1);

				.name {
					background: rgb(229, 186, 121);
				}

				.vip {
					background: rgb(229, 186, 121);
				}
			}
		}

		.btn {
			background-image: linear-gradient(-60deg, #ff5858 0%, #f09819 100%);
			color: #fff;
			text-align: center;
			font-size: 16px;
			height: 50px;
			line-height: 50px;
			width: 80%;
			margin-top: 20px;
			border: 0;
			border-radius: 200rpx;
		}
	}
	
	.jhmDiv {
		padding: 60rpx;
		text-align: center;
	
		input {
			min-height: 70rpx;
			background-color: #f3f3f3;
			border-radius: 100rpx;
		}
	
		div {
			color: #ff5959;
			font-size: 24rpx;
			font-weight: 700;
			padding-top: 40rpx;
		}
	}
</style>
