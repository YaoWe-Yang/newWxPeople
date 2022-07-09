<template>
    <view class="tabBar">
        <view v-for="(item,index) in tabBar" :key="item.id" class="tabbar_item" :class="{'active':item.id == currentPage}"
         @click="navTo(item,index)">
            <image v-if="item.id == currentPage" :src="item.imgClick" mode=""></image>
            <image v-else :src="item.imgNormal" mode=""></image>
            <view :class="{'active':item.id == currentPage}">{{item.text}}</view>
        </view>
    </view>
</template>

<script>
    export default {
        props: {
            currentPage: {
                type: Number,
                default: 1
            },
        },
        data() {
            return {
                tabBar: [{
						id:'1',
                        url: 'quncard/Index',
                        text: '微信群',
                        imgNormal:'/static/wxtabbar/index.png',
                        imgClick:'/static/wxtabbar/index.png'
                    },
                     {
						id:'2',
                        url: 'card/Index',
                        text: '个人名片',
                        imgNormal:'/static/wxtabbar/card.png',
                        imgClick:'/static/wxtabbar/card.png'
                    }, {
						id:'3',
                        url: 'me/Index',
                        text: '我的',
                        imgNormal:'/static/wxtabbar/user.png',
                        imgClick:'/static/wxtabbar/user1.png'
                    }
                ],
                // level:''
                 
            };
        },mounted(){
			// this.pageIndex();
        },
        created() {
            uni.hideTabBar({})
        },
        computed: {
 
        },
        methods: {
            navTo(item,index) {
                let _this = this;
				// console.log(_this.currentPage)
                if (item.id !== _this.currentPage) {
					// _this.currentPage = item.id;
                    uni.redirectTo({ 
                        url: '/pages/rm/'+item.url,
						
                    })
                } else {
                     // this.$parent.toTop() 
                }
            },
			
			// pageIndex(){
			// 	let routes = getCurrentPages(); // 获取当前打开过的页面路由数组
			// 	let curRoute = routes[routes.length - 1].route //获取当前页面路由
			// 	let page = curRoute.substr(curRoute.length-1,1);
			// 	this.currentPage = page;
			// }
        },
    }
</script>

<style lang="scss" scoped>
    //导航栏设置
    $isRadius:0upx; //左上右上圆角
    $isWidth:100vw; //导航栏宽度
    $isBorder:1px solid #ebedf066; //边框 不需要则设为0px
    $isBg:white; //背景
     
    // 选中设置
    $chooseTextColor:#1989fa; //选中时字体颜色
    $chooseBgColor:white; //选中时背景颜色 transparent为透明
 
    //未选中设置
    $normalTextColor:#999; //未选中颜色
 
    .tabBar {
        width: $isWidth;
        // height: 100upx;
        position: fixed;
        bottom: 0upx;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
        left: 0;
        right: 0;
        margin: 0 auto;
        z-index: 998;
        background-color: $isBg;
        color: $normalTextColor;
        // border-left: $isBorder;
        border-top: $isBorder;
        // border-right: $isBorder;
        display: flex;
        justify-content: space-around;
        border-top-right-radius: $isRadius;
        border-top-left-radius: $isRadius;
        box-sizing: content-box;
        overflow: hidden;
 
        .tabbar_item {
            width: 35%;
            font-size: 12px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
			color: #646566;
			padding-bottom:10upx;
 
            &.active {
                /* border-left: $isBorder;
                border-top: $isBorder; */
                background: $chooseBgColor;
                color: $chooseTextColor;
            }
        }
 
        image {
            width: 44upx;
            height: 44upx;
            margin: 8upx;
        }
    }
</style>
