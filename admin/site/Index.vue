<template>
	<view class="">
		<u-sticky>
			<u-tabs :list="list" :current="current" @change="change"></u-tabs>
		</u-sticky>
		<view class="page">

			<view v-if="current == '0'" class="item">
				<u-form :model="form" ref="uFormSys">
					<u-form-item label="平台名称" label-width="180">
						<u-input v-model="sysinfo.title" @input="onKeyInput($event,'webSys','title')" />
					</u-form-item>
					<u-form-item label="传送门" label-width="180">
						<u-switch v-model="sysinfo.cs" @change="onKeyInput($event,'webSys','cs')"></u-switch>
					</u-form-item>
					<u-form-item label="公告" label-width="180">
						<u-input v-model="sysinfo.notice" @input="onKeyInput($event,'webSys','notice')" />
					</u-form-item>
					<u-form-item label="代理公告" label-width="180">
						<u-input v-model="sysinfo.agent_notice" @input="onKeyInput($event,'webSys','agent_notice')" />
					</u-form-item>
					<u-form-item label="分享图" label-width="180">
						<div class="up">
							<div v-if="sysinfo.share_img==null" class="up-btn" @click="setImg('share_img')">
								<i>&#xe68b;</i>
								<text>选择图片</text>
							</div>
							<div v-else class="up-image">
								<i class="btn-close" @click="sysinfo.share_img=null">&#xe641;</i>
								<u-image :src="sysinfo.share_img" mode="widthFix"
									@click="$imagePreview([sysinfo.share_img])" />
							</div>
						</div>
					</u-form-item>
					<u-form-item label="二维码" label-width="160">
						<u-form-item label="客服" label-width="120">
							<div class="kf-btn-wrap">
								<div v-if="sysinfo.kf_qrcode != null" class="ok"><i>&#xe7be;</i></div>
								<u-button type="warning" class="btn" @click="setImg('kf_qrcode')" ripple="true">
									<i>&#xe7ba;</i> <text>设置客服二维码</text>
								</u-button>
							</div>
						</u-form-item>
						<u-form-item label="代理群" label-width="120">
							<div class="kf-btn-wrap">
								<div v-if="sysinfo.dailiqun_qrcode != null" class="ok"><i>&#xe7be;</i></div>
								<u-button type="primary" class="btn" @click="setImg('dailiqun_qrcode')" ripple="true">
									<u-icon name="kefu-ermai"></u-icon> <text>设置代理群二维码</text>
								</u-button>
							</div>
						</u-form-item>
					</u-form-item>
					<u-form-item label="激活码" label-width="160">
						<u-form-item label="长度" label-width="180">
							<u-input v-model="sysinfo.code_byte" @input="onKeyInput($event,'webSys','code_byte')" />
							<view slot="right">字符</view>
						</u-form-item>
						<u-form-item label="开码数量" label-width="180">
							<u-input v-model="sysinfo.code_num" @input="onKeyInput($event,'webSys','code_num')" />
							<view slot="right">个</view>
						</u-form-item>
						<u-form-item label="开通时长" label-width="180">
							<u-input v-model="sysinfo.code_time" @input="onKeyInput($event,'webSys','code_time')" />
							<view slot="right">个月</view>
						</u-form-item>
					</u-form-item>

					<u-form-item label="广告开关" label-width="180">
						<u-switch v-model="sysinfo.adswitch" @change="onKeyInput($event,'webSys','adswitch')">
						</u-switch>
					</u-form-item>
					<u-form-item label="广告间隔" label-width="180">
						<u-input v-model="sysinfo.qunad_num" @input="onKeyInput($event,'webSys','qunad_num')" />
						<view slot="right">条/显示广告</view>
					</u-form-item>
				</u-form>
				<view class="bottom">
					<u-button @click="submitSys('webSys')" type="primary" shape="circle" :ripple="true">保 存</u-button>
				</view>
			</view>


			<!-- {"charge": [{"num": 200, "gift": 0, "price": 2000}, {"num": 500, "gift": 0, "price": 5800}, {"num": 1000, "gift": "200", "price": 8800}], "reward": {"invite": 5, "checkin": 5, "clock_in": 5, "register": 6, "vip_invite": 12, "vip_checkin": 12, "wemp_follow": 10, "day_clock_num": 5, "continuity_lock_day": 7}} -->
			<view v-if="current == '1'" class="item">
				<u-form :model="form" ref="uFormAgent">
					<u-form-item label="积分规则" label-width="160">
						<u-form-item label="邀请" label-width="160">
							<u-input :value="sysinfo.gold.reward.invite"
								@input="onKeyInput($event,'goldSys','reward','invite')" />
							<view slot="right">积分</view>
						</u-form-item>
						<u-form-item label="签到" label-width="160">
							<u-input :value="sysinfo.gold.reward.checkin"
								@input="onKeyInput($event,'goldSys','reward','checkin')" />
							<view slot="right">积分</view>
						</u-form-item>
						<u-form-item label="注册" label-width="160">
							<u-input :value="sysinfo.gold.reward.register"
								@input="onKeyInput($event,'goldSys','reward','register')" />
							<view slot="right">积分</view>
						</u-form-item>
						<u-form-item label="VIP邀请" label-width="160">
							<u-input :value="sysinfo.gold.reward.vip_invite"
								@input="onKeyInput($event,'goldSys','reward','vip_invite')" />
							<view slot="right">积分</view>
						</u-form-item>
						<u-form-item label="VIP签到" label-width="160">
							<u-input :value="sysinfo.gold.reward.vip_checkin"
								@input="onKeyInput($event,'goldSys','reward','vip_checkin')" />
							<view slot="right">积分</view>
						</u-form-item>
					</u-form-item>
					<u-form-item label="积分购买" label-width="160">
						<u-form-item v-for="(item, index) in sysinfo.gold.charge" :label="'套餐'+(index+1)"
							label-width="160">
							<u-form-item label="数量" label-width="160">
								<u-input :value="item.num" @input="onKeyInput($event,'goldSys','charge','num',index)" />
								<view slot="right">积分</view>
							</u-form-item>
							<u-form-item label="价格" label-width="160">
								<u-input :value="item.price / 100"
									@input="onKeyInput($event,'goldSys','charge','price',index)" />
								<view slot="right">元</view>
							</u-form-item>
							<u-form-item label="赠送" label-width="160">
								<u-input :value="item.gift"
									@input="onKeyInput($event,'goldSys','charge','gift',index)" />
								<view slot="right">积分</view>
							</u-form-item>
						</u-form-item>
					</u-form-item>

					<u-form-item label="打卡规则" label-width="160">
						<u-form-item label="获得积分" label-width="160">
							<u-input :value="sysinfo.gold.reward.clock_in"
								@input="onKeyInput($event,'goldSys','reward','clock_in')" />
							<view slot="right">积分/次</view>
						</u-form-item>
						<u-form-item label="每日次数" label-width="160">
							<u-input :value="sysinfo.gold.reward.day_clock_num"
								@input="onKeyInput($event,'goldSys','reward','day_clock_num')" />
							<view slot="right">次/日</view>
						</u-form-item>
						<u-form-item label="连续打卡" label-width="160">
							<u-input :value="sysinfo.gold.reward.continuity_lock_day"
								@input="onKeyInput($event,'goldSys','reward','continuity_lock_day')" />
							<view slot="right">天</view>
						</u-form-item>
					</u-form-item>

					<u-form-item label="关注公众号" label-width="180">
						<u-input :value="sysinfo.gold.reward.wemp_follow"
							@input="onKeyInput($event,'goldSys','reward','wemp_follow')" />
						<view slot="right">积分</view>
					</u-form-item>


				</u-form>
				<view class="bottom">
					<u-button @click="submitSys('goldSys')" type="primary" shape="circle" :ripple="true">保 存</u-button>
				</view>
			</view>

			<!-- 代理 -->
			<!-- {"charge": [{"vip": 1, "name": "普通代理", "level": 1, "price": 8800, "duration": "longtime", "original_price":
			16800, "commission_ratio": {"direct": 0.5, "indirect": 0}}, {"vip": 1, "name": "黄金代理", "level": 2, "price":
			18800, "duration": "longtime", "original_price": 26800, "commission_ratio": {"direct": 0.5, "indirect":
			0.2}}, {"vip": 1, "name": "钻石代理", "level": 3, "price": 28800, "duration": "longtime", "original_price":
			36800, "commission_ratio": {"direct": 0.5, "indirect": 0.35}}], "agent_level": {"1": "普通代理", "2": "黄金代理",
			"3": "钻石代理"}, "default_commission_ratio": {"direct": 0.1, "indirect": 0}} -->
			<view v-if="current == '2'" class="item">
				<u-form :model="form" ref="uFormAgent">
					<u-form-item label="默认提成" label-width="160">
						<u-form-item label="一级" label-width="160">
							<u-input :value="sysinfo.agent.default_commission_ratio.direct * 100"
								@input="onKeyInput($event,'agentSys','default_commission_ratio','direct')" />
							<view slot="right">%</view>
						</u-form-item>
						<u-form-item label="二级" label-width="160">
							<u-input :value="sysinfo.agent.default_commission_ratio.indirect * 100"
								@input="onKeyInput($event,'agentSys','default_commission_ratio','indirect')" />
							<view slot="right">%</view>
						</u-form-item>
					</u-form-item>

					<u-form-item :label="item.name" label-width="160" v-for="(item, index) in sysinfo.agent.charge">
						<u-form-item label="原价" label-width="160">
							<u-input :value="item.original_price / 100"
								@input="onKeyInput($event,'agentSys','charge','original_price',index)" />
							<view slot="right">元</view>
						</u-form-item>
						<u-form-item label="现价" label-width="160">
							<u-input :value="item.price / 100"
								@input="onKeyInput($event,'agentSys','charge','price',index)" />
							<view slot="right">元</view>
						</u-form-item>
						<u-form-item label="提成" label-width="160">
							<u-form-item label="一级" label-width="160">
								<u-input :value="item.commission_ratio.direct * 100"
									@input="onKeyInput($event,'agentSys','charge','direct',index,'commission_ratio')" />
								<view slot="right">%</view>
							</u-form-item>
							<u-form-item label="二级" label-width="160">
								<u-input :value="item.commission_ratio.indirect * 100"
									@input="onKeyInput($event,'agentSys','charge','indirect',index,'commission_ratio')" />
								<view slot="right">%</view>
							</u-form-item>
						</u-form-item>
					</u-form-item>


				</u-form>
				<view class="bottom">
					<u-button @click="submitSys('agentSys')" type="primary" shape="circle" :ripple="true">保 存</u-button>
				</view>
			</view>

			<!-- 会员 -->
			<!-- {"charge": [{"name": "1个月", "price": 3900, "duration": 2592000, "original_price": 4500}, {"name": "6个月",
			"price": 6900, "duration": 15552000, "original_price": 9000}, {"name": "12个月", "price": 9900, "duration":
			31104000, "original_price": 18000}]} -->
			<view v-if="current == '3'" class="item">
				<u-form :model="form" ref="uFormAgent">
					<u-form-item v-for="(item, index) in sysinfo.vip.charge" :label="item.name" label-width="160">
						<u-form-item label="原价" label-width="160">
							<u-input :value="item.original_price / 100"
								@input="onKeyInput($event,'vipSys','charge','original_price',index)" />
							<view slot="right">元</view>
						</u-form-item>
						<u-form-item label="现价" label-width="160">
							<u-input :value="item.price / 100"
								@input="onKeyInput($event,'vipSys','charge','price',index)" />
							<view slot="right">元</view>
						</u-form-item>
					</u-form-item>

				</u-form>
				<view class="bottom">
					<u-button @click="submitSys('vipSys')" type="primary" shape="circle" :ripple="true">保 存</u-button>
				</view>
			</view>

			<!-- 广告 -->
			<!-- {"charge": [{"num": 2000, "desc": "30元2000曝光量", "name": "套餐一", "price": 3000}, {"num": 4000, "desc": "50元4000曝光量", "name": "套餐二", "price": 5000}, {"num": 10000, "desc": "100元10000曝光量", "name": "套餐三", "price": 10000}],"ad_grid":"adunit-be8103ec96ccecd0","ad_bannner":"adunit-be8103ec96ccecd0"} -->
			<view v-if="current == '4'" class="item">
				<u-form :model="form" ref="uFormAgent">
					<u-form-item v-for="(item, index) in sysinfo.ad.charge" :label="item.name" label-width="160">
						<u-form-item label="数量" label-width="160">
							<u-input :value="item.num" @input="onKeyInput($event,'adSys','charge','num',index)" />
							<view slot="right">次曝光</view>
						</u-form-item>
						<u-form-item label="价格" label-width="160">
							<u-input :value="item.price / 100"
								@input="onKeyInput($event,'adSys','charge','price',index)" />
							<view slot="right">元</view>
						</u-form-item>
					</u-form-item>
					<u-form-item label="广告设置" label-width="160">
						<u-form-item label="Banner" label-width="160">
							<u-input :value="sysinfo.ad.ad_bannner" @input="onKeyInput($event,'adSys','ad_bannner')" />
						</u-form-item>
						<u-form-item label="原生格子" label-width="160">
							<u-input :value="sysinfo.ad.ad_grid" @input="onKeyInput($event,'adSys','ad_grid')" />
						</u-form-item>
					</u-form-item>
				</u-form>

				<view class="bottom">
					<u-button @click="submitSys('adSys')" type="primary" shape="circle" :ripple="true">保 存</u-button>
				</view>
			</view>

			<!-- 群消耗积分 -->
			<!-- {"top_charge": [{"desc": "置顶10分钟，需消耗100积分", "gold": 100, "name": "套餐一", "time": 600}, {"desc": "置顶30分钟，需消耗200积分", "gold": 200, "name": "套餐二", "time": 1800}, {"desc": "置顶60分钟，需消耗300积分", "gold": 300, "name": "套餐三", "time": 3600}], "add_require_gold": 20, "see_qrcode_require_gold": 2} -->
			<view v-if="current == '5'" class="item">
				<u-form :model="form" ref="uFormAgent">
					<u-form-item label="积分消耗" label-width="160">
						<u-form-item label="添加群" label-width="160">
							<u-input :value="sysinfo.quncard.add_require_gold"
								@input="onKeyInput($event,'quncardSys','add_require_gold')" />
							<view slot="right">积分</view>
						</u-form-item>
						<u-form-item label="查看群" label-width="160">
							<u-input :value="sysinfo.quncard.see_qrcode_require_gold"
								@input="onKeyInput($event,'quncardSys','see_qrcode_require_gold')" />
							<view slot="right">积分</view>
						</u-form-item>
					</u-form-item>
					<u-form-item label="置顶群" label-width="160">
						<u-form-item :label="item.name" label-width="160"
							v-for="(item, index) in sysinfo.quncard.top_charge">
							<u-form-item label="积分" label-width="160">
								<u-input :value="item.gold"
									@input="onKeyInput($event,'quncardSys','top_charge','gold',index)" />
								<view slot="right">积分</view>
							</u-form-item>
							<u-form-item label="时间" label-width="160">
								<u-input :value="item.time / 60"
									@input="onKeyInput($event,'quncardSys','top_charge','time',index)" />
								<view slot="right">分钟</view>
							</u-form-item>
						</u-form-item>
					</u-form-item>

				</u-form>
				<view class="bottom">
					<u-button @click="submitSys('quncardSys')" type="primary" shape="circle" :ripple="true">保 存
					</u-button>
				</view>
			</view>

			<!-- 个人名片消耗积分 -->
			<!-- {"top_charge": [{"desc": "置顶10分钟，需消耗50积分", "gold": 50, "name": "套餐一", "time": 600}, {"desc": "置顶30分钟，需消耗100积分", "gold": 100, "name": "套餐三", "time": 1800}, {"desc": "置顶60分钟，需消耗200积分", "gold": 200, "name": "套餐三", "time": 3600}], "add_require_gold": 20, "see_qrcode_require_gold": 1} -->
			<view v-if="current == '6'" class="item">
				<u-form :model="form" ref="uFormAgent">
					<u-form-item label="积分消耗" label-width="160">
						<u-form-item label="添加群" label-width="160">
							<u-input :value="sysinfo.card.add_require_gold"
								@input="onKeyInput($event,'cardSys','add_require_gold')" />
							<view slot="right">积分</view>
						</u-form-item>
						<u-form-item label="查看群" label-width="160">
							<u-input :value="sysinfo.card.see_qrcode_require_gold"
								@input="onKeyInput($event,'cardSys','see_qrcode_require_gold')" />
							<view slot="right">积分</view>
						</u-form-item>
					</u-form-item>
					<u-form-item label="置顶" label-width="160">
						<u-form-item :label="item.name" label-width="160"
							v-for="(item, index) in sysinfo.card.top_charge">
							<u-form-item label="积分" label-width="160">
								<u-input :value="item.gold"
									@input="onKeyInput($event,'cardSys','top_charge','gold',index)" />
								<view slot="right">积分</view>
							</u-form-item>
							<u-form-item label="时间" label-width="160">
								<u-input :value="item.time / 60"
									@input="onKeyInput($event,'cardSys','top_charge','time',index)" />
								<view slot="right">分钟</view>
							</u-form-item>
						</u-form-item>
					</u-form-item>

				</u-form>
				<view class="bottom">
					<u-button @click="submitSys('cardSys')" type="primary" shape="circle" :ripple="true">保 存</u-button>
				</view>
			</view>

		</view>

	</view>
