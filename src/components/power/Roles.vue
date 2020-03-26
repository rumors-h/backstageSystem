<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <el-button type="primary" @click="addRoles">添加角色</el-button>
      <el-table :data="rolesList" border stripe>
        <el-table-column type="expand">
          <template v-slot:default="scope">
            <el-row
              :gutter="20"
              v-for="(item1,i1) in scope.row.children"
              :key="item1.id"
              :class="{'border-bottom' : true, 'border-top': i1===0, 'center': true}"
            >
              <el-col :span="6">
                <el-tag closable @close="removeRightById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="18">
                <el-row
                  v-for="(item2,i2) in item1.children"
                  :key="item2.id"
                  :class="{'border-top': i2!==0,  'center': true}"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row,item2.id)"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="(item3,i3) in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeRightById(scope.row,item3.id)"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template v-slot:default="scope">
            <el-button
              type="primary"
              class="el-icon-edit"
              size="mini"
              @click="editRoles(scope.row)"
            >编辑</el-button>
            <el-button
              type="danger"
              class="el-icon-delete"
              size="mini"
              @click="deleteRoles(scope.row)"
            >删除</el-button>
            <el-button
              type="warning"
              class="el-icon-setting"
              size="mini"
              @click="showDialog(scope.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 对话框 -->
    <el-dialog title="分配权限" :visible.sync="allotDialogVisible" width="50%">
      <!-- @close="setDefaultKey" -->
      <el-tree
        :data="rightList"
        :props="rightProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defaultKey"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="allotDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加角色 -->
    <el-dialog title="添加角色" :visible.sync="addDialogVisible" width="50%">
      <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRolesClick">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑角色 -->
    <el-dialog title="编辑角色" :visible.sync="editDialogVisible" width="50%">
      <el-form ref="editFormRef" :model="editForm" :rules="editFormRules" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRolesClick">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getRolesList,
  removeRoles,
  getRightsList,
  updateRoles,
  addRoles,
  editRoles,
  deleteRoles
} from 'network/power'
export default {
  components: {},
  data() {
    return {
      rolesList: [],
      allotDialogVisible: false,
      rightList: [],
      rightProps: {
        children: 'children',
        label: 'authName'
      },
      defaultKey: [], //默认勾选的节点
      roleID: '',
      addDialogVisible: false,
      editDialogVisible: false,
      deleteDialogVisible: false,
      roleId: '',
      //添加
      addForm: {
        roleName: '',
        roleDesc: ''
      },
      addFormRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ]
      },

      //修改
      editForm: {
        roleName: '',
        roleDesc: ''
      },
      editFormRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ]
      }
    }
  },
  async created() {
    this.getRolesList()
    // console.log(this.rolesList)
    // const { data: res2 } = await getRightsList('tree')
    // if (res2.meta.status != 200) return this.$message.error(res2.meta.msg)
    // this.rightList = res2.data
  },
  methods: {
    async getRolesList() {
      const { data: res } = await getRolesList()
      // console.log(res);
      if (res.meta.status != 200) return this.$message.error(res.meta.msg)
      this.rolesList = res.data
    },

    async removeRightById(row, id) {
      const confirmRes = await this.$confirm(
        '此操作将永久删除该角色, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmRes != 'confirm') return this.$message.info('取消了删除角色')
      const { data: res } = await removeRoles(row.id, id)
      if (res.meta.status != 200) return this.$message.error('删除失败')
      row.children = res.data
      this.$message.success('删除成功')
    },
    /* 默认勾选的节点方法 */
    getNodes(node, arr) {
      if (!node.children) return arr.push(node.id)
      node.children.forEach(item => {
        this.getNodes(item, arr)
      })
    },

    async showDialog(row) {
      this.roleID = row.id
      const { data: res2 } = await getRightsList('tree') //请求数据不能放在created中，否则defaultKey里的数据不会重新渲染
      if (res2.meta.status != 200) return this.$message.error(res2.meta.msg)
      this.rightList = res2.data

      //设置默认值
      this.defaultKey = []
      this.getNodes(row, this.defaultKey)
      this.allotDialogVisible = true
    },

    //关闭时清空默认值数组
    // setDefaultKey() {
    //   // this.defaultKey = []
    // }

    //分配权限
    async allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      console.log(keys)
      const idStr = keys.join(',')
      const { data: res } = await updateRoles(this.roleID, { rids: idStr })
      if (res.meta.status != 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.getRolesList()
      this.allotDialogVisible = false
    },

    //添加角色
    addRoles() {
      this.addForm = {}
      this.addDialogVisible = true
    },
    //确认
    addRolesClick() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return this.$message.error('添加角色名称失败')
        const { data: res } = await addRoles(this.addForm)
        // console.log(res);
        if (res.meta.status != 201) return this.$message.error(res.meta.msg)

        this.$message.success(res.meta.msg)
        this.getRolesList()

        this.addDialogVisible = false
      })
    },

    //edit
    editRoles(row) {
      this.editForm = row
      this.roleId = row.id
      this.editDialogVisible = true
    },
    editRolesClick() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return this.$message.error('修改失败')
        const { data: res } = await editRoles(this.roleId, this.editForm)
        if (res.meta.status != 200) return this.$message.error(res.meta.msg)
        this.$message.success('修改成功')
        this.getRolesList()
        this.editDialogVisible = false
      })
    },

    //delete
    async deleteRoles(row) {
      const confirmResult = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)

      if(confirmResult != 'confirm') return this.$message.info('取消了操作')
      const {data: res} = await deleteRoles(row.id)
      if(res.meta.status != 200) return this.$message.error(res.meta.msg)
      this.$message.success('删除成功')
      this.getRolesList()
    }
  }
}
</script>

<style scoped>
.box-card {
  margin-top: 20px;
}
.el-table {
  margin-top: 20px;
  font-size: 13px;
}
.el-tag {
  margin: 7px;
  margin-left: 0;
}
.border-top {
  border-top: 1px solid #eee;
}
.border-bottom {
  border-bottom: 1px solid #eee;
}
.center {
  display: flex;
  align-items: center;
}
</style>
