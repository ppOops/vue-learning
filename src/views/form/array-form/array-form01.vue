<template>
  <div style="width: 100%">
    <el-form
      :model="cardForm"
      ref="cardForm"
      :rules="rules"
      label-position="top"
    >
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
        <el-col :span="20">
          <el-input
            v-model="item.RIGHT_NAME"
            :maxlength="20"
            placeholder="请输入信用卡权益"
            clearable
            show-word-limit
          ></el-input>
        </el-col>
        <el-col :span="4" style="text-align: right;">
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
        <button class="et-tag__button--add" @click="handleAddValue">
          添加（最多{{ max }}条）
        </button>
      </el-form-item>
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
export default {
  components: 'ArrayFormA',
  data() {
    const validCardList = (rule, value, callback) => {
      console.log('校验数组')
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
      cardForm: {
        CARD_RIGHTS_LIST: [{ ID: '', RIGHT_NAME: '' }]
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
    }
  }
}
</script>
