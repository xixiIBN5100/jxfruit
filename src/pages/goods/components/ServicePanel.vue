<script setup lang="ts">
// 子调父
const emit = defineEmits<{
  (event: 'close'): void
}>()
</script>

<template>
  <view class="service-panel">
    <!-- 关闭按钮 -->
    <text class="close icon-close" @tap="emit('close')"></text>
    <!-- 标题 -->
    <view class="title">服务说明</view>
    <!-- 内容 -->
    <view class="content">
      <view class="item">
        <view class="dt">快速送达</view>
        <view class="dd">
          当日达服务：0：00-14：00下单，预计当日下午17：30-18:30左右送达。
          次日达服务：14:00至24:00下单，预计次天下午17：30-18:30左右送达。
          如有延迟配送情况，我们将通过短信通知您。
        </view>
      </view>
      <view class="item">
        <view class="dt">联系客服</view>
        <view class="dd">
          如偶遇水果磕伤等问题，请联系企业微信客服。如有疑问，可直接拨打19884192559（微信同号）。
          微信客服服务时间：9:00~22:00
        </view>
      </view>
      <view class="item">
        <view class="dt">优质团队</view>
        <view class="dd">
          践行鲜果是工大人自己的水果团购平台，为您提供高品质、新鲜的水果，满足校园生活的美味需求。
          期待为您送上美味的水果！
           <view style="text-align: right;">浙工大众创空间入驻学生团队——践行鲜生</view> 
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss">
.service-panel {
  padding: 0 30rpx;
  border-radius: 10rpx 10rpx 0 0;
  position: relative;
  background-color: #fff;
}

.title {
  line-height: 1;
  padding: 40rpx 0;
  text-align: center;
  font-size: 32rpx;
  font-weight: normal;
  border-bottom: 1rpx solid #ddd;
  color: #444;
}

.close {
  position: absolute;
  right: 24rpx;
  top: 24rpx;
}

.content {
  padding: 20rpx 20rpx 100rpx 20rpx;

  .item {
    margin-top: 20rpx;
  }

  .dt {
    margin-bottom: 10rpx;
    font-size: 28rpx;
    color: #333;
    font-weight: 500;
    position: relative;

    &::before {
      content: '';
      width: 10rpx;
      height: 10rpx;
      border-radius: 50%;
      background-color: #eaeaea;
      transform: translateY(-50%);
      position: absolute;
      top: 50%;
      left: -20rpx;
    }
  }

  .dd {
    line-height: 1.6;
    font-size: 26rpx;
    color: #999;
  }
}
</style>
