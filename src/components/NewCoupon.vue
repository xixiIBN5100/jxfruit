<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { CouponItem,  NewCouponData } from '@/types/coupon';
import { useMemberStore } from '@/stores';
import { getNewCoupon } from '@/services/coupon';

const memberStore = useMemberStore()

onMounted(() => {

})

const emit = defineEmits<{
  (event: 'close'): void,
  (event: 'add'): void
}>()


//新的优惠券的信息
const newCoupon = ref<NewCouponData>(
  {
    type: '',
    price: undefined as unknown as number,
    effectivePrice: undefined as unknown as number,
    effectiveTime: '',
    username:''
  }
)
//可以初始化newCouponQuery{type：“”，……}以防止清空newCouponQuery时访问类型报错

newCoupon.value.username= memberStore.profile!.username
//处理输入框placeholder（待优化）
const placeholder1 = ref("请输入优惠券的类型")
const placeholder2 = ref("请输入优惠券的折扣金额")
const placeholder3 = ref("请输入优惠券的生效价格")
const placeholder4 = ref("请输入优惠券的有效期截止日期")
const addNewCouponData = async () => {
  const res = await getNewCoupon(newCoupon.value)
   console.log(res)
   if (res.code === 200) {
     uni.showToast({
       title: '获取成功'
     })
    emit('add')
   }
   else{
     return uni.showToast({
        title: '获取失败'
      })
  }
  emit('close')
}
</script>

<template>
  <view class="coupon-box">
    <text class="close icon-close" @tap="emit('close')"></text>
    <view class="content">
      <input class="custom" v-model="newCoupon.type" :placeholder="placeholder1"
        placeholder-class="input-placeholder" @focus="placeholder1 = ''" @blur="placeholder1 = '请输入优惠券的类型'" />
      <input class="custom" v-model="newCoupon.price" :placeholder="placeholder2"
        placeholder-class="input-placeholder" @focus="placeholder2 = ''" @blur="placeholder2 = '请输入优惠券的折扣金额'" />
      <input class="custom" v-model="newCoupon.effectivePrice" :placeholder="placeholder3"
        placeholder-class="input-placeholder" @focus="placeholder3 = ''" @blur="placeholder3 = '请输入优惠券的生效价格'" />
      <input class="custom" v-model="newCoupon.effectiveTime" :placeholder="placeholder4"
        placeholder-class="input-placeholder" @focus="placeholder4 = ''" @blur="placeholder4 = '请输入优惠券的有效期截止日期'" />
      <button class="submit-btn" @click="addNewCouponData">提交</button>
    </view>
  </view>
</template>

<style lang="scss">
.content {
  margin-top: -55rpx;
  height: 850rpx;
  background-color: rgb(202, 240, 244);
  border-radius: 30rpx;
  // padding: 30rpx;
  padding: 80rpx 30rpx 90rpx 30rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  border: 3px ridge;
  border-color: rgb(142, 226, 250);
}

.coupon-box {
  width: 750rpx;
  background-color: rgb(238, 243, 245);
  z-index: 10;
  height: 100%;
  padding-top: 20%;
}

.custom {
  height: 75rpx;
  min-height: 10rpx;
  margin-top: 60rpx;
  border: 2px ridge;
  border-radius: 20rpx;
  padding: 8rpx;
  border-color: rgb(111, 108, 108);
  font-weight: normal;
  color: #2443f5;
  line-height: 75rpx; //行高等于输入框高度，文本自动垂直居中
  .input-placeholder {
    color: #ab8eee;
  }
}

.submit-btn {
  width: 170rpx;
  height: 80rpx;
  top: 50rpx;
  line-height: normal;
  text-align: center;
  line-height: 80rpx;
  border-radius: 60rpx;
  color: rgb(48, 77, 204);
  background-color: rgb(83, 228, 231);
  align-items: center;
  border: 1px solid;
}

.close {
  margin-left: 15rpx;
  z-index: 10;
}

</style>
