<script setup lang="ts">
import { ref } from 'vue';

//uni扫码一次

const scanCode = () => {
    uni.scanCode({
        scanType: ['qrCode'],
        success: (res) => {
            result.value = res.result
        },
        fail: (error) => {
            uni.showToast({
                title: '扫码失败',
                duration:1000,
            })
            console.log(error)
         }
    })
}


const result = ref<string>('')


</script>


<template>
  <view>
        <button @click="scanCode">扫码</button>
    </view>
    <view class="content">
        <text>cc{{ result }}</text>
    </view>


  </template>



<style lang="scss">
button {
    margin: 100rpx 300rpx 10rpx;
    height: 100rpx;
    width: 150rpx;
    background-color: rgb(132, 215, 248);
}

.content {
    height: 375rpx;
    width: 375rpx;
    background-color: blue;
    color: rgb(228, 240, 228);
    margin: 300rpx 180rpx 10rpx;
}
</style>
