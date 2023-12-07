<script setup lang="ts">
import { putMemberCartBySkuId, postMemberCart} from '@/services/cart';
import type { CartItem } from '@/types/cart';
import type { GoodsResult } from '@/types/goods';
import { onLoad } from '@dcloudio/uni-app';
import { computed, ref, onMounted } from 'vue'
import { useMemberStore } from '@/stores'

// 子调父
const emit = defineEmits<{
  (event: 'close'): void
}>()

const memberStore = useMemberStore()

onMounted(() => {
  init()
})

enum SkuMode {
  Both = 1,
  Cart = 2,
  Buy = 3,
}

/** 步进器事件对象 */
export type InputNumberBoxEvent = {
  /** 输入框当前值 */
  value: number
  /** 步进器标识符 */
  index: string
}

const onChangeCount = (ev: InputNumberBoxEvent) => {
  console.log("ev", ev.value)
  num.value = ev.value
  sumPrice() 
}

const props = defineProps<{
  goodsInfo: GoodsResult,
  mode: SkuMode
}>()

var selectedScale = ref<string>()
var inventory = ref<number> ()
var price = ref<number> ()
var activeIndex = ref<number> ()
var num = ref<number>()
var skuId = ref<number>()

const init = () => {
  selectedScale.value = props.goodsInfo.skus[0].scale
  inventory.value = props.goodsInfo.skus[0].nowInventory
  price.value = props.goodsInfo.skus[0].price
  skuId.value = props.goodsInfo.skus[0].id
  num.value = 1
  activeIndex.value = 0
  sumPrice() 
}

const selectScale = ((index: number) => {
  selectedScale.value = props.goodsInfo.skus[index].scale
  inventory.value = props.goodsInfo.skus[index].nowInventory
  price.value = props.goodsInfo.skus[index].price
  skuId.value = props.goodsInfo.skus[index].id
  activeIndex.value = index
  sumPrice() 
})

const addInCart = async () => {
  if (memberStore.profile) {
    if (props.goodsInfo.goodsInfo.onShelf === 0)  { 
      return uni.showToast({
        title: '该商品已下架',
        icon: 'none'
      })
    }
    const cartInfo = {
      num: num.value,
      skuId: skuId.value
    }
    const res = await postMemberCart(cartInfo) 
    uni.showToast({
      icon: 'success'
    })
    emit('close')
  } else {
    uni.showToast({
      title: '请先登录',
      icon: 'error'
    })
    setTimeout(() => {
      uni.navigateTo({
        url: '/pages/login/login'
      })
    }, 1000)
  }
}

const totalPrice = ref<number>()

const sumPrice = () => {
  totalPrice.value = Number(price.value * num.value).toFixed(2)
}

const buyNow = () => {
  if (props.goodsInfo.goodsInfo.onShelf === 0)  { 
    return uni.showToast({
      title: '该商品已下架',
      icon: 'none'
    })
  }
  if (Number(totalPrice.value) < 10 && props.goodsInfo.goodsInfo.category != '集赞专区') {
    return uni.showToast({
      title: '10元起购',
      icon: 'error'
    })
  }
  if (memberStore.profile) {
    // 跳转到结算页
    uni.navigateTo({ url: `/pagesOrder/create/create?type=2&count=${num.value}&skuId=${skuId.value}` })
  } else {
    uni.showToast({
      title: '请先登录',
      icon: 'error'
    })
    setTimeout(() => {
      uni.navigateTo({
        url: '/pages/login/login'
      })
    }, 1000)
  }
}

</script>

