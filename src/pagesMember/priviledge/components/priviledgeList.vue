<script setup lang="ts">
import { CouponState } from '@/services/constants'
import { CouponStateList } from '@/services/constants'
import type { CouponItem } from '@/types/coupon'
import { getCoupon } from '@/services/coupon'
import { onMounted, ref } from 'vue'
import { useMemberStore } from '@/stores'
import type { MemberItem } from '@/types/member'
import { getMemberInfo } from '@/services/member'

// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync()

const memberStore = useMemberStore()

// 定义 porps
const props = defineProps<{
  priviledgeType: number
}>()

// 请求参数
const queryParams: Required<OrderListParams> = {
  pageNum: 1,
  pageSize: 5,
  orderState: props.orderState,
}

const emit = defineEmits(['showComment'])

// 获取订单列表
const priviledgeList = ref<CouponItem[]>([])
// 是否加载中标记，用于防止滚动触底触发多次请求
const isLoading = ref(false)

const getMemberPriviledgeData = async () => {
  // 如果数据处于加载中，退出函数
  if (isLoading.value) return
  // 退出分页判断
  if (isFinish.value === true) {
    return uni.showToast({ icon: 'none', title: '没有更多数据~' })
  }
  // 发送请求前，标记为加载中
  isLoading.value = true
  // 发送请求
  const res = await getCoupon()
  console.log(res.data)
  // 发送请求后，重置标记
  isLoading.value = false
  // 数组追加
  priviledgeList.value.push(...res.data)
  // priviledgeList.value = res.data

  console.log("privi", priviledgeList.value)

  // // 分页条件
  if (queryParams.pageNum < res.data.pages) {
  //   // 页码累加
    queryParams.pageNum++
  } else {
  //   // 分页已结束
    isFinish.value = true
  }

  // console.log("res", res.data.records)
}

const member = ref<MemberItem>()

const getMemberData = async () => {

  const res = await getMemberInfo()
  console.log(res)
  member.value = res.data
}


onMounted(() => {
  getMemberPriviledgeData()
  getMemberData()
})

const useCoupon = (priviledge: CouponItem) => {
  if (priviledge.isUsed === 0 && priviledge.expired === 0) {
    uni.switchTab({url: '/pages/cart/cart'})
  }
}
const recharge = () => {
  console.log("开始充值")
  uni.showModal({
    title: '敬请期待'
  })

}


// 是否分页结束
const isFinish = ref(false)
// 是否触发下拉刷新
const isTriggered = ref(false)
// 自定义下拉刷新被触发
const onRefresherrefresh = async () => {
  // 开始动画
  isTriggered.value = true
  // 重置数据
  queryParams.pageNum = 1
  priviledgeList.value = []
  isFinish.value = false
  // 加载数据
  await getMemberPriviledgeData()
  // 关闭动画
  isTriggered.value = false
}
</script>

<template>
  <scroll-view
    enable-back-to-top
    scroll-y
    class="orders"
    refresher-enabled
    :refresher-triggered="isTriggered"
    @refresherrefresh="onRefresherrefresh"
    @scrolltolower="getMemberPriviledgeData"
  >
    <view
    v-for="priviledge in priviledgeList" :key="priviledge.id"
    v-if="props.priviledgeType === 0"
    >
      <view class="card"
      :class="[(priviledge.isUsed ===CouponState.YiShiYong|| priviledge.expired === CouponState.YiGuoQi) ? 'used' : '']">
      <!-- 优惠券信息 -->
      <view>
        <view><text style="font-size: 40rpx">￥</text>{{ priviledge.price }}</view>
        <view>{{ priviledge.type }}</view>
      </view>
      <view class="regulation">
        <view class="limit">满{{ priviledge.effectivePrice }} 可用</view>
        <view class="effective-time">有效期至：{{ priviledge.effectiveTime }}</view>
      </view>
      <view class="use" @click="useCoupon(priviledge)">{{ priviledge.isUsed === 1 ? '已使用':
        (priviledge.expired === 1 ? '已过期': '使用')}}</view>
      </view>
    </view>
    <!--展示会员信息-->
    <view class="member-card"  v-if="props.priviledgeType === 1" >
      <view class="text">您的会员等级为 V{{ member?.vipLevel }} </view>
      <view class="text">积分：{{ member?.points }} </view>
      <view class="recharge" @click="recharge">充值</view>
    </view>
    <!-- 底部提示文字-->
    <view class="loading-text" :style="{ paddingBottom: safeAreaInsets?.bottom + 'px' }">
      {{ isFinish ? '没有更多数据~' : '正在加载...' }}
    </view>
  </scroll-view>
