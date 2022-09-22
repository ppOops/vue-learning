<template>
  <div style="width: 100%">
    <div class="add-btn">
      <el-button icon="el-icon-plus" size="mini" @click="addBuyer"></el-button>
    </div>
    <div
      class="relative"
      v-for="(item, index) in ruleForm.buyerEntityList"
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
      <!-- :ref="`buyerForm${index}`" 写法二还没研究透https://blog.csdn.net/qq_39576711/article/details/123848927-->
      <el-row :gutter="20">
        <el-form
          ref="ruleForm"
          :model="item"
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
    </div>
    <el-button class="et-button" type="primary" @click="submitForm()"
      >确认</el-button
    >
  </div>
</template>

<script>
//只有form表单是对象表单，其他都是数组表单
const formName = [
  // 'form',
  // 'orderForm',
  // 'buyerForm',
  // 'riskForm',
  // 'supplierForm',
  // 'basicsForm',
  'ruleForm'
]
// const validates = item => {
//   return new Promise((resolve, reject) => {
//     console.log(item, '??1', this.$refs[item])
//     if (item != 'form') {
//       for (let i = 0; i < this.$refs[item].length; i++) {
//         this.$refs[item][i].validate(valid => {
//           if (!valid) {
//             reject(new Error('验证不对'))
//           }
//         })
//       }
//       resolve()
//     } else {
//       this.$refs[item].validate(valid => {
//         if (valid) {
//           resolve()
//         } else {
//           reject(new Error('验证不对'))
//         }
//       })
//     }
//   })
// }
export default {
  components: 'ArrayFormB',
  data() {
    return {
      ruleForm: {
        buyerEntityList: [{ registerAddr: '', linkman: '', email: '' }]
      },
      rules: {
        registerAddr: [
          {
            required: true,
            message: '请输入信用卡权益',
            trigger: ['change', 'blur']
          }
        ]
      }
    }
  },
  methods: {
    validates(item) {
      return new Promise((resolve, reject) => {
        if (item != 'form') {
          for (let i = 0; i < this.$refs[item].length; i++) {
            this.$refs[item][i].validate(valid => {
              if (!valid) {
                reject(new Error('验证不对'))
              }
            })
          }
          resolve()
        } else {
          this.$refs[item].validate(valid => {
            if (valid) {
              resolve()
            } else {
              reject(new Error('验证不对'))
            }
          })
        }
      })
    },
    //添加form-item
    addBuyer() {
      this.ruleForm.buyerEntityList.push({
        registerAddr: '',
        linkman: '',
        email: ''
      })
    },
    //删除form-item
    delBuyer(index) {
      this.ruleForm.buyerEntityList.splice(index, 1)
    },
    //提交form并且验证
    submitForm() {
      Promise.all(formName.map(item => this.validates(item)))
        .then(() => {
          this.$confirm('是否确认提交此申请？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              //校验成功以后需要的操作
              this.$message({
                type: 'info',
                message: '已提交'
              })
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: '已取消确认'
              })
            })
        })
        .catch(() => {
          //校验失败时抛出的信息
          // this.msgError('请正确填写信息')
          this.$message.info('请完善信息')
        })
    }
  }
}
// https://blog.csdn.net/qq_39576711/article/details/123848927
// confirm() {
//     Promise.all([
//       this.validateForm("refForm"),
//       ...this.formData.ruleList.map((item, index) =>
//         this.validateForm(`refForm${index}`)
//       ),
//     ]).then((res) => {
//       if (res) {
//         // 表单验证通过
//       }
//     });
//   },
//   validateForm(refs) {
//     let valiForm = this.$refs?.[refs].validate
//       ? this.$refs?.[refs]
//       : this.$refs?.[refs][0];
//     return new Promise((resolve, reject) => {
//       valiForm.validate((res) => {
//         if (res) resolve();
//         else reject();
//       });
//     });
//   },
</script>
