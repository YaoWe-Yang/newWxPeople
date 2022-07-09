<template>
	<div class="page" v-if="config">

		<div class="main">
			<u-form-item label="昵称" label-width="180rpx">
				<u-input type="text" placeholder="请输入昵称" v-model="card.nickname" />
			</u-form-item>
			<u-form-item label="头像" label-width="180rpx">
				<div class="up">
					<div v-if="card.avatar==null" class="up-btn" @click="uploader('avatar')"><i>&#xe68b;</i>
						<text>上传头像</text>
					</div>
					<div v-else class="up-image">
						<i class="btn-close" @click="card.avatar=null">&#xe641;</i>
						<u-image :src="card.avatar" mode="widthFix" @click="fdimg(card.avatar)" />
					</div>
				</div>
			</u-form-item>
			<u-form-item label="二维码" label-width="180rpx">
				<div class="up">
					<div v-if="card.qrcode==null" class="up-btn" @click="uploader('qrcode')"><i>&#xe68b;</i>
						<text>选择图片</text>
					</div>
					<div v-else class="up-image">
						<i class="btn-close" @click="card.qrcode=null">&#xe641;</i>
						<u-image :src="card.qrcode" mode="widthFix" @click="fdimg(card.qrcode)" />
					</div>
				</div>
			</u-form-item>
			<u-form-item label="性别" label-width="180rpx">
				<u-radio-group v-model="card.sex" direction="horizontal">
					<u-radio name="不公开" checked-color="#07c160">不公开</u-radio>
					<u-radio name="男" checked-color="#07c160">男</u-radio>
					<u-radio name="女" checked-color="#07c160">女</u-radio>
				</u-radio-group>
			</u-form-item>
			
			<u-form-item label="地区" label-width="180">
				<u-input type="select" v-model="card.region" placeholder="点击选择地区"
					@click="showRegion = true"></u-input>
				<u-picker mode="region" v-model="showRegion" :params="area" safe-area-inset-bottom="true"
					@confirm="onConfirmRegion"></u-picker>
			</u-form-item>
			
			<u-form-item label="介绍" label-width="180rpx">
				<u-input type="textarea" placeholder="请填写介绍" v-model="card.summary" maxlength="30" rows="3"/>
			</u-form-item>
			
		</div>

		<div class="tips" ><i>&#xe651;</i>发布个人名片需消耗{{config.quncard.add_require_gold}}积分，会员免积分，<text
				@click="$refs.openVip.show()">开通会员</text></div>
				<div class="btn">
		<u-button type="success" :custom-style="customStyle" @click="add" ripple="true" shape="circle">提交
		</u-button>
				</div>
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
				card: {
				  nickname: null,
				  avatar: null,
				  avatarPath: null,
				  qrcode: null,
				region: '不限',
				sex: '不公开',
				  summary: null
				},
				customStyle: {
					width: '80%'
				},
				
				showRegion: false,
				area: {
					province: true,
					city: true
				},
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
			onConfirmRegion(e) {
				console.log(e);
				this.card.region = e.province.label == '不限' ? '不限' : e.province.label;
				if (typeof e.city !== 'undefined') {
					this.card.region += e.city.label == '' ? '' : '-' + e.city.label;
				}
				this.showRegion = false;
			},
			onConfirmNum(e) {
				this.card.charge_key = e;
				this.showCharge = false;
			},
			uploader(type) {
				
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
								if(type == 'avatar'){
								this.card.avatar = path.url;
								this.card.avatarPath = path.path;
								}else{
									this.card.qrcode = path.url;
								}
							},
							complete: () => {
								uni.hideLoading();
							}

						})
					}
				});
			},
			add() {
				if(this.card.sex == '不公开'){
					this.card.sex = null;
				}
				console.log(this.card);
				var base = new Base();
				var that = this;
				var params = {
					url: 'addCard',
					type: 'post',
					data: that.card,
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
		padding-bottom: 30px;
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
