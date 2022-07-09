<template>
  <div class="page">
    <div class="list">
      <list v-model="list.loading" :finished="list.finished" ref="$getList('/Finance/getCashoutNoteList', list)">
        <div class="item title">
          <div>时间</div>
          <div>提现金额</div>
          <div>状态</div>
        </div>
        <div v-for="(item, key) in list.data" :class="'item status_'+item.status" :key="key" @click="showStatusExplain(item)">
          <div class="date">{{item.create_time | formatDate}}</div>
          <div class="amount">¥{{item.amount | formatPrice}}</div>
          <div v-if="item.status==0" class="status">待打款</div>
          <div v-else-if="item.status==1" class="status">已打款</div>
          <div v-else-if="item.status==2" class="status">已驳回</div>
        </div>
      </list>
      <u-empty description="暂无数据" image-size="90px" v-if="!list.loading && list.finished && list.data.length==0" />
    </div>
  </div>
</template>

<script>
	import {
		Base
	} from '@/store/base.js';
export default {
  data() {
    return {
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
			},
  },
  onLoad() {
  	const self = this;
  	var base = new Base();
  	var params = {
  		url: 'getCashoutNoteList',
  		sCallBack: function(res) {
  			self.list.data = res.list.data
  		}
  	}
  	base.request(params);
  },
  methods: {
    showStatusExplain(item) {
      if (item.status == 2) {
        this.$dialog({ title: '驳回原因', message: item.status_explain })
      }
    }
  },
};
</script>


<style lang="scss" scoped>
.list {
  .item {
    display: flex;
    height: 40px;
    line-height: 40px;
    font-size: 16px;
    background: #fff;
    > div {
      flex: 1;
      text-align: center;
      color: #999;
    }
  }
  .item.title {
    > div {
      font-weight: 700;
      color: #000;
    }
  }
  .item.status_0 {
    .status {
      color: #fe2d55;
    }
  }
}
</style>