<script setup lang="ts">
import { ref } from 'vue'
import couponManageList from './components/couponManageList.vue';
import { onLoad } from '@dcloudio/uni-app'
import { useMemberStore } from '@/stores'

const memberStore = useMemberStore()

const CouponTabs = [
  { id: 0, title: "可使用" },
  { id: 1, title: "已过期" },
  { id: 2, title: "已使用" },
]

onLoad(() => {
  if (!memberStore.profile) {
    uni.navigateTo({
      url: '/pages/login/login'
    })
  }
})
</script>

<template>
  <view>
    <swiper class="swiper">
      <swiper-item v-for="item in CouponTabs" :key="item.id">
        <view class="tabs">
          <text class="item">
            {{ item.title }}
          </text>

          <view class="cursor" :style="{ left: 35 + '%' }"></view>
        </view>
        <couponManageList :couponStateType="item.id" />
      </swiper-item>
    </swiper>
  </view>
</template>

<style lang="scss">
// 深度选择器修改 uni-data-picker 组件样式

.tabs {
  display: flex;

  justify-content: space-around;
  line-height: 60rpx;
  margin: 0 10rpx;
  background-color: rgb(120, 231, 241, 0.3);
  box-shadow: 0 4rpx 6rpx rgba(240, 240, 240, 0.6);
  position: relative;
  z-index: 9;

  .item {
    flex: 1;
    text-align: center;
    padding: 20rpx;
    font-size: 28rpx;
    color: #0d7fe3;
  }

  .cursor {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 30%;
    height: 6rpx;
    padding: 0 50rpx;
    background-color: rgb(102, 211, 244);
    /* 过渡效果 */
    transition: all 0.4s;
  }
}



.swiper {
  background-color: #eef3f5;
  height: 100vh;
  width: 750rpx;
}
</style>