</template>

<script>
	import {
		Base
	} from '@/store/base.js';
	export default {
		data() {
			return {
				sysinfo: this.$store.state.config,
				list: [{
					name: '系统设置'
				}, {
					name: '积分'
				}, {
					name: '代理'
				}, {
					name: '会员'
				}, {
					name: '广告'
				}, {
					name: '群'
				}, {
					name: '个人名片'
				}],
				current: 0,

				webSys: {
					title: this.$store.state.config.title,
					cs: this.$store.state.config.cs,
					notice: this.$store.state.config.notice,
					agent_notice: this.$store.state.config.agent_notice,
					share_img: this.$store.state.config.share_img,
					kf_qrcode: this.$store.state.config.kf_qrcode,
					dailiqun_qrcode: this.$store.state.config.dailiqun_qrcode,
					code_byte: this.$store.state.config.code_byte,
					code_num: this.$store.state.config.code_num,
					code_time: this.$store.state.config.code_time,
				},
				agentSys: this.$store.state.config.agent,
				vipSys: this.$store.state.config.vip,
				adSys: this.$store.state.config.ad,
				goldSys: this.$store.state.config.gold,
				quncardSys: this.$store.state.config.quncard,
				cardSys: this.$store.state.config.card,
			}
		},
		methods: {
			change(index) {
				this.current = index;
			},
			submitSys(name) {
				var base = new Base();
				var that = this;
				var params = {
					url: 'sys/sysSite',
					type: 'post',
					data: {
						type: name,
						data: that[name]
					},
					sCallBack: function(res) {
						that.$toast(res.msg);
					}
				}
				base.request(params);
			},
			onKeyInput: function(event, $type, $name, $change, $index, $list) {
				console.log($type, $name, $index, $list, $change);
				console.log(event);
				if (event == true) {
					event = 1
				} else if (event == false) {
					event = 0
				} else {
					event = event
				}


				if ($index >= 0) {
					if ($index) {
						var index = $index;
					} else {
						var index = 0
					}
					this[$type][$name].forEach((item, e) => {
						if (e == index) {
							if ($list) {
								// this.$set(item, $list+'.'+$change, event / 100)
								this[$type][$name][index][$list][$change] = event / 100
							} else {
								if ($change == 'price') {
									this[$type][$name][index][$change] = event * 100
								} else if ($change == 'time') {
									this[$type][$name][index][$change] = event * 60
								} else {

									this[$type][$name][index][$change] = event
								}
								if ($type == 'adSys') {
									this[$type][$name][index].desc = this[$type][$name][index].price / 100 +
										'元' + this[$type][$name][index].num + '曝光量'
								}
								if ($type == 'quncardSys' || $type == 'cardSys') {
									this[$type][$name][index].desc = '置顶' + this[$type][$name][index].time /
										60 +
										'分钟，需消耗' + this[$type][$name][index].gold + '积分'
								}
							}
						}
					});
				} else if ($change) {
					if ($type == 'goldSys') {
						this[$type][$name][$change] = event;
					} else {
						this[$type][$name][$change] = event / 100;
					}
				} else {
					this[$type][$name] = event;
				}
				// console.log(pname)
			},
			setImg(name) {
				var self = this;
				var base = new Base();

				uni.chooseImage({
					count: 1,
					sizeType: ['compressed'],
					sourceType: ['album'],
					success: (res) => {
						uni.showLoading({
							title: '正在上传'
						});
						console.log('chooseImage:');
						console.log(res);
						var tempFilePaths = res.tempFilePaths;
						uni.uploadFile({
							url: base.baseRequestUrl + 'uploader',
							filePath: tempFilePaths[0],
							name: 'file',
							formData: {
								'type': "file"
							},
							success: (item) => {
								uni.hideLoading();
								console.log('uploadFile:');
								let path = JSON.parse(item.data);
								console.log(path);
								if (path.code == 0) {
									self.sysinfo[name] = path.url;
									self.webSys[name] = path.url;
									self.$toast('上传成功');
								} else {
									self.$toast('上传失败');
								}

							}

						})
					}
				});

			}
		},
	}
