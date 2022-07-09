<template>
	<!-- <u-action-sheet v-model="visible" title="佣金明细" v-if="item"> -->
	<u-popup v-model="visible" title="佣金明细" width="650" v-if="item">

		<u-top-tips ref="uTips"></u-top-tips>

		<div class="tips">
			<i>&#xe651;</i>直接点击会员代理标识即可修改
		</div>
		<div class="top">
			<div class="left">
				<div class="userinfo">
					<div class="avatar">
						<u-lazy-load :image="item.avatar" mode="widthFix" border-radius="12"
							@click="$imagePreview([item.avatar])"></u-lazy-load>
					</div>
					<div class="nickname">
						<span class="uid">{{item.uid}}</span>
						{{item.avatar == null ? item.nickname?item.nickname:'游客':item.nickname}}
						<div>
							<span>积分:{{item.gold}}</span>
							<span :class="[item.is_agent ? '':'uid']"
								@click="showAgent = true">{{item.is_agent?item.agent_level=='1'?'普通代理':item.agent_level=='2'?'黄金代理':item.agent_level=='3'?'钻石代理':'非代理':'非代理'}}</span>
							<span :class="[item.is_vip ? '':'uid']"
								@click="showVip = true">{{item.is_vip?'会员':'非会员'}}</span>
							<div>
								<span class="success"
									@click="showRatio = true">直邀：{{item.commission_ratio.direct}}间邀：{{item.commission_ratio.indirect}}</span>
							</div>
						</div>
					</div>
				</div>
				<div class="time">
					<div v-if="item.directUser" @click="show(item.directUser)">直邀：<span>{{item.directUser.uid}}</span> /
						<text>{{item.directUser.nickname}}</text>
					</div>
					<div class="online_time" v-if="item.indirectUser" @click="show(item.indirectUser)">
						间邀：<span>{{item.indirectUser.uid}}</span> /
						<text>{{item.indirectUser.nickname}}</text>
					</div>
					<div class="online_time">注册时间：{{item.create_time | formatDate}}</div>
					<div v-if="item.online_time>0" class="online_time">最近在线：{{item.online_time | formatDate}}</div>
				</div>
			</div>
			<!-- <div class="right">
				<div class="commission">{{item.commission | formatPrice}}元</div>
				<div class="order_num">消费{{item.order_num?item.order_num:0}}笔</div>
			</div> -->
		</div>

		<u-tabs ref="tabs" :list="tabList" :current="current" :is-scroll="false" font-size="28" inactive-color="#323233"
			bar-width="80" @change="change">
		</u-tabs>
		<div class="list" v-if="type == 'walletnote'">

				<div class="noteDiv" :class="[note.ac_type=='1' ? 'noteTc':'noteTx']" v-for="(note, key) in walletnote" :key="key">
					<div class="p20">
						<div class="id">#{{note.id}}<span>余额：{{note.wallet | formatPrice}}</span></div>
						<div class="noteRight">
							<div class="type">{{note.ac_type=='1'?note.target_scene=='提现失败'?'返还':'提成':'提现'}}</div>
							<div>{{note.create_time | formatDate}}</div>
						</div>
						<div class="cj">场景：{{note.target_scene}}</div>
						<div class="je">金额：{{note.amount | formatPrice}}</div>
					</div>
				</div>
			<u-empty description="暂无数据" image-size="90px" v-if="walletnote.length==0" />
		</div>
		<div class="list" v-else>
			<div class="title">
				<div>ID</div>
				<div style="flex:1.4">用户</div>
				<div>创建时间</div>
				<div>在线时间</div>
			</div>

			<div class="item" v-for="(value, key) in list.data" :key="key" @click="show(value)">
				<div class="order">
					<div class="order-name">{{value.uid}}</div>
				</div>
				<div class="amount" style="flex:1.4">
					<div class="userAvatar" v-if="value.avatar">
						<u-lazy-load :image="value.avatar" mode="widthFix" border-radius="12"
							@click="$imagePreview([value.avatar])"></u-lazy-load>
					</div>
					<span>{{value.avatar == null ? '游客':value.nickname}}</span>
				</div>
				<div class="time">
					<p>{{value.create_time | formatDiffDate}}</p>
				</div>
				<div class="time">
					<p>{{value.online_time | formatDiffDate}}</p>
				</div>
			</div>
			<!-- <empty image-size="90px" v-if="!list.loading && list.finished && list.data.length==0">
        <template #description>
          <p>暂无数据</p>
        </template>
      </empty> -->
			<u-empty description="暂无数据" image-size="90px" v-if="list.data.length==0" />
			<!-- <empty class="tipss" description="暂无数据" error="true" v-if="list.data.length==0">
	  </empty> -->
		</div>
		<u-popup v-model="showAgent" mode="center" border-radius="12" closeable="true">
			<div class="showAgent">
				<u-form>
					<u-form-item label="代理有效期" label-width="180rpx">
						<u-input :border="border" type="select" v-model="agentType" placeholder="请选择"
							@click="showCharge = true"></u-input>
						<u-action-sheet title="代理状态" v-model="showCharge" :list="chargeList" :cancel-btn="true"
							border-radius="32" @click="onConfirmNum" />

					</u-form-item>

					<u-form-item label="代理级别" label-width="180rpx" v-if="showAgentLevel">
						<u-input :border="border" type="select" v-model="agentName" placeholder="请选择"
							@click="showAgentCharge = true"></u-input>
						<u-action-sheet title="代理级别" v-model="showAgentCharge" :list="chargeAgentList"
							:cancel-btn="true" border-radius="32" @click="onAgentSelect" />

					</u-form-item>
					<u-button type="success" @click="editAgentPost" ripple="true" shape="circle">提交
					</u-button>
				</u-form>
			</div>
		</u-popup>

		<u-popup v-model="showVip" mode="center" border-radius="12" closeable="true">
			<div class="showAgent">
				<text v-if="user.vip_expires_time == 1">会员有效期截止到：永久</text>
				<text
					v-else-if="user.vip_expires_time > 1">会员有效期截止到：<text>{{user.vip_expires_time | date}}</text></text>
				<text v-else>会员有效期截止到：<text>未开通</text></text>
				<u-form>
					<u-form-item label="会员有效期" label-width="180rpx">
						<u-input :border="border" type="select" v-model="vipName" placeholder="请选择"
							@click="showVipCharge = true"></u-input>
						<u-action-sheet title="会员有效期" v-model="showVipCharge" :list="chargeVipList" :cancel-btn="true"
							border-radius="32" @click="onVipSelect" />
					</u-form-item>
					<u-button type="success" @click="editVipPost" ripple="true" shape="circle">提交
					</u-button>
				</u-form>
			</div>
		</u-popup>

		<u-popup v-model="showRatio" mode="center" border-radius="12" closeable="true">
			<div class="showAgent">
				<text>例：<text>50%等于0.5</text></text>
				<u-form>
					<u-form-item label="直接好友" label-width="180rpx">
						<u-input :border="border" type="text" v-model="user.commission_ratio.direct"
							:placeholder="config.agent.default_commission_ratio.direct" maxlength="4"
							@input="inputRatioDirect"></u-input>
					</u-form-item>
					<u-form-item label="间接好友" label-width="180rpx">
						<u-input :border="border" type="text" v-model="user.commission_ratio.indirect"
							:placeholder="config.agent.default_commission_ratio.indirect" maxlength="4"
							@input="inputRatioIndirect"></u-input>
					</u-form-item>
					<u-button type="success" @click="editRatioPost" ripple="true" shape="circle">提交
					</u-button>
				</u-form>
			</div>
		</u-popup>

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
						order: 'create_time',
						query_type: 'direct'
					},
					total: 0,
					data: []
				},
				tabList: [{
					name: '直邀好友',
					type: 'direct'
				}, {
					name: '间邀好友',
					type: 'indirect'
				}, {
					name: '财务记录',
					type: 'walletnote'
				}],
				current: 0,
				type: 'direct',
				showRatio: false,
				showAgent: false,
				showVip: false,
				showAgentLevel: false,
				showCharge: false,
				showAgentCharge: false,
				showVipCharge: false,
				agentType: '',
				agentLevel: '',
				agentName: '',
				agentDuration: '',
				vipName: '',
				vipDuration: '',
				ratio: {
					direct: '',
					indirect: '',
				},
				chargeList: [{
					id: 0,
					text: '关闭代理',
					duration: 'close'
				}, {
					id: 1,
					text: '永久',
					duration: 'longtime'
				}],
				walletnote: [],
			};
		},
		computed: {
			user() {
				return this.$store.state.user;
			},
			config() {
				return this.$store.state.config;
			},

			chargeAgentList() {
				let list = [];
				this.config.agent.charge.forEach((item, id) => {
					list.push({
						id: item.level,
						text: item.name
					})
				});
				return list;
			},

			chargeVipList() {
				let list = [{
					duration: 'close',
					text: '关闭会员'
				}, {
					duration: 'longtime',
					text: '永久'
				}];
				this.config.vip.charge.forEach((item, id) => {
					list.push({
						duration: item.duration,
						text: item.name
					})
				});
				return list;
			},
		},
		created() {},
		onLoad() {
			this.loadData();
		},
		methods: {
			inputRatioDirect(e) {
				this.ratio.direct = e;
			},
			inputRatioIndirect(e) {
				this.ratio.indirect = e;
			},
			onConfirmNum(e) {
				this.agentType = this.chargeList[e].text;
				this.agentDuration = this.chargeList[e].duration;
				this.showCharge = false;

				this.showAgentLevel = this.agentDuration == 'longtime' ? true : false;
				if (!this.showAgentLevel) {
					this.agentLevel = '';
					this.agentName = '';
				}
			},
			onAgentSelect(e) {
				this.agentLevel = this.chargeAgentList[e].id;
				this.agentName = this.chargeAgentList[e].text;
				this.showAgentCharge = false;
			},
			onVipSelect(e) {
				this.vipDuration = this.chargeVipList[e].duration;
				this.vipName = this.chargeVipList[e].text;
				this.showVipCharge = false;
			},
			editAgentPost() {
				this.showAgent = false;

				if (this.showAgentLevel && this.agentLevel == null || !this.agentLevel) {
					this.$toast('请选择代理等级');
					return;
				}

				var base = new Base();
				var that = this;
				var params = {
					url: 'sys/setAgent',
					type: 'post',
					data: {
						level: that.agentLevel,
						duration: that.agentDuration,
						id: that.item.uid
					},
					sCallBack: function(res) {
						if (res.code == 0) {
							that.$refs.uTips.show({
								title: '设置成功',
								type: 'success',
								duration: '2300'
							})
							if (that.agentDuration == 'close') {
								var is_agent = null;
							} else {
								var is_agent = 1;
							}
							that.item.is_agent = is_agent;
							that.item.agent_level = that.agentLevel;
						}
						uni.hideLoading();
					}
				}
				base.request(params);
			},
			editVipPost() {
				this.showVip = false;

				var base = new Base();
				var that = this;
				var params = {
					url: 'sys/setVip',
					type: 'post',
					data: {
						duration: that.vipDuration,
						id: that.item.uid
					},
					sCallBack: function(res) {
						if (res.code == 0) {
							that.$refs.uTips.show({
								title: '设置成功',
								type: 'success',
								duration: '2300'
							})
							if (that.vipDuration == 'close') {
								var is_vip = null;
							} else {
								var is_vip = 1;
							}
							that.item.is_vip = is_vip;
						}
						uni.hideLoading();
					}
				}
				base.request(params);
			},
			editRatioPost() {
				this.showRatio = false;

				var base = new Base();
				var that = this;
				var params = {
					url: 'sys/setCommissionRatio',
					type: 'post',
					data: {
						ratio: that.ratio,
						id: that.item.uid
					},
					sCallBack: function(res) {
						if (res.code == 0) {
							that.$refs.uTips.show({
								title: '设置成功',
								type: 'success',
								duration: '2300'
							})
							that.item.commission_ratio = that.ratio;
						}
						uni.hideLoading();
					}
				}
				base.request(params);
			},
			loadData() {
				var base = new Base();
				var that = this;
				var params = {
					url: 'getSysUserList',
					data: {
						query_value: that.item.uid,
						query_type: that.list.query.query_type,
						order: that.list.query.order,
						page: that.list.page
					},
					sCallBack: function(res) {
						that.list.data = res.list.data
						uni.hideLoading();
					}
				}
				base.request(params);
			},
			show(item) {
				console.log(item);
				if (item.$orig) {
					var item = item.$orig
				}

				this.ratio.direct = item.commission_ratio.direct;
				this.ratio.indirect = item.commission_ratio.indirect;

				this.item = item;
				this.visible = true;
				this.list.data = [];
				this.list.page = 1;
				this.loading = false;
				this.finished = false;
				this.loadData();
				// this.$getList('getSysUserList?query_value=' + this.item.uid, this.list);
			},
			hide() {
				this.visible = false;
			},
			change(index) {
				this.current = index;
				this.list.query.query_type = this.tabList[index].type;
				this.type = this.tabList[index].type;
				if (this.type !== 'walletnote') {
					this.loadData();
				} else {
					console.log('财务记录')
					this.loadWalletNote();
				}
			},
			loadWalletNote() {
				var base = new Base();
				var that = this;
				var params = {
					url: 'sys/getWalletNote',
					type: 'post',
					data: {
						query_value: that.item.uid,
						page: that.walletnote.page
					},
					sCallBack: function(res) {
						that.walletnote = res.list.data
						uni.hideLoading();
					}
				}
				base.request(params);
			}
		}
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
						margin-right: 10rpx;
						height: 34rpx;
						line-height: 36rpx;
					}

					.uid {
						margin-top: 2px;
						font-size: 12px;
						color: #909399;
						border: 1px solid #909399;
					}
				}
			}

			.time {
				// display: flex;
				margin-top: 10px;
				color: #909399;
				font-size: 13px;

				.create_time {}

				.online_time {
					margin-top: 8rpx;
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
		color: #ff8d00;
		margin-top: 0;
		text-align: left;

		i {
			margin-right: 10rpx;
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

		>div {
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

		>div {
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

	.userAvatar {
		width: 48rpx;
	}

	.showAgent {
		padding: 40rpx;

		text {
			color: #00aa00;

			text {
				color: #ff0000;
			}
		}
	}

	.success {
		color: #00aa00 !important;
		border: 1px solid #00aa00 !important;
	}
	
	.noteDiv{
		    margin: 8rpx 26rpx;
		    border-radius: 18rpx;
			color: #FFFFFF;
			.p20{
				padding: 20rpx;
				.id{
					    position: absolute;
					    font-size: 26rpx;
					    margin-top: -12rpx;
					    margin-left: -12rpx;
					    color: #4CAF50;
					    background-color: #fff;
					    padding: 0 12rpx;
					    border-radius: 50px;
						span{
							margin-left: 22rpx;
							    color: coral;
							    padding: 2px 4px;
							    border-radius: 24px;
							    font-size: 12px;
						}
				}
			}
			.noteRight{
				width: 180rpx;
				float: right;
				text-align: right;
				.type{
					    position: absolute;
					    font-size: 60rpx;
					    color: #ffffff52;
					    padding-top: 44rpx;
					    padding-left: 44rpx;
				}
			}
			.cj{
				padding-top: 32rpx;
				padding-bottom: 16px;
			}
			.je{
				    position: absolute;
				    margin-top: -22rpx;
			}
	}
	.noteTc{
		background: #00aa00;
	}
	.noteTx{
		background: coral;
	}
</style>
