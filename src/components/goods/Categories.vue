<template>
  <div class="category">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-button type="primary" @click="addCategories">添加分类</el-button>
      <el-table :data="goodsList" border style="width: 100%" row-key="cat_id">
        <el-table-column prop="cat_name" label="分类名称"></el-table-column>
        <el-table-column label="是否有效">
          <template slot-scope="scope">
            <i class="el-icon-success" v-if="scope.row.cat_deleted === false"></i>
            <i class="el-icon-error" v-else></i>
          </template>
        </el-table-column>
        <el-table-column label="排序">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
            <el-tag type="warning" v-else>三级</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot:default="scope">
            <el-button type="primary" size="mini" class="el-icon-edit">编辑</el-button>
            <el-button type="danger" size="mini" class="el-icon-delete">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 添加商品分类 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addCateDialogClose"
    >
      <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="100px">
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
          <el-cascader
            v-model="selectedKeys"
            :options="options"
            :props="{ expandTrigger: 'hover', value: 'cat_id', label: 'cat_name', children: 'children', checkStrictly: true }"
            @change="SelectChange"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCategoryClick">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getGoodsList, addCatagory } from 'network/goods'
export default {
  data() {
    return {
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      goodsList: [],
      total: 0,
      addDialogVisible: false,
      addForm: {
        cat_pid: 0,
        cat_name: '',
        cat_level: 0
      },
      addFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      options: [],
      cascaderProps: [
        { value: 'cat_id' },
        { label: 'cat_name' },
        { children: 'children' }
      ],

      /* 选中的父级分类的id数 */
      selectedKeys: []
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    async getGoodsList() {
      const { data: res } = await getGoodsList(this.queryInfo)
      if (res.meta.status != 200) return this.$message.error(res.meta.msg)
      this.total = res.data.total
      // console.log(res.data.total)
      this.goodsList = res.data.result
    },

    /* 分页 */
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getGoodsList()
    },
    /* 添加分类 */
    addCategories() {
      this.getParentCategory()
      this.addDialogVisible = true
    },

    /* 获取父级分类 */
    async getParentCategory() {
      const { data: res } = await getGoodsList({ type: 2 })
      if (res.meta.status != 200) return this.$message.error(res.meta.msg)
      console.log(res)

      this.options = res.data
    },
    SelectChange() {
      // console.log(this.selectedKeys);
      if (this.selectedKeys.length > 0) {
        this.addForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]

        this.addForm.cat_level = this.selectedKeys.length
      } else {
        this.addForm.cat_pid = 0

        this.addForm.cat_level = 0
      }
      // console.log( this.addForm.cat_pid,this.addForm.cat_level);
    },

    async addCategoryClick() {
      this.SelectChange()
      const { data: res } = await addCatagory(this.addForm)
      if (res.meta.status != 201) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.getGoodsList()
      this.addDialogVisible = false
    },
    addCateDialogClose() {
      /*监听对话框关闭重置表单 */
      this.$refs.addFormRef.resetFields()
      this.addForm.cat_pid = 0
      this.addForm.cat_level = 0
      this.selectedKeys = []
    }
  }
}
</script>

<style scoped>
.el-breadcrumb {
  font-size: 13px;
}
.box-card {
  margin-top: 20px;
}
.el-table {
  margin: 20px 0;
  font-size: 13px;
}
.el-icon-success {
  color: lightgreen;
}
.el-icon-error {
  color: red;
}
</style>
