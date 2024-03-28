<script setup lang="ts">

import { onMounted, ref, Vue } from 'vue'
import { onLoad, onReady } from '@dcloudio/uni-app'
import { addComment } from '@/services/comment'
import type { CommentParams } from '@/types/comment'

onLoad(() => {
    maxLength.value = 4
})

const emit = defineEmits<{
  (event: 'close'): void
}>()

const commentQuery = ref<CommentParams> ({
        content: '',
        score: 5,
        goodsId: 1
    })

const maxLength = ref<number>(4)

const addCommentData = async () => {
    const res = await addComment({
        content: commentQuery.value?.content,
        goodsId: uni.getStorageSync("goodsId"),
        skuId: uni.getStorageSync("skuId"),
    }, uni.getStorageSync("orderId"))
    const commentId = res.data.commentId
    tempFilePaths.value.forEach(item => {
        uploadFile(item, commentId)
    })
    if (res.code === 200) {
        uni.showToast({
            title: '评价成功'
        })
        emit('close')
    }
}
const tempFilePaths = ref<string[]>([])

const addImage = () => {
    uni.chooseImage({
        count: 1, //count: 6, //默认9
		sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
		sourceType: ['album'], //从相册选择
		success: function(res) {
            console.log(res.tempFilePaths)
            tempFilePaths.value?.push(...res.tempFilePaths)
            console.log(tempFilePaths.value)
        }
    })
}

const uploadFile = (file: string, commentId: number) => {
  // 文件上传
  uni.uploadFile({
    url: `/comment/image/upload/${commentId}`,
    name: 'image',
    filePath: file,
    // header: {
    //   token: memberStore.profile?.token
    // },
    success: (res) => {
      if (res.statusCode === 200) {
        console.log("res", res);
        // uni.showToast({ icon: 'success', title: '更新成功' })
      } else {
        uni.showToast({ icon: 'error', title: '出现错误' })
      }
    },
  })
}

const removeImage = (index) => {
    console.log(index)
    console.log( tempFilePaths.value)
    tempFilePaths.value?.slice(index, 1)
}
</script>

<template>
    <view class="comment-box">
        <text class="close icon-close" @tap="emit('close')"></text>   
        <view class="add" @click="addImage" v-if="tempFilePaths.length === 0">
            <image src="https://image.familystudy.cn/image/jxfruit/相机.webp" mode="widthFix"
                style="width: 80rpx"
            ></image>
            <view class="add-image" >添加图片</view>
            
        </view>
        <view v-else class="show" > 
            <view class="item" v-for="(image, index) in tempFilePaths" :key="index">
                <text class="close icon-close" @tap="removeImage(index)"></text>   
                <image :src="image" class="image">
                </image>
            </view>
            <view class="tip" @click="addImage" v-if="maxLength - tempFilePaths.length >0">
                <image src="https://image.familystudy.cn/image/jxfruit/相机.webp" 
                mode="widthFix"
                style="width: 70rpx"
                ></image>
                <view 
                 style="text-align: center;font-size: 25rpx;font-weight: bold;">
                    可再加 {{ maxLength - tempFilePaths.length}} 张
                </view>
            </view>
        </view>
        <view class="content">
            <textarea style="height: 550rpx;padding: 50rpx;box-sizing: border-box;" 
            placeholder="展开说说你对商品的想法吧" name="" id="" cols="30" rows="10"
            v-model="commentQuery.content"
           >
            </textarea>
            <checkbox-group>
                <checkbox>匿名</checkbox>
            </checkbox-group>
            <button class="submit-btn" @click="addCommentData">发布</button>
        </view>
    </view>
</template>

<style scoped lang="scss">
    .add {
        background-color: white;
        height: 300rpx;
        width: 700rpx;
        border-radius: 30rpx;
        margin: auto auto;
        padding-top: 90rpx;
        text-align: center;
        // line-height: 300rpx;
       
        .add-image {
            text-align: center;
            // line-height: 300rpx;
            
        }
    }
    .content {
        margin-top: 20rpx;
        background-color: white;
        border-radius: 30rpx;
        // padding: 30rpx;
        padding: 0 30rpx 200rpx 30rpx;
    }

    .comment-box {
        width: 750rpx;
        background-color: aliceblue;
        z-index: 10;
        height: 100%;
        padding-top: 80rpx;
    }

    .submit-btn {
        width: 230rpx;
        height: 120rpx;
        text-align: center;
        line-height: 120rpx;
        border-radius: 60rpx;
        color: white;
        background-color: orange;
    }

    .close {
        margin-left: 20rpx;
        z-index: 10;
    }

    .show {
        width: 710rpx;
        flex-wrap: wrap;
        display: flex;
        padding: 20rpx;
        gap: 20rpx;
        .item {
            position: relative;
            .close {
                position: absolute;
                right: -5rpx;
                top: -5rpx;
                background: darkgray;
                border-radius: 50%;
                color: white;
            }
            .image {
            height: 150rpx;
            width: 150rpx; 
            border-radius: 25rpx;
        }
        }
       
        .tip {
            height: 150rpx;
            width: 150rpx; 
            border-radius: 25rpx;
            background: white;
            text-align: center;
            padding-top: 20rpx;
        }
    }
</style>