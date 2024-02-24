<script setup lang="ts">
import { OrderState } from '@/services/constants'
import { orderStateList } from '@/services/constants'
import { useMemberStore } from '@/stores/index'
import type { OrderItem } from '@/types/order'
import type { OrderListParams } from '@/types/order'
import { onMounted, ref } from 'vue'
import { queryOrders, deliverOrder, queryRefundOrders, refundOrder } from '@/services/adminOrder'
import { watch } from 'vue'
const memberStore = useMemberStore()
// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync()
// 定义 porps

const campus = ['所有校区', '朝晖校区', '屏峰校区', '莫干山校区']
const roomAddressList = [
  ['所有寝室'],
  [
    '所有寝室',
    '尚01',
    '尚02',
    '尚03',
    '尚04',
    '尚05',
    '尚06',
    '尚07',
    '尚08',
    '尚09',
    '尚10',
    '尚11',
    '尚12',
    '尚13',
    '尚综合楼',
    '梦1',
    '梦2',
    '梦3',
    '梦4',
    '梦5',
    '梦6',
    '梦7',
  ],
  [
    '所有寝室',
    '东01',
    '东02',
    '东03',
    '东04',
    '东05',
    '东06',
    '东07',
    '东08',
    '东09',
    '东10',
    '东11',
    '东12',
    '东13',
    '东14',
    '东15',
    '东16',
    '东17',
    '东18',
    '东19',
    '西01',
    '西02',
    '西03',
    '西04',
    '西05',
    '西06',
    '西07',
    '西08',
    '西09',
    '西10',
    '西11',
    '西12',
    '西13',
    '西14',
    '西15',
  ],
  [
    '所有寝室',
    '德01A',
    '德01B',
    '德01C',
    '德02A',
    '德02B',
    '德02C',
    '德03',
    '德04',
    '德05A',
    '德05B',
    '德05C',
    '德06',
    '德07',
    '德08',
    '德09',
    '德10',
  ],
]
const getDate = (type: string) => {
  const date = new Date()
  let year = date.getFullYear()
  let m = date.getMonth() + 1
  let d = date.getDate()

  if (type === 'start') {
    year = year - 60
  } else if (type === 'end') {
    year = year + 2
  }
  let month = m > 9 ? m.toString() : '0' + String(m)
  let day = d > 9 ? d.toString() : '0' + String(d)
  return `${year}-${month}-${day}`
}
const selectedTime = ref('')
const startDate = getDate('start')
const endDate = getDate('end')
const selectedCampus = ref(0)
const selectedDormitory = ref(0)
const selectedDate = ref('')
const props = defineProps<{
  orderState: number
  onChose: boolean
}>()
const deliverList = ref<string[]>([])
defineExpose({
  deliverList,
})
const allOrders = ref<string[]>([])
const isSelectAll = ref(false)
// 请求参数
const queryParams = ref<OrderListParams>({
  pageNum: 1,
  pageSize: 5,
  orderState: props.orderState,
})

const emit = defineEmits(['selectedItems'])
watch(
  () => props.onChose,
  () => {
    console.log('props.onChose', props.onChose)
    deliverList.value = []
  },
)
// 获取订单列表
const orderList = ref<OrderItem[]>([])
// 是否加载中标记，用于防止滚动触底触发多次请求
const isLoading = ref(false)

const getMemberOrderData = async (isChanege: boolean) => {
  // 如果数据出于加载中，退出函数
  if (isLoading.value) return
  // 退出分页判断
  if (isFinish.value === true && !isChanege) {
    return uni.showToast({ icon: 'none', title: '没有更多数据~' })
  }
  // 发送请求前，标记为加载中 true
  // 发送请求
  let res
  if (props.orderState === 5) {
    const data = {
      pageNum: queryParams.value.pageNum,
      pageSize: queryParams.value.pageSize,
    }
    res = await queryRefundOrders(data)
  } else {
    res = await queryOrders(queryParams.value)
    if (isChanege) {
      allOrders.value = []
    }
    res.data.records.forEach((item) => {
      allOrders.value.push(item.orderId.toString())
    })
  }
  // 发送请求后，重置标记
  isLoading.value = false
  // 数组追加
  if (isChanege) {
    orderList.value = []
    orderList.value.push(...res.data.records)
  } else {
    orderList.value.push(...res.data.records)
  }
  // // 分页条件
  if (queryParams.value.pageNum < res.data.pages) {
    //   // 页码累加
    queryParams.value.pageNum++
  } else {
    //   // 分页已结束
    isFinish.value = true
  }

  console.log('res', res.data.records)
}

