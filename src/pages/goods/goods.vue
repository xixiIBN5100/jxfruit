<script setup lang="ts">
import type {
  SkuPopupEvent,
  SkuPopupInstance,
  SkuPopupLocaldata,
} from '@/components/vk-data-goods-sku-popup/vk-data-goods-sku-popup'
import { postMemberCart } from '@/services/cart'
import { getGoodsById, getSkuInfo } from '@/services/goods'
import { getAddress } from '@/services/address'
import type { CartItem } from '@/types/cart'
import type { GoodsItem, GoodsResult, SkuItem, GoodsImageItem } from '@/types/goods'
import type { AddressItem } from '@/types/address'
import { onLoad } from '@dcloudio/uni-app'
import { computed, ref, onMounted} from 'vue'
import AddressPanel from './components/AddressPanel.vue'
import ServicePanel from './components/ServicePanel.vue'
import SharingPanel from './components/SharingPanel.vue'
import ScalePanel from './components/ScalePanel.vue'
import { profile } from 'console'
// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync()
import { useMemberStore } from '@/stores'
// 接收页面参数
const query = defineProps<{
  id: string,
  userId: string
}>()

const selectAddress = (address) => {
  console.log(address)
  selectedAddress.value = address
}

var selectedAddress = ref<AddressItem>()

// 获取商品详情信息
const goods = ref<GoodsResult>()
const getGoodsByIdData = async () => {
  console.log(query.id)
  const res = await getGoodsById(query.id)
  goods.value = res.data
  // SKU组件所需格式
  // localdata.value = {
  //   _id: res.data.id,
  //   name: res.data.goodsName,
  //   price: res.data.price,
  //   imgUrl: res.data.imgUrl
  // }
}

// 页面加载
onLoad(() => {
  const memberStore = useMemberStore()
  console.log(query.userId)
  getGoodsByIdData()
  if (memberStore.profile) {
    getUserAddress()
  }
  getGoodsScaleList()
})



const address = ref<AddressItem[]>()

const getUserAddress = async () => {
  const res = await getAddress()
  console.log(res.data)
  address.value = res.data
}

const sku = ref<SkuItem[]>()
const getGoodsScaleList = async () => {
  const res = await getSkuInfo(query.id)
  sku.value = res.data
}

// 轮播图变化时
const currentIndex = ref(0)
const onChange: UniHelper.SwiperOnChange = (ev) => {
  console.log(ev.detail.current)
  currentIndex.value = ev.detail.current
}

// 点击图片时
const onTapImage = (url: string) => {
  // 大图预览
  uni.previewImage({
    current: url,
    urls: goods.value!.images.map(item => item.imgUrl)
  })
}

// uni-ui 弹出层组件 ref
const popup = ref<{
  open: (type?: UniHelper.UniPopupType) => void
  close: () => void
}>()

// 弹出层条件渲染
const popupName = ref<'address' | 'service' | 'scale' | 'share'>()
const openPopup = (name: typeof popupName.value) => {
  // 修改弹出层名称
  popupName.value = name
  popup.value?.open()
}
// 是否显示SKU组件
const isShowSku = ref(false)
// 商品信息
const localdata = ref({} as SkuPopupLocaldata)
// 按钮模式
enum SkuMode {
  Both = 1,
  Cart = 2,
  Buy = 3,
}
var mode = ref<SkuMode>(SkuMode.Cart)
// 打开SKU弹窗修改按钮模式
const openSkuPopup = (val: SkuMode) => {
  popupName.value = 'scale',
  popup.value?.open()
  // // 显示SKU弹窗
  // isShowSku.value = true
  // // 修改按钮模式
  mode.value = val
}

const childComponentRef = ref(null)

