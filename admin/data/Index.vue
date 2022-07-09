<template>
	<view class="page">
		<view class="bpage">
		</view>
		<!---头部 开始 -->
		<u-navbar title="数据中心" :background="background" title-color="#fff" back-icon-color="#fff"
			:border-bottom="false"></u-navbar>
		<!---头部 结束 -->

		<div class="datamain">
			<!---数据转盘 开始-->
			<div class="data-turntable wow zoomIn" @click="dataList()">
				<div class="Mod xzleft">
					<div class="Mod1"></div>
					<div class="Mod2 xzleft"></div>
					<div class="Mod3"></div>
					<div class="Mod4 xzleft"></div>
					<div class="text">今日入账</div>
					<div class="num">
						{{data.dayPay | formatPrice}}
					</div>
				</div>
			</div>
			<!---数据转盘 结束-->

			<!---数据导航列表 S-->
			<div class="data-icolist" v-for="(item,index) in data.list">
				<div class="title"><u-parse :html="item.title"></u-parse></div>
				<a href="" class="item-name" v-for="(list,v) in item.type">
					<div class="coml wow slideInRight">
						<i class="icon-eccc"></i>
						<span>{{list.name}}</span>
					</div>
					<div class="comr">
						<span class="wow slideInLeft">{{list.val}}</span>
						<i class="icon-eed3"></i>
					</div>
				</a>
			</div>
			<!---数据导航列表 E-->
		</div>

	</view>
</template>

<script>
	import {
		Base
	} from '@/store/base.js';
	export default {
		data() {
			return {
				background: {
					// 渐变色
					// backgroundImage: 'linear-gradient(165deg, #2979ff, #ff0676);'
					
					// 纯色
					backgroundColor: '#191919'
				},
				data:'',
			}
		},
		onLoad() {
			this.dataList();
		},
		methods:{
			dataList(){
				var base = new Base();
				var that = this;
				var params = {
					url: 'sys/dataList',
					type: 'post',
					sCallBack: function(res) {
						that.data = res;
					}
				}
				base.request(params);
			} 
		}
	}
</script>

<style lang="scss" scoped>
	@import '@/static/data/css/data.css';

	.page {
		.bpage {
			position: fixed;
			top: 0;
			width: 100%;
			height: 100vh;
			background-color: #191919;
			z-index: -1;
		}

	}
	.title{
		padding: 10px;
		    text-align: center;
		    background-color: #212121;
		    color: #fff;
		    border-radius: 12rpx;
		    border: 1px solid #0f83c9;
	}
</style>
