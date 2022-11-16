// 某个字段有值时，要控制同行的其他字段必输,
// 控制下拉框互斥-停启国家

<template>
  <div style="width: 100%">
    <el-form :model="cardForm" ref="cardForm" :rules="rules">
      <!-- 注意这边prop写法 -->
      <el-form-item
        v-for="(item, index) in cardForm.CARD_RIGHTS_LIST"
        :label="'卡权益' + (index + 1)"
        :key="index"
        :prop="`CARD_RIGHTS_LIST.${index}.RIGHT_NAME`"
        :rules="[
          {
            required: true,
            message: `请输入信用卡权益${index + 1}`,
            trigger: ['change']
          },
          {
            max: 10,
            message: `信用卡权益${index + 1}长度超出`,
            trigger: ['change']
          }
        ]"
      >
        <!-- <el-form-item
        v-for="(item, index) in cardForm.CARD_RIGHTS_LIST"
        :label="'卡权益' + (index + 1)"
        :key="index"
        :prop="`CARD_RIGHTS_LIST.${index}.RIGHT_NAME`"
        :rules="rules.card"
      > -->
        <el-col :span="12">
          <el-input
            v-model="item.RIGHT_NAME"
            :maxlength="20"
            placeholder="请输入信用卡权益"
            clearable
            show-word-limit
          ></el-input>
        </el-col>
        <el-col :span="2" style="text-align: right;">
          <!-- 删除if控制, 看看对整个array的控制-->
          <el-button
            v-if="cardForm.CARD_RIGHTS_LIST.length > 1"
            icon="el-icon-delete"
            type="danger"
            plain
            @click.prevent="handleRemoveValue(index)"
            >删除</el-button
          >
        </el-col>
      </el-form-item>
      <!-- prop="CARD_RIGHTS_LIST"，这里的prop很重要，change的时候回去触发数组array的change -->
      <el-form-item
        v-if="cardForm.CARD_RIGHTS_LIST.length < max"
        class="last"
        prop="CARD_RIGHTS_LIST"
      >
        <el-button class="et-tag__button--add" @click="handleAddValue">
          添加（最多{{ max }}条）
        </el-button>
      </el-form-item>

      <el-row v-for="(item, index) in cardForm.countryDirection" :key="index">
        <el-col :span="6">
          <el-form-item
            label="启停国家"
            :prop="'countryDirection.' + index + '.countryId'"
            :rules="{
              required: item.startTime || item.endTime,
              message: '请完善启停信息',
              trigger: 'change',
              type: 'array'
            }"
          >
            <el-select
              v-model="item.countryId"
              @change="handleCountryChange($event, index)"
              placeholder="请下拉选择"
              multiple
              filterable
              clearable
            >
              <el-option
                v-for="item in countryArr"
                :value="item.id"
                :key="item.id"
                :disabled="disableOtherCountry(item, index)"
                >{{ item.code }}/{{ item.c_name }}/{{ item.e_name }}</el-option
              >
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="cardForm.countryDirection.length > 1 ? 10 : 11">
          <div class="toggle-time">
            <el-form-item
              label="启停开始时间"
              :prop="'countryDirection.' + index + '.startTime'"
              :rules="{
                required: item.countryId.length > 0 || item.endTime,
                message: '请完善启停信息',
                trigger: 'change'
              }"
            >
              <el-time-picker
                v-model="item.startTime"
                @on-change="updateCountryValidator($event, index)"
                type="time"
                placeholder="可用开始时间"
                transfer
              />
            </el-form-item>
            <span style="margin: 0 6px">-</span>
            <el-form-item
              label="启停结束时间"
              :prop="'countryDirection.' + index + '.endTime'"
              :rules="{
                required: item.countryId.length > 0 || item.startTime,
                message: '请完善启停信息',
                trigger: 'change'
              }"
            >
              <el-time-picker
                v-model="item.endTime"
                @on-change="updateCountryValidator($event, index)"
                type="time"
                placeholder="可用结束时间"
                transfer
              />
            </el-form-item>
          </div>
        </el-col>
        <el-col v-if="cardForm.countryDirection.length > 1" :span="1">
          <el-button
            icon="el-icon-delete"
            type="danger"
            plain
            @click.prevent="removeCountry(index)"
            >删除</el-button
          >
        </el-col>
      </el-row>
      <el-button v-if="!allCountrySelected" @click="addCountry" class="add-btn"
        >增加</el-button
      >
    </el-form>
    <el-button class="et-button" type="primary" @click="submitForm(form)"
      >确认</el-button
    >

    <div style="border: 1px solid black; margin: 20px 0"></div>

    <!--
    <div class="add-btn">
      <el-button icon="el-icon-plus" size="mini" @click="addBuyer"></el-button>
    </div>
    <div
      class="relative"
      v-for="(item, index) in info.buyerEntityList"
      :key="index"
    >
      <h3>{{ '买方信息' + (index + 1) }}</h3>
      <div class="reduce-btn" v-if="index !== 0">
        <el-button
          icon="el-icon-minus"
          size="mini"
          @click="delBuyer(index)"
        ></el-button>
      </div>
      <el-row :gutter="20">
        <el-form
          ref="buyerForm"
          :model="info.buyerEntityList[index]"
          :rules="rules"
          label-width="180px"
        >
          <el-col :span="12">
            <el-form-item label="注册地址：" prop="registerAddr">
              <el-input v-model="item.registerAddr"></el-input>
            </el-form-item>
            <el-form-item label="联系人：" prop="linkman">
              <el-input v-model="item.linkman"></el-input>
            </el-form-item>
            <el-form-item label="电子邮件：" prop="email">
              <el-input v-model="item.email"></el-input>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
    </div> -->
  </div>
