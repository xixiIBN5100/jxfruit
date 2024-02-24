<script setup lang="ts">
import { getShortLink } from '@/services/wechat'
import { useMemberStore } from '@/stores'
import { onLoad, onShareAppMessage } from '@dcloudio/uni-app'
import type { GoodsItem, GoodsResult } from '@/types/goods'
import { ref } from 'vue' 
// 子调父
const emit = defineEmits<{
  (event: 'close'): void
}>()

const props = defineProps<{
  id: string,
  goodsInfo: GoodsResult,
}>()

const userId = ref<number>()

onLoad(() => {
  const memberStore = useMemberStore()
  userId.value = memberStore.profile.userId
  uni.showShareMenu({
    withShareTicket: true,
    menus: ['shareAppMessage', 'shareTimeline'],
    success: (res) => {
      console.log('showShareMenu',res);
    }
  })
})

onShareAppMessage((res:any) => {
  return {
    title:'践行鲜生',
    page: `/pages/goods/goods?id=${props.id}&userId=${userId}`
  }
})

const popup = ref<{
  open: (type?: UniHelper.UniPopupType) => void
  close: () => void
}>()

const openPopup = (e) => {
  popup.value?.open()
  // // 显示SKU弹窗
  // isShowSku.value = true
  // // 修改按钮模式
}

const postPhoto = ref<string>()

const copyLink = async () => {
  const data = {
    id: props.id,
    pageTitle: props.goodsInfo.goodsInfo.goodsName
  }
  const res = await getShortLink(data)
  console.log("res", res)
  uni.setClipboardData({
    data: res.data.link,
    success:(res) => {
      uni.showToast({
        title: '链接已复制',
        icon: 'success'
      })
    }
  })
}

const shareMoment = async () => {
  const memberStore = useMemberStore()
  uni.request({
    url: 'https://api.familystudy.cn:8083/api/wechat/qrCode',
    method: 'GET',
    responseType: 'arraybuffer',
    header: {
      'Content-Type': 'application/json',
      'token': memberStore.profile?.token
    },
    success: (res) => {
      const arrayBuffer = new Uint8Array(res.data)
      const base64 = "data:image/webp;base64," + uni.arrayBufferToBase64(arrayBuffer) //这里需要添加前缀
      postPhoto.value = base64 || ''
      console.log("base64", postPhoto.value)

      
      popup.value?.open()
      drawCanvas()
	  }
  })
}



const drawCanvas = async () => {
    uni.showLoading({
      title: "加载中",
    });
    let res = uni.getSystemInfoSync();
    let rpx = res.screenWidth / 750;
    let ctx = uni.createCanvasContext("Canvas", this);
    ctx.setFontSize(20 * rpx);
    ctx.setFillStyle("#737885");
    ctx.fillText("一步云智能营销系统", 34 * rpx, 1206 * rpx);
    ctx.setFontSize(20 * rpx);
    ctx.setFillStyle("#737885");
    ctx.fillText("step technology cloud", 462 * rpx, 1206 * rpx);
    ctx.clip();
    ctx.restore();
    ctx.draw();
    uni.hideLoading();
  }


const saveImage = () => {

}


</script>

<template>
  <view class="sharing-panel">
    <!-- 关闭按钮 -->
    <text class="close icon-close" @tap="emit('close')"></text>
    <!-- 标题 -->
    <view class="btn-group">
      <view class="btn-view"><button class="btn icon1" open-type="share" @click="share"></button> 分享到微信</view>
      <view class="btn-view"><view class="btn icon2" @click="shareMoment"></view> 发朋友圈海报</view>
      <view class="btn-view"><view class="btn icon3" @click="copyLink"></view>复制链接</view>
    </view>
    <view class="cancel" @tap="emit('close')">取消</view>

    <uni-popup ref="popup" type="center" background-color="#fff" style="border-radius: 20rpx">
      <view style="width: 550rpx;height: 1300rpx;border-radius: 20rpx">
        <view style="color:rgb(7, 207, 61);text-align: center;margin-top: 30rpx;
        font-style: italic;font-size: 40rpx;font-weight: 600;">爆款推荐</view>
        <image :src="props.goodsInfo.goodsInfo.thumbNail"
        style="height: 400rpx;width: 500rpx;margin-left: 25rpx;margin-top: 30rpx"
        ></image>
        <view style="font-size: 35rpx;margin-left: 30rpx;margin-top: 30rpx
        ">{{ props.goodsInfo.goodsInfo.goodsName }}</view>
        <view style="display: flex;align-items: center;justify-content: space-between;padding-left: 30rpx;
          padding-right: 30rpx;">
          <text style="color: rgb(255, 128, 0)">￥{{ 13.99 }}</text>
          <image :src="postPhoto"
          style="height: 200rpx;width: 200rpx;border-radius: 100rpx"></image>
        </view>
      </view>
      <!-- <canvas
        style="width: 550rpx; height: 100rpx; margin: 0 auto"
        :style="{ height: 1267 * rpx + 'px' }"
        canvas-id="Canvas"
        id="CanvasId"
      >
      </canvas>

      <view class="sharePosterBtn">
        <view class="sharePosterBtn1" @click="saveImage">保存图片</view>
        <button open-type="share" class="sharePosterBtn2">名片转发</button>
      </view> -->
      
    </uni-popup>
  </view>
</template>

<style lang="scss">
.sharePosterBtn {
  height: 1300rpx;
  width: 550rpx;
}
.btn-group {
  display: flex;
  justify-content: space-evenly;
  font-size: 25rpx;
  height: 250rpx;
  padding: 80rpx;
  box-sizing: border-box;


  .btn {
    width: 100rpx;
    height: 100rpx;
    border-radius: 50%;
    background-size: 75%;
    margin: 0 auto;
    margin-bottom: 10rpx;
    background-repeat: no-repeat;
    background-color: rgb(235, 235, 235);
    background-position: center;
  }

  .icon1 {
    background-image: url('https://image.familystudy.cn/image/jxfruit/wechat-logo.webp');
  }

  .icon2 {
    background-image: url('https://image.familystudy.cn/image/jxfruit/moments.webp');
  }

  .icon3 {
    background-image: url('https://image.familystudy.cn/image/jxfruit/link.webp');
    background-size: 60%;
  }
}

.cancel {
  text-align: center;
  height: 100rpx;
  line-height: 100rpx;
}

.sharing-panel {
  padding: 0 30rpx;
  border-radius: 20rpx 20rpx 0 0;
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
