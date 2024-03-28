<template>
    <view class="viewport">
      <CustomNavbar></CustomNavbar>
      <view class="scroll-view">
          <HotPanel :list="hotList"></HotPanel>
      </view>
      
    </view>
  </template>
  
  <script lang="ts">
  import CustomNavbar from './components/CustomNavbar.vue'
  import HotPanel from './components/HotPanel.vue'
  import type { LoginResult } from '@/types/user'
  import { loginByWechat } from '@/services/login'
  import { useMemberStore } from '@/stores'
  
  export default {
    data() {
      return {
        baseUrl: 'https://image.familystudy.cn/image/jxfruit/'
      }
    },
  
    components:{
      CustomNavbar,    
      HotPanel
    },
  
    methods:{
      loginSuccess(result: LoginResult) {
        // 保存会员信息
        var { userInfo } = result
        var { nickName, gender, grade, username, campus, avatarUrl } = userInfo
        const profile = { nickName, gender, grade, username, campus, avatarUrl, token: result.token }
        console.log(profile)
        const memberStore = useMemberStore()
        memberStore.setProfile(profile)
        // 成功提示
        uni.showToast({ icon: 'success', title: '登录成功' })    
      },
  
      onGetphonenumber() {
        let this_ = this
        uni.login({
            success: async function (res) {
              console.log(res.code)
              const response = await loginByWechat(
                {
                  code: res.code
                }
              )
              if (response.code === 200){
                console.log(response, "responst") 
                uni.setStorageSync("openId", response.data.openId)
                console.log("openId", response.data.openId)           
                this_.loginSuccess(response.data)
              }
            }
        })  
      }
    },
  
    onLoad() {
      this.onGetphonenumber()
    },     
  }
  </script>
  
  <style lang="scss">
    page {
      background-color: #f7f7f7;
      height: 100%;
      overflow: hidden;
      background-image: linear-gradient( rgb(252, 255, 249), #8A9E70);
    }
    

    .viewport {
      height: 100%;
      display: flex;
      flex-direction: column;
    }
  
    .scroll-view {
      margin-top: 20rpx;
      flex: 1;
      overflow: hidden;
    }
  </style>