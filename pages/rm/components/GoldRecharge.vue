<template>
	<u-popup v-if="config" v-model="visible" mode="bottom" border-radius="32" safe-area-inset-bottom="true"
		closeable="true">
		<view class="vipTitle">{{title}}</view>
		<div class="wrap">
			<div class="list">
				<div class="item" v-for="(item, key) in config.gold.charge" :key="key" :class="{active:charge_key==key}"
					@click="charge_key=key">
					<div class="gold"><i>&#xe63a;</i>{{item.num}}</div>
					<div class="money">售价 {{item.price/100}} 元</div>
					<div class="gift" v-if="item.gift>0">送{{item.gift}}积分</div>
				</div>
			</div>
			<div v-if="$scopedSlots.tips" class="tips">
				<i>&#xe651;</i>
				<slot name="tips"></slot>
			</div>
			<div class="btn" @click="createOrder()">确认支付</div>
		</div>
	</u-popup>
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
				visible: false,
				charge_key: null
			};
		},
		computed: {
			config() {
				return this.$store.state.config;
			}
		},
		created() {},
		methods: {
			show() {
				this.visible = true;
				this.charge_key = this.config.gold.charge.length - 1;
			},
			hide() {
				this.visible = false;
			},
			createOrder() {
				const self = this;
				var base = new Base();
				var params = {
					url: 'createOrder',
					type: 'post',
					data: {
						type: 'gold',
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
	.wrap {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 40upx;

		.list {
			display: flex;
			flex-wrap: wrap;
			width: 100%;
			justify-content: space-between;

			.item {
				background: rgb(247, 248, 249);
				text-align: center;
				position: relative;
				border-radius: 6px;
				padding: 13px 0;
				width: 30%;

				.gold {
					font-size: 22px;
					font-weight: 500;

					i {
						margin-right: 6px;
						color: #4fc08d;
						font-size: 15px;
					}
				}

				.money {
					margin-top: 6px;
					color: #909399;
					font-size: 13px;
				}

				span {
					font-size: 13px;
					margin-left: 3px;
					font-weight: 500;
				}

				.gift {
					position: absolute;
					top: -20px;
					right: 0;
					height: 24px;
					line-height: 24px;
					background-color: #fef0f0;
					border: 1px solid #fde2e2;
					color: #f56c6c;
					padding: 0px 8px;
					border-radius: 4px;
					font-size: 12px;
					font-weight: 500;
				}

				.gift::after {
					content: "";
					position: absolute;
					bottom: -6px;
					left: 6px;
					border-right: 6px solid transparent;
					border-left: 6px solid transparent;
					border-top: 6px solid #fef0f0;
				}
			}

			.item.active {
				background: rgb(95, 202, 96);
				color: #fff;

				i {
					color: #fff;
				}

				.money {
					color: #fff;
				}
			}
		}

		.tips {
			width: 100%;
			margin-top: 20px;
			color: #999;
			font-size: 13px;

			i {
				margin-right: 5px;
				font-size: 12px;
				color: #edb060;
			}
		}

		.btn {
			background: rgb(95, 202, 96);
			color: #fff;
			text-align: center;
			font-size: 32upx;
			height: 100upx;
			line-height: 100upx;
			width: 80%;
			margin-top: 40upx;
			border-radius: 200upx;
		}
	}
</style>