<template>
  <view class="scale-panel">
    <!-- 关闭按钮 -->
    <text class="close icon-close" @tap="emit('close')"></text>   
    <!-- 内容 -->
    <view class="content">
      <view class="intro">
        <image :src="goodsInfo.goodsInfo.thumbNail" class="thumb-nail"></image>
        <div style="margin-left: 20rpx;">
          <div class="price">
            <text style="font-size: 30rpx;">￥</text> <text style="font-size: 50rpx;">{{ price }}</text> 
          </div>
          <div class="inventory">
            库存： {{ inventory }}
          </div>
          <div class="selected-scale">
            已选： {{ selectedScale }}
          </div>

        </div>
      </view>
      <view class="scale-text">规格</view>
      <view style="display:flex;">
      <template v-for="(item, index) in goodsInfo.skus" :key="item.id">
        <view class="scale-item" :class="index === activeIndex ? 'selected':''" 
        @click="selectScale(index)">
            {{ item.scale }}
        </view>
      </template>
      </view>
    </view>
    <view class="num-panel">
      <view class="num">数量</view>
      <view class="count">
        <vk-data-input-number-box
          v-model="num" 
          :min="1" 
          :max="inventory"            
          @change="onChangeCount"
       />
      </view>
    </view>
    <view class="total-price"> 
      <text style="color: black;">总价: </text>{{ totalPrice }}
    </view>
    <view class="footer">
      <view class="button secondary" v-if="mode==1||mode==2" 
      :class="[ goodsInfo.goodsInfo.onShelf === 0 ? 'under-shelf': '' ]"
      @click="addInCart"> 加入购物车 </view>
      <view class="button primary" v-if="mode==1||mode==3" 
      :class="[ goodsInfo.goodsInfo.onShelf === 0 ? 'under-shelf': '' ]"
      @click="buyNow"> 立即购买 </view>
    </view>

  </view>
</template>

<style lang="scss">
.scale-panel {
  padding: 0 30rpx;
  border-radius: 10rpx 10rpx 0 0;
  position: relative;
  background-color: #fff;
}

.thumb-nail {
  height: 200rpx;
  width: 200rpx;
}
.intro {
  display: flex;

  .price {
    color:#ff984f;
  }

  .inventory {
    font-size: 30rpx;
    margin-top: 10rpx;
    color: #949494;
  }
  .selected-scale{
    margin-top:10rpx;
    font-size: 35rpx;
  }
}

.total-price {
  color: #ff984f;
  margin-left: 20rpx;
}

.num-panel {
  display: flex;
  justify-content: space-between;
  margin-left: 20rpx;
  .num {
    font-size: 30rpx;
  }
}

.selected {
  border: 5rpx solid rgb(255,234,189);
  color: black;
  background-color: rgb(255, 246, 227);
}

.scale-text {
  color:#999;
  font-size: 30rpx;
  margin-top: 10rpx;
}

.scale-item {
  border: 1rpx solid gainsboro;
  width:fit-content;
  padding: 5rpx;
  box-sizing: border-box;
  border-radius: 10rpx;
  margin: 10rpx 10rpx 0 0;
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
  min-height: 300rpx;
  max-height: 540rpx;
  overflow: auto;
  padding: 20rpx;
  .item {
    padding: 30rpx 50rpx 30rpx 60rpx;
    background-size: 40rpx;
    background-repeat: no-repeat;
    background-position: 0 center;
    background-image: url(https://pcapi-xiaotuxian-front-devtest.itheima.net/miniapp/images/locate.png);
    position: relative;
  }
  .icon {
    color: #999;
    font-size: 40rpx;
    transform: translateY(-50%);
    position: absolute;
    top: 50%;
    right: 0;
  }
  .icon-checked {
    color: rgb(255,234,189);
  }
  .icon-ring {
    color: #444;
  }
  .user {
    font-size: 28rpx;
    color: #444;
    font-weight: 500;
  }
  .address {
    font-size: 26rpx;
    color: #666;
  }
}

.footer {
  display: flex;
  justify-content: space-between;
  padding: 20rpx 0 40rpx;
  font-size: 28rpx;
  color: #444;

  .button {
    flex: 1;
    height: 72rpx;
    text-align: center;
    line-height: 72rpx;
    margin: 0 20rpx;
    color: #fff;
    border-radius: 72rpx;
  }

  .primary {
    color: black;
    background-color: rgb(255,234,189);
  }

  .secondary {
    background-color: #ffa868;
    color: black;
  }
  .under-shelf {
    background: rgb(191, 191, 191);
  }
}
</style>