</template>

<script>
import { MockCountryListRes } from './mockData'
import * as _ from 'lodash'

const getCountryList = () => {
  return new Promise(resolve => {
    resolve(MockCountryListRes)
  })
}
export default {
  components: 'ArrayFormA',
  data() {
    const validCardList = (rule, value, callback) => {
      if (value.length < 1) {
        callback(new Error('至少一张张卡'))
      } else {
        callback()
      }
    }
    const validCard = (rule, value, callback) => {
      console.log(rule)
      if (value === '' || value === null) {
        callback(new Error('请输入信用卡权益'))
      } else {
        if (value.length > 10) {
          callback(new Error('信用卡权益长度不超过10'))
        }
        callback()
      }
    }
    return {
      countryArr: [],
      cardForm: {
        CARD_RIGHTS_LIST: [{ ID: '', RIGHT_NAME: '' }],
        countryDirection: [] // 某个字段有值时，要控制同行的其他字段必输, 控制下拉框互斥
      },
      rules: {
        // 校验整个数组的
        CARD_RIGHTS_LIST: { validator: validCardList, trigger: 'change' },
        // 如果是单独写在from-item，这边就不用写了，如果校验内容较多建议直接写下面，比较清晰
        card: { validator: validCard, trigger: 'change' } // 写法1，自定义校验器
        // card2: [
        //   {
        //     required: true,
        //     message: '请输入信用卡权益',
        //     trigger: ['change']
        //   },
        //   {
        //     max: 10,
        //     message: '信用卡权益长度超出',
        //     trigger: ['change']
        //   }
        // ] // 写法2，自带的
      },
      max: 5
    }
  },
  computed: {
    allCountrySelected() {
      return _.find(this.cardForm.countryDirection, function(item) {
        return (item.countryId || []).includes(0)
      })
    }
  },
  mounted() {
    this.addCountry()
    this.loadCountryList()
  },
  methods: {
    //添加form-item
    handleAddValue() {
      this.cardForm.CARD_RIGHTS_LIST.push({ ID: '', RIGHT_NAME: '' })
    },
    //删除form-item
    handleRemoveValue(index) {
      this.cardForm.CARD_RIGHTS_LIST.splice(index, 1)
    },
    //提交form并且验证
    submitForm() {
      this.$refs.cardForm.validate(valid => {
        if (valid) {
          this.$message.info('操作成功')
          //此处加入自己需求
        } else {
          //此处加入自己需求
          this.$message.info('请完善信息')
          return
        }
      })
    },
    handleCountryChange(val, index) {
      if ((val || []).includes(0)) {
        this.cardForm.countryDirection[index].countryId = [0]
      }
      this.updateCountryValidator(val, index)
    },
    updateCountryValidator(val, index) {
      if (!val || (Array.isArray(val) && !val.length)) {
        this.$nextTick(() => {
          this.$refs.cardForm.validateField(
            'countryDirection.' + index + '.countryId'
          )
          this.$refs.cardForm.validateField(
            'countryDirection.' + index + '.startTime'
          )
          this.$refs.cardForm.validateField(
            'countryDirection.' + index + '.endTime'
          )
        })
      }
    },
    addCountry() {
      this.cardForm.countryDirection.push({
        countryId: [],
        startTime: '',
        endTime: ''
      })
    },
    removeCountry(index) {
      this.cardForm.countryDirection.splice(index, 1)
    },
    async loadCountryList() {
      const { code, row = [] } = await getCountryList({})
      if (code !== 0) {
        this.$message.error(code)
      }
      this.countryArr = row
      let allCountry = {
        id: 0,
        s_name: 'ALL',
        code: '0',
        e_name: 'ALL',
        c_name: '所有'
      }
      this.countryArr.unshift(allCountry)
    },
    disableOtherCountry(item, index) {
      const selected = this.cardForm.countryDirection[index].countryId || []
      if (this.allCountrySelected) {
        return selected.length > 0 && !selected.includes(item.id)
      }
      const disableCountries = this.selectedCountry(index)
      disableCountries.length > 0 && disableCountries.push(0)
      return disableCountries.includes(item.id)
    },
    selectedCountry(exclude) {
      return this.cardForm.countryDirection.reduce((calc, cur, index) => {
        if (exclude !== index) {
          return [...calc, ...cur.countryId]
        }
        return calc
      }, [])
    },
    resolveCountryDirection() {
      const configs = []
      this.cardForm.countryDirection.forEach(item =>
        configs.push({
          countryId: (item.countryId || []).join(','),
          startTime: item.startTime,
          endTime: item.endTime
        })
      )
      return configs
    }
  }
}
</script>

<style scoped>
.toggle-time {
  display: flex;
}
.country-delete-icon {
  position: relative;
  margin-left: 8px;
  top: 5px;
  cursor: pointer;
}
.add-btn {
  display: block;
  margin-bottom: 20px;
}
</style>
