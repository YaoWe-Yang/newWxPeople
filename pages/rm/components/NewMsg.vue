<template>
	<view class="page">
		<view class='i-class orderNotify ' :class="[ isDisp?'ani-in':'ani-out' ]">
			<image class='orderNotifyAvatar' :src='list.user.avatar'></image>
			<text class='orderNotifyName'>{{list.user.username}}</text>刚刚加入群聊
		</view>
	</view>
	
</template>

<script>
	export default {
		data() {
			return {
				isDisp: false,
				list:''
			};
		},
		methods: {
			show(list){
				this.list = list;
				
				this.isDisp = true;
				let that = this;
				setTimeout(function() {
					that.isDisp = false
				}, 3000);
			}
		},
		onShow() {
			
		}
	};
</script>

<style>
	.page {
		position: fixed;
		top: 180rpx;
		    /* padding: 0 20rpx; */
	}

	.orderNotify {
		background-color: rgba(0, 0, 0, .6);
		color: #fff;
		border-radius: 0 30rpx 30rpx 0;
		line-height: 60rpx;
		padding: 0 30rpx;
		display: flex;
		align-content: center;
		align-items: center;
		transform: translateX(-100%);
	}

	.orderNotify.ani-in {
		animation: aniIn 400ms ease-in forwards;
	}

	.orderNotify.ani-out {
		animation: aniOut 400ms ease-out forwards;
	}

	.orderNotifyAvatar {
		width: 40rpx;
		height: 40rpx;
		border-radius: 50%;
		margin-right: 8rpx;
	}

	.orderNotifyName {
		display: inline-block;
		max-width: 200rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	@keyframes aniIn {
		from {
			transform: translateX(-100%);
		}

		to {
			transform: translateX(0%);
		}
	}

	@keyframes aniOut {
		from {
			transform: translateX(0%);
		}

		to {
			transform: translateX(-100%);
		}
	}
</style>
