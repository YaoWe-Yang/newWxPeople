<template>
	<view>
		<!-- <u-sticky>
				<u-dropdown>
					<u-dropdown-item v-model="value1" title="位置" :options="options1"></u-dropdown-item>
					<u-dropdown-item v-model="value2" title="热度" :options="options2"></u-dropdown-item>
				</u-dropdown>
		</u-sticky> -->
		<u-top-tips ref="uTips"></u-top-tips>
		
		<view v-if="sysinfo.cs == '1'">
		<view class="comment" v-for="(res, index) in commentList" :key="res.id">
			<view class="left">
				<image :src="res.url" mode="aspectFill"></image>
			</view>
			<view class="right">
				<view class="top">
					<view class="name">{{ res.name }}</view>
					<view class="like" :class="{ highlight: res.isLike }">
						<view class="num">{{ res.likeNum=="0"?'':res.likeNum }}</view>
						<u-icon v-if="!res.isLike" name="thumb-up" :size="30" color="#9a9a9a"
							@click="getLike(index,res.id)">
						</u-icon>
						<u-icon v-if="res.isLike" name="thumb-up-fill" :size="30" @click="getLike(index,res.id)">
						</u-icon>
					</view>
				</view>
				<view class="content">
					{{ res.contentText }}

					<scroll-view class="squareImg">
						<scroll-view v-for="(item,i) in res.image" :key="item.i" :class="[res.image.length == '1'?'':'fl img30']">
							<u-image :src="item" v-if="res.image.length == '1'" class="img60" mode="widthFix" border-radius="10" @tap="fdimg(''+res.image,i+'')"></u-image>
							<image :src="item" v-else class="w100" mode="scaleToFill" :show-menu-by-longpress="true"
								:lazy-load='true' @tap="fdimg(''+res.image,i+'')">
							</image>
						</scroll-view>
					</scroll-view>
				</view>
				<view class="reply-box" v-if="res.replyList != undefined">
					<view v-for="(item, ii) in res.replyList.slice(0, 3)" :key="item.ii">
						<view class="item" v-if="item.type == '2'">
							<view class="username">{{ item.nickname }}</view>
							<view class="text">{{ item.contentStr }}</view>
						</view>
					</view>
					<view class="all-reply" @tap="toAllReply">
						共{{ res.allReply }}条回复
						<u-icon class="more" name="arrow-right" :size="26"></u-icon>
					</view>
				</view>
				<br>
				<view class="bottom">
					{{ res.date }}
					<view class="reply" @click="toReply(res.id)">回复</view>
				</view>
			</view>
		</view>
		</view>
		<view v-else>
			<u-card>
					<view class="" slot="body">
						<view class="u-body-item u-flex u-border-bottom u-col-between u-p-t-0">
							<view class="u-body-item-title u-line-2">瓶身描绘的牡丹一如你初妆，冉冉檀香透过窗心事我了然，宣纸上走笔至此搁一半</view>
							<image src="https://img11.360buyimg.com/n7/jfs/t1/94448/29/2734/524808/5dd4cc16E990dfb6b/59c256f85a8c3757.jpg" mode="aspectFill"></image>
						</view>
						<view class="u-body-item u-flex u-row-between u-p-b-0">
							<view class="u-body-item-title u-line-2">釉色渲染仕女图韵味被私藏，而你嫣然的一笑如含苞待放</view>
							<image src="https://img12.360buyimg.com/n7/jfs/t1/102191/19/9072/330688/5e0af7cfE17698872/c91c00d713bf729a.jpg" mode="aspectFill"></image>
						</view>
					</view>
				</u-card>
		</view>
		<view class="Replyview" v-if="showReply">
			<!-- <u-popup v-model="showReply" mode="bottom" border-radius="14" mask="false" mask-custom-style="{background: 'rgba(0, 0, 0, 0.2)'}" duration=""> -->
			<view style="padding: 20rpx;width: 100%;height: 100upx;">
				<textarea type="text" placeholder="请输入评论" class="inputReplytext" maxlength="160" cursor-spacing="42"
					confirm-type="send" :focus="showReplyFocus" @blur="disReply" @input="onKeyInput"
					@confirm="postReply" fixed="true" @linechange="editHeight" />

			</view>
			<view class="inputReplyCount">
				{{inputValue.length}}/160
			</view>

			<!-- <u-button type="primary" @click="postReply">发表</u-button> -->
			<!-- </u-popup> -->
		</view>
		<u-tabbar :list="tabbar" :mid-button="true"></u-tabbar>
	</view>
</template>

