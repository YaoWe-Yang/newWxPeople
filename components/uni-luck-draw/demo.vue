<template>
	<view class="page">
		<view class="box">
			<img :src="require('@/components/uni-luck-draw/img/wheel/bg.png')" style="width: 100%" mode="widthFix" />
			<!-- <img  /> -->
			<!-- <cover-view class="coverView"> -->
			<cover-image :src="require('@/components/uni-luck-draw/img/wheel/btn.png')" class="pointer" mode="widthFix"></cover-image>
			<!-- </cover-view> -->
			<LuckyWheel class="luck-draw" ref="LuckyWheel" width="275px" height="275px" :prizes="wheel.prizes"
				:buttons="wheel.buttons" :default-style="wheel.defaultStyle" :default-config="wheel.defaultConfig" 
				@start="wheelStart" @end="wheelEnd"/>
		</view>
		<LuckyGrid ref="luckyGrid" width="310px" height="330px" :prizes="grid.prizes" :blocks="grid.blocks"
			:buttons="grid.buttons" :default-style="grid.defaultStyle" :active-style="grid.activeStyle"
			@start="gridStart" @end="gridEnd" />
	</view>
</template>

<script>
	import LuckyWheel from '@/components/uni-luck-draw/lucky-wheel.vue'
	import LuckyGrid from '@/components/uni-luck-draw/lucky-grid.vue'
	export default {
		components: {
			LuckyWheel,
			LuckyGrid
		},
		data() {
			return {
				wheel: {
					prizes: [],
					buttons: [{
						radius: '40px',
						imgs: [{
							src: require('@/components/uni-luck-draw/img/wheel/button.png'),
							width: '140%',
							top: '-135%'
						}]
					}],
					defaultStyle: {
						fontColor: '#000',
						fontSize: '13px',
						fontStyle: 'SimHei',
					},
					defaultConfig: {
						offsetDegree: 22.5
					},
				},
				grid: {
					prizes: [],
					blocks: [{
							padding: '1px',
							background: '#e2cea3',
							borderRadius: '13px'
						},
						{
							padding: '5px 0px',
							background: '#f3ecdc',
							borderRadius: '13px'
						},
						{
							padding: '1px',
							background: '#e2cea3',
							borderRadius: '8px'
						},
						{
							padding: '15px 10px',
							background: '#fffcf5',
							borderRadius: '8px'
						},
					],
					buttons: [{
						x: 1,
						y: 1,
						background: 'rgba(0, 0, 0, 0)',
						imgs: [{
							src: require('@/components/uni-luck-draw/img/grid/btn.png'),
							width: '90%',
							top: '5%'
						}]
					}],
					defaultStyle: {
						background: '#ffefd6',
						borderRadius: '5px',
						fontColor: '#755c28',
						fontSize: '10px',
						lineHeight: '12px'
					},
					activeStyle: {
						background: '#de7247',
						fontColor: '#ffefd6',
					}
				}
			}
		},
		mounted() {
			this.getPrizesListWheel()
			this.getPrizesListGrid()
		},
		methods: {
			// 大转盘
			getPrizesListWheel() {
				const prizes = []
				let data = [{
						name: '10个京豆',
						img: require('@/components/uni-luck-draw/img/wheel/1.png'),
						color: '#F8DEF8'
					},
					{
						name: '5个京豆',
						img: require('@/components/uni-luck-draw/img/wheel/1.png'),
						color: '#FEF3FC'
					},
					{
						name: '1个京豆',
						img: require('@/components/uni-luck-draw/img/wheel/1.png'),
						color: '#F8DEF8'
					},
					{
						name: '谢谢参与',
						img: require('@/components/uni-luck-draw/img/wheel/0.png'),
						color: '#FEF3FC'
					},
					{
						name: '10个京豆',
						img: require('@/components/uni-luck-draw/img/wheel/1.png'),
						color: '#F8DEF8'
					},
					{
						name: '5个京豆',
						img: require('@/components/uni-luck-draw/img/wheel/1.png'),
						color: '#FEF3FC'
					},
					{
						name: '1个京豆',
						img: require('@/components/uni-luck-draw/img/wheel/1.png'),
						color: '#F8DEF8'
					},
					{
						name: '谢谢参与',
						img: require('@/components/uni-luck-draw/img/wheel/0.png'),
						color: '#FEF3FC'
					},
				]
				data.forEach((item, index) => {
					prizes.push({
						name: item.name,
						background: item.color,
						fonts: [{
							text: item.name,
							top: '12%'
						}],
						imgs: [{
							src: item.img,
							width: '45%',
							top: '35%'
						}],
					})
				})
				this.wheel.prizes = prizes
			},
			wheelStart() {
				this.$refs.LuckyWheel.play()
				setTimeout(() => {
					this.$refs.LuckyWheel.stop(Math.random() * 8 >> 0)
				}, 2000)
			},
			wheelEnd(prize) {
				this.$u.toast(`恭喜你获得${prize.name}`);
			},

			// 九宫格
			getPrizesListGrid() {
				const prizesGrid = []
				let axis = [
					[0, 0],
					[1, 0],
					[2, 0],
					[2, 1],
					[2, 2],
					[1, 2],
					[0, 2],
					[0, 1]
				]
				let data = ['电热烘干毛巾架', '10元满减红包', '2积分', '胖喵焖烧罐', '5元满减红包', '多层置物架', '3元直减红包', '全场满99减10']
				axis.forEach((item, index) => {
					prizesGrid.push({
						x: item[0],
						y: item[1],
						title: data[index],
						imgs: [{
							width: '100%',
							height: '100%',
							src: require(
								`@/components/uni-luck-draw/img/grid/default-${index}.png`),
							activeSrc: require(
								`@/components/uni-luck-draw/img/grid/active-${index}.png`)
						}]
					})
				})
				this.grid.prizes = prizesGrid
			},
			gridStart() {
				this.$refs.luckyGrid.play()
				setTimeout(() => {
					this.$refs.luckyGrid.stop(Math.random() * 8 >> 0)
				}, 2000)
			},
			gridEnd(prize) {
				this.$u.toast(`恭喜你获得大奖: ${prize.title}`);
			}
		}
	}
</script>

<style scoped>
	.page{
		background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAANAgMAAAAPhQzvAAAADFBMVEVfV/ZUTPRVTfRLQ/L3YHYbAAAAGUlEQVQI12NgYGFgwCA4YKzQuVMdUMQwCABBYAIAV5t6PAAAAABJRU5ErkJggg==);
		background-size: 6.5px 6.5px;
	}
	.box {
		position: relative;
		width: 350px;
		height: 350px;
		text-align: center;
		margin: 0 auto;
	}

	.pointer {
		width: 38px;
		position: absolute;
		left: 50%;
		transform: translate(-50%);
		z-index: 999;
	}

	.luck-draw {
		width: 275px;
		height: 275px;
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
	}
</style>