// SKU组件实例
const skuPopupRef = ref<SkuPopupInstance>()
// 计算被选中的值
const selectArrText = computed(() => {
  return skuPopupRef.value?.selectArr?.join(' ').trim() || '请选择商品规格'
})
// // 加入购物车事件
// const onAddCart = async (ev: CartItem) => {
//   await postMemberCart({ id: ev.id, count: ev.num })
//   uni.showToast({ title: '添加成功' })
//   isShowSku.value = false
// }
// // 立即购买
// const onBuyNow = (ev: SkuPopupEvent) => {
//   uni.navigateTo({ url: `/pagesOrder/create/create` })
// }

const toComment = (id: string) => {
  uni.navigateTo({url: `/pagesOrder/comment/comment?goodsId=${id}`})
}

const addCart = () => {
  console.log("goods")
  if (goods.value?.goodsInfo.onShelf !== 0) { openSkuPopup(SkuMode.Cart) }
  else {  
    uni.showToast({
      title: '该商品已下架',
      icon: 'none'
    })
  }
}

const buyNow = () => {
  console.log("goods")
  if (goods.value?.goodsInfo.onShelf !== 0) { openSkuPopup(SkuMode.Buy) }
  else {  
    uni.showToast({
      title: '该商品已下架',
      icon: 'none'
    })
  }
}
</script>

<template>
  <scroll-view enable-back-to-top scroll-y class="viewport">
    <!-- 基本信息 -->
    <view class="goods">
      <!-- 商品主图 -->
      <view class="preview">
        <swiper @change="onChange">
          <swiper-item v-for="item in goods?.images">
            <image @click="onTapImage" class="image"  mode="aspectFill" :src="item?.imgUrl"  />
            <!-- <image class="fruit-logo" src="../../static/images/logo.jpg"></image> -->
          </swiper-item>
        </swiper>
        <view class="indicator">
          <text class="current">{{ currentIndex + 1 }}</text>
          <text class="split">/</text>
          <text class="total">{{ goods?.images.length }}</text>
        </view>
      </view>

      <!-- 商品简介 -->
      <view class="meta">
        <view class="price">
          <text class="symbol">¥</text>
          <text class="number">{{ goods?.goodsInfo.price }}</text>
          <view class="share-btn" @click="openPopup('share')"></view>
        </view>
        <view class="name ellipsis">{{ goods?.goodsInfo.goodsName }}</view>
        <view class="desc"> {{ goods?.goodsInfo.description }} </view>       
      </view>
      <!-- 操作面板 -->
      <view class="action">
        <view @tap="openSkuPopup(SkuMode.Both);" class="item arrow">
          <text class="label">选择</text>
          <text class="text ellipsis"> {{ selectArrText }} </text>
        </view>
        <view @tap="openPopup('address')" class="item arrow">
          <text class="label">送至</text>
          <text class="text ellipsis">  {{ selectedAddress?.campus || '请选择收获地址'}} {{ selectedAddress?.roomAddress }}  </text>
        </view>
        <view @tap="openPopup('service')" class="item arrow">
          <text class="label">服务</text>
          <text class="text ellipsis">  破损包退 最优质的售后服务 </text>
        </view>
      </view>
    </view>

    <!-- 商品详情 -->
    <view class="detail panel">
      <view class="title" @tap="toComment(query.id)">
        <text class="item arrow">评论 {{ goods?.commentNum }}
          <text class="all">查看全部</text>
        </text>
      </view>
      <view class="comment">
        <template v-for="(item, index) in goods?.comments.slice(0,3)" :key="index">
          <view>
            <view class="purchaser">
              <img class="avatar" :src="item.avatarUrl" alt="">
              <text class="name">{{ item.publisher }}</text>
            </view>
            <view class="content">{{ item.content }}</view>
          </view>
        </template>
      </view>
      <view style="height: 200rpx">
      </view>
    </view>
  </scroll-view>

  <!-- 用户操作 -->
  <view v-if="goods" class="toolbar" :style="{ paddingBottom: safeAreaInsets?.bottom + 'px' }">
    <view class="icons">
      <button class="icons-button"><text class="icon-heart"></text>收藏</button>
      <!-- #ifdef MP-WEIXIN -->
      <button class="icons-button" open-type="contact">
        <text class="icon-handset"></text>客服
      </button>
      <!-- #endif -->
      <navigator class="icons-button" url="/pages/cart/cart2" open-type="navigate">
        <text class="icon-cart"></text>购物车
      </navigator>
    </view>
    <view class="buttons">
      <view class="addcart" :class="[ goods?.goodsInfo.onShelf === 0 ? 'under-shelf': '' ]"
        @click="addCart"> 
        加入购物车 
      </view>
      <view class="payment" :class="[ goods?.goodsInfo.onShelf === 0 ? 'under-shelf': '' ]" 
        @click="buyNow"> 
        立即购买 
      </view>
    </view>
  </view>

  <!-- uni-ui 弹出层 -->
  <uni-popup ref="popup" type="bottom" background-color="#fff">
    <AddressPanel 
    @selectAddress="selectAddress"
    :addressList="address" v-if="popupName === 'address'" @close="popup?.close()" />
    <ServicePanel v-if="popupName === 'service'" @close="popup?.close()" />
    <ScalePanel ref="scale" :mode="mode" :goodsInfo="goods" v-if="popupName === 'scale'" @close="popup?.close()" />
    <SharingPanel ref="share" :id="id" :mode="mode"  v-if="popupName === 'share'"
     @close="popup?.close()"  :goodsInfo="goods"
    />
  </uni-popup>
