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
import type { GoodsItem, GoodsResult, SkuItem, GoodsImageItem, newGood } from '@/types/goods'
import type { AddressItem } from '@/types/address'
import { onLoad } from '@dcloudio/uni-app'
import { computed, ref, onMounted } from 'vue'
import { updateGood, deleteById, setOnShelf, deletImage } from '@/services/adminGoods'
import { profile } from 'console'
// import uni from '@dcloudio/vite-plugin-uni'
// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync()
import { useMemberStore } from '@/stores'
import { title } from 'process'
// 接收页面参数
const query = defineProps<{
  id: string
  userId: string
}>()

const newGoods = ref<newGood>({
  goodsName: '',
  price: 0,
  discount: 1,
  description: '',
  category: '',
})

const address = ref<AddressItem[]>()

// const getUserAddress = async () => {
//   const res = await getAddress()
//   console.log(res.data)
//   address.value = res.data
// }

const sku = ref<SkuItem[]>()
const getGoodsScaleList = async () => {
  const res = await getSkuInfo(query.id)
  sku.value = res.data
}
const imagePath = ref<string>('')
// 轮播图变化时
const currentIndex = ref(0)
const onChange: UniHelper.SwiperOnChange = (ev) => {
  console.log(ev.detail.current)
  currentIndex.value = ev.detail.current
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
  ;(popupName.value = 'scale'), popup.value?.open()
  // // 显示SKU弹窗
  // isShowSku.value = true
  // // 修改按钮模式
  mode.value = val
}

const childComponentRef = ref(null)
// SKU组件实例
const skuPopupRef = ref<SkuPopupInstance>()
const addThumb = () => {
  uni.chooseImage({
    count: 1,
    sizeType: ['original', 'compressed'],
    sourceType: ['album', 'camera'],
    success: function (res) {
      console.log(res)
      imagePath.value = res.tempFilePaths[0]
      const tempFilePaths = res.tempFilePaths
    },
  })
}

const addGoods = async () => {
  console.log(newGoods.value)
  uni.uploadFile({
    url: '/goods/admin/add',
    filePath: imagePath.value,
    name: 'image',
    formData: {
      ...newGoods.value,
    },
    success: function (res) {
      const data = JSON.parse(res.data)
      console.log(data)
      if (data.msg === 'success') {
        uni.showToast({
          title: '新建成功!',
          icon: 'success',
          duration: 2000,
        })
      } else {
        uni.showToast({
          title: '新建失败!',
          icon: 'none',
          duration: 2000,
        })
      }
    },
  })
}
</script>

<template>
  <scroll-view enable-back-to-top scroll-y class="viewport">
    <!-- 基本信息 -->
    <view class="goods">
      <!-- 商品主图 -->
      <view class="preview">
        <swiper>
          <swiper-item>
            <image class="image" src="../../static/images/logo.jpg"></image>
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
          <input :type="number" required v-model.number="newGoods.price" />
        </view>
        <input
          class="name ellipsis"
          required
          v-model="newGoods.goodsName"
          placeholder="商品名称(必填)"
        />
        <input class="name ellipsis" required v-model="newGoods.category" placeholder="商品种类" />
        <input
          type="number"
          class="name ellipsis"
          v-model="newGoods.discount"
          placeholder="商品折扣"
        />
        <input class="name ellipsis" v-model="newGoods.productRegion" placeholder="商品产地" />
        <input class="name ellipsis" disabled placeholder="生产日期" />
        <uni-datetime-picker
          v-model="newGoods.productTime"
          type="date"
          @change="console.log(newGoods)"
        />
        <!-- 生产日期 -->
        <textarea class="desc" v-model="newGoods.advantage" placeholder="请在此输入商品优势" />
        <textarea
          class="desc"
          style="padding-top: 20px"
          v-model="newGoods.description"
          placeholder="请在此输入商品详情描述"
        />
        <textarea class="desc" v-model="newGoods.introduction" placeholder="请在此输入商品介绍" />
        <textarea class="desc" v-model="newGoods.notes" placeholder="请在此输入商品注意点" />
      </view>
      <!-- 操作面板 -->
    </view>

    <!-- 商品详情 -->
    <view class="detail panel">
      <view class="title">
        <button type="primary" @click="addThumb">添加缩略图片</button>
        <button type="primary" @click="addGoods">新建商品</button>
      </view>
      <view style="height: 200rpx"> </view>
    </view>
  </scroll-view>
  <!-- TODO: 生产日期选择，折扣是不是数字，创建商品是否跑通，规格添加和管理写完，然后整体项目删掉一些冗余的东西 -->
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
    justify-content: space-around;
    align-items: center;
    height: 90rpx;
  }
  .button {
    padding-top: 20px;
    padding-left: -10px;
  }
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

  .all {
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
      background-color: rgb(255, 234, 189);
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
      height: 50px;
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
  justify-content: center;
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
      background-color: rgb(255, 234, 189);
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
    justify-content: center;
    // 兼容 H5 端和 App 端的导航链接样式
  }
  text {
    display: block;
    font-size: 34rpx;
  }
}
</style>