</script>

<style lang="scss" scoped>
	.page {
		padding: 0 40rpx;
		background-color: #f8f8f8;
		height: auto;
	}

	.item {
		padding-bottom: 40rpx;
	}

	.bottom {
		margin: 40rpx 0;
	}

	.kf-btn-wrap {
		position: relative;
		overflow: hidden;
		border-radius: 4px;

		.btn {
			width: 100%;
		}

		.ok {
			position: absolute;
			top: 0;
			left: 0;
			background: #07c160;
			color: #fff;
			padding: 0 6px;
			border-bottom-right-radius: 4px;
			z-index: 2;
			height: 20px;
			line-height: 20px;
		}
	}

	.up {
		width: 80px;
		height: 80px;
		position: relative;

		.up-btn {
			width: 100%;
			height: 100%;
			background: #ffffff;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 26rpx;
			color: #606266;
			flex-direction: column;
			border-radius: 10rpx;

			i {
				font-size: 30px;
				color: #dcdee0;
			}
		}

		.btn-close {
			position: absolute;
			top: -4px;
			right: -4px;
			background: rgba($color: #333, $alpha: 0.8);
			color: #fff;
			border: 2px solid #fff;
			width: 18px;
			height: 18px;
			border-radius: 18px;
			font-size: 12px;
			display: flex;
			align-items: center;
			justify-content: center;
			z-index: 2;
		}

		.up-image {
			width: 80px;
			height: 80px;
			overflow: hidden;

			img {
				width: 100%;
			}
		}
	}
</style>
