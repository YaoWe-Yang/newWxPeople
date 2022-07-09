<template>
  <!-- <u-action-sheet v-model="visible" title="佣金明细" v-if="item"> -->
	  <u-popup v-model="visible" title="佣金明细" v-if="item">
    <div class="top">
      <div class="left">
        <div class="userinfo">
          <img class="avatar" :src="item.avatar" v-if="item.avatar"/>
          <div class="nickname">
            <span>{{item.direct_user_id==user.uid?'直邀':'间邀'}}</span>
            {{item.nickname == null ? '游客':item.nickname}}
            <p class="uid">UID:{{item.uid}}</p>
          </div>
        </div>
        <div class="time">
          <div class="create_time">{{item.create_time | formatDiffDate}}注册</div>
          <div v-if="item.online_time>0" class="online_time">{{item.online_time | formatDiffDate}}在线</div>
        </div>
      </div>
      <div class="right">
        <div class="commission">{{item.commission | formatPrice}}元</div>
        <div class="order_num">消费{{item.order_num?item.order_num:0}}笔</div>
      </div>
    </div>
    <div class="tips">
      <i>&#xe651;</i>佣金根据消费时您的代理等级计算
    </div>
    <div class="list">
      <div class="title">
        <div style="flex:1.6">消费</div>
        <div>佣金</div>
        <div>时间</div>
      </div>
      <list v-model="list.loading" :finished="list.finished" ref="$getList('getCommissionNoteList?from_user_id=' + item.uid, list)" :immediate-check="false">
        <div class="item" v-for="(item, key) in list.data" :key="key">
          <div class="order" style="flex:1.4">
            <div class="order-name">{{item.fromOrder.name}}</div><span>(¥{{item.fromOrder.amount | formatPrice}})</span>
          </div>
          <div class="amount">
            ¥{{item.amount | formatPrice}}<span>({{item.ratio}}%)</span>
          </div>
          <div class="time">
            <p>{{item.create_time | formatDate('yyyy-MM-dd')}}</p>
            <p>{{item.create_time | formatDate('hh:mm')}}</p>
          </div>
        </div>
      </list>
      <!-- <empty image-size="90px" v-if="!list.loading && list.finished && list.data.length==0">
        <template #description>
          <p>暂无数据</p>
        </template>
      </empty> -->
	  <empty class="tipss" description="暂无数据" error="true" v-if="list.data.length==0">
	  </empty>
    </div>
	</u-popup>
  <!-- </u-action-sheet> -->
</template>

<script>
	import Empty from '@/pages/rm/components/Empty.vue';
	import {
		Base
	} from '@/store/base.js';
export default {
  props: [
	  Empty
  ],
  data() {
    return {
      visible: false,
      item: null,
      list: {
        loading: false,
        finished: false,
        page: 1,
        query: {
        },
        total: 0,
        data: []
      }
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
  onLoad() {
  	const self = this;
  	var base = new Base();
  	var params = {
  		url: 'getCommissionNoteList?from_user_id=' + self.item.uid,
		data:self.list,
  		sCallBack: function(res) {
  			self.list.data = res.list.data
  		}
  	}
  	base.request(params);
  },
  methods: {
    show(item) {
		console.log(item);
      this.item = item.$orig;
      this.visible = true;
      this.list.data = [];
      this.list.page = 1;
      this.loading = false;
      this.finished = false;
      this.$getList('getCommissionNoteList?from_user_id=' + this.item.uid, this.list);
    },
    hide() {
      this.visible = false;
    }
  },
};
</script>
<style lang="scss" scoped>
.top {
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: flex-end;
  padding: 16px;
  background: #fdf6ec;
  .left {
    .userinfo {
      display: flex;
      .avatar {
        width: 42px;
        height: 42px;
        border-radius: 6px;
        margin-right: 10px;
      }
      .nickname {
        font-size: 15px;
        span {
          margin-bottom: 3px;
          padding: 0 4px;
          border-radius: 2px;
          font-size: 12px;
          display: inline-block;
          border: 1px solid #409eff;
          color: #409eff;
        }
        .uid {
          margin-top: 2px;
          font-size: 12px;
          color: #909399;
        }
      }
    }
    .time {
      display: flex;
      margin-top: 10px;
      color: #909399;
      font-size: 13px;
      .create_time {
        position: relative;
        margin-right: 10px;
      }
      .create_time::after {
        position: absolute;
        content: "";
        top: 5px;
        right: -5px;
        bottom: 5px;
        border-left: 1px solid #ebeef5;
      }
      .online_time {
      }
    }
  }
  .right {
    .commission {
      font-size: 20px;
      color: #f56c6c;
      margin-bottom: 5px;
    }
    .order_num {
      color: #909399;
    }
  }
}
.tips {
  width: 100%;
  font-size: 13px;
  padding: 10px 16px;
  background-color: #fef0f0;
  color: #f56c6c;
  margin-top: 0;
  i {
    margin-right: 5px;
    font-size: 12px;
    color: #edb060;
	float: left;
  }
}
.list {
  height: 380px;
}
.title {
  display: flex;
  justify-content: space-around;
  border-bottom: 1px solid #f2f6fc;
  height: 40px;
  line-height: 40px;
  background: #f2f6fc;
  > div {
    color: #909399;
    flex: 1;
    text-align: center;
  }
}
.item {
  display: flex;
  justify-content: space-around;
  height: 40px;
  line-height: 40px;
  padding: 0 3px;
  > div {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 3px;
    overflow: hidden;
  }
  .order-name {
    word-break: keep-all;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  span {
    margin-left: 3px;
    font-size: 12px;
    color: #909399;
  }
  .time {
    flex-direction: column;
    p {
      line-height: 16px;
      font-size: 12px;
    }
  }
}

.tipss {
		position: absolute;
		width: 100%;
		margin-top: 100rpx;
	}
</style>