</template>

<style lang="scss">
page {
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
} 

.viewport {
  background-color: #f4f4f4;
}

.panel {
  margin-top: 20rpx;
  background-color: #fff;
  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 90rpx;
    line-height: 1;
    padding: 30rpx 60rpx 30rpx 6rpx;
    position: relative;
    text {
      padding-left: 10rpx;
      font-size: 28rpx;
      color: #333;
      font-weight: 600;
      border-left: 4rpx solid rgb(255,234,189);
    }
    navigator {
      font-size: 24rpx;
      color: #666;
    }
  }
}

.share-btn {
  position: absolute;
  top: 40rpx;
  right: 20rpx;
  width: 50rpx;
  height: 50rpx;
  text-align: center;
  line-height: 50rpx;
  background-image: url('https://image.familystudy.cn/image/jxfruit/share.webp');
  background-size: contain;
}

.arrow {
  &::after {
    position: absolute;
    top: 50%;
    right: 30rpx;
    content: '\e6c2';
    color: #ccc;
    font-family: 'erabbit' !important;
    font-size: 32rpx;
    transform: translateY(-50%);
  }

  .all{
    position: absolute;
    right: 70rpx;
    font-weight: normal;
  }
}

/* 商品信息 */
.goods {
  background-color: #fff;
  .preview {
    height: 750rpx;
    position: relative;
    .image {
      position: relative;
      z-index: 8;
      width: 750rpx;
      height: 750rpx;
    }
    .fruit-logo {
      position: absolute;
      width: 300rpx;
      z-index: 10;
      height: 300rpx;
      bottom: 400rpx;
      left: 30rpx;

    }
    .indicator {
      height: 40rpx;
      padding: 0 24rpx;
      line-height: 40rpx;
      border-radius: 30rpx;
      color: #fff;
      font-family: Arial, Helvetica, sans-serif;
      background-color: rgba(0, 0, 0, 0.3);
      position: absolute;
      bottom: 30rpx;
      right: 30rpx;
      .current {
        font-size: 26rpx;
      }
      .split {
        font-size: 24rpx;
        margin: 0 1rpx 0 2rpx;
      }
      .total {
        font-size: 24rpx;
      }
    }
  }
  .meta {
    position: relative;
    border-bottom: 1rpx solid #eaeaea;
    .price {
      height: 130rpx;
      padding: 25rpx 30rpx 0;
      color: rgb(255, 0, 0);
      font-size: 34rpx;
      box-sizing: border-box;
      background-color: rgb(255,234,189);
    }
    .number {
      font-size: 56rpx;
    }
    .brand {
      width: 160rpx;
      height: 80rpx;
      overflow: hidden;
      position: absolute;
      top: 26rpx;
      right: 30rpx;
    }
    .name {
      max-height: 88rpx;
      line-height: 1.4;
      margin: 20rpx;
      font-size: 32rpx;
      color: #333;
    }
    .desc {
      line-height: 1;
      padding: 0 20rpx 30rpx;
      font-size: 24rpx;
      color: #000000;
      white-space: pre-wrap;
    }
  }
  .action {
    padding-left: 20rpx;
    .item {
      height: 90rpx;
      padding-right: 60rpx;
      border-bottom: 1rpx solid #eaeaea;
      font-size: 26rpx;
      color: #333;
      position: relative;
      display: flex;
      align-items: center;
      &:last-child {
        border-bottom: 0 none;
      }
    }
    .label {
      width: 60rpx;
      color: #898b94;
      margin: 0 16rpx 0 10rpx;
    }
    .text {
      flex: 1;
      -webkit-line-clamp: 1;
    }
  }
}

