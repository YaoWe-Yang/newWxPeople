<template>
	<view class="">
		<view class="" style="text-align: center;">
			<image src="https://img.yzcdn.cn/vant/empty-image-default.png" mode="widthFix" style="width: 180rpx;" v-if="error"></image>
			<image src="https://img.yzcdn.cn/vant/empty-image-error.png" mode="widthFix" v-else></image>
		</view>
		<view class="description">
			{{description}}
		</view>
		<view class="tips">
			<slot name="tips"></slot>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			description: {
				type: String,
				default: '积分不足'
			},
			error: {
				type: String,
				default: 'true'
			}
		},
	}
</script>

<style>
	image {
		width: 320upx;
	}

	.description {
		padding: 0 !important;
		width: 100%;
		text-align: center;
		margin-top: 32upx;
		color: #969799;
		font-size: 28upx;
		line-height: 40upx;
		margin: 0;
		font-weight: 400;
	}
	
	.tips{
		margin-top: 48upx;
		text-align: center;
	}
</style>
