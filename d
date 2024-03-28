[33mcommit 21a6cede4b9c86ee6ced0192d85fe317da192cb5[m[33m ([m[1;31mupstream/master[m[33m)[m
Merge: 2d9c861 8609271
Author: codelover123hxy <97789400+codelover123hxy@users.noreply.github.com>
Date:   Tue Feb 27 23:51:55 2024 +0800

    Merge pull request #6 from 123sssdd/hhh
    
    后台优惠券&券码功能

[33mcommit 8609271eec57297d70ef2324872221a270a2205d[m
Merge: 405bfae 2d9c861
Author: codelover123hxy <97789400+codelover123hxy@users.noreply.github.com>
Date:   Tue Feb 27 23:51:41 2024 +0800

    Merge branch 'master' into hhh

[33mcommit 405bfae380414122aff85dcbc1737d97b46d9700[m
Author: 123sssdd <https://github.com/123sssdd>
Date:   Tue Feb 27 20:29:38 2024 +0800

    券码功能

[1mdiff --git a/src/pagesAdmin/couponManage/components/couponManageList.vue b/src/pagesAdmin/couponManage/components/couponManageList.vue[m
[1mindex 6d94382..276e3b5 100644[m
[1m--- a/src/pagesAdmin/couponManage/components/couponManageList.vue[m
[1m+++ b/src/pagesAdmin/couponManage/components/couponManageList.vue[m
[36m@@ -31,7 +31,7 @@[m [mconst Add = async () => {[m
   if (currSubType.isFinish) {[m
     //还原到上一页满数据的状态[m
     currSubType.couponItems = [...couponRecordList.value][m
[31m-    currSubType.subTypeParams.pageNum=couponRecordPage.value[m
[32m+[m[32m    currSubType.subTypeParams.pageNum = couponRecordPage.value[m
     //重新获取数据,并做分页处理[m
     currSubType.isFinish = false[m
     const res = await getCouponAdmin(currSubType.subTypeParams)[m
[36m@@ -40,9 +40,9 @@[m [mconst Add = async () => {[m
       currSubType.subTypeParams.pageNum!++[m
     }[m
     else {[m
[31m-      currSubType.isFinish=true[m
[32m+[m[32m      currSubType.isFinish = true[m
     }[m
[31m-    const newCouponItem=res.data.records[m
[32m+[m[32m    const newCouponItem = res.data.records[m
     currSubType.couponItems.push(...newCouponItem)[m
   }[m
   else return[m
[36m@@ -101,7 +101,7 @@[m [mconst onDelete = (id: number) => {[m
         //isLoading.value=true[m
         const res = await getCouponAdmin(currSubType.subTypeParams)[m
         //isLoading.value=false[m
[31m-         //备份[m
[32m+[m[32m        //备份[m
         couponRecordList.value = [...currSubType.couponItems][m
         couponRecordPage.value = currSubType.subTypeParams.pageNum![m
         //分页处理[m
[36m@@ -149,7 +149,7 @@[m [mconst onRefresherrefresh = async () => {[m
   isLoading.value = true[m
   const res = await getCouponAdmin(currSubType.subTypeParams)[m
   isLoading.value = false[m
[31m-   //备份[m
[32m+[m[32m  //备份[m
   couponRecordList.value = [...currSubType.couponItems][m
   couponRecordPage.value = currSubType.subTypeParams.pageNum![m
   //分页处理[m
[36m@@ -178,7 +178,7 @@[m [mconst onScrolltolower = async () => {[m
     currSubType.subTypeParams[m
   )[m
   isLoading.value = false[m
[31m-   //备份[m
[32m+[m[32m  //备份[m
   couponRecordList.value = [...currSubType.couponItems][m
   couponRecordPage.value = currSubType.subTypeParams.pageNum![m
   //分页处理[m
[36m@@ -232,7 +232,7 @@[m [mconst onScrolltolower = async () => {[m
       </view>[m
     </view>[m
     <!-- 底部提示文字-->[m
[31m-    <view class="loading-text" :style="{ paddingBottom: safeAreaInsets!.bottom + 150 +'px' }">[m
[32m+[m[32m    <view class="loading-text" :style="{ paddingBottom: safeAreaInsets!.bottom + 150 + 'px' }">[m
       {{ subTypes[couponStateIndex].isFinish ? '没有更多数据~' : (isLoading ? '正在加载中...' : '滚动获取数据') }}[m
     </view>[m
   </scroll-view>[m
[36m@@ -308,12 +308,6 @@[m [mconst onScrolltolower = async () => {[m
     }[m
   }[m
 [m
[31m-  //侧滑删除样式[m
[31m-  .cart-swipe {[m
[31m-    display: block;[m
[31m-    margin: 20rpx 0;[m
[31m-  }[m
[31m-[m
   .delete {[m
     display: flex;[m
     align-items: center;[m
[36m@@ -338,7 +332,8 @@[m [mconst onScrolltolower = async () => {[m
     .delete-button {[m
       background-color: #cf4444;[m
     }[m
[31m-     .button-hover {[m
[32m+[m
[32m+[m[32m    .button-hover {[m
       background-color: #0735ca;[m
       color: rgb(38, 0, 255);[m
       opacity: 0.8;[m
[36m@@ -388,7 +383,8 @@[m [mconst onScrolltolower = async () => {[m
       border: 1rpx solid #548ac8;[m
       color: #548ac8;[m
     }[m
[31m-     .button-hover {[m
[32m+[m
[32m+[m[32m    .button-hover {[m
       background-color: #0735ca;[m
       color: red;[m
       opacity: 0.8;[m
[1mdiff --git a/src/pagesAdmin/qrCodeVerify/qrCodeVerify.vue b/src/pagesAdmin/qrCodeVerify/qrCodeVerify.vue[m
[1mindex 8dfac40..c7c3aa6 100644[m
[1m--- a/src/pagesAdmin/qrCodeVerify/qrCodeVerify.vue[m
[1m+++ b/src/pagesAdmin/qrCodeVerify/qrCodeVerify.vue[m
[36m@@ -1,57 +1,55 @@[m
 <script setup lang="ts">[m
[32m+[m[32mimport { qrCodeVerify } from '@/services/coupon';[m
 import { ref } from 'vue';[m
[32m+[m[32m//核销券码[m
[32m+[m[32mconst couponCodeVerify = async () => {[m
[32m+[m[32m  await qrCodeVerify({ codeNo: codeNo.value })[m
[32m+[m[32m   uni.showToast({[m
[32m+[m[32m    title: '核销成功'[m
[32m+[m[32m  })[m
[32m+[m[32m}[m
 [m
 //uni扫码一次[m
 [m
 const scanCode = () => {[m
[31m-    uni.scanCode({[m
[31m-        scanType: ['qrCode'],[m
[31m-        success: (res) => {[m
[31m-            result.value = res.result[m
[31m-        },[m
[31m-        fail: (error) => {[m
[31m-            uni.showToast({[m
[31m-                title: '扫码失败',[m
[31m-                duration:1000,[m
[31m-            })[m
[31m-            console.log(error)[m
[31m-         }[m
[31m-    })[m
[32m+[m[32m  uni.scanCode({[m
[32m+[m[32m    scanType: ['qrCode'],[m
[32m+[m[32m    success: async (res) => {[m
[32m+[m[32m      console.log(res)[m
[32m+[m[32m      codeNo.value = res.result[m
[32m+[m[32m      couponCodeVerify()[m
[32m+[m[32m    },[m
[32m+[m[32m    fail: (error) => {[m
[32m+[m[32m      uni.showToast({[m
[32m+[m[32m        title: '扫码失败',[m
[32m+[m[32m        duration: 1000,[m
[32m+[m[32m        icon: 'error'[m
[32m+[m[32m      })[m
[32m+[m[32m      console.log(error)[m
[32m+[m[32m    }[m
[32m+[m[32m  })[m
 }[m
[31m-[m
[31m-[m
[31m-const result = ref<string>('')[m
[31m-[m
[31m-[m
[32m+[m[32mconst codeNo = ref<string>('')[m
 </script>[m
 [m
 [m
 <template>[m
   <view>[m
[31m-        <button @click="scanCode">扫码</button>[m
[31m-    </view>[m
[31m-    <view class="content">[m
[31m-        <text>cc{{ result }}</text>[m
[31m-    </view>[m
[31m-[m
[31m-[m
[31m-  </template>[m
[32m+[m[32m    <button @click="scanCode">扫码</button>[m
[32m+[m[32m  </view>[m
[32m+[m[32m</template>[m
 [m
 [m
 [m
 <style lang="scss">[m
 button {[m
[31m-    margin: 100rpx 300rpx 10rpx;[m
[31m-    height: 100rpx;[m
[31m-    width: 150rpx;[m
[31m-    background-color: rgb(132, 215, 248);[m
[31m-}[m
[31m-[m
[31m-.content {[m
[31m-    height: 375rpx;[m
[31m-    width: 375rpx;[m
[31m-    background-color: blue;[m
[31m-    color: rgb(228, 240, 228);[m
[31m-    margin: 300rpx 180rpx 10rpx;[m
[32m+[m[32m  margin: 100rpx 300rpx 10rpx;[m
[32m+[m[32m  height: 100rpx;[m
[32m+[m[32m  width: 150rpx;[m
[32m+[m[32m  background-color: rgb(203, 243, 248);[m
[32m+[m[32m  border-radius: 20px;[m
[32m+[m[32m  border:3px solid rgb(44, 241, 255) ;[m
[32m+[m[32m  font-weight: bold;[m
[32m+[m[32m  color: rgb(29, 28, 29);[m
 }[m
 </style>[m
[1mdiff --git a/src/pagesMember/coupon/coupon.vue b/src/pagesMember/coupon/coupon.vue[m
[1mindex d205ad8..e59ddb3 100644[m
[1m--- a/src/pagesMember/coupon/coupon.vue[m
[1m+++ b/src/pagesMember/coupon/coupon.vue[m
[36m@@ -13,7 +13,7 @@[m [mconst getDefaultCouponData = async () => {[m
   isLoading.value = true[m
   const res = await getDefaultCoupon()[m
   isLoading.value=false[m
[31m-  //问题：如果返回一个空对象，数组加上去，则length>0,渲染出空券[m
[32m+[m[32m  //问题：如果返回一个空对象，数组加上去，则length>0,渲染出空券(已解决)[m
   if (Object.keys(res.data).length !== 0) {[m
     couponDefaultList.value.push(res.data)[m
   }[m
[1mdiff --git a/src/pagesMember/priviledge/components/priviledgeList.vue b/src/pagesMember/priviledge/components/priviledgeList.vue[m
[1mindex 051b45d..44033bc 100644[m
[1m--- a/src/pagesMember/priviledge/components/priviledgeList.vue[m
[1m+++ b/src/pagesMember/priviledge/components/priviledgeList.vue[m
[36m@@ -59,7 +59,7 @@[m [mconst couponCodeList = ref<CouponCode[]>([[m
 ])[m
 //查询券码列表[m
 const onQueryCodeList = async () => {[m
[31m-  const res = await queryCouponCodeList(couponCodeParams.value)[m
[32m+[m[32m  const res = await queryCouponCodeList()[m
   couponCodeList.value.push(...res.data)[m
 }[m
 [m
[36m@@ -73,12 +73,13 @@[m [mconst onQueryCode = (id: number) => {[m
 const onNavigate = () => {[m
   uni.switchTab({ url: '/pages/category/category' })[m
 }[m
[31m-/*[m
[32m+[m
[32m+[m[32m//核销后返回页面时重新获取数据[m
 onShow(()=> {[m
   onQueryCodeList()[m
 })[m
[31m-核销后返回时重新获取数据?[m
[31m-*/[m
[32m+[m
[32m+[m
 // 优惠券子类列表(前端自定义)[m
 const subTypes = ref<(SubTypeItem & { isFinish?: boolean })[]>([[m
   { subTypeParams: { subType: 0, pageNum: 1, pageSize: 6, }, couponItems: [] },[m
[36m@@ -263,9 +264,9 @@[m [mconst onScrolltolower = async () => {[m
           <view class="area2">[m
             <image mode="aspectFit" src="@/static/images/jx_logo.png"></image>[m
             <view class="textarea">[m
[31m-              <text>规格:{{ couponCode.scale }}</text>[m
[31m-              <text>实付:¥{{ couponCode.price }}</text>[m
[31m-              <text>优惠信息：{{ couponCode.description }}</text>[m
[32m+[m[32m              <text>规格: {{ couponCode.scale }}</text>[m
[32m+[m[32m              <text>实付: ¥{{ couponCode.price }}</text>[m
[32m+[m[32m              <text>优惠: {{ couponCode.description }}</text>[m
             </view>[m
           </view>[m
           <view class="buttonarea">[m
[36m@@ -372,7 +373,7 @@[m [mconst onScrolltolower = async () => {[m
         align-items: center;[m
 [m
         .submit-btn {[m
[31m-          width: 200rpx;[m
[32m+[m[32m          width: 230rpx;[m
           height: 80rpx;[m
           text-align: center;[m
           line-height: 80rpx;[m
[36m@@ -380,8 +381,7 @@[m [mconst onScrolltolower = async () => {[m
           color: rgb(48, 77, 204);[m
           background-color: rgb(203, 253, 254);[m
           border: 1px solid;[m
[31m-          margin-right: -10rpx;[m
[31m-[m
[32m+[m[32m          margin-right: 30rpx;[m
         }[m
 [m
         .button-hover {[m
[36m@@ -391,7 +391,7 @@[m [mconst onScrolltolower = async () => {[m
         }[m
 [m
         .more-btn {[m
[31m-          width: 200rpx;[m
[32m+[m[32m          width: 230rpx;[m
           height: 80rpx;[m
           text-align: center;[m
           line-height: 80rpx;[m
[36m@@ -550,4 +550,6 @@[m [mconst onScrolltolower = async () => {[m
     border-radius: 20rpx;[m
     background-color: white;[m
   }[m
[31m-}</style>[m
[32m+[m[32m}[m
[32m+[m
[32m+[m[32m</style>[m
[1mdiff --git a/src/services/coupon.ts b/src/services/coupon.ts[m
[1mindex 357b220..435e243 100644[m
[1m--- a/src/services/coupon.ts[m
[1m+++ b/src/services/coupon.ts[m
[36m@@ -1,4 +1,4 @@[m
[31m-import type { CouponResult, CouponItem ,SubTypeParams,NewCouponData,CouponCode} from "@/types/coupon"[m
[32m+[m[32mimport type { CouponResult, CouponItem ,SubTypeParams,NewCouponData,CouponCode, QrCodeVerify} from "@/types/coupon"[m
 import type { PageParams } from "@/types/global"[m
 import { http } from "@/utils/http"[m
 export const getDefaultCoupon = () => {[m
[36m@@ -40,10 +40,17 @@[m [mexport const deleteCouponById = (id:string) => {[m
   )[m
 }[m
 [m
[31m-export const queryCouponCodeList = (data:PageParams) => {[m
[32m+[m[32mexport const queryCouponCodeList = () => {[m
   return http<CouponCode[]>({[m
     url:'/coupon/qrCode',[m
     method: 'GET',[m
[31m-    data[m
    })[m
 }[m
[32m+[m
[32m+[m[32mexport const qrCodeVerify = (data:QrCodeVerify) => {[m
[32m+[m[32m  return http({[m
[32m+[m[32m         url: '/coupon/qrCode/verify',[m
[32m+[m[32m         method: 'POST',[m
[32m+[m[32m         data[m
[32m+[m[32m       })[m
[32m+[m[32m}[m
[1mdiff --git a/src/types/coupon.d.ts b/src/types/coupon.d.ts[m
[1mindex 53672ee..d05b826 100644[m
[1m--- a/src/types/coupon.d.ts[m
[1m+++ b/src/types/coupon.d.ts[m
[36m@@ -50,3 +50,7 @@[m [mexport type CouponCode= {[m
   goodsName: string[m
   description:string[m
 }[m
[32m+[m
[32m+[m[32mexport type QrCodeVerify = {[m
[32m+[m[32m  codeNo:string[m
[32m+[m[32m}[m

[33mcommit 7b955177ac0ce45f670790e833f7a2f2b26b016f[m
Author: 123sssdd <https://github.com/123sssdd>
Date:   Mon Feb 26 21:33:16 2024 +0800

    券码

[1mdiff --git a/src/pages/my/my.vue b/src/pages/my/my.vue[m
[1mindex bd942ac..6795246 100644[m
[1m--- a/src/pages/my/my.vue[m
[1m+++ b/src/pages/my/my.vue[m
[36m@@ -52,11 +52,11 @@[m [monMounted(async () => {[m
 // 获取屏幕边界到安全区域距离[m
 const { safeAreaInsets } = uni.getSystemInfoSync()[m
 const orderTypes = [[m
[31m-    { type: '1', text: '待付款', icon: 'icon-currency' },[m
[31m-    { type: '2', text: '待发货', icon: 'icon-gift' },[m
[31m-    { type: '3', text: '待收货', icon: 'icon-check' },[m
[31m-    { type: '4', text: '待评价', icon: 'icon-comment' },[m
[31m-  ][m
[32m+[m[32m  { type: '1', text: '待付款', icon: 'icon-currency' },[m
[32m+[m[32m  { type: '2', text: '待发货', icon: 'icon-gift' },[m
[32m+[m[32m  { type: '3', text: '待收货', icon: 'icon-check' },[m
[32m+[m[32m  { type: '4', text: '待评价', icon: 'icon-comment' },[m
[32m+[m[32m][m
 const memberTypes = [[m
   {[m
     type: '1', text: '会员免运费',[m
[36m@@ -100,11 +100,8 @@[m [mconst memberTypes = [[m
       <!-- 情况2：未登录 -->[m
       <view class="overview" v-else>[m
         <navigator url="/pages/login/login" hover-class="none">[m
[31m-          <image[m
[31m-            class="avatar gray"[m
[31m-            mode="aspectFit"[m
[31m-            src="https://image.familystudy.cn/image/jxfruit/%E6%AD%A3%E5%BC%8Flogo.webp"[m
[31m-          ></image>[m
[32m+[m[32m          <image class="avatar gray" mode="aspectFit"[m
[32m+[m[32m            src="https://image.familystudy.cn/image/jxfruit/%E6%AD%A3%E5%BC%8Flogo.webp"></image>[m
         </navigator>[m
         <view class="meta">[m
           <navigator url="/pages/login/login" hover-class="none" class="nickname">[m
[36m@@ -122,7 +119,7 @@[m [mconst memberTypes = [[m
 [m
     <view class="orders member">[m
       <view class="title" style="padding-left: 20rpx;">[m
[31m-         会员中心[m
[32m+[m[32m        会员中心[m
         <navigator class="navigator" url="/pages/coming-soon/coming-soon" hover-class="none">[m
           全部<text class="icon-right"></text>[m
         </navigator>[m
[36m@@ -132,16 +129,10 @@[m [mconst memberTypes = [[m
       </view>[m
       <view class="section">[m
         <!-- 订单 -->[m
[31m-        <navigator[m
[31m-          v-for="item in memberTypes"[m
[31m-          :key="item.type"[m
[31m-          url="/pages/coming-soon/coming-soon"[m
[31m-          class="navigator"[m
[31m-          hover-class="none"[m
[31m-          style=" padding-bottom: 15rpx;"[m
[31m-        >[m
[31m-        <image :src="item.imgUrl" mode="aspectFit" style="margin-bottom: 10rpx;"></image>[m
[31m-        <view style="">{{ item.text }}</view>[m
[32m+[m[32m        <navigator v-for="item in memberTypes" :key="item.type" url="/pages/coming-soon/coming-soon" class="navigator"[m
[32m+[m[32m          hover-class="none" style=" padding-bottom: 15rpx;">[m
[32m+[m[32m          <image :src="item.imgUrl" mode="aspectFit" style="margin-bottom: 10rpx;"></image>[m
[32m+[m[32m          <view style="">{{ item.text }}</view>[m
         </navigator>[m
         <!-- 客服 -->[m
         <!-- #ifdef MP-WEIXIN -->[m
[36m@@ -154,31 +145,20 @@[m [mconst memberTypes = [[m
     <view class="orders">[m
       <view class="title">[m
         我的订单[m
[31m-        <navigator class="navigator"[m
[31m-          :url="memberStore.profile ? '/pagesOrder/list/list?type=0' : '/pages/login/login'"[m
[31m-          hover-class="none"[m
[31m-        >[m
[32m+[m[32m        <navigator class="navigator" :url="memberStore.profile ? '/pagesOrder/list/list?type=0' : '/pages/login/login'"[m
[32m+[m[32m          hover-class="none">[m
           全部<text class="icon-right"></text>[m
         </navigator>[m
         <navigator class="navigator"[m
[31m- 