<script setup lang="ts">
import { CouponState } from '@/services/constants'
import type { CouponItem, SubTypeParams } from '@/types/coupon'
import { deleteCouponById, getCoupon, getCouponAdmin, getNewCoupon } from '@/services/coupon'
import { onMounted, ref } from 'vue'
import type { SubTypeItem } from '@/types/coupon'
import NewCoupon from '@/components/NewCoupon.vue'
// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync()
// 优惠券子类列表(前端自定义)
const subTypes = ref<(SubTypeItem & { isFinish?: boolean })[]>([
  { subTypeParams: { subType: 0, pageNum: 1, pageSize: 4, }, couponItems: [] },
  { subTypeParams: { subType: 1, pageNum: 1, pageSize: 4, }, couponItems: [] },
  { subTypeParams: { subType: 2, pageNum: 1, pageSize: 4, }, couponItems: [] }
])

//优惠券状态类型参数
const props = defineProps<{ couponStateType: number }>()

// 是否加载中标记，用于防止滚动触底触发多次请求
const isLoading = ref(false)

const couponStateIndex = props.couponStateType

//备份
const couponRecordList = ref<CouponItem[]>([])
const couponRecordPage = ref(0)
//添加可用优惠券(待定)
const Add = async () => {
  const currSubType = subTypes.value[couponStateIndex]
  if (currSubType.isFinish) {
    //还原到上一页满数据的状态
    currSubType.couponItems = [...couponRecordList.value]
    currSubType.subTypeParams.pageNum = couponRecordPage.value
    //重新获取数据,并做分页处理
    currSubType.isFinish = false
    const res = await getCouponAdmin(currSubType.subTypeParams)
    //分页处理
    if (currSubType.subTypeParams.pageNum! < res.data.pages) {
      currSubType.subTypeParams.pageNum!++
    }
    else {
      currSubType.isFinish = true
    }
    const newCouponItem = res.data.records
    currSubType.couponItems.push(...newCouponItem)
  }
  else return
}

onMounted(() => {
  isShow.value = false
  getCouponAdminData()
})

//初始化函数
const onInitialize = async (QueryParams: SubTypeParams) => {
  isLoading.value = true
  const res = await getCouponAdmin(QueryParams)
  isLoading.value = false
  //引用当前子类
  const currSubType = subTypes.value[couponStateIndex]
  //备份
  couponRecordList.value = [...currSubType.couponItems]
  couponRecordPage.value = currSubType.subTypeParams.pageNum!
  //追加数据
  currSubType.couponItems = res.data.records
  //分页处理
  if (currSubType.subTypeParams.pageNum! < res.data.pages) {
    currSubType.subTypeParams.pageNum!++
  }
  else {
    //动态添加isFinish属性并赋值
    currSubType.isFinish = true
  }
}


const getCouponAdminData = async () => {
  //各组件初次获取子类数据并做相应处理
  await onInitialize(subTypes.value[couponStateIndex].subTypeParams)

}


//删优惠券
const onDelete = (id: number) => {
  uni.showModal({
    content: '是否删除',
    confirmColor: '#3a34db',
    success: async (res) => {
      if (res.confirm) {
        //后端删除单个优惠券
        await deleteCouponById(id.toString())
        //重新加载当前子类第一页数据
        const currSubType = subTypes.value[couponStateIndex]
        currSubType.subTypeParams.pageNum = 1
        currSubType.couponItems = []
        currSubType.isFinish = false
        //if(isLoading.value)return
        //isLoading.value=true
        const res = await getCouponAdmin(currSubType.subTypeParams)
        //isLoading.value=false
        //备份
        couponRecordList.value = [...currSubType.couponItems]
        couponRecordPage.value = currSubType.subTypeParams.pageNum!
        //分页处理
        if (currSubType.subTypeParams.pageNum! < res.data.pages) {
          currSubType.subTypeParams.pageNum!++
        }
        else {
          currSubType.isFinish = true
        }
        const newCouponItem = res.data.records
        currSubType.couponItems.push(...newCouponItem)
      }
    },
  }
  )

}
const isShow = ref<boolean>()
//获取新的优惠券
const couponShow = ref(true)
const getNewCouponData = () => {
  if (isLoading.value) return
  isShow.value = true
  couponShow.value = false
}

