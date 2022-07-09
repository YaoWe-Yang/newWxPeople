<template>
	<div class="page" v-if="order_info">
		<template v-if="order_info.status==0">
			<div class="header">
				<div class="trade_no">{{order_info.body}}</div>
				<div class="money"><span>¥</span>{{order_info.amount | formatPrice}}</div>
				<div class="time count-down">
					<!-- <u-count-down class="count-down" :time="15*60*1000" format="支付剩余时间：mm:ss" /> -->
					支付剩余时间：
					<u-count-down :timestamp="15*60" bg-color="" font-size="24rpx" color="hsla(0,0%,100%,.8)"
						separator-color="hsla(0,0%,100%,.8)" :show-hours="false"></u-count-down>
				</div>
			</div>
			<template>
				<div class="paytypetitle">
					付款方式
				</div>
				<!-- <div class="paytypelist" v-model="type">
					<u-cell-group :border="false">
						<u-cell-item icon="weixin-fill" color="#4fc08d" title="微信" clickable @click="type = 'wepay'" arrow="false">
							<u-radio-group v-model="value">
								<template #right-icon>
									<u-radio :label-disabled="false" active-color="#4fc08d" name="wepay"></u-radio>
								</template>
							</u-radio-group>
						</u-cell-item>

						<u-cell-item v-if="false" icon="alipay" title="支付宝" clickable @click="type = 'alipay'">
							<template #right-icon>
								<u-radio checked-color="#4fc08d" name="alipay" />
							</template>
						</u-cell-item>
					</u-cell-group>
				</div> -->
				<u-radio-group class="paytypelist" v-model="type" :size="40" icon-size="30">
					<u-cell-group :border="false">
						<u-cell-item icon="wechat" title="微信" clickable @click="type = 'wepay'" :arrow="false"
							:title-style="{'padding':'30rpx 8rpx'}">
							<template #right-icon>
								<u-radio active-color="#4fc08d" name="wepay" />
							</template>
						</u-cell-item>
						<u-cell-item v-if="false" icon="alipay" title="支付宝" clickable @click="type = 'alipay'">
							<template #right-icon>
								<u-radio active-color="#4fc08d" name="alipay" />
							</template>
						</u-cell-item>
					</u-cell-group>
				</u-radio-group>
				<div class="agree">
					<text style="float: left;">点击“确认支付”表示您同意</text><a href="JavaScript:;"
						@click="$go('/html/fufeixieyi')"
						style="color: #576b93;text-decoration: none;">《微群人脉平台付费服务协议》</a>
				</div>
				<div class="btn">
					<u-button :custom-style="btn" @click="pay()" :hair-line="false" :ripple="true" shape="circle">确认支付
					</u-button>
				</div>
			</template>
		</template>
		<template v-else>
			<div style="padding:160rpx">
				<u-empty text="订单已支付">
					<template #src>
						<i class="success-icon">&#xe610;</i>
					</template>
				</u-empty>
				<u-button type="success" @click="goBalck" :hair-line="false" :ripple="true"
					shape="circle">返回个人中心</u-button>
			</div>
		</template>
		<!-- <pay-tips ref="payTips" /> -->
		<u-popup v-model="loading" mode="center" border-radius="14">
			<div class="loading-wrap" style="margin: 0 auto;text-align: center;padding:20rpx;">
				<u-loading size="40" color="#07c160" style="padding:20rpx;"></u-loading>
				<view style="padding-top: 6rpx;">正在查询订单状态...</view>
			</div>
		</u-popup>

	</div>
</template>

