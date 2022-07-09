<template>
	<div>
		<u-top-tips ref="uTips" z-index="99999"></u-top-tips>
		<u-popup v-model="visible" mode="bottom" border-radius="32" safe-area-inset-bottom="true" closeable="true">
			<view class="vipTitle">{{title}}</view>
			<div class="qrcode-wrap">
				<empty class="tips" v-if="tips_visible" description="积分不足">
					<template #tips>
						<div class="row">
							<u-button type="success" size="medium" :ripple="true" to="/me/gold">签到获取积分</u-button>

							<u-button type="primary" size="medium" :ripple="true" @click="$refs.openVip.show()"
								style="margin-left:20upx">会员免积分加群</u-button>
						</div>
					</template>
				</empty>
				<template v-else-if="qrcodeText">
					<div class="tips" v-if="item.is_expires==1">
						<i>&#xe651;</i>该群发布时间为{{item.refresh_time | formatDiffDate}}，该二维码可能已过期
					</div>
						
						<view class="viewQr">
							<u-loading mode="circle" size="36" :show="isLoading"></u-loading>
							<canvas canvas-id="qrcode" style="width: 420upx;height: 420upx;position: fixed;right: 100vw;bottom: 100vh;z-index: -9999;opacity: 0;" v-if="isLoading" />
							<image :src="codeImg" mode="widthFix" style="width: 400upx;" lazy-load="true" show-menu-by-longpress="true" @tap="fdimg(''+codeImg+'')" v-else></image>		
						</view>
						
						<view class="msg">
							<!-- <view class="title">长按识别</view> -->
							<view class="des">（企业群需点击二维码放大长按识别）</view>
						</view>
				</template>
				<u-loading v-else type="spinner" />
			</div>
		</u-popup>
		<open-vip ref="openVip">
			<template #tips>
				<a href="JavaScript:;" @click="closeVipOpenAgent()"
					style="float: left;color: #576b93;text-decoration: none;">开通代理</a>可享受永久VIP权限
			</template>
		</open-vip>
	</div>
</template>

<script>
	import uQRCode from '@/common/uqrcode.js';
	import OpenVip from '@/pages/rm/components/OpenVip.vue';
	import Empty from '@/pages/rm/components/Empty.vue';
	import {
		Base
	} from '@/store/base.js';
	export default {
		components: {
			OpenVip,
			Empty
		},
		props: {
			title: {
				type: String,
				default: '二维码'
			}
		},
		data() {
			return {
				isLoading: true,
				visible: false,
				tips_visible: false,
				qrcodeText: null,
				item: null,
				codeImg: null,
			};
		},
		computed: {

		},
		created() {

		},
		methods: {
			show(item) {
				if (item.id) {
					this.item = item;
				} else {
					this.item = item.$orig;
				}
				this.visible = true;
				this.isLoading = true;
				
				var self = this;
				var base = new Base();
				var params = {
					url: 'getQunCard',
					type: 'post',
					data: {
						id: self.item.id
					},
					sCallBack: function(res) {
						if (res.code == 0) {
							self.qrcodeText = res.quncard.qrcode;
							uQRCode.make({
								canvasId: 'qrcode',
								componentInstance: self,
								text: self.qrcodeText,
								size: 210,
								margin: 10,
								fileType: 'png',
								correctLevel: 1,
								success: res => {
									console.log(res);
									self.codeImg = res;
									
									var paramsIs = {
										url: 'isLookQun',
										type: 'post',
										data: {
											id: self.item.id
										},
										sCallBack: function(res) {
											console.log(res);
											self.isLoading = false;
										}
									}
									base.request(paramsIs);
								}
							})
							item.note = true;
							if (res.msg != '') {
								self.$refs.uTips.show({
									title: res.msg,
									type: 'success'
								})
							}
							self.tips_visible = false;
						} else if (res.code == 2) {
							self.tips_visible = true;
						}
					}
				}
				base.request(params);
			},
			hide() {
				self.visible = false;
			},
			fdimg(img) {
				var base = new Base();
				base._previewImage(img);
			},
		},
	};
</script>
<style lang="scss" scoped>
	.qrcode-wrap {
		display: flex;
		align-items: center;
		justify-content: center;
		height: auto;
		flex-direction: column;

		.tips {
			width: 100%;
			color: #ff5858;
			font-size: 26rpx;
			margin-top: 24rpx;
			text-align: center;
			margin-bottom: 40rpx;

			i {
				margin-right: 10rpx;
				font-size: 24rpx;
				color: #edb060;
			}
		}
		
		.viewQr{
			height: 400upx;
			line-height: 400upx;
		}
	}
	
	.msg{
		text-align: center;
		padding: 30rpx 0 40rpx;
		.des{
			font-size: 24rpx;
			color: red;
		}
	}
	
	.btns {
		.row {
			width: 400rpx;
			display: flex;
			justify-content: space-between;
		}
	}
</style>