</template>

<style lang="scss">

// 优惠券列表
.orders {
  height: 100%;
  .used {
    background-color: grey !important;
    color: black !important;
    .use {
      border: 1rpx solid black !important;
    }
  }

  .card {
    justify-content: space-between;
    align-items: center;
    min-height: 100rpx;
    padding: 30rpx;
    box-sizing: border-box;
    margin: 20rpx 20rpx 0;
    border-radius: 10rpx;
    background-color: #ffe6e6;
    color:#ff0000;
    display: flex;
    border-radius: 30rpx;
    &:last-child {
      padding-bottom: 40rpx;
    }

    .regulation {
      font-size: 25rpx;
      .limit {
          font-size: 35rpx;
          font-weight: 700;
      }
    }

    .use {
      border-radius: 30rpx;
      width: 120rpx;
      height: 60rpx;
      font-size: 30rpx;
      text-align: center;
      line-height: 60rpx;
      border: 1rpx solid #ff0000;
    }
  }

  .member-card {
    width: 700rpx;
    height: 300rpx;
    border-radius: 20rpx;
    background-color: rgb(255,234,189);;
    margin: 30rpx auto;
    padding: 30rpx;
    box-sizing: border-box;
    position: relative;

    .text {
      font-size: 35rpx;
    }

    .recharge {
      position: absolute;
      bottom: 20rpx;
      right: 20rpx;
      width: 100rpx;
      height: 50rpx;
      line-height: 50rpx;
      text-align: center;
      border-radius: 20rpx;
      background-color: white;
    }
  }

  .status {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 28rpx;
    color: #999;
    margin-bottom: 15rpx;

    .date {
      color: #666;
      flex: 1;
    }

    .primary {
      color: #ff9240;
    }

    .icon-delete {
      line-height: 1;
      margin-left: 10rpx;
      padding-left: 10rpx;
      border-left: 1rpx solid #e3e3e3;
    }
  }

  .goods {
    display: flex;
    margin-bottom: 20rpx;

    .cover {
      width: 170rpx;
      height: 170rpx;
      margin-right: 20rpx;
      border-radius: 10rpx;
      overflow: hidden;
      position: relative;
      .image {
        width: 170rpx;
        height: 170rpx;
      }
    }

    .quantity {
      position: absolute;
      bottom: 0;
      right: 0;
      line-height: 1;
      padding: 6rpx 4rpx 6rpx 8rpx;
      font-size: 24rpx;
      color: #fff;
      border-radius: 10rpx 0 0 0;
      background-color: rgba(0, 0, 0, 0.6);
    }

    .meta {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .name {
      height: 80rpx;
      font-size: 26rpx;
      color: #444;
    }

    .type {
      line-height: 1.8;
      padding: 0 15rpx;
      margin-top: 10rpx;
      font-size: 24rpx;
      align-self: flex-start;
      border-radius: 4rpx;
      color: #888;
      background-color: #f7f7f8;
    }

    .single-price {
      margin-top: 30rpx;
      width: fit-content;
      font-size: 35rpx;
      color: #ff9240;
    }

    .sku-title{
      display: flex;
      justify-content: space-between;
    }

    .num {
      font-size: 30rpx;
      width:45rpx;
      height: 45rpx;
      border-radius: 5rpx;
      border: 1rpx solid gainsboro;
      text-align: center;
      line-height: 45rpx;
    }

    .more {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22rpx;
      color: #333;
    }
  }

  .payment {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    line-height: 1;
    padding: 20rpx 0;
    text-align: right;
    color: #999;
    font-size: 28rpx;
    border-bottom: 1rpx solid #eee;

    .quantity {
      font-size: 24rpx;
      margin-right: 16rpx;
    }

    .amount {
      color: #444;
      margin-left: 6rpx;
    }

    .symbol {
      font-size: 20rpx;
    }
  }

  .action {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding-top: 20rpx;

    .button {
      width: 180rpx;
      height: 60rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-left: 20rpx;
      border-radius: 60rpx;
      border: 1rpx solid #ccc;
      font-size: 26rpx;
      color: #444;
    }

    .secondary {
      color: rgb(255,234,189);;
      border-color: rgb(255,234,189);;
    }

    .primary {
      color: #fff;
      background-color: rgb(255,234,189);;
      border-color: rgb(255,234,189);;
    }
  }

  .loading-text {
    text-align: center;
    font-size: 28rpx;
    color: #666;
    padding: 20rpx 0;
  }
}
</style>
