<script setup lang="ts">
import type { CouponItem } from '@/types/coupon'
import { getCoupon, getDefaultCoupon } from '@/services/coupon'
import { useCouponStore } from '@/stores/modules/coupon'
import { onLoad } from '@dcloudio/uni-app'
import { computed, ref } from 'vue'

// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync()
const isLoading = ref(false)
const couponDefaultList = ref<CouponItem[]>([])
const getDefaultCouponData = async () => {
  isLoading.value = true
  const res = await getDefaultCoupon()
  isLoading.value=false
  //问题：如果返回一个空对象，数组加上去，则length>0,渲染出空券(已解决)
  if (Object.keys(res.data).length !== 0) {
    couponDefaultList.value.push(res.data)
  }

}
onLoad(() => {
  getDefaultCouponData()
})

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
  <scroll-view enable-back-to-top scroll-y class="coupons">
    <view class="coupon">
      <view v-if="couponDefaultList.length">
        <view class="card" v-for="item in couponDefaultList">
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
        <view class="loading-text" :style="{ paddingBottom: safeAreaInsets?.bottom + 'px' }">
          {{ isLoading ? '正在加载...' : '' }}
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
  color: #ff0000;
  display: flex;
  border: 1px solid rgba(255, 0, 0, 0.9);
  border-radius: 30rpx;

  .text1 {
    font-size: 25rpx;
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

    .effective-time {
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
