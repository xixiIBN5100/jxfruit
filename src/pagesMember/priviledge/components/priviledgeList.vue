<script setup lang="ts">
import { CouponState } from '@/services/constants'
import { CouponStateList } from '@/services/constants'
import type { CouponItem, CouponQueryParams } from '@/types/coupon'
import { getCoupon } from '@/services/coupon'
import { onMounted, ref } from 'vue'
import { useMemberStore } from '@/stores'
import type { MemberItem } from '@/types/member'
import { getMemberInfo } from '@/services/member'
import type { SubTypeItem } from '@/types/coupon'
// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync()


// 定义 porps接收类型参数（优惠券/会员）
const props = defineProps<{
  priviledgeType: number
}>()


// 分页参数（请求）
const couponQueryParams: CouponQueryParams = {
  pageSize: 10,
  pageNum: 1,
}




// 获取优惠券子类列表
const subTypes = ref<(SubTypeItem & { isFinish?: boolean })[]>([])

// 是否加载中标记，用于防止滚动触底触发多次请求
const isLoading = ref(false)


//获取优惠券信息
const getMemberPriviledgeData = async () => {

  // 如果正在等待数据获取（后端传过来）中，退出函数
  if (isLoading.value) return
  // 发送请求前，标记一下正在调用获取数据接口
  isLoading.value = true
  // 调用获取数据接口
  const res = await getCoupon(couponQueryParams)
  console.log(res)
  isLoading.value = false
  //保存子类列表
 // subTypes.value = res.data.subTypes
  /*
    //分页条件
    if (queryParams.pageNum < res.data.pages) {
    //   // 页码累加
      queryParams.pageNum++
    } else {
    //   // 分页已结束
      isFinish.value = true
    }
  */
  // console.log("res", res.data.records)
}

const member = ref<MemberItem>()

//获取会员信息
const getMemberData = async () => {

  const res = await getMemberInfo()
  console.log(res)
  member.value = res.data
}


onMounted(() => {
  getMemberPriviledgeData()
  getMemberData()
})

const useCoupon = (priviledge: CouponItem) => {
  if (priviledge.isUsed === 0 && priviledge.expired === 0) {
    uni.switchTab({ url: '/pages/cart/cart' })
  }
}
const recharge = () => {
  console.log("开始充值")
  uni.showModal({
    title: '敬请期待'
  })

}


// 是否分页结束
const isFinish = ref(false)
// 是否触发下拉刷新
const isTriggered = ref(false)
// 监听下拉刷新动作
const onRefresherrefresh = async () => {
  // 开始动画
  isTriggered.value = true
  // 重置数据
  //queryParams.pageNum = 1
  //priviledgeList.value= []
  isFinish.value = false
  // 加载数据
  await getMemberPriviledgeData()
  // 关闭动画
  isTriggered.value = false
}
const activeIndex = ref(0)
/*
//const subTypes = ref<(SubTypeItem & { finish?: boolean })[]>([])
const getCouponData = async () => {
  const res = await getCoupon( {
    // 技巧：环境变量，开发环境，修改初始页面方便测试分页结束
    page: import.meta.env.DEV ? 30 : 1,
    pageSize: 10,
  })
  //当前推荐页的获取数据接口，!表示非空断言，因为逻辑上一定能取到
  //首次获取，当前页面默认为1或者自定义（大一点）（开发环境）
  // 保存子类列表
  subTypes.value = res.result.subTypes
}
*/

// 滚动触底
const onScrolltolower = async () => {
  // 根据高亮下标（当前下标）从子类列表引用当前子类
  const currsubType = subTypes.value[activeIndex.value]
  // 分页条件
  if (currsubType.couponItems.page < currsubType.couponItems.pages) {
    currsubType.couponItems.page++
  } else {
    // 标记子类已结束
    currsubType.isFinish = true
    // 退出并轻提示（存疑）
    return uni.showToast({ icon: 'none', title: '没有更多数据了~' })
  }
/*
  // 调用API传参（这里为触底获取数据）
  const res = await getCoupon({
    subType: currsubType.id,
    page: currsubType.couponItems.page,
    pageSize: currsubType.couponItems.pageSize,
  })
  //请求参数为当前子类的id+当前子类的商品集合（含分页参数）的页码、记录数
  //均为后端传过来的（首次获取）


  // res.result.subTypes:新的子类列表
  //newsubTypes:新的当前子类
  const newsubType = res.data.subTypes[activeIndex.value]
  // （新的当前子类）里的商品集合（含分页参数）的（商品列表）解构并追加到-->
  //  -->原当前子类的商品集合的商品列表,用于增加数据
  currsubType.couponItems.items.push(...newsubType.couponItems.items)
*/
}


