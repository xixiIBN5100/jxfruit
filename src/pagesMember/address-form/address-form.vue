<script setup lang="ts">
import {
  getAddressById,
  postAddress,
  updateAddressById,
} from '@/services/address'
import { onLoad } from '@dcloudio/uni-app'
import { validateHeaderName } from 'http'
import { fileURLToPath } from 'url'
import { ref } from 'vue'

// 表单数据
const form = ref({
  receiverName: '', // 收货人
  receiverPhone: '', // 联系方式
  campus: '', // 省市区(前端展示)
  roomAddress: '', // 详细地址
  isDefault: 1, // 默认地址，1为是，0为否
})

// 获取页面参数
const query = defineProps<{
  id?: string
}>()

// 获取收货地址详情数据
const getMemberAddressByIdData = async () => {
  if (query.id) {
    // 发送请求
    const res = await getAddressById(query.id)
    // 把数据合并到表单中
    Object.assign(form.value, res.data)
  }
}

// 页面加载
onLoad(() => {
  getMemberAddressByIdData()
})

// 动态设置标题
uni.setNavigationBarTitle({ title: query.id ? '修改地址' : '新建地址' })

// // 收集所在地区
// const onRegionChange: UniHelper.RegionPickerOnChange = (ev) => {
//   // 省市区(前端展示)
//   form.value.fullLocation = ev.detail.value.join(' ')
//   // 省市区(后端参数)
//   const [provinceCode, cityCode, countyCode] = ev.detail.code!
//   // form.value.provinceCode = provinceCode
//   Object.assign(form.value, { provinceCode, cityCode, countyCode })
// }

// 收集是否默认收货地址
const onSwitchChange: UniHelper.SwitchOnChange = (ev) => {
  form.value.isDefault = ev.detail.value ? 1 : 0
}

// 定义校验规则
const rules: UniHelper.UniFormsRules = {
  receiverName: {
    rules: [{ required: true, errorMessage: '请输入收货人姓名' }],
  },
  receiverPhone: {
    rules: [
      { required: true, errorMessage: '请输入联系方式' },
      { pattern: /^1[3-9]\d{9}$/, errorMessage: '手机号格式不正确' },
    ],
  },
  campus: {
    rules: [{ required: true, errorMessage: '请选择所在校区' }],
  },
  roomAddress: {
    rules: [{ required: true, errorMessage: '请选择寝室楼' }],
  },
}

const campusList = [
  '朝晖校区', '屏峰校区', '莫干山校区'
]

const roomAddressList = [
  {
    campus: '朝晖校区',
    item: [
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
      '梦7'
    ]
  },
  {
    campus: '屏峰校区',
    item: [
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
      '西15'
    ]
  },
  {
    campus: '莫干山校区',
    item: [
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
      '德10'
    ]
  }
]

var choosedCampusIndex = 0

const onCampusChange = (e: any) => {
  console.log(e)
  const index = e.target.value
  choosedCampusIndex = index
  form.value.campus = campusList[index]
}

const onRoomAddressChange = (e: any) => {
  const index = e.target.value
  console.log(index)
  // choosedCampusIndex = index
  form.value.roomAddress = roomAddressList[choosedCampusIndex].item[index]
}
// 表单组件实例
const formRef = ref<UniHelper.UniFormsInstance>()


// 提交表单
const onSubmit = async () => {
  try {
    if (form.value.receiverName == '' ||
      form.value.receiverPhone == '' ||
      form.value.campus == '' ||
      form.value.roomAddress == '') {
      return uni.showToast({
        title: '请填写完整信息',
        icon: 'error'
      })
    }
    var reg = /^1[3-9]\d{9}$/;
    if (!reg.test(form.value.receiverPhone)) {
      return uni.showToast({
        title: '请填写正确的手机号',
        icon: 'error'
      })
    }
    // 校验通过后再发送请求
    console.log(query)
    if (query.id) {
      // 修改地址请求
      console.log(form.value)

      await updateAddressById(form.value)
    } else {
      // 新建地址请求
      await postAddress(form.value)
    }
    // 成功提示
    uni.showToast({ icon: 'success', title: query.id ? '修改成功' : '添加成功' })
    // 返回上一页
    setTimeout(() => {
      uni.navigateBack()
    }, 400)
  } catch (error) {
    uni.showToast({ icon: 'error', title: '请填写完整信息' })
  }
}

