<script setup lang="ts">
import { CouponState } from '@/services/constants'
import { CouponStateList } from '@/services/constants'
import type { CouponCode, CouponItem, SubTypeItem, SubTypeParams } from '@/types/coupon'
import { getCoupon, queryCouponCodeList } from '@/services/coupon'
import { onMounted, ref } from 'vue'
import { useMemberStore } from '@/stores'
import type { MemberItem } from '@/types/member'
import { getMemberInfo } from '@/services/member'
import type { PageParams } from '@/types/global'
import { onShow } from '@dcloudio/uni-app'
// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync()


// 定义 porps接收权益类型参数（优惠券/会员）
const props = defineProps<{
  priviledgeType: number
}>()

//券码分页
const couponCodeParams = ref<PageParams>({
  pageNum: 1,
  pageSize: 4
})


const couponCodeList = ref<CouponCode[]>([
  {
    couponCodeId: 1,
    codeNo: "123123",
    userId: 43,
    verified: 0,
    scale: "规格2",
    price: 20.0,
    goodsName: "购物券",
    description: "满30减8"
  },
  {
    couponCodeId: 2,
    codeNo: "123123",
    userId: 43,
    verified: 0,
    scale: "规格2",
    price: 20.0,
    goodsName: "购物券",
    description: "满30减8"
  },
  {
    couponCodeId: 3,
    codeNo: "123123",
    userId: 43,
    verified: 0,
    scale: "规格2",
    price: 20.0,
    goodsName: "购物券",
    description: "满30减8"
  }
])

var pageParams = {
  pageSize: 10,
  pageNum: 1
}

//查询券码列表
const onQueryCodeList = async () => {
 
  const res = await queryCouponCodeList(pageParams)
  couponCodeList.value.push(...res.data)
}

//跳转到查询券码页面，并携带页面参数couponCodeId
const onQueryCode = (id: number) => {
  uni.navigateTo({
    url: `/pagesMember/couponCode/couponCode?couponCodeId=${id}`
  })
}
//再来一单
const onNavigate = () => {
  uni.switchTab({ url: '/pages/category/category' })
}

//核销后返回页面时重新获取数据
onShow(()=> {
  onQueryCodeList()
})


// 优惠券子类列表(前端自定义)
const subTypes = ref<(SubTypeItem & { isFinish?: boolean })[]>([
  { subTypeParams: { subType: 0, pageNum: 1, pageSize: 6, }, couponItems: [] },
  { subTypeParams: { subType: 1, pageNum: 1, pageSize: 6, }, couponItems: [] },
  { subTypeParams: { subType: 2, pageNum: 1, pageSize: 6, }, couponItems: [] }
])

// 是否加载中标记，用于防止滚动触底触发多次请求
const isLoading = ref(false)
//初始化函数
const onInitialize = async (QueryParams: SubTypeParams) => {
  isLoading.value = true
  const res = await getCoupon(QueryParams)
  isLoading.value = false
  //引用当前子类
  const currSubType = subTypes.value[initializeIndex.value]
  currSubType.couponItems = res.data.records
  //分页处理
  if (currSubType.subTypeParams.pageNum! < res.data.pages) {
    currSubType.subTypeParams.pageNum!++
  }
  else {
    //动态添加isFinish属性并赋值
    currSubType.isFinish = true
  }
  initializeIndex.value++
}
const initializeIndex = ref(0)
//获取优惠券信息
const getMemberCouponData = async () => {
  //初次获取数据并做相应处理
  await onInitialize(subTypes.value[initializeIndex.value].subTypeParams)
  await onInitialize(subTypes.value[initializeIndex.value].subTypeParams)
  await onInitialize(subTypes.value[initializeIndex.value].subTypeParams)
}

const member = ref<MemberItem>()

//获取会员信息
const getMemberData = async () => {

  const res = await getMemberInfo()
  console.log(res)
  member.value = res.data
}


