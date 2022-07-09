<template>
    <view>
        <view>
            <!-- url为要跳转外链的地址-->
            <web-view :src="url">
            </web-view>
        </view>
    </view>
</template>
 
<script>
    export default {
        data() {
            return {
				name:"",
                url:"",
				img:""
            }
        },
        onLoad(val) {
			console.log(val)
			this.name = decodeURI(val.title);
            this.url = decodeURIComponent(val.url);
			this.img = decodeURIComponent(val.img);
            // 设置当前的title 如果外链中有的话将被覆盖
            if(this.isNotEmpty(this.name)){
                this.setTitle(this.name);
            }
        },
        methods: {
            isNotEmpty(obj) {
                if (typeof obj == undefined || obj == null || obj == "" || obj == "undefined" || obj.length == 0) {
                    return false;
                } else {
                    return true;
                }
            },
            // 设置title
            setTitle(title) {
                uni.setNavigationBarTitle({
                    title: title
                })
            },
        },
		// 这里如果写成onShareAppMessage: res => { ... }形式的箭头函数，在内部会无法获得this
		onShareAppMessage(res) {
			if (res.from === 'button') { // 来自页面内分享按钮
				console.log(res.target)
			}
			return {
				title: this.name,
				path: '/pages/index/index?id=' + this.$store.state.user.uid,
				imageUrl: this.img
			}
		},
		onShareTimeline(res) {
			if (res.from === 'button') { // 来自页面内分享按钮
				console.log(res.target)
			}
			return {
				title: this.name,
				path: '/pages/index/index?id=' + this.$store.state.user.uid,
				imageUrl: this.img
			}
		},
    }
</script>