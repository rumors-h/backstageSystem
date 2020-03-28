<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert show-icon title="添加商品信息" type="info" center :closable="false"></el-alert>
      <el-steps :space="200" :active="+ activeIndex" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- 左边tab栏 -->
      <el-form
        ref="addFormRef"
        :model="addForm"
        :rules="addFormRules"
        label-width="80px"
        label-position="top"
      >
        <el-tabs
          :tab-position="'left'"
          v-model="activeIndex"
          :before-leave="beforeTabLeave"
          @tab-click="tabClicked"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="goodsList"
                :props="{ expandTrigger: 'hover', value: 'cat_id', label: 'cat_name', children: 'children'}"
                @change="cascaderHandleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item :label="item.attr_name" v-for="item in manyParams" :key="item.attr_id">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  :label="item"
                  v-for="(item, index) in item.attr_vals"
                  :key="index"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="item in onlyParams" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="tokenHeader"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <el-button type="primary" @click="add">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片预览对话框 -->
    <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
      <img :src="previewURL" alt class="previewImg" />
    </el-dialog>
  </div>
</template>

<script>
import { getGoodsList, getParams, addGoods } from 'network/goods'
import _ from 'lodash'
export default {
  data() {
    return {
      activeIndex: '0',
      addForm: {
        goods_name: '',
        goods_cat: [],
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        /* 商品内容 */
        goods_introduce: '',
        /* 级联选择器选中的参数 */
        pics: [],
        attrs: []
      },
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' }
        ]
      },
      goodsList: [],
      manyParams: [],
      onlyParams: [],
      uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
      /* 携带token的头部信息 */
      tokenHeader: {
        Authorization: window.sessionStorage.getItem('token')
      },
      previewURL: '',
      previewVisible: false,
      type: null
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    async getGoodsList() {
      const { data: res } = await getGoodsList()
      if (res.meta.status != 200) return this.$message.error(res.meta.msg)
      this.goodsList = res.data
      // console.log(this.goodsList);
    },
    cascaderHandleChange() {
      if (this.addForm.goods_cat.length != 3) {
        this.addForm.goods_cat = []
        return
      }
    },
    beforeTabLeave(newVal, oldVal) {
      if (oldVal == '0' && this.addForm.goods_cat.length != 3) {
        this.$message.error('请选择商品分类')
        return false
      }
    },
    /* tab的点击事件 */
    async tabClicked() {
      /* 获取商品参数 */
      if (this.activeIndex == '1') {
        const { data: res } = await getParams(this.addForm.goods_cat[2], {
          sel: 'many'
        })
        // console.log(res);
        if (res.meta.status != 200) return this.$message.error(res.meta.msg)
        res.data.forEach(item => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(',')
        })
        // console.log(res)
        this.manyParams = res.data
        // console.log(this.manyParams)
      }
      if (this.activeIndex == '2') {
        const { data: res } = await getParams(this.addForm.goods_cat[2], {
          sel: 'only'
        })
        // console.log(res);
        if (res.meta.status != 200) return this.$message.error(res.meta.msg)
        this.onlyParams = res.data
        // console.log(this.onlyParams)
      }
    },

    /* 处理图片预览效果 */
    handlePreview(file) {
      // console.log(file)
      this.previewURL = file.response.data.url
      this.previewVisible = true
    },
    /* 移除图片 */
    handleRemove(file) {
      // console.log(file)
      const index = this.addForm.pics.findIndex(i => {
        return i.pic == file.response.data.tmp_path
        // console.log(i);
      })
      this.addForm.pics.splice(index, 1)
      // console.log(this.addForm);
    },
    /* 图片上传成功 */
    handleSuccess(response) {
      // console.log(response)
      const filePath = { pic: response.data.tmp_path }
      this.addForm.pics.push(filePath)
      // console.log(this.addForm);
    },

    /* 添加商品 */
    add() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return this.$message.error('请输入正确的内容')

        /* 深拷贝，因为级联选择器规定了只能绑定在数组，否则会报错，如果不深拷贝，会报错 */
        const form = _.cloneDeep(this.addForm)
        form.goods_cat = form.goods_cat.join(',')
        /* 处理动态参数 */
        this.manyParams.forEach(item => {
          const newInfo = {attr_id: item.attr_id, attr_value: item.attr_vals.join(' ')}
          form.attrs.push(newInfo)
        })
        /* 处理静态属性 */
         this.onlyParams.forEach(item => {
          const newInfo = {attr_id: item.attr_id, attr_value: item.attr_vals}
          form.attrs.push(newInfo)
        })
        // console.log(form);
        const {data: res} = await addGoods(form)
        if(res.meta.status!=201) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)

        this.$emit('change')

      })
    }
  }
}
</script>

<style scoped>
.el-card {
  margin-top: 20px;
}
.el-steps {
  margin: 20px 0;
}
.el-checkbox {
  margin: 0 20px 0 0 !important;
}
.previewImg {
  width: 100%;
}
.el-button {
  margin-top: 10px;
}
</style>
