<script setup lang="ts">
import type { MemberItem } from '@/types/member'
import { computed, onMounted, ref, watch } from 'vue'
import { useMemberStore } from '@/stores'
import { getMemberInfo } from '@/services/member'

const newuseMemberStore = useMemberStore()
const memberInfo = getMemberInfo()
const level = ref()
const memberInfomation = ref()
const diff = ref()
const couponData = {
  isFlipped: false,
}
const showToast = () => {
  uni.showModal({
    title: '会员须知',
    content: '当前该等级会员: ' + memberInfomation.value.requirement + '\n' +memberInfomation.value.treatment
  })
}
const variable = ref() // 初始化变量
memberInfo
  .then((result) => {
    memberInfomation.value = result.data.membership
    console.log(memberInfomation.value)
    diff.value = memberInfomation.value.diffToNextLevel
    level.value = memberInfomation.value.name
    variable.value = memberInfomation.value.vipLevel
  })
  .catch((error) => {
    // 处理错误
    console.error(error)
  })
// 计算属性，根据变量的值返回相应的背景颜色
const cardColor = computed(() => {
  switch (variable.value) {
    case 0:
      return '#c2b2a4'
    case 1:
      return '#f8c9a0'
    case 2:
      return '#eca263'
    case 3:
      return '#d97f32'
    case 4:
      return '#b95b09'
  }
})

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


</script>
<template>
  <view class="box">
    <div class="membercontainer">
      <swiper-item @click='showToast'>
        <view class="card" :style="{ backgroundColor: cardColor }">
          <text class="member">{{ level }}</text>
          <view style="width: 300rpx; margin-left: 90rpx; margin-top: 40rpx">
            <text style="font-size: 20rpx; margin-top: 10rpx">0目前距离升级还需要消费{{ diff }} </text>
            <progress :percent="0" :active="true" :border-radius="3" :stroke-width="3"></progress>
            <img src="../../static/images/jx_logo.png" class="image" />
          </view>
        </view>
      </swiper-item>
    </div>
    <view class="section">
      <view
        v-for="item in memberTypes"
        :key="item.type"
        class="navigator"
        style="padding-bottom: 15rpx"
      >
        <image :src="item.imgUrl" mode="aspectFit" style="margin-bottom: 10rpx"></image>
        <view>{{ item.text }}</view>
      </view>
    </view>
    <view class="container">
      <view class="children1">
        <text class="title1">会员免运费</text>
      </view>
      <view class="children1">
        <text class="title1">专享免减券</text>

      </view>
      <view class="children1">
        <text class="title1">抽优惠券</text>
      </view>
    </view>
  </view>
</template>

<style lang="scss">
.swiper_buy {
  display: flex;
  justify-content: space-between;
}
.item {
  width: 200rpx;
  height: 200rpx;
  background-color: #fff;
  margin: 10rpx;
  margin-top: -2rpx;
  border-radius: 15rpx;
}
.swiper_coupon {
  display: flex;
  justify-content: space-between;
}
.itemList {
  height: 250rpx;
  padding: 10px;
}
.couponList {
  padding: 10px; /* 调整内边距 */
  height: 150rpx;
}
.coupon {
  width: 200rpx;
  height: 120rpx;
  background-color: rgb(255, 240, 228);
  margin: 10rpx;
  margin-top: 20rpx;
  border-radius: 15rpx;
}
.card {
  width: 650rpx;
  height: 280rpx;
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
  padding: 40rpx 50rpx 40rpx;

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
  background-color: rgb(225, 225, 165);
  border-radius: 90rpx;
  margin: 20rpx auto 0;
  padding: 27rpx;

  .children1 {
    width: 100%;
    height: 280rpx;
    background-color: burlywood;
    border-radius: 60rpx;
    padding: 20rpx;
    margin: auto;
    margin-bottom: 30rpx;

    .title1 {
      margin-left: 15rpx;
    }
  }

  .children2 {
    width: 100%;
    height: 320rpx;
    background-color: burlywood;
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
