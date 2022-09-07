<template>
  <div>
    <h1>可编辑行表格说明：</h1>
    <ul>
      <li>通过代码控制每次只能编辑一行，避免性能问题</li>
      <li>姓名：无验证规则</li>
      <li>账号：必填且异步验证</li>
      <li>邮箱：必填且必须时邮箱</li>
      <li>确认邮箱：必填且必须时邮箱且两次邮箱必须输入的一样</li>
      <li>其他：必填且户口类型必须为农村父亲姓名必须为张三</li>
    </ul>
    <el-form ref="validateForm" :inline="true" :model="editableTableData">
      <el-table :data="editableTableData.tableData" style="width: 100%">
        <el-table-column prop="name" label="姓名" width="180">
          <template slot-scope="scope">
            <el-form-item
              v-if="editRow && idEditThisRow(scope.row)"
              label=" "
              :prop="`tableData[${scope.$index}].name`"
              :rules="buildRowCellRule(scope.row, 'name')"
            >
              <el-input v-model="scope.row.name"></el-input>
            </el-form-item>
            <template v-else>{{ scope.row.name }}</template>
          </template>
        </el-table-column>
        <el-table-column prop="account" label="账号" width="180">
          <template slot-scope="scope">
            <el-form-item
              v-if="editRow && idEditThisRow(scope.row)"
              label=" "
              :prop="`tableData[${scope.$index}].account`"
              :rules="buildRowCellRule(scope.row, 'account')"
            >
              <el-input v-model="scope.row.account"></el-input>
            </el-form-item>
            <template v-else>{{ scope.row.account }}</template>
          </template>
        </el-table-column>
        <el-table-column prop="email" label="邮箱">
          <template slot-scope="scope">
            <el-form-item
              v-if="editRow && idEditThisRow(scope.row)"
              label=" "
              :prop="`tableData[${scope.$index}].email`"
              :rules="buildRowCellRule(scope.row, 'email')"
            >
              <el-input v-model="scope.row.email"></el-input>
            </el-form-item>
            <template v-else>{{ scope.row.email }}</template>
          </template>
        </el-table-column>
        <el-table-column v-if="editRow" prop="confirm" label="确认邮箱">
          <template slot-scope="scope">
            <el-form-item
              v-if="editRow && idEditThisRow(scope.row)"
              label=" "
              :prop="`tableData[${scope.$index}].confirm`"
              :rules="buildRowCellRule(scope.row, 'confirm')"
            >
              <el-input v-model="scope.row.confirm"></el-input>
            </el-form-item>
            <template v-else>{{ scope.row.confirm }}</template>
          </template>
        </el-table-column>
        <el-table-column prop="other" label="其他">
          <template slot-scope="scope">
            <el-form-item
              v-if="editRow && idEditThisRow(scope.row)"
              label=" "
              :prop="`tableData[${scope.$index}].other`"
              :rules="buildRowCellRule(scope.row, 'other')"
            >
              <CustomFormItem v-model="scope.row.other"></CustomFormItem>
            </el-form-item>
            <template v-else>{{ scope.row.other }}</template>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <el-button
              v-if="!editRow"
              @click="handleClick(scope.row, 'edit')"
              type="text"
              size="small"
              :disabled="!editRow && idEditThisRow(scope.row)"
            >
              编辑
            </el-button>
            <el-button
              v-if="editRow && idEditThisRow(scope.row)"
              @click="handleClick(scope.row, 'save')"
              type="text"
              size="small"
              :disabled="!idEditThisRow(scope.row)"
            >
              保存
            </el-button>
            <el-button
              v-if="editRow && idEditThisRow(scope.row)"
              @click="handleClick(scope.row, 'cancel')"
              type="text"
              size="small"
              :disabled="!idEditThisRow(scope.row)"
            >
              取消
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
  </div>
</template>

