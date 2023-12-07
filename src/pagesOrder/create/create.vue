<script setup lang="ts">
// import {
  // getMemberOrderPreAPI,
  // getMemberOrderPreNowAPI,
  // getMemberOrderRepurchaseByIdAPI,
  // postMemberOrderAPI,
// } from '@/services/order'
import {
  getOrderPre,
  getDefaultAddress,
  postOrder,
  getMemberOrderPreNow,
  // getMemberOrderRepurchaseById,
  getMemberOrderById 
} from '@/services/order'

import {
  getCoupon
} from '@/services/coupon'

import { useAddressStore } from '@/stores/modules/address'
import { useCouponStore } from '@/stores/modules/coupon'
import type { AddressItem
 } from '@/types/address'
import type { OrderPreResult } from '@/types/order'
import { onLoad, onShareAppMessage, onShareTimeline } from '@dcloudio/uni-app'

import { computed, ref } from 'vue'
import type { CouponItem } from '@/types/coupon'
import { title } from 'process'

// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync()
// 订单备注
const buyerMessage = ref('')
// 配送时间
const deliveryList = ref([
  { type: 1, text: '17:30~18:30 (周一至周日)' },
  // { type: 2, text: '工作日送 (周一至周五)' },
  // { type: 3, text: '周末配送 (周六至周日)' },
])

const openPopup = () => {
  // 修改弹出层名称
  popup.value?.open()
}

const init = () => {
  console.log("init")
}

// uni-ui 弹出层组件 ref
const popup = ref<{
  open: (type?: UniHelper.UniPopupType) => void
  close: () => void
}>()



// 当前配送时间下标
const activeIndex = ref(0)
// 当前配送时间
const activeDelivery = computed(() => deliveryList.value[activeIndex.value])
// 修改配送时间
const onChangeDelivery: UniHelper.SelectorPickerOnChange = (ev) => {
  activeIndex.value = ev.detail.value
}

// 页面参数
const query = defineProps<{
  skuId?: string
  count?: string
  orderId?: string
  type?: string,
  price?: number,
  formData: Object
}>()


var defaultAddress = ref<AddressItem>()

const getDefaultAddressData = async () => {
  const res = await getDefaultAddress()
  defaultAddress.value = res.data
  console.log(defaultAddress.value)
}

const gotoCoupon = () => {
  uni.navigateTo( {
      url: `../../pagesMember/coupon/coupon?totalPrice=${totalPrice.value}`
    }
  )
}

// 获取订单信息
const orderPre = ref<OrderPreResult[]>()
const getMemberOrderPreData = async () => {
  if (query.type === '2') {
    postFee.value = 0
    const res = await getMemberOrderPreNow({
      skuId: query.skuId
    })
    orderPre.value = res.data
    sumPrice()   
  } else if (query.type === '3') {
    // 再次购买
    const res = await getMemberOrderById(Number(query.orderId))
    orderPre.value = res.data.skus
    postFee.value = res.data.postFee
    getDefaultAddressData()
    sumPrice()
  } else {
    const res = await getOrderPre()
    orderPre.value = res.data
    postFee.value = 0
    sumPrice()
  }
}

onLoad((options) => {
  console.log(options)
  console.log("query", query.formData)
  getMemberOrderPreData()
  getDefaultAddressData()
  selectedCoupon.value = undefined
  uni.showShareMenu({
    withShareTicket: true,
    menus: ['shareAppMessage', 'shareTimeline'],
    success: (res) => {
      console.log('showShareMenu',res);
    }
  })
})

const addressStore = useAddressStore()
// 收货地址
const selecteAddress = computed(() => {
  return addressStore.selectedAddress || defaultAddress
})

const couponStore = useCouponStore()
const selectedCoupon = computed(() => {
  return couponStore.selectedCoupon
})

onShareAppMessage ((res: any) => {
  if (res.from === 'button') {
    console.log(res.target)
  }
  return {
    title: '标题',
    // path: '/pages/pagesOrder/create/create' 
  }
})

onShareTimeline (()  => {
  return {
    title: '标题'
  }
})
const sumPrice = () => {
  let result = orderPre.value.reduce((sum, item) => {
    if ('num' in item) {
      return sum + item.price * item.num
    } else {
      return sum + item.price * Number(query.count)
    }
  }, 0)
  totalPrice.value = result
}

const totalPrice = ref<number> ()
const postFee = ref<number> ()
const notes = ref<string>()

