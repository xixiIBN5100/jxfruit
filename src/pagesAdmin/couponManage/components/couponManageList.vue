<script setup lang="ts">
import { CouponState } from '@/services/constants'
import { CouponStateList } from '@/services/constants'
import type { CouponItem, subTypeParams } from '@/types/coupon'
import { deleteCouponById, getCoupon, getCouponAdmin, getNewCoupon } from '@/services/coupon'
import { isShallow, onMounted, ref } from 'vue'
import { useMemberStore } from '@/stores'
import type { MemberItem } from '@/types/member'
import { getMemberInfo } from '@/services/member'
import type { SubTypeItem } from '@/types/coupon'
import NewCoupon from '@/components/NewCoupon.vue'
import type { PageParams } from '@/types/global'




// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync()

// 分页参数（请求）
const adminQueryParams: Required<subTypeParams> = {
  subType: 1,
  pageNum: 1,
  pageSize: 2,
}


//优惠券状态类型参数
const props = defineProps<{ couponStateType: number }>()

//准备返回优惠券筛选后的优惠券列表
const newCouponAdminList = ref<CouponItem[]>([])
// 是否加载中标记，用于防止滚动触底触发多次请求
const isLoading = ref(false)

const couponStateIndex = props.couponStateType

//管理员优惠券列表
const couponAdminList = ref<CouponItem[]>([])
//临时备份列表
const couponRecordList = ref<CouponItem[]>([])
//添加可用优惠券(待定)
const Add = async () => {
  //还原到获取本页数据之前的状态
  couponAdminList.value = [...couponRecordList.value]
  //重新获取数据
  isFinish.value = false
  await getCouponAdminData()
}
//Tip:filter并不会改变原数组，所以一定要先存起来

//筛选对应状态的优惠券数组
const onFilter = (list: CouponItem[]) => {
  if (couponStateIndex === 2) {
    newCouponAdminList.value = list.filter(coupon => coupon.expired === CouponState.YiGuoQi)
  }
  else if (couponStateIndex === 1) {
    newCouponAdminList.value = list.filter(coupon => coupon.isUsed === CouponState.YiShiYong)
  }
  else {
    newCouponAdminList.value = list.filter(coupon => !(coupon.isUsed === CouponState.YiShiYong || coupon.expired === CouponState.YiGuoQi)
    )
  }

  //如果没有拿到对应数据，直接再次获取下一页数据
  if (newCouponAdminList.value.length) {
    couponAdminList.value.push(...newCouponAdminList.value)
  }
  else {
    //问题：执行顺序调整一下，获取已过期优惠券
    adminQueryParams.pageNum++
    getCouponAdminData()
  }


}
// 是否分页结束
const isFinish = ref(false)
//获取优惠券信息
const getCouponAdminData = async () => {

  // 如果数据处于加载中，退出函数
  if (isLoading.value) return

  // 退出分页判断
  if (isFinish.value === true) {
    return uni.showToast({ icon: 'none', title: '没有更多数据~' })
  }

  // 发送请求前，标记为加载中
  isLoading.value = true
  // 发送请求
  const res = await getCouponAdmin(adminQueryParams)
  // 发送请求后，重置标记
  isLoading.value = false
  //备份
  couponRecordList.value = [...couponAdminList.value]
  //数组筛选后追加
  onFilter(res.data.records)
  //分页条件
  if (adminQueryParams.pageNum < res.data.pages) {
    // 页码累加
    adminQueryParams.pageNum++
  }
  else {
    // 分页已结束
    isFinish.value = true
  }
}
const onDelete = (id: number) => {
  uni.showModal({
    content: '是否删除',
    confirmColor: 'rgb(255,234,189)',
    success: async (res) => {
      if (res.confirm) {
        //后端删除单个优惠券
        await deleteCouponById(id.toString())
        //前端删优惠券
        couponAdminList.value = couponAdminList.value.filter(item => item.id != id)
      }
    },
  }
  )

}
const couponShow = ref(true)
const getNewCouponData = () => {
  //if (isLoading.value) return
  isShow.value = true
  couponShow.value = false
}

