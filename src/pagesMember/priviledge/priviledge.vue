<script setup lang="ts">
import { ref } from 'vue'
import priviledgeList from './components/priviledgeList.vue'
import { onLoad } from '@dcloudio/uni-app'
import { useMemberStore } from '@/stores'
import { getCoupon } from '@/services/coupon';

const memberStore = useMemberStore()

const query = defineProps<{
  type: string
}>()

/*onLoad(() => {
    if (!memberStore.profile) {
    uni.navigateTo({
      url: '/pages/login/login'
    })
  }
})*/
//测试一下
const getCouponData = async () => {
  const res = await getCoupon()
   console.log(res)
}
onLoad(() => {
  getCouponData()
})

const priviledgeTabs = ref([
  { priviledgeType: 0, title: '券', isRender: false },
  { priviledgeType: 1, title: '会员', isRender: false },
  // { priviledgeType: 2, title: '会员', isRender: false },
])
// 高亮下标
const activeIndex = ref(priviledgeTabs.value.findIndex((v) => v.priviledgeType === Number(query.type)))
// 默认渲染容器
priviledgeTabs.value[activeIndex.value].isRender = true
</script>

<template>
    <view>
        <view class="tabs">
            <text class="item" v-for="(item, index) in priviledgeTabs" :key="item.title"
              @tap="() => {activeIndex = index
                           item.isRender = true }">
                           {{ item.title }}
            </text>
            <!-- 游标 -->
            <view class="cursor" :style="{ left: activeIndex * 50 + 13 + '%' }"></view>
        </view>
         <!-- 滑动容器 -->

        <swiper class="swiper" :current="activeIndex" @change="activeIndex = $event.detail.current">
          <!-- 滑动项 -->
          <swiper-item v-for="item in priviledgeTabs" :key="item.title">
            <!-- 订单列表 -->
            <priviledgeList :priviledge-type="item.priviledgeType" v-show="item.isRender" />
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
  background-color: #fff;
  box-shadow: 0 4rpx 6rpx rgba(240, 240, 240, 0.6);
  position: relative;
  z-index: 9;

  .item {
    flex: 1;
    text-align: center;
    padding: 20rpx;
    font-size: 28rpx;
    color: #262626;
  }

  .cursor {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 20%;
    height: 6rpx;
    padding: 0 50rpx;
    background-color: rgb(255,234,189);
    /* 过渡效果 */
    transition: all 0.4s;
  }
}

.swiper {
  background-color: #f7f7f8;
  height: 100vh;
  width: 750rpx;
}
</style>
