<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { onMounted, ref } from 'vue';
import { useMemberStore } from '@/stores'
const query = defineProps<{ couponCodeId: number }>()
const imgUrl=ref<string>('')
console.log(query.couponCodeId)
const getCouponCodeData = async () => {
  const memberStore = useMemberStore()
  uni.request({
    url: `https://api.familystudy.cn:8083/api/coupon/qrCode/${query.couponCodeId}`,
    method: 'GET',
    responseType: 'arraybuffer',//返回原始二进制图像数据，低级，不能直接操作
    header: {
      'Content-Type': 'application/json',//请求体内容类型，json
      'token': memberStore.profile?.token
    },
    success: (res:any) => {
      const arrayBuffer = new Uint8Array(res.data)//按字节读取数据，视图对象
      const base64 = "data:image/png;base64," + uni.arrayBufferToBase64(arrayBuffer)//视图内容转为Base64字符串
      imgUrl.value = base64
    },
  })
}
onLoad(() => {
   getCouponCodeData()
})




</script>


<template>
  <view class="code">
    <view class="text">
       <text>管理员扫码进行核销</text>
    </view>
    <image :src='imgUrl'></image>
  </view>
</template>

<style lang="scss">
.code {
  height: 100vh;
  width: 750rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .text{
    font-size: 30rpx;
    font-weight: bolder;
  }
  image{
    position: relative;
    height:750rpx;
    width: 100%;
  }
}
</style>
