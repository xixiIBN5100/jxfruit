<script setup lang="ts">
    import type { CouponItem } from '@/types/coupon'
    import { getCoupon } from '@/services/coupon'
    import { useCouponStore } from '@/stores/modules/coupon'
    import { onLoad, onShareAppMessage, onShareTimeline } from '@dcloudio/uni-app'
    import { computed, ref } from 'vue'

    const couponList = ref<CouponItem[]>()
    const getCouponData = async () => {
        const res = await getCoupon()
        couponList.value = res.data
    }
    onLoad(() => {
        getCouponData()
    })

    // 获取页面参数
    const query = defineProps<{
        totalPrice?: number
    }>()

    const onChangeCoupon = (item: CouponItem) => {
        // 修改地址
        const couponStore = useCouponStore()
        couponStore.changeSelectedCoupon(item)
        // 返回上一页
        uni.navigateBack()
    }
</script>

<template>
    <view class="coupon">
        <view v-if="couponList?.length !== 0"> 
            <template v-for="(item,index) in couponList" :key="index"
            >
                <view class="card" v-if = "item.isUsed === 0 && query?.totalPrice >= item.effectivePrice 
                && query?.totalPrice >= item.price && item.expired === 0">
                <!-- 订单信息 -->
                    <view>
                        <view><text style="font-size: 40rpx">￥</text>{{ item.price }}</view>
                        <view>{{ item.type }}</view>        
                    </view>
                    <view class="regulation">
                        <view class="limit">满{{ item.effectivePrice }} 可用</view>
                        <view class="effective-time">有效期至：{{ item.effectiveTime }}</view>
                    </view>
                    <view class="use" @click="onChangeCoupon(item)">使用</view>
                </view>
            </template>
        </view>
        <view v-else> 
            暂无合适的优惠券
        </view>
    </view>
</template>

<style lang="scss">
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
</style>