const deliverOrderById = async (orderId: string[]) => {
  deliverOrder(orderId).then((res) => {
    console.log('res', res)
    if (res.msg === 'success') {
      uni.showToast({ icon: 'none', title: '发货成功' })
    } else {
      uni.showToast({ icon: 'none', title: `发货失败` })
    }
  })
}

const approveRefund = async (refundId: Number) => {
  uni.showModal({
    title: '提示',
    content: '是否同意退款',
    success: function (res) {
      if (res.confirm) {
        console.log('用户点击确定')
        refundOrder(refundId).then((res) => {
          console.log('res', res)
          if (res.msg === 'success') {
            uni.showToast({ icon: 'none', title: '同意退款成功' })
          } else {
            uni.showToast({ icon: 'none', title: `同意退款失败` })
          }
        })
      }
    },
  })
}
watch(
  () => props.onChose,
  () => {
    deliverList.value = []
  },
)
onMounted(() => {
  getMemberOrderData(false)
})
watch(
  () => isSelectAll.value,
  (newVal) => {
    if (newVal) {
      deliverList.value = allOrders.value
    } else {
      deliverList.value = []
    }
    emit('selectedItems', deliverList.value)
    console.log('deliverList', deliverList.value)
  },
)
// 是否分页结束
const isFinish = ref(false)
// 是否触发下拉刷新
const isTriggered = ref(false)
// 自定义下拉刷新被触发
const onRefresherrefresh = async () => {
  // 开始动画
  isTriggered.value = true
  // 重置数据
  queryParams.value.pageNum = 1
  orderList.value = []
  isFinish.value = false
  // 加载数据
  await getMemberOrderData(true)
  // 关闭动画
  isTriggered.value = false
}

const addOrder = (e: number) => {
  if (deliverList.value.includes(e.toString())) {
    deliverList.value = deliverList.value.filter((item) => item !== e.toString())
  } else {
    deliverList.value.push(e.toString())
  }
  emit('selectedItems', deliverList.value)
}

const changeCampus = (e) => {
  selectedCampus.value = e.detail.value
  selectedDormitory.value = 0
  handleParamsChange()
}
const changeDormitory = (e) => {
  selectedDormitory.value = e.detail.value
  handleParamsChange()
}
const changeDate = (e) => {
  if (e === '') {
    selectedDate.value = ''
  } else {
    selectedDate.value = e.detail.value
  }
  handleParamsChange()
}

const handleParamsChange = () => {
  let data = queryParams.value
  data.pageNum = 1
  data.pageSize = 5
  if (selectedCampus.value != 0) {
    data['campus'] = campus[selectedCampus.value]
  } else {
    delete data?.['campus']
    delete data?.roomAddress
  }
  console.log('selectedDormitory.value', selectedDormitory.value)
  if (selectedDormitory.value != 0) {
    data['roomAddress'] = roomAddressList[selectedCampus.value][selectedDormitory.value]
  } else {
    delete data?.['roomAddress']
    console.log('delete data?.roomAddress', data?.roomAddress)
  }
  if (selectedDate.value != '') {
    data['date'] = selectedDate.value
  } else {
    delete data?.['date']
  }
  queryParams.value = data
  console.log('queryParams', queryParams.value)
  getMemberOrderData(true)
}
</script>