<script>
import CustomFormItem from './custom-form-item.vue'
export default {
  name: 'StyleTextPage',
  components: { CustomFormItem },
  data() {
    return {
      // 记录行编辑状态
      editRow: false,
      // 记录编辑的行数据id
      editDataId: null,
      // 记录当前行数据未编辑之前的值（用来进行数据还原）
      curRowDataBeforeEdit: null,
      // 是否正在执行保存操作
      saving: false,
      // 行数据
      editableTableData: {
        tableData: [
          {
            id: 1,
            name: '王小1',
            account: 'a1',
            email: 'qq1@qq.com',
            confirm: 'qq1@qq.com',
            other: null
          },
          {
            id: 2,
            name: '王小2',
            account: 'a2',
            email: 'qq2@qq.com',
            confirm: 'qq2@qq.com',
            other: null
          },
          {
            id: 3,
            name: '王小3',
            account: 'a3',
            email: 'qq3.qq.com',
            confirm: 'qq3.qq.com',
            other: null
          },
          {
            id: 4,
            name: '王小4',
            account: 'a4',
            email: 'qq4.qq.com',
            confirm: 'qq4.qq.com',
            other: null
          }
        ]
      }
    }
  },
  methods: {
    /**
     * 构建行单元格的验证规则，通过row参数让自定义校验规则中可以获取到当前的行数据
     * @param row 当前行数据
     * @param propertyName
     * @return {[{message: string, required: boolean},{trigger: string, type: string, message: string},{validator: validator, trigger: string}]|[{message: string, required: boolean},{trigger: string, type: string, message: string}]|*[]|[{validator: validator, trigger: string}]}
     */
    buildRowCellRule(row, propertyName) {
      if (propertyName === 'name') {
        return []
      } else if (propertyName === 'email') {
        return [
          { required: true, message: '必填' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
        ]
      } else if (propertyName === 'confirm') {
        return [
          { required: true, message: '必填' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (value !== row.email) {
                callback(new Error('两次输入的邮箱不一致!'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ]
      } else if (propertyName === 'account') {
        return [
          { required: true, message: '必填' },
          {
            validator: (rule, value, callback) => {
              console.log('执行异步账号验证')
              setTimeout(() => {
                return value === 'aa'
                  ? callback(new Error('账号已存在'))
                  : callback()
              }, 2000)
            },
            trigger: 'blur'
          }
        ]
      } else if (propertyName === 'other') {
        return [
          { required: true, message: '必填' },
          {
            validator: (rule, value, callback) => {
              console.log('change event', rule, value)
              if (value.type !== '农村') {
                callback(new Error('户口类型必须为农村'))
              } else if (value.fatherName !== '张三') {
                callback(new Error('父亲姓名只能为张三'))
              } else {
                callback()
              }
            },
            trigger: 'change'
          }
        ]
      }
    },
    idEditThisRow(row) {
      return row.id === this.editDataId
    },
    // 清除编辑状态
    clearEditStatus() {
      this.editRow = false
      this.editDataId = null
      this.curRowDataBeforeEdit = null
    },
    handleClick(row, optType) {
      if (optType === 'save') {
        if (!this.saving) {
          this.saving = true
          this.$refs.validateForm.validate(valid => {
            console.log('验证结果:', valid)
            if (valid) {
              this.clearEditStatus()
            }
            this.saving = false
          })
        }
      } else if (optType === 'edit') {
        // 编辑
        this.editRow = true
        this.editDataId = row.id
        this.curRowDataBeforeEdit = Object.assign({}, row)
      } else {
        // 取消
        const idx = this.editableTableData.tableData.findIndex(
          item => item.id === this.editDataId
        )
        if (idx >= 0) {
          this.editableTableData.tableData.splice(
            idx,
            1,
            this.curRowDataBeforeEdit
          )
          this.clearEditStatus()
        }
      }
    }
  }
}
</script>

<style scoped>
::v-deep .el-form-item__content {
  width: 100px;
}
</style>