onMounted(() => {
  getMemberCouponData()
  getMemberData()
  onQueryCodeList()
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



// 是否触发下拉刷新
const isTriggered = ref(false)


// 监听下拉刷新动作
const onRefresherrefresh = async () => {
  // 开始动画
  isTriggered.value = true
  // 重置数据
  const currSubType = subTypes.value[activeIndex.value]
  currSubType.subTypeParams.pageNum = 1
  currSubType.couponItems = []
  currSubType.isFinish = false
  if (isLoading.value) return
  // 加载数据
  isLoading.value = true
  const res = await getCoupon(currSubType.subTypeParams)
  isLoading.value = false
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
const activeIndex = ref(0)
// 滚动触底
const onScrolltolower = async () => {
  // 根据高亮下标（当前下标）从子类列表引用当前子类
  const currSubType = subTypes.value[activeIndex.value]
  if (currSubType.isFinish) {
    // 退出并轻提示
    return uni.showToast({ icon: 'none', title: '没有更多数据了~' })
  }
  if (isLoading.value) return
  isLoading.value = true
  const res = await getCoupon(
    currSubType.subTypeParams
  )
  isLoading.value = false
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
  <!-- 展示会员信息
  <view class="member-card" v-if="props.priviledgeType === 1">
    <view class="text">您的会员等级为 V{{ member?.vipLevel }} </view>
    <view class="text">积分：{{ member?.points }} </view>
    <view class="recharge" @click="recharge">充值</view>
  </view> -->
  <!--展示优惠券信息-->
  <view class="tabs" v-if="props.priviledgeType === 0">
    <text class="item" v-for="(item, index) in CouponStateList" :key="item.id" @tap="() => { activeIndex = index }">
      {{ item.text }}
    </text>
    <!-- 游标 -->
    <view class="cursor" :style="{ left: activeIndex * 33 + 8 + '%' }"></view>
  </view>
  <view class="scroll" v-for="(item, index) in subTypes" :key="index" v-show="activeIndex == index"
    v-if="props.priviledgeType === 0">
    <scroll-view enable-back-to-top scroll-y class="coupons" refresher-enabled :refresher-triggered="isTriggered"
      @refresherrefresh="onRefresherrefresh" @scrolltolower="onScrolltolower" scroll-with-animation show-scrollbar>
      <view v-for="coupon in item.couponItems" :key="coupon.id">
        <view class="card"
          :class="[(coupon.isUsed === CouponState.YiShiYong || coupon.expired === CouponState.YiGuoQi) ? 'used' : '']">
          <!-- 优惠券信息-->
          <view>
            <view><text style="font-size: 40rpx">￥</text>{{ coupon.price }}</view>
            <view>{{ coupon.type }}</view>
          </view>
          <view class="regulation">
            <view class="limit" v-if="coupon.effectivePrice != 0">满{{ coupon.effectivePrice }} 可用</view>
            <view class="effective-time">有效期至：{{ coupon.effectiveTime }}</view>
          </view>
          <view class="use" @click="useCoupon(coupon)">{{ coupon.isUsed === 1 ? '已使用' :
            (coupon.expired === 1 ? '已过期' : '使用') }}
          </view>
        </view>
      </view>
      <!-- 底部提示文字-->
      <view class="loading-text" :style="{ paddingBottom: safeAreaInsets!.bottom + 150 + 'px' }">
        {{ item.isFinish ? '没有更多数据~' : (isLoading ? '正在加载中...' : '滚动获取数据') }}
      </view>
    </scroll-view>
  </view>
  <view class="qrCode" v-if="props.priviledgeType == 1">
    <scroll-view enable-back-to-top scroll-y class="couponCodes">
      <view v-for="couponCode in couponCodeList" :key="couponCode.couponCodeId">
        <view class="couponCode" :class="[(couponCode.verified == 1 ? 'used' : '')]">
          <view class="area1">
            <view class="logo">
              <image></image>
              <text>践行鲜果{{ couponCode.goodsName }}</text>
            </view>
            <view class="use">
              <text>{{ couponCode.verified ? '已核销' : '待消费' }}</text>
            </view>
          </view>
          <view class="divider"></view>
          <view class="area2">
            <image mode="aspectFit" src="@/static/images/jx_logo.png"></image>
            <view class="textarea">
              <text>规格: {{ couponCode.scale }}</text>
              <text>实付: ¥{{ couponCode.price }}</text>
              <text>优惠: {{ couponCode.description }}</text>
            </view>
          </view>
          <view class="buttonarea">
            <button class="submit-btn" @click="onQueryCode(couponCode.couponCodeId)"
              hover-class="button-hover">查看券码</button>
            <button class="more-btn" @click="onNavigate" hover-class="button-hover">再来一单</button>
          </view>
        </view>
      </view>


    </scroll-view>
  </view>
</template>

<style lang="scss">
.qrCode {
  height: 100%;
  background-color: #ddf3fa;
  width: 750rpx;

  .couponCodes {
    height: 100vh;
    width: 100%;

    //text-align:center;
    .couponCode {
      background-color: rgba(118, 254, 236, 0.8);
      min-height: 300rpx;
      padding: 20rpx 60rpx 10rpx;
      margin: 30rpx 30rpx 30rpx;
      box-sizing: border-box;
      border-radius: 30rpx;
      border: 2px solid rgb(73, 93, 244, 0.8);
      display: flex;
      flex-direction: column;

      .area1 {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .logo {
          display: flex;
          width: 200rpx;
          white-space: nowrap;
          margin: 10rpx 0rpx;

          text {
            font-weight: bolder;
            font-size: 20px;
          }

        }

        .use {
          text {
            font-size: 30rpx;
          }
        }
      }

      .divider {
        height: 1px;
        background-color: #a4a0a0;
        margin: 13px -20px;

      }

      .area2 {
        display: flex;
        height: 300rpx;
        width: 100%;
        position: relative;

        image {
          width: 450rpx;
          height: 450rpx;
          position: absolute;
          top: -80rpx;
          left: -140rpx;

        }

        .textarea {
          display: flex;
          flex-direction: column;
          margin: 20rpx 20rpx 0rpx 240rpx;
          height: 460rpx;
          flex: 1;
          font-size: 18px;
          line-height: 50px;
          color: #474444;
        }
      }

      .buttonarea {
        display: flex;
        height: 200rpx;
        width: 500rpx;
        margin-top: 10rpx;
        margin-left: 130rpx;
        justify-content: space-evenly;
        align-items: center;
      

        .submit-btn {
          width: 230rpx;
          height: 80rpx;
          text-align: center;
          line-height: 80rpx;
          border-radius: 60rpx;
          color: rgb(48, 77, 204);
          background-color: rgb(203, 253, 254);
          border: 1px solid;
          margin-right: 30rpx;
          font-size: 35rpx;
        }

        .button-hover {
          background-color: #092da1;
          color: red;
          opacity: 0.8;
        }

        .more-btn {
          width: 230rpx;
          height: 80rpx;
          text-align: center;
          line-height: 80rpx;
          border-radius: 60rpx;
          color: rgb(48, 77, 204);
          background-color: rgb(203, 253, 254);
          border: 1px solid;
          margin-right: 40rpx;
          font-size: 35rpx;
        }

        .button-hover {
          background-color: #092da1;
          color: red;
          opacity: 0.8;
        }
      }

    }


  }

}

.scroll {
  background-color: #9fddfa;
  height: 100vh;
  width: 750rpx;

}

.tabs {
  display: flex;

  justify-content: space-around;
  line-height: 60rpx;
  margin: 0 0rpx;
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
    width: 18%;
    height: 6rpx;
    padding: 0 50rpx;
    background-color: rgb(41, 205, 131);
    /* 过渡效果 */
    transition: all 0.25s;
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
    padding: 14rpx 0;
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
