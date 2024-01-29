<script setup lang="ts">
import { onMounted, ref, Vue } from 'vue'
import { onLaunch, onLoad, onReady } from '@dcloudio/uni-app'
import { getMemberOrderById, submitRefundData } from '@/services/order'
import { useMemberStore } from '@/stores'
// import { }
import type { OrderItem } from '@/types/order'
// 页面参数
const query = defineProps<{
  skuId?: number
  count?: number
  orderId?: number
  type?: string,
  price?: number,
  formData: Object,
  id?: number
}>()

// 获取会员Store
const memberStore = useMemberStore()

const orderInfo = ref<OrderItem[]>([])

const getOrderByIdData = async (id: number) => {
    console.log("id", id)
    const res = await getMemberOrderById(id) 
    orderInfo.value = res.data
    console.log("skus", orderInfo.value.skus.filter(item => item.id === Number(query.id)))
    orderInfo.value.skus = orderInfo.value.skus.filter(item => item.id === Number(query.id))
    amount.value = orderInfo.value.skus[0].price * orderInfo.value.skus[0].num
}

onLoad(() => {
    getOrderByIdData(query.orderId)
})

const amount = ref<number>()
const reason = ref<string>()

export type RefundItem = {
    orderId: number,
    amount: number,
    reason: string
}

const submitRefund = async () => {
    const amountWithFloat = Number(amount.value).toFixed(2)
    let data = {
        orderId: Number(query.orderId),
        amount: Number(amount.value).toFixed(2),
        reason: reason.value 
    }
    const res = await submitRefundData(data)
    if (res.code === 200) {
        uni.showToast({
            title: '申请退款成功',
            icon: 'success'
        })
        setTimeout(() => {
          uni.navigateBack()
        }, 1000)
    }
}
</script>

<template>
  <view>
    <view class="title">订单商品</view>
    <view class="card">
    <navigator
      v-for="item in orderInfo.skus"
      :key="item.id"
      class="goods"
      :url="`/pagesOrder/detail/detail?id=${orderInfo.orderId}`"
      hover-class="none"
    >
    <view class="cover">
      <image class="image" mode="aspectFit" :src="item.thumbNail"></image>
    </view>
    <view class="meta">
      <view class="sku-title">
        <view class="name ellipsis">{{ item.goodsName }}</view>
        <view class="num">x{{ item.num }}</view>
      </view>
      <view class="type">{{ item.scale }}</view>
      <view class="single-price"> ￥ {{ item.price }} </view>
      </view>
      </navigator>
      <view style="display: flex;"> 
          <text class="text">退款金额(精确到分) </text> 
          <input type="text" style="border: 1rpx solid rgb(190, 190, 190);
          border-radius: 15rpx;width: 150rpx" v-model="amount"> &nbsp; 元
      </view>
      <view style="display: flex;margin-top: 20rpx">
          <text class="text">您退款的原因是</text> 
          <input type="text" style="border: 1rpx solid rgb(190, 190, 190);
          border-radius: 15rpx;width: 500rpx;padding: 10rpx"  v-model="reason">
      </view>
      <button class="btn" @tap="submitRefund">提交退款申请</button>
    </view>
  </view>
</template>

<style scoped lang="scss">
.title {
    margin: 30rpx 40rpx;
    color: grey;
    font-size: 30rpx;
}
 .goods {
    display: flex;
    margin-bottom: 20rpx;

    .cover {
      width: 170rpx;
      height: 170rpx;
      margin-right: 20rpx;
      border-radius: 15rpx;
      overflow: hidden;
      position: relative;
      .image {
        width: 170rpx;
        height: 170rpx;
        border-radius: 15rpx;
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

  .card {
    min-height: 100rpx;
    padding: 20rpx;
    margin: 20rpx 20rpx 0;
    border-radius: 10rpx;
    background-color: #fff;

    &:last-child {
      padding-bottom: 40rpx;
    }
  }

  .btn {
    background: rgb(255,234,189);
    border-radius: 30rpx;
    margin-top: 30rpx;
  }

  .text {
    width: 400rpx;
  }
</style>