<template>
  <scroll-view
    enable-back-to-top
    scroll-y
    class="orders"
    refresher-enabled
    :refresher-triggered="isTriggered"
    @refresherrefresh="onRefresherrefresh"
    @scrolltolower="getMemberOrderData(false)"
  >
    <view v-if="props.orderState !== 5" class="header-container">
      <view>
        <picker mode="selector" :value="selectedCampus" :range="campus" @change="changeCampus">
          <view class="picker">
            <view class="picker__label">校区</view>
            <view class="picker__value">{{ campus[selectedCampus] }}</view>
          </view>
        </picker>
        <picker
          mode="selector"
          :value="selectedDormitory"
          :range="roomAddressList[selectedCampus]"
          @change="changeDormitory"
        >
          <view class="picker">
            <view class="picker__label">寝室</view>
            <view class="picker__value">{{
              roomAddressList[selectedCampus][selectedDormitory]
            }}</view>
          </view>
        </picker>
        <picker
          mode="date"
          :value="selectedDate"
          :start="startDate"
          :end="endDate"
          @change="changeDate"
        >
          <view class="picker">
            <view class="picker__label">日期</view>
            <view class="picker__value">{{ selectedDate }}</view>
          </view>
        </picker>
        <view class="button-container">
          <button class="button" v-if="props.onChose" @tap="isSelectAll = !isSelectAll">
            全选订单
          </button>
          <button class="button" @tap="changeDate('')">重置日期</button>
        </view>
      </view>
    </view>
    <view class="card" v-for="order in orderList" :key="order.orderId">
      <!-- 这里写法比较暴力，直接用了v-if判断是否为待退款订单 -->
      <view v-if="props.orderState !== 5">
        <!-- 订单信息 -->
        <view class="status">
          <text class="date">{{ order.submitTime }}</text>
          <!-- 订单状态文字 -->
          <text>{{ orderStateList[order.orderState].text }}</text>
          <!-- 待评价/已完成/已取消 状态: 展示删除订单 -->
        </view>
        <!-- 商品信息，点击商品跳转到订单详情，不是商品详情 -->
        <navigator
          v-for="item in order.skus"
          :key="item.id"
          class="goods"
          :url="`/pagesAdmin/orderDetails/orderDetails?id=${order.orderId}`"
          hover-class="none"
        >
          <view class="cover">
            <image class="image" mode="aspectFit" :src="item.thumbNail"></image>
          </view>
          <view class="meta">
            <view class="name">订单号: {{ item.orderId }}</view>
            <view class="sku-title">
              <view class="name ellipsis">{{ item.goodsName }}</view>

              <view class="num">x{{ item.num }}</view>
            </view>

            <view class="type">{{ item.scale }}</view>
            <view style="display: flex; align-items: center; justify-content: space-between">
              <view class="single-price"> ￥ {{ item.price }} </view>
            </view>
          </view>
        </navigator>
        <!-- 支付信息 -->
        <view class="payment">
          <text class="quantity">共{{ order.totalNum }}件商品</text>
          <text>实付</text>
          <text class="amount"> <text class="symbol">¥</text>{{ order.payMoney }}</text>
        </view>
        <!-- 订单操作按钮 -->
        <view class="action">
          <template>
            <checkbox-group v-if="props.onChose">
              <checkbox
                :checked="deliverList.includes(order.orderId.toString())"
                :value="order.orderId"
                @tap="addOrder(order.orderId)"
              ></checkbox>
            </checkbox-group>
          </template>
          <template>
            <view
              class="button primary"
              @tap="deliverOrderById([order.orderId.toString()])"
              v-if="order.orderState === 2"
            >
              发货</view
            >
          </template>
          <template>
            <navigator
              :url="`/pagesAdmin/orderDetails/orderDetails?id=${order.orderId}`"
              hover-class="none"
              class="button primary"
            >
              订单详情
            </navigator>
            <!-- 待收货状态: 展示确认收货 -->
          </template>
        </view>
      </view>

      <!-- 待退款订单 -->

      <view v-else>
        <navigator :url="`/pagesAdmin/orderDetails/orderDetails?id=${order.orderId}`">
          <view class="status">
            <text class="date">{{ order.submitTime }}</text>
            <!-- 订单状态文字 -->
            <text>待退款</text>
          </view>
          <view class="goods">
            <view class="meta">
              <view style="display: flex; align-items: center; justify-content: space-between">
                <view class="name">退款单号: {{ order.id }}</view>
                <view class="name">订单号: {{ order.orderId }}</view>
              </view>
              <view> 退款原因：{{ order.reason }} </view>
              <!--            <view class="num">x{{ order.totalNum }}</view>-->
              <view style="display: flex; align-items: center; justify-content: space-between">
                <view class="single-price">总金额 ￥ {{ order.totalMoney }} </view>
              </view>
            </view>
          </view>
        </navigator>
        <view class="action">
          <view class="button primary" @tap="approveRefund(order.id)"> 同意退款</view>
        </view>
      </view>
    </view>
    <!-- 底部提示文字 -->
    <view class="loading-text" :style="{ paddingBottom: safeAreaInsets?.bottom + 'px' }">
      {{ isFinish ? '没有更多数据~' : '正在加载...' }}
    </view>
  </scroll-view>
