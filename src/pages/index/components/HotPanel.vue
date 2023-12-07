<script setup lang="ts">
import type { HotItem } from '@/types/home'

// 定义 props 接收数据
defineProps<{
  list: HotItem[]
}>()

const nav = (index) => {
  uni.setStorageSync("type", index)
  uni.switchTab({
    url: '../category/category',
    success: function (e) {
       var page = getCurrentPages().pop();// 返回页面数组的最后一个页面数据
       if (page == undefined || page == null) return;  //如果最后一个页面为undefined或null，即当前就在首页 return出去，不调用onLoad
       page.onLoad();
    }
  })
}

const navToSuggestion = () => {
  uni.navigateTo({
    url: '../suggestion/suggestion'
  })
}

</script>

<template>
  <!-- 推荐专区 -->
  <view class="panel hot">
    <!-- <view class="item" v-for="item in list" :key="item.id">
      <view class="title">
        <text class="title-text">{{ item.title }}</text>
      </view>
      <navigator hover-class="none" :url="`/pages/hot/hot?type=${item.type}`" class="cards">
        <image
          v-for="src in item.pictures"
          :key="src"
          class="image"
          mode="aspectFit"
          :src="src"
        ></image>
      </navigator>
    </view> -->
    <view class="item">
      <view class="top"> 
        <view class="top-item" @click="nav(0)">
          <image class="image" src="https://image.familystudy.cn/image/jxfruit/鲜果专区.png"
          mode="heightFix"
          ></image>
          <view class="text">鲜果专区</view>
        </view>
        <view class="top-item" @click="nav(1)"> 
          <image class="image" src="https://image.familystudy.cn/image/jxfruit/今日特价.png"
          mode="heightFix"
          ></image>
          <view class="text">今日特价</view>
        </view>
      </view>
      <view class="bottom"> 
        <view class="bottom-item" @click="navToSuggestion"> 
          <image class="image" src="https://image.familystudy.cn/image/jxfruit/意见反馈.png"
          mode="heightFix"
          ></image>
          <view class="text">意见箱</view>
        </view>
        <view class="bottom-item" @click="nav(2)"> 
          <image class="image" src="https://image.familystudy.cn/image/jxfruit/山姆专区.png"
          mode="heightFix"
          ></image>
          <view class="text">山姆代购</view>
        </view>
        <view class="bottom-item" @click="nav(3)"> 
          <image class="image" src="https://image.familystudy.cn/image/jxfruit/活动商品.png"
          mode="heightFix"
          ></image>
          <view class="text">活动商品</view>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss">
@import '../styles/hot.scss';
</style>
