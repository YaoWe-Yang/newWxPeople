<template>
	<div class="page" v-if="ad">
		<div class="main">
			<u-form :model="form" ref="uForm">

				<div class="title">广告设置</div>
				<u-form-item :label-position="labelPosition" label="广告内容" label-width="180rpx">
					<u-input type="textarea" :border="border" placeholder="请填写广告内容" v-model="ad.ad_text" />
				</u-form-item>
				<u-form-item :label-position="labelPosition" label="广告图片" label-width="180">
					<div class="up">
						<div v-if="ad.ad_image==null" class="up-btn" @click="uploader()"><i>&#xe68b;</i>
							<text>选择图片</text></div>
						<div v-else class="up-image">
							<i class="btn-close" @click="ad.ad_image=null">&#xe641;</i>
							<u-image :src="ad.ad_image" mode="widthFix" @click="fdimg(ad.ad_image)"/>
						</div>
					</div>
				</u-form-item>

				<div class="title">投放设置</div>

				<u-form-item :label-position="labelPosition" label="粉丝地区" prop="region" label-width="180">
					<u-input :border="border" type="select" v-model="ad.region" placeholder="请选择地区"
						@click="showRegion = true"></u-input>
					<u-picker mode="region" v-model="showRegion" :params="area" safe-area-inset-bottom="true"
						@confirm="onConfirmRegion"></u-picker>
				</u-form-item>

				<u-form-item label="粉丝性别" label-width="180rpx">

					<u-radio-group v-model="ad.sex" direction="horizontal">
						<u-radio name="不限" checked-color="#07c160">不限</u-radio>
						<u-radio name="男" checked-color="#07c160">男</u-radio>
						<u-radio name="女" checked-color="#07c160">女</u-radio>
					</u-radio-group>
				</u-form-item>
				<u-form-item label="代发套餐" label-width="180rpx">
					<u-input :border="border" type="select" v-model="chargeName" placeholder="请选择代发套餐"
						@click="showCharge = true"></u-input>
					<u-action-sheet title="代发套餐" v-model="showCharge" :list="chargeList" :cancel-btn="true"
						border-radius="32" @click="onConfirmNum" />

				</u-form-item>
				
				<div class="okBottom">
					<u-button :custom-style="submitAd" :ripple="true" shape="circle" hair-line="false" @click="add">确认投放
					</u-button>
					<text v-if="chargePrice"><text class="sumText">合计：</text><text
							class="sumLeft">￥</text>{{chargePrice | formatPrice}}</text>
				</div>

			</u-form>
		</div>
	</div>
</template>

<script>
	import {
		Base
	} from '@/store/base.js';
	import RegionList from '@/plugins/region.js';
	export default {
		data() {
			return {
				regionList: RegionList,
				showRegion: false,
				pickerShow: false,
				showCharge: false,
				area: {
					province: true,
					city: true
				},
				ad: {
					ad_text: null,
					ad_image: null,
					region: '不限',
					sex: '不限',
					charge_key: null,
				},
				agree: true,
				service_rate: 0.1,
				loading: false,
				submitAd: {
					width: '110px',
					height: '40px',
					fontWeight: '500',
					border: 'none',
					background: 'linear-gradient(90deg,#ff6034,#ee0a24)',
					color: '#FFFFFF',
					border: '0',
					float: 'right',
					margin: '12rpx 40rpx',

				},
				intro: '',
				rules: {
					intro: [{
							required: true,
							message: '请填写简介'
						},
						{
							min: 5,
							message: '简介不能少于5个字',
							trigger: 'change',
						},
						// 正则校验示例，此处用正则校验是否中文，此处仅为示例，因为uView有this.$u.test.chinese可以判断是否中文
						{
							pattern: /^[\u4e00-\u9fa5]+$/gi,
							message: '简介只能为中文',
							trigger: 'change',
						},
					],
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
			chargeList() {
				let list = [];
				this.config.ad.charge.forEach((item, id) => {
					list.push({
						id: id,
						text: item.name,
						subText: item.desc,
					})
				});
				return list;
			},
			chargeName() {
				if (this.ad.charge_key != null) {
					return this.config.ad.charge[this.ad.charge_key].name;
				}
				return null;
			},
			chargePrice() {
				if (this.ad.charge_key != null) {
					return this.config.ad.charge[this.ad.charge_key].price;
				}
				return null;
			}
		},
		created() {

		},
		methods: {
			fdimg(img) {
				var base = new Base();
				base._previewImage(img);
			},
			onPaySuccess() {
				this.$go('/ad/mgr');
			},
			onConfirmRegion(e) {
				console.log(e);
				this.ad.region = e.province.label == '不限' ? '不限' : e.province.label;
				if (typeof e.city !== 'undefined') {
					this.ad.region += e.city.label == '' ? '' : '-' + e.city.label;
				}
				this.showRegion = false;
			},
			onConfirmNum(e) {
				this.ad.charge_key = e;
				this.showCharge = false;
			},
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
								this.ad.ad_image = path.url;
							},
							complete:()=>{
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
					url: 'adAdd',
					type: 'post',
					data: that.ad,
					sCallBack: function(res) {
						if (res.code == 0) {
							uni.navigateTo({
								url:'/pages/rm/Pay?trade_no='+ res.trade_no
							})
						} else {
							that.$toast(res.msg);
						}
					}
				}
				base.request(params);
				
				// this.$post('/Ad/add', this.ad, res => {
				// 	window.location.href = '/0/?/#/pay?trade_no=' + res.trade_no;
				// })
			},
		},
	};
</script>



<style lang="scss" scoped>
	.page {
		display: flex;
		flex-direction: column;
		background: #f8f8f8;
		min-height: 100vh;
		padding: 10px;
		padding-bottom: 100px;

	}

	.title {
		padding: 4px 8px;
		color: #909399;
		margin-top: 10px;
	}

	.agree {
		margin-top: 10px;
		margin-left: 16px;
		display: flex;
		align-items: center;
		color: #909399;

		a {
			margin-left: 3px;
		}
	}

	.btn {
		width: 80%;
		margin-left: 10%;
		margin-top: 30px;
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

	.okBottom {
		position: fixed;
		left: 0;
		bottom: 0;
		height: 100rpx;
		line-height: 100rpx;
		background-color: #FFFFFF;
		width: 100%;
		text-align: right;

		text {
			color: #ee0a24;
			font-weight: 500;
			font-size: 20px;
			font-family: Avenir-Heavy, PingFang SC, Helvetica Neue, Arial, sans-serif;
			display: inline-block;
			.sumText{
				color: #323233;
				font-size: 14px;
			}
			.sumLeft{
				font-size: 12px;
			}
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
