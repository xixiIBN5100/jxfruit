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
import { computed, ref, onMounted, reactive } from 'vue'
import {
  updateGood,
  deleteById,
  setOnShelf,
  deletImage,
  updateScale,
  deleteScale,
} from '@/services/adminGoods'
// import uni from '@dcloudio/vite-plugin-uni'
// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync()
import { useMemberStore } from '@/stores'
import type { newScale } from '@/types/goods'
import { addScale } from '../../services/adminGoods'
// 接收页面参数
const query = defineProps<{
  id: string
  userId: string
}>()
const newScaleData = ref<newScale>({ scale: '', price: 0, totalInventory: 0, attribute: '' })
const state = reactive({
  popup: ref(null),
})
const newScalePop = ref(null)
const selectAddress = (address) => {
  console.log(address)
  selectedAddress.value = address
}

var selectedAddress = ref<AddressItem>({})
const onShelf = ref(0)
// 获取商品详情信息
const goods = ref<GoodsResult>()
const getGoodsByIdData = async () => {
  console.log(query.id)
  const res = await getGoodsById(query.id)
  goods.value = res.data
  onShelf.value = goods.value.goodsInfo.onShelf
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
  getGoodsScaleList()
})

const address = ref<AddressItem[]>()

// const getUserAddress = async () => {
//   const res = await getAddress()
//   console.log(res.data)
//   address.value = res.data
// }

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
    urls: goods.value!.images.map((item) => item.imgUrl),
  })
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
const childComponentRef = ref(null)
// SKU组件实例
const skuPopupRef = ref<SkuPopupInstance>()

const toComment = (id: string) => {
  uni.navigateTo({ url: `/pagesOrder/comment/comment?goodsId=${id}` })
}

const saveChanges = () => {
  console.log(goods.value)
  const data = goods.value
  updateGood(data.goodsInfo).then((res) => {
    if (res.msg === 'success') {
      uni.showToast({
        title: '保存成功!',
        icon: 'success',
        duration: 2000,
      })
    }
  })
}

const changeShelf = async () => {
  const state = onShelf.value == 1 ? 0 : 1
  const res = await setOnShelf({
    id: goods.value.goodsInfo.id,
    state: state,
  }).then((r) => {
    console.log(r)
    if (r.msg === 'success') {
      uni.showToast({
        title: '操作成功!',
        icon: 'success',
        duration: 2000,
      })
      onShelf.value = 1 - onShelf.value
    }
  })
}

const deleteGood = async () => {
  uni.showModal({
    title: '提示',
    // 提示文字
    content: '确认删除该商品吗？',
    // 取消按钮的文字自定义
    cancelText: '取消',
    // 确认按钮的文字自定义
    confirmText: '删除',
    //删除字体的颜色
    confirmColor: 'red',
    //取消字体的颜色
    cancelColor: '#000000',
    success: function (res) {
      if (res.confirm) {
        deleteById(goods.value.goodsInfo.id).then((res) => {
          if (res.msg === 'success') {
            uni.showToast({
              title: '删除成功!',
              icon: 'success',
              duration: 2000,
            })
            uni.navigateBack()
          } else {
            uni.showToast({
              title: '删除失败!',
              icon: 'none',
              duration: 2000,
            })
          }
        })
      }
    },
  })
}

const deletImageById = (id: number) => {
  console.log(id)
  uni.showModal({
    title: '提示',
    content: '确认删除该图片吗？',
    success: function (res) {
      if (res.confirm) {
        deletImage(id).then((res) => {
          if (res.msg === 'success') {
            uni.showToast({
              title: '删除成功!',
              icon: 'success',
              duration: 2000,
            })
            goods.value.images = goods.value.images.filter((item) => item.id !== id)
          } else {
            uni.showToast({
              title: '删除失败!',
              icon: 'none',
              duration: 2000,
            })
          }
        })
      }
    },
  })
}
const addImage = () => {
  uni.chooseImage({
    count: 1,
    sizeType: ['original', 'compressed'],
    sourceType: ['album', 'camera'],
    success: function (res) {
      console.log(res)
      const tempFilePaths = res.tempFilePaths
      uni.uploadFile({
        url: `/goods/admin/add/image/${goods.value.goodsInfo.id}`,
        filePath: tempFilePaths[0],
        name: 'file',
        success: function (res) {
          const data = JSON.parse(res.data)
          console.log(data)
          if (data.msg === 'success') {
            uni.showToast({
              title: '上传成功!',
              icon: 'success',
              duration: 2000,
            })
            goods.value.images.push(data.data.imgs[0])
            console.log(goods.value.images)
          } else {
            uni.showToast({
              title: '上传失败!',
              icon: 'none',
              duration: 2000,
            })
          }
        },
      })
    },
  })
}

const deletScaleById = (id: number) => {
  console.log(id)
  uni.showModal({
    title: '提示',
    content: '确认删除该规格吗？',
    success: function (res) {
      if (res.confirm) {
        deleteScale(id).then((res) => {
          if (res.msg === 'success') {
            uni.showToast({
              title: '删除成功!',
              icon: 'success',
              duration: 2000,
            })
            goods.value.skus = goods.value?.skus.filter((item) => item.id !== id)
          } else {
            uni.showToast({
              title: '删除失败!',
              icon: 'none',
              duration: 2000,
            })
          }
        })
      }
    },
  })
}

