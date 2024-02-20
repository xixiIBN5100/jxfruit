<script setup lang="ts">
import type { CouponItem } from '@/types/coupon'
import { getCoupon, getDefaultCoupon } from '@/services/coupon'
import { useCouponStore } from '@/stores/modules/coupon'
import { onLoad } from '@dcloudio/uni-app'
import { computed, ref } from 'vue'

// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync()

//const couponList = ref<CouponItem[]>()
const getDefaultCouponData = async () => {
  const res = await getDefaultCoupon()
  // couponList.value = res.data
}
onLoad(() => {
  getDefaultCouponData()
})

const couponList = ref<CouponItem[]>([{
  id: 1,
  type: '折扣券',
  price: 10, // 折扣金额或折扣比例
  effectiveTime: '2023-04-10 00:00:00',
  effectivePrice: 1, // 满足该价格条件后可使用（如果是满减券则表示满多少可用）
  userId: 10001,
  isUsed: 0, // 是否已使用，0表示未使用，1表示已使用
  expired: 0 // 2023-05-01 00:00:00 (Unix 时间戳)
},
  {
    id: 2,
    type: '现金券',
    price: 30,
    effectiveTime: '2023-02-25 00:00:00',
    effectivePrice: 0, // 现金券通常无需满足最低消费额
    userId: 10002,
    isUsed: 1,
    expired: 1677523200 // 2023-03-15 00:00:00
  },
  {
    id: 3,
    type: '折扣券',
    price: 15, // 折扣金额或折扣比例
    effectiveTime: '2023-04-10 00:00:00',
    effectivePrice: 200, // 满足该价格条件后可使用（如果是满减券则表示满多少可用）
    userId: 10001,
    isUsed: 0, // 是否已使用，0表示未使用，1表示已使用
    expired: 1688121600 // 2023-05-01 00:00:00 (Unix 时间戳)
  },

]
  )

// 是否分页结束
const isFinish = ref(false)

// 是否触发下拉刷新
const isTriggered = ref(false)
// 自定义下拉刷新被触发
const onRefresherrefresh = async () => {
  // 开始动画
  isTriggered.value = true
  // 重置数据
  //queryParams.pageNum = 1
  //priviledgeList.value= []
  isFinish.value = false
  // 加载数据
  //await getMemberPriviledgeData()
  // 关闭动画
  isTriggered.value = false
}







// 获取页面参数
const query = defineProps<{
  totalPrice: number
}>()

const onChangeCoupon = (item: CouponItem) => {
  // 修改选择的优惠券
  const couponStore = useCouponStore()
  couponStore.changeSelectedCoupon(item)
  // 返回上一页
  uni.navigateBack()
}


</script>

<template>
  <scroll-view enable-back-to-top scroll-y class="coupons" refresher-enabled :refresher-triggered="isTriggered"
    @refresherrefresh="onRefresherrefresh" @scrolltolower="getDefaultCouponData">
    <view class="coupon">
      <view v-if="couponList.length">
        <view v-for="(item, index) in couponList" :key="index">
          <view class="card" v-if="item.isUsed === 0 && query.totalPrice >= item.effectivePrice
            && query.totalPrice >= item.price && item.expired === 0">
            <!-- 优惠券信息 -->
            <view>
              <view><text style="font-size: 40rpx">￥</text>{{ item.price }}</view>
              <view class="text1">{{ item.type }}</view>
            </view>
            <view class="regulation">
              <view class="limit" v-if="item.effectivePrice != 0">满{{ item.effectivePrice }} 可用</view>
              <view class="effective-time">有效期至：{{ item.effectiveTime }}</view>
            </view>
            <text class="use" @click="onChangeCoupon(item)">使用</text>
          </view>
        </view>
        <view class="loading-text" :style="{ paddingBottom: safeAreaInsets?.bottom + 'px' }">
          {{ isFinish ? '没有更多数据~' : '正在加载...' }}
        </view>
      </view>
      <view v-else class="logo">
        <view class="text">
          暂无合适的优惠券
        </view>
        <image class="logo-image" mode="widthFix" src="@/static/images/1.jpg">
        </image>
      </view>

    </view>

  </scroll-view>
</template>

<style lang="scss">
.loading-text {
  text-align: center;
  font-size: 28rpx;
  color: #666;
  padding: 20rpx 0;
}

.card {
  justify-content: space-between;
  align-items: center;
  min-height: 100rpx;
  padding: 30rpx;
  box-sizing: border-box;
  margin: 20rpx 20rpx 0;
  background-color: #ffe6e6;
  color: #ff0000 ;
  display: flex;
  border: 1px solid rgba(255,0,0,0.9);
  border-radius: 30rpx;
  .text1{
    font-size:25rpx;
  }
  .use {
      border-radius: 30rpx;
      width: 120rpx;
      height: 60rpx;
      font-size: 30rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      line-height: 60rpx;
      border: 2px solid rgb(241, 48, 48);

    }

  &:last-child {
    padding-bottom: 40rpx;
  }

  .regulation {
    font-size: 25rpx;

    .limit {
      font-size: 35rpx;
      font-weight: 700;
      margin-bottom: 15rpx;
    }
    .effective-time{
      width: 330rpx;
      font-size: 30rpx;
      font-weight: 700;
    }
  }


}
 .coupons {
    height: 100%;
  }
.coupon {
  text-align: center;
  .text {
    margin-top: 70rpx;
    font-size: 50rpx;
    /* 设置字体大小为20rpx */
    color: #87CEFA;
    /* 设置淡蓝色，这里使用的是一个示例颜色值，你可以根据需要调整 */

  }
}


.logo-image {
  margin-top: 110rpx;

}
</style>
