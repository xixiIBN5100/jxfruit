<script setup lang="ts">
import { ref } from 'vue'
import priviledgeList from './components/priviledgeList.vue'
import { onLoad } from '@dcloudio/uni-app'
import { useMemberStore } from '@/stores'

const memberStore = useMemberStore()

const query = defineProps<{
  type: string
}>()

onLoad(() => {
  if (!memberStore.profile) {
    uni.navigateTo({
      url: '/pages/login/login'
    })
  }
})
const priviledgeTabs = ref([
  { priviledgeType: 0, title: '优惠券' },
  { priviledgeType: 1, title: '购物券' }

])
// 高亮下标
const activeIndex = ref(priviledgeTabs.value.findIndex((v) => v.priviledgeType === Number(query.type)))
// 默认渲染容器
</script>

<template>
  <view>
    <view class="tabs">
      <text class="item" v-for="(item, index) in priviledgeTabs" :key="item.title" @tap="() => { activeIndex = index }">
        {{ item.title }}
      </text>
      <!-- 游标 -->
      <view class="cursor" :style="{ left: activeIndex * 33 + 0 + '%' }"></view>
    </view>
    <!-- 滑动容器 -->

    <swiper class="swiper" :current="activeIndex" @change="activeIndex = $event.detail.current">
      <!-- 滑动项 -->
      <swiper-item v-for="item in priviledgeTabs" :key="item.title">
        <!-- 权益列表 -->
        <priviledgeList :priviledge-type="item.priviledgeType" />
      </swiper-item>
    </swiper>
  </view>
</template>

<style lang="scss" >
// 深度选择器修改 uni-data-picker 组件样式
.tabs {
  display: flex;
  justify-content: space-around;
  line-height: 60rpx;
  margin: 0 10rpx;
  background-color: #fff;
  box-shadow: 0 4rpx 6rpx rgba(240, 240, 240, 0.6);
  position: relative;
  z-index: 9;

  .item {
    flex: 1;
    text-align: center;
    padding: 20rpx;
    font-size: 35rpx;
    font-weight: bolder;
    color: #262626;
  }

  .cursor {
    position: absolute;
    bottom: 0;
    width: 33%;
    height: 6rpx;
    padding: 0 50rpx;
    background-color: rgb(255, 234, 189);
    /* 过渡效果 */
    transition: all 0.3s;
  }
}

.swiper {
  background-color: #9fddfa;
  height: 100vh;
  width: 750rpx;
}
</style>