/* 商品详情 */
.detail {
  padding-left: 20rpx;
  .content {
    margin-left: -20rpx;
    .image {
      width: 100%;
    }
    
  }
  .properties {
    padding: 0 20rpx;
    margin-bottom: 30rpx;
    .item {
      display: flex;
      line-height: 2;
      padding: 10rpx;
      font-size: 26rpx;
      color: #333;
      border-bottom: 1rpx dashed #ccc;
    }
    .label {
      width: 200rpx;
    }
    .value {
      flex: 1;
    }
  }
}

/* 同类推荐 */
.similar {
  .content {
    padding: 0 20rpx 20rpx;
    background-color: #f4f4f4;
    display: flex;
    flex-wrap: wrap;
    .goods {
      width: 340rpx;
      padding: 24rpx 20rpx 20rpx;
      margin: 20rpx 7rpx;
      border-radius: 10rpx;
      background-color: #fff;
    }
    .image {
      width: 300rpx;
      height: 260rpx;
    }
    .name {
      height: 80rpx;
      margin: 10rpx 0;
      font-size: 26rpx;
      color: #262626;
    }
    .price {
      line-height: 1;
      font-size: 20rpx;
      color: #cf4444;
    }
    .number {
      font-size: 26rpx;
      margin-left: 2rpx;
    }
  }
  navigator {
    &:nth-child(even) {
      margin-right: 0;
    }
  }
}


.comment {
  padding-left: 20rpx;
  .purchaser {
    font-weight: 700;
    .avatar {
      width: 80rpx;
      height: 80rpx;
      border-radius: 50%;
    }
  }
  .name {
    font-size: 28rpx;
    margin-left: 20rpx;
  }
  .content {
    padding-left: 20rpx;
    padding-right: 20rpx;
    margin-top: 10rpx;
    font-size: 28rpx;
  }
}


/* 底部工具栏 */
.toolbar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: calc((var(--window-bottom)));
  z-index: 1;
  background-color: #fff;
  height: 100rpx;
  padding: 0 20rpx;
  border-top: 1rpx solid #eaeaea;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: content-box;
  .buttons {
    display: flex;
    & > view {
      width: 220rpx;
      text-align: center;
      line-height: 72rpx;
      font-size: 26rpx;
      color: #fff;
      border-radius: 72rpx;

      
    }
    .addcart {
      background-color: rgb(255,234,189);
      color: black;
    }
    .payment {
      background-color: #ffa868;  
      margin-left: 20rpx;
      color: black;
    }
    .under-shelf {
      background: rgb(191, 191, 191);
    }
  }
  .icons {
    padding-right: 20rpx;
    display: flex;
    align-items: center;
    flex: 1;
    // 兼容 H5 端和 App 端的导航链接样式
    .navigator-wrap,
    .icons-button {
      flex: 1;
      text-align: center;
      line-height: 1.4;
      padding: 0;
      margin: 0;
      border-radius: 0;
      font-size: 20rpx;
      color: #333;
      background-color: #fff;
      &::after {
        border: none;
      }
    }
    text {
      display: block;
      font-size: 34rpx;
    }
  }
}
</style>