<script>
	// import PayTips from "@/components/PayTips.vue";
	import {
		Base
	} from '@/store/base.js';
	export default {
		components: {
			// PayTips
		},
		data() {
			return {
				order_info: null,
				type: 'wepay',
				agree: true,
				loading: false,
				trade_no: '',
				btn: {
					backgroundColor: '#4fc08d',
					color: '#FFFFFF',
					height: '100%',
					lineHeight: '100upx',
					border: '0',
				}
			};
		},
		created() {
			// this.getOrderInfo();
		},
		onLoad: function(option) {

			this.trade_no = option.trade_no;
			this.getOrderInfo();
		},
		methods: {
			getOrderInfo() {
				var self = this;
				var base = new Base();
				var params = {
					url: 'getOrderInfo',
					data: {
						trade_no: self.trade_no
					},
					sCallBack: function(res) {
						self.order_info = res.order_info;
						if (self.loading && self.order_info.status == 0) {
							self.getOrderInfo();
						} else {
							self.loading = false;

						}
					}
				}
				base.request(params);

			},
			pay() {
				if (this.type == 'wepay') {
					this.jsApi();
				} else if (this.type == 'alipay') {
					this.h5();
				}
			},
			h5() {
				this.$refs.payTips.show(this.order_info.trade_no, this.type).then(() => {
					this.pauSuccess();
				});
			},
			jsApi() {
				var self = this;
				var base = new Base();
				var params = {
					url: 'getJsPayParams',
					data: {
						trade_no: self.trade_no
					},
					sCallBack: function(res) {
						if (res.code == 0) {
							let paymentData = res.params;
							uni.requestPayment({
								timeStamp: paymentData.timeStamp,
								nonceStr: paymentData.nonceStr,
								package: paymentData.package,
								signType: paymentData.signType,
								paySign: paymentData.paySign,
								success: (res) => {
									// if (res.err_msg === "get_brand_wcpay_request:ok") {
									self.pauSuccess();
									// } else {
									// console.log(res);
									// uni.showToast({
									// 	title:'支付成功',
									// 	success() {
									// 		var notify = {
									// 			url: 'notify',
									// 			type:'post',
									// 			sCallBack: function(res) {
									// 				if(res){
									// 					uni.redirectTo({
									// 						url: '/pages/rm/me/Index'
									// 					});
									// 				}
									// 			}
									// 		}
									// 		base.request(notify);
									// 	}
									// })
									// }
								},
								fail: (res) => {
									uni.showModal({
										content: "支付失败，原因为：" + res.errMsg,
										showCancel: false
									})
								},
								complete: () => {

								}
							})
						} else {
							console.log(res);
						}

					}
				}
				base.request(params);
			},
			pauSuccess() {
				this.loading = true;
				this.getOrderInfo();
			},
			goBalck(){
				uni.reLaunch({
				    url: '/pages/rm/me/Index'
				});
			}
		}
	};
</script>

<style scoped lang="scss">
	.page {
		display: flex;
		flex-direction: column;
		background: #f8f8f8;
		min-height: 100vh;
	}

	.header {
		display: flex;
		flex-direction: column;
		background: #4fc08d;
		padding-top: 30px;
		padding-bottom: 30px;
		position: relative;
		align-items: center;
		color: #fff;

		.money {
			font-size: 36px;
			margin-top: 24px;

			span {
				font-size: 18px;
				margin-right: 8px;
			}
		}

		.count-down {
			color: rgba($color: #fff, $alpha: 0.8);
			font-size: 12px;
			margin-top: 10px;
		}
	}

	.paytypetitle {
		margin-top: 8px;
		height: 40px;
		line-height: 40px;
		padding: 0 10px;
	}

	.paytypelist {
		.van-hairline--top-bottom::after {
			border: 0;
		}

		.van-cell {
			padding: 20px 20px;
		}

		.van-cell::after {
			border: 0;
		}

		.van-icon-wechat {
			color: #07c160;
			font-size: 30px;
			margin-right: 10px;
		}

		.van-icon-alipay {
			color: #0398e0;
			font-size: 30px;
			margin-right: 10px;
		}
	}

	.btn {
		margin: 60upx auto;
		text-align: center;
		font-size: 32upx;
		height: 100upx;
		line-height: 100upx;
		width: 80%;
		border-radius: 200upx;
	}

	.success-icon {
		font-size: 100px;
		display: inline-block;
		height: 160px;
		width: 160px;
		text-align: center;
		line-height: 160px;
		color: #67c23a;
	}

	.agree {
		margin: 14px 16px;
		font-size: 12px;
		color: #888;
	}

	.loading-wrap {
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