const onSubscribe = async () => {
      wx.requestSubscribeMessage({
      tmplIds: ['JmwYKZ9RgZr4y1nAp_eDjgUrEt_mMIsSPOaEZMLqKsk','kxAwLKc6Nn3_uC4RL7DLUof6WqqiqZwfiXvAkE1B3F8'],
      success: (res) => {
        if (res['JmwYKZ9RgZr4y1nAp_eDjgUrEt_mMIsSPOaEZMLqKsk'] == 'accept') {
          console.log("订阅成功")
        }
      }
    })
  }

// 提交订单
const onOrderSubmit = async () => {
  // 没有收货地址提醒
  console.log("default", defaultAddress.value?.id)
  console.log("selected", selecteAddress.value.id)
  console.log(!selecteAddress.id && !defaultAddress)
  if (!selecteAddress.value.id && !defaultAddress.value?.id) {
    return uni.showToast({ icon: 'none', title: '请选择收货地址' })
  }
  // 发送请求
  await onSubscribe()
    const goodsList = orderPre?.value.map((v:any) => ({ id: v.skuId, num: v.num || Number(query?.count) }))
    const response = await postOrder({
      addressId: selecteAddress.value?.id || defaultAddress.value?.id,
      goods: goodsList,
      payMoney: (postFee.value + totalPrice.value - (selectedCoupon.value?.price || 0)).toFixed(2),
      notes: notes.value,
      discount: selectedCoupon.value?.price || 0,
      couponId: selectedCoupon.value?.id
    })
    uni.showToast({
      title: '支付成功'
    })
  // 关闭当前页面，跳转到订单详情，传递订单id
    uni.redirectTo({ url: `/pagesOrder/detail/detail?id=${response.data.id}` }) 
}
</script>

<template>
  <scroll-view enable-back-to-top scroll-y class="viewport">
  
    <!-- 收货地址 -->
    <navigator
      v-if="selecteAddress.id"
      class="shipment"
      hover-class="none"
      url="/pagesMember/address/address?from=order"
    >
      <view class="user"> {{ selecteAddress.receiverName }} {{ selecteAddress.receiverPhone }} </view>
      <view class="address"> {{ selecteAddress.campus }} {{ selecteAddress.roomAddress }} </view>
      <text class="icon icon-right"></text>
    </navigator>

    <navigator
      v-if="!selecteAddress.id && defaultAddress"
      class="shipment"
      hover-class="none"
      url="/pagesMember/address/address?from=order"
    >
      <view class="user"> {{ defaultAddress.receiverName }} {{ defaultAddress.receiverPhone }} </view>
      <view class="address"> {{ defaultAddress.campus }} {{ defaultAddress.roomAddress }} </view>
      <text class="icon icon-right"></text>
    </navigator>

    <navigator
      v-if="!selecteAddress.id && !defaultAddress"
      class="shipment"
      hover-class="none"
      url="/pagesMember/address/address?from=order"
    >
      <view class="address"> 请选择收货地址 </view>
      <text class="icon icon-right"></text>
    </navigator>
    
    <!-- 商品信息 -->
    <view class="goods">
      <navigator
        v-for="(item,index) in orderPre"
        :key="index"
        :url="`/pages/goods/goods?id=${item.goodsId}`"
        class="item"
        hover-class="none"
      >
        <image class="picture" :src="item.thumbNail" />
        <view class="meta">
          <view class="name ellipsis"> {{ item.goodsName }} </view>
          <view class="attrs">{{ item.scale }}</view>
          <view class="prices">
            <view class="pay-price symbol">{{ item.price }}</view>
            <!-- <view class="price symbol">{{ item.price }}</view> -->
          </view>
          <view class="count">x{{ item.num || query.count }}</view>
        </view>
      </navigator>
    </view>

    <!-- 配送及支付方式 -->
    <view class="related">
      <view class="item">
        <text class="text">配送时间</text>
        <picker :range="deliveryList" range-key="text" @change="onChangeDelivery">
          <view class="icon-fonts picker">{{ activeDelivery.text }}</view>
        </picker>
      </view>
      <view class="item">
        <text class="text">订单备注</text>
        <input
          class="input"
          :cursor-spacing="30"
          placeholder="选题，建议留言前先与商家沟通确认"
          v-model="notes"
        />
      </view>
    </view>

    <!-- 支付金额 -->
    <view class="settlement">
      <view class="item">
        <text class="text">商品总价: </text>
        <text class="number symbol">{{ totalPrice }}</text>
      </view>
      <view class="item">
        <text class="text">运费: </text>
        <text class="number symbol">{{ postFee }}</text>
      </view>
      <view class="item" @click="gotoCoupon">
        <text class="text">
          选择优惠券:{{ 
          selectedCoupon? `满${selectedCoupon.effectivePrice}减${selectedCoupon.price}`:
          ''
          }}
        </text>
        <text class="number"
        :class="[selectedCoupon? 'decrease': 'icon icon-right']">
        {{ selectedCoupon?.price }}</text>
      </view>
    </view>
  </scroll-view>

  <!-- 吸底工具栏 -->
  <view class="toolbar" :style="{ paddingBottom: safeAreaInsets?.bottom + 'px' }">
    <view class="total-pay symbol">
      <text class="number">{{ (postFee + totalPrice - (selectedCoupon?.price || 0)).toFixed(2) }}</text>
    </view>
    <!-- <button  id="share" ref="share" data-name="shareBtn" class="button-share" open-type="share">点击分享给微信好友</button> -->
    <view class="button" :class="{ disabled: !selecteAddress.id && !defaultAddress }" @tap="onOrderSubmit">
      提交订单
    </view>
  </view>
