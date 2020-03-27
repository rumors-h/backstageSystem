<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert show-icon title="注意：只允许为第三级分类设置相关参数！" type="warning"></el-alert>
      <el-row class="selectRow">
        <el-col>
          <span>选择商品分类：</span>
          <el-cascader
            v-model="SelectKeys"
            :options="goodsList"
            :props="{ expandTrigger: 'hover', value: 'cat_id', label: 'cat_name', children: 'children' }"
            @change="cascaderChange"
            clearable
          ></el-cascader>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button
            :disabled="SelectKeys.length==0 ? true:false"
            type="primary"
            size="mini"
            @click="showAddDialog"
          >添加参数</el-button>
          <el-table stripe border :data="manyParams">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  :key="index"
                  v-for="(tag, index) in scope.row.attr_vals"
                  closable
                  @close="closeTag(scope.row,index)"
                >{{tag}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="showEditDialog(scope.row)"
                ></el-button>
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="deleteParams(scope.row)"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            size="mini"
            :disabled="SelectKeys.length==0 ? true:false"
            @click="showAddDialog"
          >添加属性</el-button>
          <el-table stripe border :data="onlyParams">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  :key="index"
                  v-for="(tag, index) in scope.row.attr_vals"
                  closable
                  @close="closeTag(scope.row,index)"
                >{{tag}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="attr_name" label="属性名称"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="showEditDialog(scope.row)"
                ></el-button>
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="deleteParams(scope.row)"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加参数对话框 -->
    <el-dialog
      :title="'添加' + dialogTitle"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="80px">
        <el-form-item :label="dialogTitle" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改参数对话框 -->
    <el-dialog
      :title="'添加' + dialogTitle"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form ref="editFormRef" :model="editForm" :rules="editFormRules" label-width="80px">
        <el-form-item :label="dialogTitle" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getGoodsList,
  getParams,
  addParams,
  editParams,
  deleteParams
} from 'network/goods'
export default {
  data() {
    return {
      goodsList: [],
      SelectKeys: [],
      activeName: 'many',
      isUse: true,
      manyParams: [],
      onlyParams: [],
      addDialogVisible: false,
      editDialogVisible: false,
      addForm: {
        attr_name: ''
      },
      addFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      },
      editForm: {
        attr_name: ''
      },
      editFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      },
      attrID: ''
      /* 控制按钮和文本框的转换 */
      // inputVisible: false,
      // inputValue: ''
    }
  },
  computed: {
    dialogTitle() {
      if (this.activeName == 'many') return '动态参数'
      else return '静态属性'
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

      // console.log(this.goodsList)
    },
    cascaderChange() {
      if (this.SelectKeys.length != 3) {
        this.SelectKeys = []
        this.manyParams = []
        this.onlyParams = []
        return
      }
      this.getParams()
    },
    handleTabClick() {
      this.getParams()
    },
    async getParams() {
      const { data: res } = await getParams(this.SelectKeys[2], {
        sel: this.activeName
      })
      if (res.meta.status != 200) return

      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []

        item.inputVisible = false
        item.inputValue = ''
      })
      if (this.activeName == 'many') {
        this.manyParams = res.data
      } else {
        this.onlyParams = res.data
      }
      console.log(res)
    },
    showAddDialog() {
      this.addDialogVisible = true
    },
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    async addParams() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await addParams(this.SelectKeys[2], {
          attr_name: this.addForm.attr_name,
          attr_sel: this.activeName
        })
        if (res.meta.status != 201) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.addDialogVisible = false
        this.getParams()
      })
    },
    /* 修改参数 */
    showEditDialog(row) {
      this.attrID = row.attr_id
      this.editForm.attr_name = row.attr_name
      this.editDialogVisible = true
    },

    editParams() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await editParams(
          this.SelectKeys[2],
          this.attrID,
          {
            attr_name: this.editForm.attr_name,
            attr_sel: this.activeName
          }
        )
        if (res.meta.status != 200) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.editDialogVisible = false
        this.getParams()
      })
    },
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },

    /* 删除参数 */
    async deleteParams(row) {
      const confirmRes = await this.$confirm(
        '此操作将永久删除该参数, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmRes != 'confirm') return this.$message.info('已取消该操作')
      const { data: res } = await deleteParams(this.SelectKeys[2], row.attr_id)
      if (res.meta.status != 200) return this.$message.error(res.meta.msg)
      this.$message.success('成功删除')
      this.getParams()
    },

    /* 展开行里的内容 start*/
    closeTag(row,index) {
      row.attr_vals.splice(index,1)
      this.joinDataBase(row)
      // console.log(row)
    },

    /* 文本框失去焦点或者按下了enter */
    handleInputConfirm(row) {
      if (!row.inputValue.trim().length) {
        row.inputValue = ''
        return (row.inputVisible = false)
      }
      row.attr_vals.push(row.inputValue)
      row.inputValue = ''
      row.inputVisible = false

      /* 加入数据库 */
      this.joinDataBase(row)
    },

    async joinDataBase(row) {
      const { data: res } = await editParams(this.SelectKeys[2], row.attr_id, {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(',')
      })
      if (res.meta.status != 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
    },
    /* 点击按钮展示文本框 */
    showInput(row) {
      row.inputVisible = true
      /* 让文本框自动获得焦点 
      $nextTick 当页面上元素被重新渲染之后，才会执行回调函数中的内容*/
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    }
    /* 展开行里的内容 end*/
  }
}
</script>

<style scoped>
.el-breadcrumb {
  font-size: 13px;
  margin-bottom: 20px;
}
.selectRow {
  margin: 10px 5px 20px 0;
}
.el-tag {
  margin-right: 20px;
}
.input-new-tag {
  width: 120px;
}
</style>