const close = () => {
  isShow.value = false
  couponShow.value = true
}

// 是否触发下拉刷新(数据全部清空，然后只拿第一页)
const isTriggered = ref(false)
// 自定义下拉刷新被触发
const onRefresherrefresh = async () => {
  // 开始动画
  isTriggered.value = true
  // 重置数据
  const currSubType = subTypes.value[couponStateIndex]
  currSubType.subTypeParams.pageNum = 1
  currSubType.couponItems = []
  currSubType.isFinish = false
  if (isLoading.value) return
  // 加载数据
  isLoading.value = true
  const res = await getCouponAdmin(currSubType.subTypeParams)
  isLoading.value = false
  //备份
  couponRecordList.value = [...currSubType.couponItems]
  couponRecordPage.value = currSubType.subTypeParams.pageNum!
  //分页处理
  if (currSubType.subTypeParams.pageNum! < res.data.pages) {
    currSubType.subTypeParams.pageNum!++
  }
  else {
    currSubType.isFinish = true
  }
  const newCouponItem = res.data.records
  currSubType.couponItems.push(...newCouponItem)
  // 关闭动画
  isTriggered.value = false
}
// 滚动触底
const onScrolltolower = async () => {
  // 根据高亮下标（当前下标）从子类列表引用当前子类
  const currSubType = subTypes.value[couponStateIndex]
  if (currSubType.isFinish) {
    // 退出并轻提示
    return uni.showToast({ icon: 'none', title: '没有更多数据了~' })
  }
  if (isLoading.value) return
  isLoading.value = true
  const res = await getCouponAdmin(
    currSubType.subTypeParams
  )
  isLoading.value = false
  //备份
  couponRecordList.value = [...currSubType.couponItems]
  couponRecordPage.value = currSubType.subTypeParams.pageNum!
  //分页处理
  if (currSubType.subTypeParams.pageNum! < res.data.pages) {
    currSubType.subTypeParams.pageNum!++
  }
  else {
    currSubType.isFinish = true
  }
  const newCouponItem = res.data.records
  currSubType.couponItems.push(...newCouponItem)
}

</script>

<template>
  <NewCoupon @close="close" style="position: fixed; z-index: 10" v-if="isShow" @add="Add"></NewCoupon>
  <scroll-view enable-back-to-top scroll-y class="coupons" refresher-enabled :refresher-triggered="isTriggered"
    @refresherrefresh="onRefresherrefresh" @scrolltolower="onScrolltolower" v-show='couponShow'>
    <view v-for="couponAdmin in subTypes[couponStateIndex].couponItems" :key="couponAdmin.id">
      <!--已使用和已过期的样式-->
      <view class="card"
        :class="[(couponAdmin.isUsed === CouponState.YiShiYong || couponAdmin.expired === CouponState.YiGuoQi) ? 'used' : '']">
        <!-- 优惠券信息 -->
        <view>
          <view><text style="font-size: 40rpx">￥</text>{{ couponAdmin.price }}</view>
          <view class="text1">{{ couponAdmin.type }}</view>
        </view>
        <view class="regulation">
          <view class="limit" v-if="couponAdmin.effectivePrice">满{{ couponAdmin.effectivePrice }} 可用</view>
          <view class="effective-time">有效期至：{{ couponAdmin.effectiveTime }}</view>
        </view>
        <view class="use">{{ couponAdmin.isUsed === 1 ? '已使用' :
          (couponAdmin.expired === 1 ? '已过期' : '可使用') }}
        </view>
        <view class="delete">
          <button @tap="onDelete(couponAdmin.id)" class="button delete-button" hover-class="button-hover">删除</button>
        </view>
      </view>
    </view>

    <!--新建优惠券-->
    <view class="newcoupon">
      <!-- 优惠券信息 -->
      <view class="regulation">
        <view class="limit">新的优惠券~~</view>
      </view>
      <view class="get" @click="getNewCouponData" hover-class="button-hover">
        获取
      </view>
    </view>
    <!-- 底部提示文字-->
    <view class="loading-text" :style="{ paddingBottom: safeAreaInsets!.bottom + 150 + 'px' }">
      {{ subTypes[couponStateIndex].isFinish ? '没有更多数据~' : (isLoading ? '正在加载中...' : '滚动获取数据') }}
    </view>
  </scroll-view>
