<script setup lang="ts">
import { onLoad, onReachBottom } from '@dcloudio/uni-app'
import { computed, ref } from 'vue'
import { searchGoods } from '@/services/goods'
// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync()
const name = ref<string>()
const goods = ref()
const searchGoodsData = async () => {
  console.log(name.value)
  const res = await searchGoods(name.value)
  goods.value = res.data
  uni.navigateTo({
    url: '../search-result/search-result'
  })
  uni.setStorageSync("goodsInfo", goods.value)
}
</script>

<template>
  <view class="navbar" :style="{ paddingTop: safeAreaInsets!.top + 30 + 'px' }">
    <!-- logo文字 -->
    <view class="logo">
      <image class="logo-image"
      mode="widthFix"
      src="https://image.familystudy.cn/image/jxfruit/%E6%AD%A3%E5%BC%8Flogo.webp"></image>
      <!--<text class="logo" style="color: aliceblue;">践行鲜果</text>-->
      <!-- <text class="logo-text">新鲜 · 亲民 · 快捷</text> -->
    </view>
    <!-- 搜索条 -->
    <view class="search-view">
      <view class="search">
        <!-- <text >搜索商品</text> -->
        <text class="icon-search"></text> <input type="text"
        confirm-type = "search" @confirm="searchGoodsData"
        placeholder="这里有你想要的" style="width: 600rpx"
        placeholder-style="color: black"
        v-model="name"
        >
          <text class="icon-scan"></text>
      </view>
    </view>
  </view>
</template>

<style lang="scss">
/* 自定义导航条 */
.navbar {
  background-color: rgb(255,234,189);
  position: relative;
  display: flex;
  flex-direction: column;
  // padding-top: 20px;
  height: 600rpx;
  .logo {
    display: flex;
    position: absolute;
    top: 300rpx;
    left: 50%;
    transform: translate(-50%);
    align-items: center;
    height: 64rpx;
    .logo-image {
      width: 300rpx;

    }
    .logo-text {
      flex: 1;
      line-height: 28rpx;
      color: #fff;
      margin: 2rpx 0 0 20rpx;
      padding-left: 20rpx;
      border-left: 1rpx solid #fff;
      font-size: 26rpx;
    }
  }



  .search {
    width: 700rpx;
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10rpx 0 26rpx;
    top: 540rpx;
    left: 50%;

    transform: translate(-50%);
    font-size: 28rpx;
    border-radius: 32rpx;
    height: 120rpx;
    background-color: rgb(255,255,255);
    .icon-search {
      &::before {
        margin-right: 10rpx;
      }
    }
    .icon-scan {
      font-size: 30rpx;
      padding: 15rpx;
    }
  }


}
</style>