</template>

<style lang="scss">
// 订单列表
.orders {
  .card {
    min-height: 100rpx;
    padding: 20rpx;
    margin: 20rpx 20rpx 0;
    border-radius: 10rpx;
    background-color: #fff;

    &:last-child {
      padding-bottom: 40rpx;
    }
  }

  .status {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 28rpx;
    color: #999;
    margin-bottom: 15rpx;

    .date {
      color: #666;
      flex: 1;
    }

    .primary {
      color: #ff9240;
    }

    .icon-delete {
      line-height: 1;
      margin-left: 10rpx;
      padding-left: 10rpx;
      border-left: 1rpx solid #e3e3e3;
    }
  }

  .goods {
    display: flex;
    margin-bottom: 20rpx;

    .cover {
      width: 170rpx;
      height: 170rpx;
      margin-right: 20rpx;
      border-radius: 10rpx;
      overflow: hidden;
      position: relative;
      .image {
        width: 170rpx;
        height: 170rpx;
      }
    }

    .quantity {
      position: absolute;
      bottom: 0;
      right: 0;
      line-height: 1;
      padding: 6rpx 4rpx 6rpx 8rpx;
      font-size: 24rpx;
      color: #fff;
      border-radius: 10rpx 0 0 0;
      background-color: rgba(0, 0, 0, 0.6);
    }

    .meta {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .name {
      height: 80rpx;
      font-size: 26rpx;
      color: #444;
    }

    .type {
      line-height: 1.8;
      padding: 0 15rpx;
      margin-top: 10rpx;
      font-size: 24rpx;
      align-self: flex-start;
      border-radius: 4rpx;
      color: #888;
      background-color: #f7f7f8;
    }

    .single-price {
      margin-top: 30rpx;
      width: fit-content;
      font-size: 35rpx;
      color: #ff9240;
    }

    .sku-title {
      display: flex;
      justify-content: space-between;
    }

    .num {
      font-size: 30rpx;
      width: 45rpx;
      height: 45rpx;
      border-radius: 5rpx;
      border: 1rpx solid gainsboro;
      text-align: center;
      line-height: 45rpx;
    }

    .more {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22rpx;
      color: #333;
    }

    .button {
      width: 180rpx;
      height: 60rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-left: 20rpx;
      border-radius: 60rpx;
      border: 1rpx solid #ccc;
      font-size: 26rpx;
      color: #444;
    }
  }

  .payment {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    line-height: 1;
    padding: 20rpx 0;
    text-align: right;
    color: #999;
    font-size: 28rpx;
    border-bottom: 1rpx solid #eee;

    .quantity {
      font-size: 24rpx;
      margin-right: 16rpx;
    }

    .amount {
      color: #444;
      margin-left: 6rpx;
    }

    .symbol {
      font-size: 20rpx;
    }
  }

  .action {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding-top: 20rpx;

    .button {
      width: 180rpx;
      height: 60rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-left: 20rpx;
      border-radius: 60rpx;
      border: 1rpx solid #ccc;
      font-size: 26rpx;
      color: #444;
    }

    .secondary {
      color: black;
      border-color: rgb(255, 234, 189);
    }

    .primary {
      color: black;
      background-color: rgb(255, 234, 189);
      border-color: rgb(255, 234, 189);
    }
  }

  .loading-text {
    text-align: center;
    font-size: 28rpx;
    color: #666;
    padding: 20rpx 0;
  }
}
.header-container {
  .picker {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20rpx;
    border-bottom: 1rpx solid #f7f7f8;
    .picker__label {
      font-size: 28rpx;
      color: #444;
    }
    .picker__value {
      font-size: 28rpx;
      color: #666;
    }
  }
  .button {
    font-size: 26rpx;
    border-radius: 72rpx;
    border: 1rpx solid #ccc;
    color: #444;
  }
}
.button-container {
  display: flex;
  justify-content: space-around;
  border-bottom: 1rpx solid #f7f7f8;
}
</style>