</template>

<style lang="scss">
// 优惠券列表
.coupons {
  height: 100%;
  text-align: center;

  .used {
    background-color: grey !important;
    color: black !important;
    border: 1rpx solid black !important;

    .use {
      border: 1rpx solid black !important;
    }

    .button {
      border: 2px solid rgb(184, 154, 154) !important;
    }
  }

  .card {
    justify-content: space-between;
    align-items: center;
    min-height: 100rpx;
    padding: 30rpx;
    box-sizing: border-box;
    margin: 20rpx 20rpx 0;
    background-color: #ffe6e6;
    color: #ff0000;
    display: flex;
    border: 1px solid rgba(255, 0, 0, 0.9);
    border-radius: 30rpx;

    .text1 {
      font-size: 25rpx;
    }

    &:last-child {
      padding-bottom: 40rpx;
    }

    .regulation {
      font-size: 25rpx;

      .limit {
        font-size: 35rpx;
        font-weight: 700;
        margin-bottom: 15rpx;
      }

      .effective-time {
        width: 330rpx;
        font-size: 30rpx;
        font-weight: 700;
      }
    }

    .use {
      border-radius: 30rpx;
      width: 100rpx;
      height: 60rpx;
      font-size: 25rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      line-height: 60rpx;
      border: 2px solid rgb(241, 48, 48);
    }
  }

  .delete {
    display: flex;
    align-items: center;

    .button {
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      left: -2rpx;
      width: 80rpx;
      height: 80rpx;
      padding: 6px;
      line-height: 1.5;
      color: #fff;
      font-size: 23rpx;
      letter-spacing: 1rpx; //字间距
      border: 2px solid rgb(243, 218, 218);
      border-radius: 50%;
    }

    .delete-button {
      background-color: #cf4444;
    }

    .button-hover {
      background-color: #0735ca;
      color: rgb(38, 0, 255);
      opacity: 0.8;
    }
  }

  .newcoupon {
    justify-content: center;
    align-items: center;
    min-height: 100rpx;
    height: 140rpx;
    padding: 30rpx;
    box-sizing: border-box;
    margin: 20rpx 20rpx 0;
    border-radius: 10rpx;
    background-color: #cee3f8;
    color: #aea0a0;
    display: flex;
    border-radius: 30rpx;
    border: 1px solid rgb(55, 134, 195);
    margin-bottom: 0rpx;

    &:last-child {
      padding-bottom: 40rpx;
    }

    .regulation {
      font-size: 25rpx;

      .limit {
        font-size: 35rpx;
        font-weight: 600;
        margin-bottom: 15rpx;

      }
    }

    .get {
      position: absolute;
      left: 78%;
      border-radius: 30rpx;
      width: 120rpx;
      height: 60rpx;
      font-size: 30rpx;
      text-align: center;
      line-height: 60rpx;
      border: 1rpx solid #548ac8;
      color: #548ac8;
    }

    .button-hover {
      background-color: #0735ca;
      color: red;
      opacity: 0.8;
    }
  }

  .loading-text {
    text-align: center;
    font-size: 28rpx;
    color: #666;
    padding: 14rpx 0;
  }
}
</style>
