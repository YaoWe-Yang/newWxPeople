<template>
	<!-- <div> -->
	<u-popup v-model="visible" mode="bottom" border-radius="32" safe-area-inset-bottom="true" closeable="true">
		<view class="vipTitle">{{title}}</view>
		<div class="qrcode-wrap">
			<template v-if="qrcode">
				<div class="tips" v-if="tips">{{tips}}</div>

				<u-loading mode="circle" size="36" :show="isLoading"></u-loading>
				<canvas canvas-id="qrcode" style="width: 400upx;height: 400upx;position: fixed;z-index: -9999;opacity: 0;" v-if="isLoading"/>
					<image :src="qrcodePng" mode="widthFix" style="width: 400upx;" lazy-load="true" show-menu-by-longpress="true"
						@tap="fdimg(''+qrcodePng+'')" v-else></image>

			</template>
			<u-loading v-else type="spinner" />
		</div>
	</u-popup>
	<!-- </div> -->
</template>

<script>
	import {
		Base
	} from '@/store/base.js';
	import uQRCode from '@/common/uqrcode.js';
	export default {
		props: {
			title: {
				type: String,
				default: '二维码'
			},
			tips: {
				type: String,
				default: null
			}
		},
		data() {
			return {
				isLoading: true,
				visible: false,
				qrcode: null,
				qrcodePng: '',
			};
		},
		computed: {
			user() {
				return uni.getStorageSync('userInfo');
			},
			config() {
				return uni.getStorageSync('sysInfo');
			},
			make() {
				this.isLoading = true;
				uQRCode.make({
					canvasId: 'qrcode',
					componentInstance: this,
					text: this.qrcode,
					size: 200,
					margin: 10,
					backgroundColor: '#ffffff',
					foregroundColor: '#000000',
					fileType: 'png',
					correctLevel: 1,
					success: res => {
						this.isLoading = false;
						this.qrcodePng = res;
						console.log('二维码')
						console.log(res)
					}
				})
			}
		},
		created() {

		},
		onLoad() {},
		methods: {
			show(qrcode) {
				this.visible = true;
				this.qrcode = qrcode;
			},
			hide() {
				this.visible = false;
				this.qrcode = null;
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
		height: 320px;
		flex-direction: column;

		.tips {
			width: 100%;
			color: #ff5858;
			font-size: 13px;
			text-align: center;
			margin-bottom: 20px;
			padding: 0 16px;

			i {
				margin-right: 5px;
				font-size: 12px;
				color: #edb060;
			}
		}
	}

	.btns {
		.row {
			width: 200px;
			display: flex;
			justify-content: space-between;
		}
	}
</style>
