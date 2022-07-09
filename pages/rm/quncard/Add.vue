<template>
	<div class="page" v-if="config">

		<div class="main">
			<u-form-item label="群名称" label-width="180rpx">
				<u-input type="text" placeholder="请输入群名称" v-model="qun.name" />
			</u-form-item>
			<u-form-item label="群二维码" label-width="180rpx">
				<div class="up">
					<div v-if="qun.qrcode==null" class="up-btn" @click="uploader()"><i>&#xe68b;</i>
						<text>选择图片</text>
					</div>
					<div v-else class="up-image">
						<i class="btn-close" @click="qun.qrcode=null">&#xe641;</i>
						<u-image :src="qun.qrcode" mode="widthFix" @click="fdimg(qun.qrcode)" />
					</div>
				</div>
			</u-form-item>
			<u-form-item label="群人数" label-width="180rpx">
				<u-input type="number" placeholder="请输入群人数" v-model="qun.num" />
			</u-form-item>
		</div>

		<div class="tips"><i>&#xe651;</i>发布群需消耗{{config.quncard.add_require_gold}}积分，会员免积分，<text
				@click="$refs.openVip.show()">开通会员</text></div>
		<u-button class="btn" type="success" :custom-style="customStyle" @click="add" ripple="true" shape="circle">提交
		</u-button>
		<open-vip ref="openVip" title="开通会员" />
	</div>
</template>
<script>
	import OpenVip from '@/pages/rm/components/OpenVip.vue';
	import {
		Base
	} from '@/store/base.js';
	export default {
		components: {
			OpenVip
		},
		data() {
			return {
				qun: {
					name: null,
					qrcode: null,
					num: null
				},
				customStyle: {
					width: '80%'
				}
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
		created() {
			
		},
		methods: {
			uploader() {
				var base = new Base();
				uni.chooseImage({
					count: 1,
					sizeType: ['compressed'],
					sourceType: ['album'],
					success: (res) => {
						var tempFilePaths = res.tempFilePaths;
						uni.showLoading({
							title: '上传中'
						});
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
								this.qun.qrcode = path.url;
							},
							complete: () => {
								uni.hideLoading();
							}

						})
					}
				});
			},
			add() {
				console.log(this.ad);
				var base = new Base();
				var that = this;
				var params = {
					url: 'addQuncard',
					type: 'post',
					data: that.qun,
					sCallBack: function(res) {
						if (res.code == 0) {
							that.$go('Mgr')
						} else {
							that.$toast(res.msg);
						}
					}
				}
				base.request(params);
			}
		},
	};
</script>


<style lang="scss" scoped>
	.main {
		padding: 40rpx;
	}

	.up {
		width: 80px;
		height: 80px;
		position: relative;

		.up-btn {
			width: 100%;
			height: 100%;
			background: #f7f8fa;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 26rpx;
			color: #606266;
			flex-direction: column;
			border-radius: 10rpx;

			i {
				font-size: 30px;
				color: #dcdee0;
			}
		}

		.btn-close {
			position: absolute;
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

		.up-image {
			width: 80px;
			height: 80px;
			overflow: hidden;

			img {
				width: 100%;
			}
		}
	}

	.tips {
		width: 100%;
		color: #999;
		font-size: 13px;
		padding: 10px 16px;

		i {
			margin-right: 5px;
			font-size: 12px;
			color: #edb060;
			float: left;
		}

		text {
			color: #576b93;
			text-decoration: none;
		}
	}

	.btn {
		margin-top: 30px;
		margin-bottom: 30px;
		margin-left: 10%;
		width: 80%;
	}

	.btns {
		display: flex;
		justify-content: space-between;
		width: 300px;

		.u-button {
			width: 49%;
		}
	}

	.up {
		width: 80px;
		height: 80px;
		margin: 10rpx;

		.up-btn {
			width: 100%;
			height: 100%;
			background: #f7f8fa;
			display: flex;
			align-items: center;
			justify-content: center;
			background: #f4f5f6;

			i {
				font-size: 18px;
				color: #606266;
				font-weight: 600;
			}
		}

		.up-image {
			position: relative;

			img {
				width: 100%;
			}

			.btn-close {
				position: absolute;
				top: 10rpx;
				right: 10rpx;
				z-index: 10;
				background-color: #fa3534;
				border-radius: 100rpx;
				width: 44rpx;
				height: 44rpx;
				display: -webkit-box;
				display: -webkit-flex;
				display: flex;
				-webkit-box-orient: horizontal;
				-webkit-box-direction: normal;
				-webkit-flex-direction: row;
				flex-direction: row;
				-webkit-box-align: center;
				-webkit-align-items: center;
				align-items: center;
				-webkit-box-pack: center;
				-webkit-justify-content: center;
				justify-content: center;
			}
		}
	}
</style>
