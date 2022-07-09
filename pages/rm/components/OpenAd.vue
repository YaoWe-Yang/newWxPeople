<template>
	<u-popup v-model="visible" mode="top" border-radius="32" safe-area-inset-bottom="true">
		<div class="ad-wrap">
			<template v-if="item">
				<view class="adicon">广告</view>
				<image :src="item.ad_image" mode="aspectFill" height="800" style="width: 100%;" @click="$imagePreview([item.ad_image])"></image>
				<view class="text">{{item.ad_text}}</view>
			</template>
			<u-loading v-else mode="circle" size="36"></u-loading>
		</div>
	</u-popup>
</template>

<script>
	export default {
		props: {
			tips: {
				type: String,
				default: null
			}
		},
		data() {
			return {
				visible: false,
				item: false
			};
		},
		computed: {
			user() {
				return this.$store.state.user;
			},
			config() {
				return this.$store.state.config;
			}
		},
		created() {

		},
		onLoad() {},
		methods: {
			show(item) {
				this.visible = true;
				this.item = item;
			},
			hide() {
				this.visible = false;
				this.item = null;
			}
		},
	};
</script>
<style lang="scss" scoped>
	.ad-wrap {
		display: flex;
		align-items: left;
		justify-content: center;
		flex-direction: column;
		.adicon{
			    position: absolute;
			    z-index: 1;
			    right: 10rpx;
			    top: 10rpx;
			    font-size: 20rpx;
			    color: #fff;
			    background-color: #00000073;
			    height: 36rpx;
			    width: 70rpx;
			    text-align: center;
			    line-height: 38rpx;
			    border-radius: 100rpx;
		}
		.text{
			padding: 20rpx;
		}
	}
</style>
