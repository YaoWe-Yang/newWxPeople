<template>
	<view class="uni-cursor-point">
		<view v-if="popMenu && (leftBottom||rightBottom||leftTop||rightTop) && content.length > 0" :class="{
        'uni-fab--leftBottom': leftBottom,
        'uni-fab--rightBottom': rightBottom,
        'uni-fab--leftTop': leftTop,
        'uni-fab--rightTop': rightTop
      }" class="uni-fab">
			<view :class="{
          'uni-fab__content--left': horizontal === 'left',
          'uni-fab__content--right': horizontal === 'right',
          'uni-fab__content--flexDirection': direction === 'vertical',
          'uni-fab__content--flexDirectionStart': flexDirectionStart,
          'uni-fab__content--flexDirectionEnd': flexDirectionEnd,
		  'uni-fab__content--other-platform': !isAndroidNvue
        }" :style="{ width: boxWidth, height: boxHeight, backgroundColor: styles.backgroundColor }"
				class="uni-fab__content" elevation="5">
				<view v-if="flexDirectionStart || horizontalLeft" class="uni-fab__item uni-fab__item--first" />
				<view v-for="(item, index) in content" :key="index" :class="{ 'uni-fab__item--active': isShow }"
					class="uni-fab__item" @click="_onItemClick(index, item)">
					<!-- <image :src="item.active ? item.selectedIconPath : item.iconPath" class="uni-fab__item-image" mode="widthFix" /> -->
					<!-- <u-badge v-if="index == 0" type="error" size="mini" count="8" :offset="[28,260]"></u-badge> -->
					<view v-if="index == 0"><view class="msgBadge" v-if="count">{{count}}</view></view>
					<i v-if="index == 0" class="myfont uni-fab__item-icon"
						:style="{color: item.active ? styles.selectedColor : styles.color}">&#xe623;</i>
					<i v-if="index == 1" class="myfont uni-fab__item-icon"
						:style="{color: item.active ? styles.selectedColor : styles.color}">&#xe60a;</i>
					<text class="uni-fab__item-text"
						:style="{ color: item.active ? styles.selectedColor : styles.color }">{{ item.text }}</text>
				</view>
				<view v-if="flexDirectionEnd || horizontalRight" class="uni-fab__item uni-fab__item--first" />
			</view>
		</view>
		<view :class="{
		  'uni-fab__circle--leftBottom': leftBottom,
		  'uni-fab__circle--rightBottom': rightBottom,
		  'uni-fab__circle--leftTop': leftTop,
		  'uni-fab__circle--rightTop': rightTop,
		  'uni-fab__content--other-platform': !isAndroidNvue
		}" class="uni-fab__circle uni-fab__plus" :style="{ 'background-color': styles.buttonColor }" @click="_onClick">
			<i class="myfont uni-fab__item-icon fontcolor" :class="isShow ? '':'iconGif'">&#xe623;</i>
			<u-badge type="error" :count="count" :offset="[0,0]"></u-badge>
			<!-- <view class="fab-circle-v"  :class="{'uni-fab__plus--active': isShow && content.length > 0}"></view>
			<view class="fab-circle-h" :class="{'uni-fab__plus--active': isShow  && content.length > 0}"></view> -->
		</view>
	</view>
</template>