// #ifdef H5 || APP-PLUS
const onCityChange: UniHelper.UniDataPickerOnChange = (ev) => {
  // 省市区
  const [province, city, county] = ev.detail.value
  // 收集后端所需的 code 数据
  Object.assign(form.value, {
    provinceCode: province.value,
    cityCode: city.value,
    countyCode: county.value,
  })
}
// #endif
</script>

<template>
  <view class="content">
    <uni-forms :rules="rules" :model="form" ref="formRef">
      <!-- 表单内容 -->
      <uni-forms-item name="receiver" class="form-item">
        <text class="label">收货人</text>
        <input class="input" placeholder="请填写收货人姓名" v-model="form.receiverName" />
      </uni-forms-item>
      <uni-forms-item name="contact" class="form-item">
        <text class="label">手机号码</text>
        <input
          class="input"
          placeholder="请填写收货人手机号码"
          :maxlength="11"
          v-model="form.receiverPhone"
        />
      </uni-forms-item>
      <uni-forms-item name="countyCode" class="form-item">
        <text class="label">校区</text>
        <!-- #ifdef MP-WEIXIN -->
        <picker
          @change="onCampusChange"
          class="picker"
          :range="campusList"
        >
          <view v-if="form.campus">{{ form.campus }}</view>
          <view v-else class="placeholder">请选择校区</view>
        </picker>
        <!-- #endif -->

        <!-- #ifdef H5 || APP-PLUS -->
        <!-- <uni-data-picker
          placeholder="请选择地址"
          popup-title="请选择城市"
          field="code as value, name as text"
          orderby="value asc"
          :step-searh="true"
          self-field="code"
          parent-field="parent_code"
          :local-data="dataTree"
          @change="onCityChange"
          :clear-icon="false"
          v-model="form.countyCode"
        /> -->
        <!-- #endif -->
      </uni-forms-item>
      <uni-forms-item name="address" class="form-item">
        <text class="label">详细地址</text>
        
        <picker
          @change="onRoomAddressChange"
          class="picker"
        
          :range="roomAddressList[choosedCampusIndex].item"
        >
          <view v-if="form.roomAddress">{{ form.roomAddress }}</view>
          <view v-else class="placeholder">请选择寝室楼</view>
        </picker>
      </uni-forms-item>
      <view class="form-item">
        <label class="label">设为默认地址</label>
        <switch
          @change="onSwitchChange"
          class="switch"
          color="rgb(255,234,189)"
          :checked="form.isDefault === 1"
        />
      </view>
    </uni-forms>
  </view>
  <!-- 提交按钮 -->
  <button @tap="onSubmit" class="button">保存并使用</button>
</template>

<style lang="scss">
// 深度选择器修改 uni-data-picker 组件样式
:deep(.selected-area) {
  flex: 0 1 auto;
  height: auto;
}

page {
  background-image: linear-gradient(rgb(255,255,246),rgb(255, 255, 236));
}

.content {
  margin: 20rpx 20rpx 0;
  padding: 0 20rpx;
  border-radius: 10rpx;
  background-color: #fff;

  .form-item,
  .uni-forms-item {
    display: flex;
    align-items: center;
    min-height: 96rpx;
    padding: 25rpx 10rpx;
    background-color: #fff;
    font-size: 28rpx;
    border-bottom: 1rpx solid #ddd;
    position: relative;
    margin-bottom: 0;

    // 调整 uni-forms 样式
    .uni-forms-item__content {
      display: flex;
    }

    .uni-forms-item__error {
      margin-left: 200rpx;
    }

    &:last-child {
      border: none;
    }

    .label {
      width: 200rpx;
      color: #333;
    }

    .input {
      flex: 1;
      display: block;
      height: 46rpx;
    }

    .switch {
      position: absolute;
      right: -20rpx;
      transform: scale(0.8);
    }

    .picker {
      flex: 1;
    }

    .placeholder {
      color: #808080;
    }
  }
}

.button {
  height: 80rpx;
  margin: 30rpx 20rpx;
  color: black;
  border-radius: 80rpx;
  font-size: 30rpx;
  background-color: rgb(255,234,189);
}
</style>