const changeScale = (id: number) => {
  console.log(id)
  const data = goods.value.skus.find((item) => item.id === id)
  console.log(data)
  updateScale(data).then((res) => {
    if (res.msg === 'success') {
      uni.showToast({
        title: '修改成功!',
        icon: 'success',
        duration: 2000,
      })
    } else {
      uni.showToast({
        title: '修改失败!',
        icon: 'none',
        duration: 2000,
      })
    }
  })
}

const popNewScale = () => {
  //弹出新建规格弹窗
  newScalePop.value[0].open()
}
const comfimNewScale = (id: number) => {
  console.log(newScaleData)
  addScale(id, newScaleData.value).then((res) => {
    if (res.msg === 'success') {
      uni.showToast({
        title: '新建成功!',
        icon: 'success',
        duration: 2000,
      })
      newScalePop.value[0].close()
    } else {
      uni.showToast({
        title: '新建失败!',
        icon: 'none',
        duration: 2000,
      })
    }
  })
}
onMounted(() => {
  console.log(newScalePop)
})
</script>

<template>
  <scroll-view enable-back-to-top scroll-y class="viewport">
    <!-- 基本信息 -->
    <view class="goods">
      <!-- 商品主图 -->
      <view class="preview">
        <swiper @change="onChange">
          <swiper-item v-for="item in goods?.images">
            <image
              @longpress="deletImageById(item.id)"
              @click="onTapImage"
              class="image"
              mode="aspectFill"
              :src="item?.imgUrl"
            />
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
          <input :type="number" v-model.number="goods.goodsInfo.price" />
        </view>
        <input class="name ellipsis" v-model="goods.goodsInfo.goodsName" />
        <textarea class="desc" v-model="goods.goodsInfo.description" />
      </view>
      <!-- 操作面板 -->
    </view>

    <!-- 商品详情 -->
    <view class="detail panel">
      <view class="title">
        <button type="primary" @click="addImage">添加图片</button>
        <button type="primary" @click="popNewScale">添加规格</button>
      </view>
      <view class="scale">
        <div class="item" v-for="item in goods?.skus" :key="item.id">
          <text class="label">规格：</text>
          <input class="value" v-model="item.scale" />
          <text class="label">单价：</text>
          <input class="value" v-model="item.price" />
          <text class="label">总库存：</text>
          <input class="value" v-model="item.totalInventory" />
          <text class="label">说明：</text>
          <textarea class="text" v-model="item.attribute" />
          <div class="button">
            <button type="primary" @click="changeScale(item.id)">修改该规格</button>
            <button type="warn" @click="deletScaleById(item.id)">删除该规格</button>
          </div>
          <uni-popup ref="newScalePop" type="center">
            <view class="popup-content">
              <view class="form-item">
                <text class="label">规格：</text>
                <input class="value" v-model="newScaleData.scale" />
              </view>
              <view class="form-item">
                <text class="label">价格：</text>
                <input class="value" v-model="newScaleData.price" />
              </view>
              <view class="form-item">
                <text class="label">总库存：</text>
                <input class="value" v-model="newScaleData.totalInventory" />
              </view>
              <view class="form-item">
                <text class="label">说明：</text>
                <input style="width: 100px" v-model="newScaleData.attribute" />
              </view>
              <view class="button">
                <button type="primary" @click="comfimNewScale(goods?.goodsInfo.id)">
                  确认新建
                </button>
              </view>
            </view>
          </uni-popup>
        </div>
      </view>
      <view style="height: 200rpx"> </view>
    </view>
  </scroll-view>

  <view v-if="goods" class="toolbar" :style="{ paddingBottom: safeAreaInsets?.bottom + 'px' }">
    <view class="buttons">
      <view class="payment" @tap="deleteGood()"> 删除 </view>
      <view class="payment" @tap="saveChanges()"> 保存 </view>
      <view class="payment" @tap="changeShelf()">
        {{ onShelf ? '下架' : '上架' }}
      </view>
    </view>
  </view>
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

.popup-content {
  background-color: #f4f4f4;
  height: 300px;
  width: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  //圆角
  border-radius: 20px;
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

.scale {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  //竖着排列，每列占一行
  .item {
    width: 100%;
    padding: 20rpx;
    border-bottom: 1rpx solid #eaeaea;
    .label {
      font-size: 26rpx;
      color: #333;
    }
    .value {
      width: 100px;
      height: 60rpx;
      font-size: 26rpx;
      color: #333;
    }
    .text {
      height: 30px;
      width: 250px;
      font-size: 26rpx;
      color: #333;
    }
  }
  .button {
    display: flex;
    justify-content: space-around;
    button {
      width: 200rpx;
      height: 60rpx;
      font-size: 26rpx;
      color: #fff;
      border-radius: 60rpx;
    }
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
