<!-- eslint-disable prettier/prettier -->
<template>
  <div>
    <el-card>
      <div>暂存</div>
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="类型" prop="activityType">
          <el-select v-model="ruleForm.activityType" placeholder="请选择类型">
            <el-option label="短信" value="1"></el-option>
            <el-option label="邮件" value="2"></el-option>
            <el-option label="App Push" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="活动名称" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="活动时间" required>
          <el-col :span="11">
            <el-form-item prop="date1">
              <el-date-picker
                type="date"
                placeholder="选择日期"
                v-model="ruleForm.date1"
                style="width: 100%;"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="11">
            <el-form-item prop="date2">
              <el-time-picker
                placeholder="选择时间"
                v-model="ruleForm.date2"
                style="width: 100%;"
              ></el-time-picker>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="即时配送" prop="delivery">
          <el-switch v-model="ruleForm.delivery"></el-switch>
        </el-form-item>
        <el-form-item label="活动性质" prop="type">
          <el-checkbox-group v-model="ruleForm.type">
            <el-checkbox label="美食/餐厅线上活动" name="type"></el-checkbox>
            <el-checkbox label="地推活动" name="type"></el-checkbox>
            <el-checkbox label="线下主题活动" name="type"></el-checkbox>
            <el-checkbox label="单纯品牌曝光" name="type"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <message ref="message" v-if="ruleForm.activityType === '1'" />
        <mail ref="mail" v-if="ruleForm.activityType === '2'" />
        <app-push
          :activityType="ruleForm.activityType"
          ref="apppush"
          v-if="ruleForm.activityType === '3'"
        />
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')"
            >立即创建</el-button
          >
          <el-button @click="resetForm('ruleForm')">重置</el-button>
          <el-button @click="saveDraft('ruleForm')">暂存</el-button>
          <el-button @click="detailVisible = true" type="primary">Popup</el-button>
          <el-button @click="toErrorField('ruleForm')" type="primary">scrollToError</el-button>
        </el-form-item>
      </el-form>
      <detail-dialog v-model="detailVisible"></detail-dialog>
    </el-card>
  </div>
</template>

<script>
import AppPush from './app-push.vue'
import Message from './message.vue'
import Mail from './mail.vue'
import DetailDialog from './detail-dialog.vue'
import formHelper from '@/mixins/formHelper'

export default {
  mixins: [formHelper],
  components: {
    AppPush,
    Mail,
    Message,
    DetailDialog
  },
  data() {
    // const stashStr = localStorage.getItem('stash')
    // const stash = stashStr ? JSON.parse(stashStr) : {}
    return {
      //   ruleForm: Object.assign(
      //     {
      //       name: '',
      //       activityType: '1',
      //       date1: '',
      //       date2: '',
      //       delivery: false,
      //       type: [],
      //     },
      //     stash
      //   ),
      detailVisible: false,
      ruleForm: {
        name: '',
        activityType: '1',
        date1: '',
        date2: '',
        delivery: false,
        type: []
      },
      rules: {
        name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        activityType: [
          { required: true, message: '请选择活动方式', trigger: 'change' }
        ],
        date1: [
          {
            type: 'date',
            required: true,
            message: '请选择日期',
            trigger: 'change'
          }
        ],
        date2: [
          {
            type: 'date',
            required: true,
            message: '请选择时间',
            trigger: 'change'
          }
        ],
        type: [
          {
            type: 'array',
            required: true,
            message: '请至少选择一个活动性质',
            trigger: 'change'
          }
        ],
        resource: [
          { required: true, message: '请选择活动资源', trigger: 'change' }
        ]
      },
      typeMap: {
        1: 'message',
        2: 'mail',
        3: 'apppush'
      },
      // 模拟的不同类型表单的提交
      fakeSubmit: {
        1: data => this.$alert(`短信模板创建成功${JSON.stringify(data)}`),
        2: data => this.$alert(`邮件模板创建成功${JSON.stringify(data)}`),
        3: data => this.$alert(`push模板创建成功${JSON.stringify(data)}`)
      }
    }
  },
  mounted() {
    this.open()
  },
  methods: {
    open() {
      const stashStr = localStorage.getItem('stash')
      if (!stashStr) return
      console.log('open')
      this.$confirm('检测到未保存数据', '是否恢复上次数据', {
        confirmButtonText: '是',
        cancelButtonText: '否'
      })
        .then(() => {
          const stash = stashStr ? JSON.parse(stashStr) : {}
          this.ruleForm = Object.assign(this.ruleForm, stash)
        })
        .catch(() => {
          console.log('取消')
          localStorage.removeItem('stash')
        })
    },
    saveDraft() {
      console.log('data:', this.$data.ruleForm)
      localStorage.setItem('stash', JSON.stringify(this.$data.ruleForm))
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    submitForm(formName) {
      const activityType = this.typeMap[this.ruleForm.activityType]
      const validate1 = this.$refs[formName].validate()
      const validate2 = this.$refs[activityType].validateForm()

      Promise.all([validate1, validate2])
        .then(() => {
          // 都通过时，发送请求
          const reqData = {
            ...this.$refs[activityType].getData(),
            ...this.ruleForm
          }
          this.fakeSubmit[this.ruleForm.activityType](reqData)
        })
        .catch(err => {
          console.log(err)
        })
      // this.$refs[formName].validate(valid => {
      //   if (valid) {
      //     alert('submit!')
      //   } else {
      //     console.log('error submit!!')
      //     return false
      //   }
      // })
    },
    toErrorField(formName) {
      this.$refs[formName].validate((valid, message) => {
        // 第二个参数就是校验信息，会包括所有你的表单这次不通过校验的字段和提示文字
        // console.log(message)
        if (valid) {
          // 如果校验通过则提交
          alert('submit!')
        } else {
          // 校验不通过
          // 取第一个不通过的信息对象提示即可
          // this.$message.error(message[Object.keys(message)[0]][0].message)
          this.$nextTick(() => {
            // const el = document.querySelectorAll('.el-form-item__error')[0]
            // el.scrollIntoView({ block: 'center', behavior: 'smooth' })
            this.scrollToError()
          })
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.demo-ruleForm {
  width: 600px;
}
</style>