</script>

<template>
  <!--展示会员信息-->
  <view class="member-card" v-if="props.priviledgeType === 1">
    <view class="text">您的会员等级为 V{{ member?.vipLevel }} </view>
    <view class="text">积分：{{ member?.points }} </view>
    <view class="recharge" @click="recharge">充值</view>
  </view>
  <!--展示优惠券信息-->
  <view class="tabs" v-if="props.priviledgeType === 0">
    <text class="item" v-for="(item, index) in CouponStateList" :key="item.id" @tap="() => { activeIndex = index }">
      {{ item.text }}
    </text>
    <!-- 游标 -->
    <view class="cursor" :style="{ left: activeIndex * 33 + 5 + '%' }"></view>
  </view>
  <swiper class="swiper" :current="activeIndex" @change="activeIndex = $event.detail.current" v-if="props.priviledgeType === 0">
    <swiper-item v-for="item in subTypes" :key="item.id">
      <scroll-view enable-back-to-top scroll-y class="coupons" refresher-enabled :refresher-triggered="isTriggered"
        @refresherrefresh="onRefresherrefresh" @scrolltolower="onScrolltolower">

        <view v-for="priviledge in item.couponItems.items" :key="priviledge.id" >
          <view class="card"
            :class="[(priviledge.isUsed === CouponState.YiShiYong || priviledge.expired === CouponState.YiGuoQi) ? 'used' : '']">
            <!-- 优惠券信息 -->
            <view>
              <view><text style="font-size: 40rpx">￥</text>{{ priviledge.price }}</view>
              <view>{{ priviledge.type }}</view>
            </view>
            <view class="regulation">
              <view class="limit" v-if="priviledge.effectivePrice != 0">满{{ priviledge.effectivePrice }} 可用</view>
              <view class="effective-time">有效期至：{{ priviledge.effectiveTime }}</view>
            </view>
            <view class="use" @click="useCoupon(priviledge)">{{ priviledge.isUsed === 1 ? '已使用' :
              (priviledge.expired === 1 ? '已过期' : '使用') }}
            </view>
          </view>
        </view>
        <!-- 底部提示文字-->
        <view class="loading-text" :style="{ paddingBottom: safeAreaInsets?.bottom + 'px' }">
          {{ item.isFinish ? '没有更多数据~' : '正在加载...' }}
        </view>
      </scroll-view>
    </swiper-item>
  </swiper>
</template>

<style lang="scss">
.swiper {
  background-color: #f7f7f8;
  height: 100vh;
  width: 750rpx;
}

.tabs {
  display: flex;

  justify-content: space-around;
  line-height: 60rpx;
  margin: 0 10rpx;
  background-color: #fff;
  box-shadow: 0 4rpx 6rpx rgba(240, 240, 240, 0.6);
  position: relative;
  z-index: 9;

  .item {
    flex: 1;
    text-align: center;
    padding: 20rpx;
    font-size: 28rpx;
    color: #262626;
  }

  .cursor {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 25%;
    height: 6rpx;
    padding: 0 50rpx;
    background-color: rgb(41, 205, 131);
    /* 过渡效果 */
    transition: all 0.4s;
  }
}

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
    border-radius: 30rpx;
    border: 1px solid rgba(255, 0, 0, 0.9);

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
      width: 120rpx;
      height: 60rpx;
      font-size: 30rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      //line-height: 60rpx;
      border: 2px solid rgb(241, 48, 48);
    }
  }

  .loading-text {
    text-align: center;
    font-size: 28rpx;
    color: #666;
    padding: 20rpx 0;
  }
}
.member-card {
    width: 700rpx;
    height: 300rpx;
    border-radius: 20rpx;
    background-color: rgb(255, 234, 189);
    margin: 30rpx auto;
    padding: 30rpx;
    box-sizing: border-box;
    position: relative;

    .text {
      font-size: 35rpx;
    }

    .recharge {
      position: absolute;
      bottom: 20rpx;
      right: 20rpx;
      width: 100rpx;
      height: 50rpx;
      line-height: 50rpx;
      text-align: center;
      border-radius: 20rpx;
      background-color: white;
    }
  }
</style>