const isShow = ref<boolean>()

const close = () => {
  isShow.value = false
  couponShow.value = true
}

onMounted(() => {
  isShow.value = false
  getCouponAdminData()
})


// 是否触发下拉刷新(数据全部清空，然后只拿第一页)
const isTriggered = ref(false)
// 自定义下拉刷新被触发
const onRefresherrefresh = async () => {
  // 开始动画
  isTriggered.value = true
  // 重置数据
  adminQueryParams.pageNum = 1
  couponAdminList.value = []
  isFinish.value = false
  // 加载数据
  await getCouponAdminData()
  // 先等待成功获取数据，再关闭动画
  isTriggered.value = false
}

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
/*
// 滚动触底调用获取数据接口
const  = async () => {
  // 根据高亮下标（当前下标）从子类列表获取当前子类
  const currsubTypes = subTypes.value[activeIndex.value]
  // 分页条件
  if (currsubTypes.couponItems.page < currsubTypes.couponItems.pages) {
    //couponItems表示子类对应的商品集合（含分页参数）
    //pages表示总页数（后端返回）
    //page表示当前页码
    // 如果当前页码<总页码，当前页码累加
    currsubTypes.couponItems.page++
  } else {
    // 标记子类已结束
    currsubTypes.finish = true
    // 退出并轻提示（存疑）
    return uni.showToast({ icon: 'none', title: '没有更多数据了~' })
  }

  // 调用API传参（这里为触底获取数据）
  const res = await getCoupon({
    subType: currsubTypes.id,
    page: currsubTypes.couponItems.page,
    pageSize: currsubTypes.couponItems.pageSize,
  })
  //请求参数为当前子类的id+当前子类的商品集合（含分页参数）的页码、记录数
  //均为后端传过来的（首次获取）


  // res.result.subTypes:新的子类列表
  //newsubTypes:新的当前子类
  const newsubTypes = res.result.subTypes[activeIndex.value]
  // （新的当前子类）里的商品集合（含分页参数）的（商品列表）解构并追加到-->
  //  -->原当前子类的商品集合的商品列表,用于增加数据
  currsubTypes.couponItems.items.push(...newsubTypes.couponItems.items)
}
*/

</script>

<template>
  <NewCoupon @close="close" style="position: fixed; z-index: 10" v-if="isShow" @add="Add"></NewCoupon>
  <scroll-view enable-back-to-top scroll-y class="coupons" refresher-enabled :refresher-triggered="isTriggered"
    @refresherrefresh="onRefresherrefresh" @scrolltolower="getCouponAdminData" v-show='couponShow'>
    <view v-for="couponAdmin in couponAdminList" :key="couponAdmin.id">
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
          <button @tap="onDelete(couponAdmin.id)" class="button delete-button">删除</button>
        </view>

      </view>
    </view>

    <!--新建优惠券-->
    <view class="newcoupon" v-if="couponStateIndex == 0">
      <!-- 优惠券信息 -->
      <view class="regulation">
        <view class="limit">新的优惠券~~</view>
      </view>
      <view class="get" @click="getNewCouponData">
        获取
      </view>
    </view>
    <!-- 底部提示文字-->
    <view class="loading-text" :style="{ paddingBottom: safeAreaInsets!.bottom + 100 + 'px' }">
      {{ isFinish ? '没有更多数据~' : (isLoading ? '正在加载中...' : '滚动获取下一页数据...') }}
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

  //侧滑删除样式
  .cart-swipe {
    display: block;
    margin: 20rpx 0;
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
  }

  .loading-text {
    text-align: center;
    font-size: 28rpx;
    color: #666;
    padding: 20rpx 0;
  }
}
</style>
