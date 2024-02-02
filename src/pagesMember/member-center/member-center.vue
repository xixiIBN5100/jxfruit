<script setup lang="ts">
import profile from '@/components/profile.vue'

import type { MemberItem } from '@/types/member'
import { getMemberInfo } from '@/services/member'
import { Static, onMounted, ref } from 'vue'
import { useMemberStore } from '@/stores'
import jx_logo from '@/static/images/jx_logo.png'
const newuseMemberStore = useMemberStore()
const memberInfo = getMemberInfo()
const couponData = {
  isFlipped: false,
}

const memberTypes = [
  {
    type: 'a1',
    text: '会员免运费',
    imgUrl: 'https://image.familystudy.cn/image/jxfruit/会员免运费1.webp',
  },
  {
    type: 'a2',
    text: '每月一分领',
    imgUrl: 'https://image.familystudy.cn/image/jxfruit/每月一分领.webp',
  },
  {
    type: 'a3',
    text: '专享免减券',
    imgUrl: 'https://image.familystudy.cn/image/jxfruit/专享免减券.webp',
  },
  {
    type: 'a4',
    text: '抽优惠券',
    imgUrl: 'https://image.familystudy.cn/image/jxfruit/抽优惠券.webp',
  },
]
// 获取目标元素的位置和屏幕可见区域高度
const scrollToElement = (id: string) => {
  uni.pageScrollTo({
    selector: '#' + id, // 指定要滚动到的元素的选择器（此处为id选择器）
    duration: 500, // 滚动动画的时长，单位为毫秒
  })
}
</script>
<template>
  <view class="box">
    <swiper class="membercontainer">
      <swiper-item>
        <view class="card">
          <text class="member">白银会员</text>
          <view style="width: 300rpx; margin-left: 90rpx; margin-top: 40rpx">
            <text style="font-size: 20rpx; margin-top: 10rpx">30目前距离升级还需要70成长值 </text>
            <progress :percent="30" :active="true" :border-radius="3" :stroke-width="3"></progress>
            <img src="../../static/images/jx_logo.png" class="image" />
          </view>
        </view>
      </swiper-item>
      <swiper-item>
        <view class="card">
          <text class="member">黄金会员</text>
          <view style="width: 300rpx; margin-left: 90rpx; margin-top: 40rpx">
            <text style="font-size: 20rpx; margin-top: 10rpx">30目前距离升级还需要70成长值 </text>
            <progress :percent="30" :active="true" :border-radius="3" :stroke-width="3"></progress>
            <img src="../../static/images/jx_logo.png" class="image" />
          </view>
        </view>
      </swiper-item>
      <swiper-item>
        <view class="card">
          <text class="member">铂金会员</text>
          <view style="width: 300rpx; margin-left: 90rpx; margin-top: 40rpx">
            <text style="font-size: 20rpx; margin-top: 10rpx">30目前距离升级还需要70成长值 </text>
            <progress :percent="30" :active="true" :border-radius="3" :stroke-width="3"></progress>
            <img src="../../static/images/jx_logo.png" class="image" />
          </view>
        </view>
      </swiper-item>
      <swiper-item>
        <view class="card">
          <text class="member">钻石会员</text>
          <view style="width: 300rpx; margin-left: 90rpx; margin-top: 40rpx">
            <text style="font-size: 20rpx; margin-top: 10rpx">30目前距离升级还需要70成长值 </text>
            <progress :percent="30" :active="true" :border-radius="3" :stroke-width="3"></progress>
            <img src="../../static/images/jx_logo.png" class="image" />
          </view>
        </view>
      </swiper-item>
      <swiper-item>
        <view class="card">
          <text class="member">星耀会员</text>
          <view style="width: 300rpx; margin-left: 90rpx; margin-top: 40rpx">
            <text style="font-size: 20rpx; margin-top: 10rpx">30目前距离升级还需要70成长值 </text>
            <progress :percent="30" :active="true" :border-radius="3" :stroke-width="3"></progress>
            <img src="../../static/images/jx_logo.png" class="image" />
          </view>
        </view>
      </swiper-item>
    </swiper>
    <view class="section">
      <view
        v-for="item in memberTypes"
        :key="item.type"
        class="navigator"
        style="padding-bottom: 15rpx"
      >
        <image
          :src="item.imgUrl"
          mode="aspectFit"
          style="margin-bottom: 10rpx"
          @click="scrollToElement(item.type)"
        ></image>
        <view>{{ item.text }}</view>
      </view>
    </view>
    <view class="container">
      <view class="children1" id="a1">
        <text class="title1">会员免运费</text>
      </view>
      <view class="children1" id="a2">
        <text class="title1">每月一分领</text>
      </view>
      <view class="children1" id="a3">
        <text class="title1">专享免减券</text>
      </view>
      <view class="children1" id="a4">
        <text class="title1">抽优惠券</text>
      </view>
    </view>
  </view>
</template>

<style lang="scss">
.card {
  width: 650rpx;
  height: 280rpx;
  background-color: burlywood;
  border-radius: 50rpx;
  box-shadow: 0rpx 0rpx 5rpx #888888;
  margin: 20rpx auto 0;

  .member {
    position: relative;
    top: 55rpx;
    font-size: 80rpx;
    margin-left: 80rpx;
    background: rgb(255, 240, 228);
    -webkit-background-clip: text;
    color: transparent;
    display: inline-block;
  }
}

.section {
  width: 100%;
  margin-top: 10rpx;
  display: flex;
  justify-content: space-between;
  padding: 40rpx 20rpx 40rpx;

  .navigator,
  .contact {
    text-align: center;
    font-size: 24rpx;
    color: #333;

    &::before {
      display: block;
      font-size: 60rpx;
      color: #ff9545;
    }

    &::after {
      border: none;
    }
  }

  .contact {
    padding: 0;
    margin: 0;
    border: 0;
    background-color: transparent;
    line-height: inherit;
  }
}

.container {
  display: flex;
  flex-direction: column;
  background-color: #f0f0f0;
  border-radius: 90rpx;
  margin: 20rpx auto 0;
  padding: 27rpx;

  .children1 {
    width: 100%;
    height: 320rpx;
    background-color: #ffffff;
    border-radius: 60rpx;
    padding: 20rpx;
    margin: auto;
    margin-bottom: 30rpx;

    .title1 {
      margin-left: 15rpx;
    }
  }
}

.membercontainer {
  width: 100%;
  height: 300rpx;
}

.box {
  background-color: rgb(225, 225, 165);
}

.image {
  width: 380rpx;
  height: 380rpx;
  margin-left: 240rpx;
  margin-top: -260rpx;
}
</style>