<script>
	let platform = 'other'
	// #ifdef APP-NVUE
	platform = uni.getSystemInfoSync().platform
	// #endif
	
	
	import {Base} from '@/store/base.js';
	var base = new Base();
	/**
	 * Fab 悬浮按钮
	 * @description 点击可展开一个图形按钮菜单
	 * @tutorial https://ext.dcloud.net.cn/plugin?id=144
	 * @property {Object} pattern 可选样式配置项
	 * @property {Object} horizontal = [left | right] 水平对齐方式
	 * 	@value left 左对齐
	 * 	@value right 右对齐
	 * @property {Object} vertical = [bottom | top] 垂直对齐方式
	 * 	@value bottom 下对齐
	 * 	@value top 上对齐
	 * @property {Object} direction = [horizontal | vertical] 展开菜单显示方式
	 * 	@value horizontal 水平显示
	 * 	@value vertical 垂直显示
	 * @property {Array} content 展开菜单内容配置项
	 * @property {Boolean} popMenu 是否使用弹出菜单
	 * @event {Function} trigger 展开菜单点击事件，返回点击信息
	 * @event {Function} fabClick 悬浮按钮点击事件
	 */
	export default {
		name: 'UniFab',
		emits: ['fabClick', 'trigger'],
		props: {
			pattern: {
				type: Object,
				default () {
					return {}
				}
			},
			horizontal: {
				type: String,
				default: 'right'
			},
			vertical: {
				type: String,
				default: 'bottom'
			},
			direction: {
				type: String,
				default: 'horizontal'
			},
			content: {
				type: Array,
				default () {
					return [{
							"iconPath": "&#xe623;",
							"selectedIconPath": "&#xe623;",
							"text": '消息',
							"name": 'msg',
							"active": true,
						},
						{
							"iconPath": '&#xe60a;',
							"selectedIconPath": '&#xe60a;',
							"text": '好友',
							"name": 'friend',
							"active": false,
						},
					]
				}
			},
			show: {
				type: Boolean,
				default: false
			},
			popMenu: {
				type: Boolean,
				default: true
			}
		},
		data() {
			return {
				fabShow: false,
				isShow: false,
				isAndroidNvue: platform === 'android',
				styles: {
					color: '#3c3e49',
					selectedColor: '#007AFF',
					backgroundColor: '#fff',
					buttonColor: '#007AFF'
				},
				count:0,
				
			}
		},
		computed: {
			contentWidth(e) {
				return (this.content.length + 1) * 110 + 20 + 'rpx'
			},
			contentWidthMin() {
				return 110 + 'rpx'
			},
			// 动态计算宽度
			boxWidth() {
				return this.getPosition(3, 'horizontal')
			},
			// 动态计算高度
			boxHeight() {
				return this.getPosition(3, 'vertical')
			},
			// 计算左下位置
			leftBottom() {
				return this.getPosition(0, 'left', 'bottom')
			},
			// 计算右下位置
			rightBottom() {
				return this.getPosition(0, 'right', 'bottom')
			},
			// 计算左上位置
			leftTop() {
				return this.getPosition(0, 'left', 'top')
			},
			rightTop() {
				return this.getPosition(0, 'right', 'top')
			},
			flexDirectionStart() {
				return this.getPosition(1, 'vertical', 'top')
			},
			flexDirectionEnd() {
				return this.getPosition(1, 'vertical', 'bottom')
			},
			horizontalLeft() {
				return this.getPosition(2, 'horizontal', 'left')
			},
			horizontalRight() {
				return this.getPosition(2, 'horizontal', 'right')
			}
		},
		watch: {
			pattern(newValue, oldValue) {
				//console.log(JSON.stringify(newValue))
				this.styles = Object.assign({}, this.styles, newValue)
			}
		},
		created() {
			this.isShow = this.show
			if (this.top === 0) {
				this.fabShow = true
			}
			// 初始化样式
			this.styles = Object.assign({}, this.styles, this.pattern)
			
			this.getMsgNum();
		},
		methods: {
			_onClick() {
				this.$emit('fabClick')
				if (!this.popMenu) {
					return
				}
				this.isShow = !this.isShow
			},
			open() {
				this.isShow = true
			},
			close() {
				this.isShow = false
			},
			/**
			 * 按钮点击事件
			 */
			_onItemClick(index, item) {
				// this.$emit('trigger', {
				// 	index,
				// 	item
				// })
				console.log(item);
				if(item.name == 'msg'){
					uni.navigateTo({
						url: "/im/pageUserList"
					});
				}
			},
			/**
			 * 获取 位置信息
			 */
			getPosition(types, paramA, paramB) {
				if (types === 0) {
					return this.horizontal === paramA && this.vertical === paramB
				} else if (types === 1) {
					return this.direction === paramA && this.vertical === paramB
				} else if (types === 2) {
					return this.direction === paramA && this.horizontal === paramB
				} else {
					return this.isShow && this.direction === paramA ? this.contentWidth : this.contentWidthMin
				}
			},
			
			// 获取信息数
			getMsgNum(){
				const self = this;
				var params = {
					url: 'getMsgNum',
					sCallBack: function(res) {
						console.log(res);
						self.count = res.num;
					}
				}
				base.request(params);
			}
		}
	}
</script>

