<template>
  <div>
    <el-link @click="handlerClick">填写其他信息</el-link>

    <el-dialog
      v-if="dialogVisible"
      :lock-scroll="true"
      :destroy-on-close="true"
      title="其他信息填写"
      :append-to-body="true"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <el-form label-width="80px" ref="otherForm" :model="otherFormData">
        <el-form-item label="户口类型">
          <el-input v-model="otherFormData.type"></el-input>
        </el-form-item>
        <el-form-item label="父亲姓名">
          <el-input v-model="otherFormData.fatherName"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="onCancel">取消</el-button>
        <el-button type="primary" @click="onConfirm">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import emitter from 'element-ui/src/mixins/emitter' // 分发事件的el-form处理方法
const defaultOtherFormData = {
  type: null,
  fatherName: null
}
/**
 * 自定义表单项组件
 */
export default {
  name: 'CustomFormItem',
  model: {
    prop: 'value',
    event: 'change'
  },
  mixins: [emitter], // 混入的方式 , 加载到当前组件
  props: {
    value: {
      type: [String, Number, Object]
    }
  },
  data() {
    return {
      // 其他信息填写弹窗是否显示
      dialogVisible: false,
      otherFormData: Object.assign({}, defaultOtherFormData)
    }
  },
  methods: {
    onCancel() {
      this.dialogVisible = false
    },
    handlerClick() {
      this.showDialog(this.value)
    },
    onConfirm() {
      this.dialogVisible = false
      this.$emit('change', this.otherFormData)
      // dispatch(componentName, eventName, params): 不停的向上去遍历父节点并且通过$emit去触发事件，到达根节点之后停止
      this.dispatch('ElFormItem', 'el.form.change', [this.otherFormData]) // 值发生变化时, 向el-form-item分发事件 , 调用组件内部的校验流程
    },
    handleClose() {
      this.dialogVisible = false
    },
    showDialog(other) {
      this.dialogVisible = true
      if (other) {
        this.otherFormData = Object.assign(
          {},
          other ? other : defaultOtherFormData
        )
      }
    }
  }
}
</script>

<style scoped></style>
