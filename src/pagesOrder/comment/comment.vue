<script setup lang="ts">
    import { getSelfComments, getCommentsByGoodsId, addComment } from '@/services/comment'
    import type { CommentItem } from '@/types/comment';

    import { onLoad, onReady } from '@dcloudio/uni-app'
    import { ref } from 'vue'

    const query = defineProps<{
        goodsId: number
    }>()

    const pageQuery = {
        pageSize: 10,
        pageNum: 1
    }

    const commentList = ref<CommentItem[]>()

    const getCommentDataByGoodsId = async () => {
        const res = await getCommentsByGoodsId(pageQuery, query.goodsId)
        console.log(res)
        commentList.value = res.data.records
    }
    
    const previewImage = (images: string[], index: number) => {
        uni.previewImage({
            current: index,
	        urls: images
        })
    }  

    onLoad(() => {
        console.log("sb")
        getCommentDataByGoodsId()
    })
</script>

<template>
    <view class="comment-page">
        <view>
            <template v-for="item in commentList" :key="item.id">
                <view class="comment-item">
                    <view class="title">
                        <image class="avatar" :src="item.avatarUrl"></image>
                        <view class="nickname">{{ item.publisher }}</view>
                    </view>
                    <view class="comment">  
                        <view class="time">{{ item.publishTime }}</view>
                        <view class="content">{{ item.content }}</view>
                        <view class="image">
                        <template v-for="(image,index) in item.images" :key="index">
                            <image :src="image" class="comment-image" @click="previewImage(item.images, index)"></image>
                        </template>                        
                    </view>
                    </view>                   
                </view>
            </template>
        </view>
    </view>
</template>

<style scoped lang="scss">
    .comment-page {
        background-color: rgb(237, 237, 237);
        height: 1200rpx;
    }
    .comment-item {
        padding: 20rpx;
        background-color: rgb(237, 237, 237);
        box-sizing: border-box;
        .title {
            display: flex;
            justify-items: center;
        }
        .nickname {
            font-size: 30rpx;
            line-height: 80rpx;
            margin-left: 30rpx;
            font-weight: 700;
        }
        .avatar {
            width: 80rpx;
            height: 80rpx;
            border-radius: 50%;
        }
        .comment {
            background-color: white;
            width: 650rpx;
            border-radius: 15rpx;
            margin: 15rpx auto;
            padding: 20rpx;
            box-sizing: border-box;
            font-size: 30rpx;
            .time {
                font-size: 25rpx;
            }
            .content {
                margin-top: 10rpx;
            }
            .image {
                margin-top: 30rpx;
                .comment-image {
                    width: 300rpx;
                    height: 300rpx;
                    border-radius: 20rpx;
                }
            }
        }        
    }
</style>