<style lang="scss" scoped>
	.uni-fab {
		position: fixed;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		justify-content: center;
		align-items: center;
		z-index: 999;
	}

	.uni-cursor-point {
		/* #ifdef H5 */
		cursor: pointer;
		/* #endif */
	}

	.uni-fab--active {
		opacity: 1;
	}

	.uni-fab--leftBottom {
		left: 10rpx;
		bottom: 100rpx;
		/* #ifdef H5 */
		left: calc(10rpx + var(--window-left));
		bottom: calc(100rpx + var(--window-bottom));
		/* #endif */
		padding: 20rpx;
	}

	.uni-fab--leftTop {
		left: 10rpx;
		top: 120rpx;
		/* #ifdef H5 */
		left: calc(10rpx + var(--window-left));
		top: calc(120rpx + var(--window-top));
		/* #endif */
		padding: 20rpx;
	}

	.uni-fab--rightBottom {
		right: 10rpx;
		bottom: 100rpx;
		/* #ifdef H5 */
		right: calc(10rpx + var(--window-right));
		bottom: calc(100rpx + var(--window-bottom));
		/* #endif */
		padding: 20rpx;
	}

	.uni-fab--rightTop {
		right: 10rpx;
		top: 120rpx;
		/* #ifdef H5 */
		right: calc(10rpx + var(--window-right));
		top: calc(120rpx + var(--window-top));
		/* #endif */
		padding: 20rpx;
	}

	.uni-fab__circle {
		position: fixed;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		justify-content: center;
		align-items: center;
		width: 110rpx;
		height: 110rpx;
		background-color: #3c3e49;
		border-radius: 110rpx;
		z-index: 1000;
	}

	.uni-fab__circle--leftBottom {
		left: 30rpx;
		bottom: 120rpx;
		/* #ifdef H5 */
		left: calc(30rpx + var(--window-left));
		bottom: calc(120rpx + var(--window-bottom));
		/* #endif */
	}

	.uni-fab__circle--leftTop {
		left: 30rpx;
		top: 80rpx;
		/* #ifdef H5 */
		left: calc(30rpx + var(--window-left));
		top: calc(80rpx + var(--window-top));
		/* #endif */
	}

	.uni-fab__circle--rightBottom {
		right: 28rpx;
		bottom: 118rpx;
		/* #ifdef H5 */
		right: calc(28rpx + var(--window-right));
		bottom: calc(118rpx + var(--window-bottom));
		/* #endif */
	}

	.uni-fab__circle--rightTop {
		right: 30rpx;
		top: 80rpx;
		/* #ifdef H5 */
		right: calc(30rpx + var(--window-right));
		top: calc(80rpx + var(--window-top));
		/* #endif */
	}

	.uni-fab__circle--left {
		left: 0;
	}

	.uni-fab__circle--right {
		right: 0;
	}

	.uni-fab__circle--top {
		top: 0;
	}

	.uni-fab__circle--bottom {
		bottom: 0;
	}

	.uni-fab__plus {
		font-weight: bold;
	}

	.fab-circle-v {
		position: absolute;
		width: 6rpx;
		height: 62rpx;
		left: 52rpx;
		top: 24rpx;
		background-color: white;
		transform: rotate(0deg);
		transition: transform 0.3s;
	}

	.fab-circle-h {
		position: absolute;
		width: 62rpx;
		height: 6rpx;
		left: 24rpx;
		top: 52rpx;
		background-color: white;
		transform: rotate(0deg);
		transition: transform 0.3s;
	}

	.uni-fab__plus--active {
		transform: rotate(135deg);
	}

	.uni-fab__content {
		/* #ifndef APP-NVUE */
		box-sizing: border-box;
		display: flex;
		/* #endif */
		flex-direction: row;
		border-radius: 110rpx;
		overflow: hidden;
		transition-property: width, height;
		transition-duration: 0.2s;
		width: 110rpx;
		border-color: #DDDDDD;
		border-width: 1rpx;
		border-style: solid;
	}

	.uni-fab__content--other-platform {
		border-width: 0rpx;
		box-shadow: 0 0 10rpx 4rpx rgba(0, 0, 0, 0.2);
	}

	.uni-fab__content--left {
		justify-content: flex-start;
	}

	.uni-fab__content--right {
		justify-content: flex-end;
	}

	.uni-fab__content--flexDirection {
		flex-direction: column;
		justify-content: flex-end;
	}

	.uni-fab__content--flexDirectionStart {
		flex-direction: column;
		justify-content: flex-start;
	}

	.uni-fab__content--flexDirectionEnd {
		flex-direction: column;
		justify-content: flex-end;
	}

	.uni-fab__item {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 110rpx;
		height: 110rpx;
		opacity: 0;
		transition: opacity 0.2s;
	}

	.uni-fab__item--active {
		opacity: 1;
	}

	.uni-fab__item-image {
		width: 50rpx;
		height: 50rpx;
		margin-bottom: 6rpx;
	}

	.uni-fab__item-icon {
		font-size: 50rpx;
		// margin-bottom: 3px;
	}

	.uni-fab__item-text {
		color: #FFFFFF;
		font-size: 24rpx;
	}

	.uni-fab__item--first {
		width: 110rpx;
	}

	.fontcolor {
		font-size: 60rpx;
		color: #fff;
	}

	.iconGif {
		animation: zy 1.5s .05s linear infinite;
	}

	.msgBadge {
		position: absolute;
		font-size: 20rpx;
		padding: 8rpx;
		background-color: red;
		color: #ffffff;
		border-radius: 50%;
		line-height: 10rpx;
		top: 30rpx;
		left: 100rpx;
	}
</style>
