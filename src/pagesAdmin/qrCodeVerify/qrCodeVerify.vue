<script setup lang="ts">
import { qrCodeVerify } from '@/services/coupon';
import { ref } from 'vue';
//核销券码
const couponCodeVerify = async () => {
  await qrCodeVerify({ codeNo: codeNo.value })
   uni.showToast({
    title: '核销成功'
  })
}

//uni扫码一次

const scanCode = () => {
  uni.scanCode({
    scanType: ['qrCode'],
    success: async (res) => {
      console.log(res)
      codeNo.value = res.result
      couponCodeVerify()
    },
    fail: (error) => {
      uni.showToast({
        title: '扫码失败',
        duration: 1000,
        icon: 'error'
      })
      console.log(error)
    }
  })
}
const codeNo = ref<string>('')
</script>


<template>
  <view>
    <button @click="scanCode">扫码</button>
  </view>
</template>



<style lang="scss">
button {
  margin: 100rpx 300rpx 10rpx;
  height: 100rpx;
  width: 200rpx;
  line-height: 100rpx;
  background-color: rgb(203, 243, 248);
  border-radius: 20px;
  border:3px solid rgb(44, 241, 255) ;
  font-weight: bold;
  color: rgb(29, 28, 29);
}

</style>