<script>
	import {
		Base
	} from '@/store/base.js';
	export default {
		data() {
			return {
				tabbar: this.$store.state.tabbar,
				commentList: [],
				value1: 1,
				value2: 2,
				options1: [{
						label: '自动定位',
						value: 1,
					},
					{
						label: '距离优先',
						value: 2,
					}
				],
				options2: [{
						label: '最热',
						value: 1,
					},
					{
						label: '最冷',
						value: 2,
					},
				],
				// 显示输入框
				showReply: '',
				// 回复输入框焦点
				showReplyFocus: '',
				// 点击回复的id
				activeReply: '',
				// 输入框的值
				inputValue: '',
				// 输入框行数
				lineCount: 1,
				// 评论模块高度
				bottomHeight: 150,
				
				userinfo: this.$store.state.user,
				sysinfo: this.$store.state.config,
			}
		},
		onShow() {
			this.sysinfo = this.$store.state.config;
			this.userinfo = this.$store.state.user;
		},
		onLoad() {
			this.getComment();
		},
		methods: {
			// 跳转到全部回复
			toAllReply() {
				this.$u.toast('系统升级中');
				// uni.navigateTo({
				// 	url: '/pages/release/reply'
				// });
			},
			// 点赞
			getLike(index, id) {
				var base = new Base();
				this.commentList[index].isLike = !this.commentList[index].isLike;
				if (this.commentList[index].isLike == true) {
					this.commentList[index].likeNum++;
					var isLike = 1;
				} else {
					if(this.commentList[index].likeNum){
						this.commentList[index].likeNum--;
					}
					var isLike = 0;
				}
				console.log(isLike);
				
				const self = this;
				var params = {
					url: 'getSquareLike',
					data: {
						isLick: isLike,
						id: id
					},
					sCallBack: function(res) {
						// console.log(res);
						// 绑定Like
						self.getComment();
					}
				}
				base.request(params);
			},
			// 朋友圈列表
			getComment() {
				const self = this;
				var base = new Base();
				var params = {
					url: 'getSquareAll',
					sCallBack: function(res) {
						if(!res.error_code){
						self.commentList = res;
						}
					}
				}
				base.request(params);

			},
			fdimg(img, id) {
				var base = new Base();
				base._previewImage(img, id);
			},
			// 触发回复焦点
			toReply(id) {
				// 绑定要回复的动态id
				this.activeReply = id;

				// 打开输入框
				this.showReply = true;
				// 打开自动聚焦
				this.showReplyFocus = true;
			},
			// 失去焦点隐藏回复input
			disReply() {

				// 关闭输入框
				this.showReply = false;
				// 关闭自动聚焦
				this.showReplyFocus = false;
			},
			// 实时绑定input值
			onKeyInput: function(event) {
				const self = this;
				console.log(event.target.value);
				self.inputValue = event.target.value
			},
			// 实时监听改变评论模块高度
			editHeight: function(event) {

				console.log(event);
				var linecount = this.lineCount;
				if (linecount < event.detail.lineCount) {
					this.lineCount = event.detail.lineCount;
					this.bottomHeight = this.bottomHeight + event.detail.height
				} else {
					this.lineCount = event.detail.lineCount;
					this.bottomHeight = this.bottomHeight - event.detail.height
				}
				console.log(this.lineCount, this.bottomHeight)
			},
			// 提交评论
			postReply() {
				const self = this;
				var base = new Base();
				if (self.inputValue.length == 0) {
					self.$refs.uTips.show({
						title: '评论不能为空',
						type: 'error',
						duration: '2300'
					})
					return false;
				}
				var params = {
					url: 'postSquareText',
					type: 'post',
					data: {
						id: self.activeReply,
						contentStr: self.inputValue
					},
					sCallBack: function(res) {
						console.log(res);
						if (!res.code) {
							self.getComment();
							self.$refs.uTips.show({
								title: '评论成功',
								type: 'success',
								duration: '2300'
							})
						} else {
							self.$refs.uTips.show({
								title: res.msg,
								type: 'error',
								duration: '2300'
							})
						}
					}
				}
				base.request(params);
			}
		},

	}
</script>

<style lang="scss" scoped>
	image {
		will-change: transform
	}
	.u-card-wrap { 
			background-color: $u-bg-color;
			padding: 1px;
		}
		
		.u-body-item {
			font-size: 32rpx;
			color: #333;
			padding: 20rpx 10rpx;
		}
			
		.u-body-item image {
			width: 120rpx;
			flex: 0 0 120rpx;
			height: 120rpx;
			border-radius: 8rpx;
			margin-left: 12rpx;
		}
		
	.comment {
		display: flex;
		padding: 30rpx;

		.left {
			image {
				width: 64rpx;
				height: 64rpx;
				border-radius: 50%;
				background-color: #f2f2f2;
			}
		}

		.right {
			flex: 1;
			padding-left: 20rpx;
			font-size: 30rpx;

			.top {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 10rpx;

				.name {
					color: #5677fc;
				}

				.like {
					display: flex;
					align-items: center;
					color: #9a9a9a;
					font-size: 26rpx;

					.num {
						margin-right: 4rpx;
						color: #9a9a9a;
					}
				}

				.highlight {
					color: #5677fc;

					.num {
						color: #5677fc;
					}
				}
			}

			.content {
				margin-bottom: 10rpx;
			}

			.reply-box {
				background-color: rgb(242, 242, 242);
				border-radius: 12rpx;

				.item {
					padding: 20rpx;
					border-bottom: solid 2rpx $u-border-color;

					.username {
						font-size: 24rpx;
						color: #999999;
					}
				}

				.all-reply {
					padding: 20rpx;
					display: flex;
					color: #5677fc;
					align-items: center;

					.more {
						margin-left: 6rpx;
					}
				}
			}

			.bottom {
				margin-top: 20rpx;
				display: flex;
				font-size: 24rpx;
				color: #9a9a9a;
				width: 100%;

				.reply {
					color: #5677fc;
					margin-left: 10rpx;
				}
			}
		}
	}

	.img60 {
		width: 60%;
	}

	.img30 {
		width: 32.53%;
		height: 200upx;
	}

	.fl {
		float: left;
		padding: 0.4%;
	}

	.w100 {
		width: 100%;
		height: 200upx;
	}

	.Replyview {
		position: fixed;
		bottom: 0;
		z-index: 999;
		background-color: #FFFFFF;
		width: 100%;
		height: 150upx;
	}

	.inputReplytext {
		width: 97.5%;
		height: 70rpx;
		color: #2979FF;
		border: 1rpx solid #e3e3e3;
		border-radius: 14rpx;
		padding: 1%;
	}

	.inputReplyCount {
		float: right;
		color: #606266;
		position: relative;
		right: 26rpx;
		bottom: -8rpx;
	}
	
	.squareImg{
		padding-top: 10upx;
	}
</style>
