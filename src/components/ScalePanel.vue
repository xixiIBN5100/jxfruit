<script setup lang="ts">
import { putMemberCartBySkuId, postMemberCart} from '@/services/cart';
import type { CartItem } from '@/types/cart';
import type { GoodsResult } from '@/types/goods';
import { onLoad } from '@dcloudio/uni-app';
import { computed, ref, onMounted, watch } from 'vue'

// 子调父
const emit = defineEmits<{
  (event: 'close'): void
}>()

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

watch(() => props.goodsInfo, () => {
    console.log('监听obj.stu')
    init()
  },
  {
      // 需要深度监听
  deep: true
})

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

const sumPrice = () => {
  totalPrice.value = Number(price.value * num.value).toFixed(2)
}

const addInCart = async () => {
  if (props.goodsInfo.goodsInfo.category === '集赞专区') {
    return uni.showToast({
      title: '此类商品无法加入购物车',
      icon: 'none'
    })
  }
  console.log("sku", skuId.value)
  const cartInfo = {
    num: num.value,
    skuId: skuId.value
  }
  const res = await postMemberCart(cartInfo) 
  uni.showToast({
    title: '已加入购物车',
    icon: 'success'
  })
  emit('close')
}

const totalPrice = ref<number>()

const buyNow = () => {
  console.log(totalPrice.value)
  if (Number(totalPrice.value) < 10 && props.goodsInfo.goodsInfo.category !== '集赞专区') {
    return uni.showToast({
      title: '10元起购',
      icon: 'error'
    })
    // setTimeout(()=>{
    //   uni.navigateBack()
    // },1000)
  }
  // 跳转到结算页
  uni.navigateTo({ url: `/pagesOrder/create/create?type=2&count=${num.value}&skuId=${skuId.value}` })
}

</script>

<template>
  <view class="scale-panel">
    <view>
    <!-- 关闭按钮 -->
    <text class="close icon-close" @tap="emit('close')"></text>   
    <!-- 内容 -->
    <view class="content">
      <view class="intro">
        <image :src="goodsInfo.goodsInfo.thumbNail" class="thumb-nail"></image>
        <div style="margin-left: 30rpx;margin-top: 10rpx">
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
  </view>
    <view class="footer">
      <view class="button secondary" 
      :class="[props.goodsInfo.goodsInfo.category === '集赞专区'? 'disabled': '']"
      v-if="mode == 1 || mode == 2" @click="addInCart"> 加入购物车 </view>
      <view class="button primary" v-if="mode == 1 || mode == 3" @click="buyNow"> 立即购买 </view>
    </view>
  </view>
</template>

<style lang="scss">
.scale-panel {
  height: 1000rpx;
  padding: 0 30rpx;
  border-radius: 30rpx 30rpx 0 0;
  position: relative;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.thumb-nail {
  height: 200rpx;
  width: 200rpx;
  border-radius: 15rpx;
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

.num-panel {
  display: flex;
  justify-content: space-between;
  margin-left: 20rpx;
  .num {
    // margin-left: 10rpx;
    font-size: 30rpx;
  }
}

.total-price {
  color: #ff984f;
  margin-left: 20rpx;
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
  margin: 15rpx 15rpx 0 0;
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
    background-color: #ffa868;
  }

  .secondary {
    background-color: rgb(255,234,189);
    color: black;
  }

  .disabled {
    background: gray;
  }
}
</style>
