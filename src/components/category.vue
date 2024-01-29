<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { computed, ref } from 'vue'
// import PageSkeleton from './components/PageSkeleton.vue'

</script>

<template>
  <view class="viewport" v-if="isFinish">
    <!-- 搜索框 -->
    <view class="search">
      <view class="input">
        <text class="icon-search">女靴</text>
      </view>
    </view>
    <!-- 分类 -->
    <view class="categories">
      <!-- 左侧：一级分类 -->
      <scroll-view class="primary" scroll-y>
        <view
          v-for="(item, index) in categoryList"
          :key="index"
          class="item"
          :class="{ active: index === activeIndex }"
          @tap="activeIndex = index"
        >
          <text class="name">
            {{ item.category }}
          </text>
        </view>
      </scroll-view>
      <!-- 右侧：二级分类 -->
      <scroll-view enable-back-to-top class="secondary" scroll-y>
        <!-- 焦点图 -->
        <!-- <XtxSwiper class="banner" :list="bannerList" /> -->
        <!-- 内容区域 -->
        <view class="panel" v-for="item in subCategoryList" :key="item.id">
          <view class="title">
            <text class="name">{{ item.goodsName }}</text>
            <navigator class="more" hover-class="none">全部</navigator>
          </view>
          <view class="section">
            <!-- <navigator
              v-for="goods in item.goods"
              :key="goods.id"
              class="goods"
              hover-class="none"
              :url="`/pages/goods/goods?id=${goods.id}`"
            > -->
              <image class="image" :src="item.imgUrl"></image>
              <view class="name ellipsis">{{ item.goodsName }}</view>
              <view class="price">
                <text class="symbol">¥</text>
                <text class="number">{{ item.price }}</text>
              </view>
            <!-- </navigator> -->
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
  <!-- <PageSkeleton v-else /> -->
</template>

<style lang="scss">
  @import '.././styles/category.scss';
</style>