</template>

<style lang="scss">
page {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  background-image: linear-gradient(rgb(255,255,246),rgb(255, 255, 236));
}

.decrease {
  color: red;
  font-weight: 700;
}

.decrease::before {
  content: '-';
  font-size: 80%;
  margin-right: 5rpx;
  font-weight: 700;
}

.button-share{
  width:100rpx;
  height:100rpx;
  border-radius:50%;
  background-color:rgb(255,234,189);
  color: black;
}

.symbol::before {
  content: '¥';
  font-size: 80%;
  margin-right: 5rpx;
}



.shipment {
  margin: 20rpx;
  padding: 30rpx 30rpx 30rpx 84rpx;
  font-size: 26rpx;
  border-radius: 10rpx;
  background: url(https://pcapi-xiaotuxian-front-devtest.itheima.net/miniapp/images/locate.png)
    20rpx center / 50rpx no-repeat #fff;
  position: relative;

  .icon {
    font-size: 36rpx;
    color: #333;
    transform: translateY(-50%);
    position: absolute;
    top: 50%;
    right: 20rpx;
  }

  .user {
    color: #333;
    margin-bottom: 5rpx;
  }

  .address {
    color: #666;
  }
}

.goods {
  margin: 20rpx;
  padding: 0 20rpx;
  border-radius: 10rpx;
  background-color: #fff;

  .item {
    display: flex;
    padding: 30rpx 0;
    border-top: 1rpx solid #eee;

    &:first-child {
      border-top: none;
    }

    .picture {
      width: 170rpx;
      height: 170rpx;
      border-radius: 10rpx;
      margin-right: 20rpx;
    }

    .meta {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      position: relative;
    }

    .name {
      height: 80rpx;
      font-size: 26rpx;
      color: #444;
    }

    .attrs {
      line-height: 1.8;
      padding: 0 15rpx;
      margin-top: 6rpx;
      font-size: 24rpx;
      align-self: flex-start;
      border-radius: 4rpx;
      color: #888;
      background-color: #f7f7f8;
    }

    .prices {
      display: flex;
      align-items: baseline;
      margin-top: 6rpx;
      font-size: 28rpx;

      .pay-price {
        margin-right: 10rpx;
        color: #cf4444;
      }

      .price {
        font-size: 24rpx;
        color: #999;
        text-decoration: line-through;
      }
    }

    .count {
      position: absolute;
      bottom: 0;
      right: 0;
      font-size: 26rpx;
      color: #444;
    }
  }
}

.related {
  margin: 20rpx;
  padding: 0 20rpx;
  border-radius: 10rpx;
  background-color: #fff;

  .item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-height: 80rpx;
    font-size: 26rpx;
    color: #333;
  }

  .input {
    flex: 1;
    text-align: right;
    margin: 20rpx 0;
    padding-right: 20rpx;
    font-size: 26rpx;
    color: #999;
  }

  .item .text {
    width: 125rpx;
  }

  .picker {
    color: #666;
  }

  .picker::after {
    content: '\e6c2';
  }
}

/* 结算清单 */
.settlement {
  margin: 20rpx;
  padding: 0 20rpx;
  border-radius: 10rpx;
  background-color: #fff;

  .item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 80rpx;
    font-size: 26rpx;
    color: #333;
  }

  .danger {
    color: #cf4444;
  }
}

/* 吸底工具栏 */
.toolbar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: calc(var(--window-bottom));
  z-index: 1;

  background-color: #fff;
  height: 100rpx;
  padding: 0 20rpx;
  border-top: 1rpx solid #eaeaea;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: content-box;

  .total-pay {
    font-size: 40rpx;
    color: #cf4444;

    .decimal {
      font-size: 75%;
    }
  }

  .button {
    width: 220rpx;
    text-align: center;
    line-height: 72rpx;
    font-size: 26rpx;
    color: black;
    border-radius: 72rpx;
    background-color: rgb(255,234,189);
    
  }

  .disabled {
    opacity: 0.6;
  }
}
</style>
