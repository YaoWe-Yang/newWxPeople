<template>
	<div class="page">
		<div class="headerRight" @click="$go('CashoutNoteList')">提现记录</div>
		<div class="header">
			<div class="cancashout">
				<div class="label">可提现佣金</div>
				<div class="money">
					<span>¥</span>{{user.wallet | formatPrice}}
				</div>
			</div>
		</div>
		<div class="payment-channel" v-if="false">
			<div class="title">
				提现到
			</div>
			<van-radio-group class="list" v-model="payment_channel">
				<van-cell-group>
					<van-cell icon="wechat" title="微信" clickable @click="payment_channel = 'wepay'">
						<template #right-icon>
							<van-radio checked-color="#1989fa" name="wepay" />
						</template>
					</van-cell>
					<van-cell icon="alipay" title="支付宝" clickable @click="payment_channel = 'alipay'"
						checked-color="#fe2d55">
						<template #right-icon>
							<van-radio checked-color="#1989fa" name="alipay" />
						</template>
					</van-cell>
				</van-cell-group>
			</van-radio-group>
		</div>
		<div class="payment-qrcode" v-if="payment_channel=='alipay'">
			<div class="title">
				收款码
			</div>
			<div class="wrap">
				<div class="up">
					<div v-if="payment_qrcode==null" class="up-btn" @click="uploader()"><i>&#xe68b;</i></div>
					<div v-else class="up-image">
						<i class="btn-close" @click="payment_qrcode=null">&#xe641;</i>
						<u-image :src="payment_qrcode" mode="widthFix" />
					</div>
				</div>
			</div>
		</div>
		<div class="tips">
			<div class="title">提现说明</div>
			<div class="content">
				1、提现无门槛，无手续费
				<br />2、提现实时到账（微信实时到账，支付宝1个工作日到账）
				<br />3、一天只能提现一次
			</div>
		</div>
		<!-- <u-button class="btn" :loading="loading" :disabled="loading" type="primary" loading-text="正在提交..."
			@click="submit" size="default" :ripple="true" >立即提现</u-button> -->
		<u-button class="btn" type="primary" @click="submit" size="default" :ripple="true">立即提现</u-button>
	</div>
</template>

<script>
	import {
		Base
	} from '@/store/base.js';
	export default {
		data() {
			return {
				loading: false,
				payment_channel: 'alipay',
				payment_qrcode: null,
				payment_qrcode_path:null,
			};
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
			onNavBarRightBtnClick() {
				this.$go('cashout_note_list');
			},
			submit() {
				if (this.payment_channel == 'alipay' && this.payment_qrcode == null) {
					this.$toast('请上传收款码');
					return;
				}
				this.loading = true;

				var base = new Base();
				var that = this;
				var params = {
					url: 'cashout',
					type: 'post',
					data: {
						payment_channel: that.payment_channel,
						payment_qrcode: that.payment_qrcode_path
					},
					sCallBack: function(res) {
						if (res.code == 0) {
							uni.redirectTo({
								url: 'CashoutNoteList'
							});
						} else {
							that.$toast(res.msg);
						}
					},
					eCallBack: function() {
						that.loading = false;
					}
				}
				base.request(params);
			},
			uploader() {
				var base = new Base();
				uni.chooseImage({
					count: 1,
					sizeType: ['compressed'],
					sourceType: ['album'],
					success: (res) => {
						var tempFilePaths = res.tempFilePaths;
						uni.uploadFile({
							url: base.baseRequestUrl + 'uploader',
							filePath: tempFilePaths[0],
							name: 'file',
							formData: {
								'type': "file"
							},
							success: (item) => {
								let path = JSON.parse(item.data);
								console.log(path);
								this.payment_qrcode = path.url;
								this.payment_qrcode_path = path.path;
							}

						})
					}
				});

			}
		},
	};
</script>


<style lang="scss" scoped>
	.page {
		display: flex;
		flex-direction: column;
		background: #fff;
		min-height: 100vh;
		padding-bottom: 100px;
	}

	.headerRight {
		position: absolute;
		z-index: 1;
		right: 0;
		padding: 20rpx;
		color: #1989fa;
	}

	.header {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 30px 0;
		position: relative;
		background: #ffff;

		.tips {
			position: absolute;
			top: 10px;
			right: 10px;
			color: #c0c4cc;
		}

		.cancashout {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;

			.label {
				color: #909399;
			}

			.money {
				font-size: 50px;
				font-weight: 700;
				color: rgb(254, 45, 85);
				margin-top: 5px;

				span {
					margin-right: 5px;
					font-size: 20px;
				}
			}
		}
	}

	.title {
		height: 20px;
		line-height: 20px;
		position: relative;
		padding-left: 10px;
	}

	.title::after {
		content: "";
		position: absolute;
		left: 0;
		top: 4px;
		border-left: 2px solid #1989fa;
		bottom: 4px;
	}

	.payment-channel {
		margin-top: 10px;
		padding: 16px;

		.list {
			margin-top: 8px;

			.van-hairline--top-bottom::after {
				border: 0;
			}

			.van-cell {
				padding: 16px 0px;
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
	}

	.payment-qrcode {
		margin-top: 10px;
		padding: 16px;

		.wrap {
			background: #fff;
			padding: 10px 0;
			overflow: hidden;

			.up {
				width: 80px;
				height: 80px;

				.up-btn {
					width: 100%;
					height: 100%;
					background: #f7f8fa;
					display: flex;
					align-items: center;
					justify-content: center;

					i {
						font-size: 30px;
						color: #dcdee0;
					}
				}

				.up-image {
					position: relative;

					img {
						width: 100%;
					}

					.btn-close {
						position: absolute;
						z-index: 2;
						top: -4px;
						right: -4px;
						background: rgba($color: #333, $alpha: 0.8);
						color: #fff;
						border: 2px solid #fff;
						width: 18px;
						height: 18px;
						border-radius: 18px;
						font-size: 12px;
						display: flex;
						align-items: center;
						justify-content: center;
					}
				}
			}
		}
	}

	.tips {
		margin-top: 10px;
		padding: 16px;

		.content {
			padding: 10px 0;
			padding-top: 8px;
			font-size: 13px;
			line-height: 1.8;
			color: #909399;
			background: #fff;
		}
	}

	.btn {
		background: #1989fa;
		color: #fff;
		text-align: center;
		// padding: 12px 0vw;
		position: fixed;
		left: 10%;
		right: 10%;
		bottom: 20px;
		width: 80%;
		border-radius: 5px;
		font-size: 16px;
		border: 0;
	}
</style>
