<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            class="input-with-select"
            v-model="params.query"
            clearable
            @clear="getUserInfo"
          >
            <!-- clearable带i清除功能的输入框  @clear删除时立即触发 -->
            <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- table用户表单视图 -->
      <el-table :data="userList" stripe border>
        <el-table-column type="index"></el-table-column>
        <!-- 索引列 -->
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column label="状态">
          <template v-slot:default="slotProps">
            <el-switch v-model="slotProps.row.mg_state" @change="changeState(slotProps.row)"></el-switch>
            <!-- 将界面修改同步到数据库 -->
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot:default="slotProps">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editClick(slotProps.row.id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteClick(slotProps.row.id)"
            ></el-button>
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="setRole(slotProps.row)"
              ></el-button>
            </el-tooltip>
            <!-- el-tooltip显示提示信息 -->
            <!-- {{slotProps.row.id}}} -->
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="params.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="params.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addFormClosed">
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="70px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" show-password v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUserClick">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户对话框 -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" @close="editFormClosed">
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="70px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserClick">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配角色 -->
    <el-dialog
      title="分配角色"
      :visible.sync="setRoleDialogVisible"
      width="50%"
      @close="setRoleFormClosed"
    >
      <p>当前的用户：{{userInfo.username}}</p>
      <p>当前的角色：{{userInfo.role_name}}</p>
      <p>
        分配新角色：
        <el-select v-model="SelectID" placeholder="请选择">
          <el-option
            v-for="item in rolesList"
            :key="item.id"
            :label="item.roleName"
            :value="item.id"
          ></el-option>
        </el-select>
      </p>

      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRoleClick">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getUserInfo,
  changeUserState,
  addUser,
  editUser,
  editUserInfo,
  deleteUser
} from 'network/user'
import {getRolesList, allotRoles} from 'network/power'

export default {
  components: {},
  data() {
    var checkPhone = (rule, value, callback) => {
      const phoneReg = /^1[3|4|5|7|8][0-9]{9}$/
      if (!value) {
        return callback()
      }
      setTimeout(() => {
        // Number.isInteger是es6验证数字是否为整数的方法,实际输入的数字总是识别成字符串
        // 所以在前面加了一个+实现隐式转换

        if (!Number.isInteger(+value)) {
          callback(new Error('请输入数字值'))
        } else {
          if (phoneReg.test(value)) {
            callback()
          } else {
            callback(new Error('电话号码格式不正确'))
          }
        }
      }, 100)
    }
    var checkEmail = (rule, value, callback) => {
      const mailReg = /^([A-Za-z0-9_\-\.\u4e00-\u9fa5])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,8})$/
      if (!value) {
        return callback()
      }
      setTimeout(() => {
        if (mailReg.test(value)) {
          callback()
        } else {
          callback(new Error('请输入正确的邮箱格式'))
        }
      }, 100)
    }

    return {
      params: {
        query: '',
        //当前页码
        pagenum: 1,
        //每页显示条数
        pagesize: 2
      },
      userList: [],
      total: null,
      addDialogVisible: false,
      editDialogVisible: false,
      //添加用户信息
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      //添加用户规则信息
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 5, max: 15, message: '长度在 5 到 15 个字符', trigger: 'blur' }
        ],
        email: [{ validator: checkEmail, trigger: 'blur' }],
        mobile: [{ validator: checkPhone, trigger: 'blur' }]
      },
      //修改用户信息
      editForm: {},
      editFormRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkPhone, trigger: 'blur' }
        ]
      },

      //当前被选中的用户信息,分配角色
      userInfo: {},
      setRoleDialogVisible: false,
      //当前被选中的用户的ID
      SelectID: '',
      rolesList: []
    }
  },
  created() {
    this.getUserInfo()
  },
  methods: {
    async getUserInfo() {
      const { data: res } = await getUserInfo(this.params)
      // console.log(res)
      if (res.meta.status != 200) return this.$message.error(res.meta.msg)
      this.userList = res.data.users
      this.total = res.data.total
    },
    /* 分页功能实现 */
    handleSizeChange(newSize) {
      this.params.pagesize = newSize
      this.getUserInfo()
    },
    handleCurrentChange(newPage) {
      this.params.pagenum = newPage
      this.getUserInfo()
    },
    /* 改变用户状态 */
    async changeState(userInfo) {
      const { data: res } = await changeUserState(
        userInfo.id,
        userInfo.mg_state
      )
      if (res.meta.status != 200) {
        userInfo.mg_state = !userInfo.mg_state
        return this.$message.error(res.meta.msg)
      }
      return this.$message.success(res.meta.msg)
    },
    search() {
      this.params.pagenum = 1
      this.getUserInfo()
    },
    addFormClosed() {
      this.$refs.addFormRef.resetFields() //在对话框关闭时对表单字段进行重置
    },
    //添加用户信息
    addUserClick() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await addUser(this.addForm)
        // console.log(res)
        if (res.meta.status != 201) return this.$message.error(res.meta.msg)

        this.$message.success('添加用户成功')
        this.getUserInfo()
        this.addDialogVisible = false //在做完这些事情之后再关闭对话框，不能写在外面，否则获取不到数据
      })
    },

    //点击修改按钮时，将用户id传入并且显示修改对话框
    async editClick(id) {
      const { data: res } = await editUser(id)
      // console.log(res)
      if (res.meta.status != 200) return this.$message.error(res.meta.msg)
      this.editForm = res.data
      this.editDialogVisible = true
    },
    //重置表单，虽然数据会实时更新但是表单验证不会，如果不重置，下次打开还是会有验证信息
    editFormClosed() {
      this.$refs.editFormRef.resetFields()
    },
    //修改用户信息
    editUserClick() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await editUserInfo(this.editForm.id, {
          email: this.editForm.email,
          mobile: this.editForm.mobile
        })
        console.log(res)
        if (res.meta.status != 200) return this.$message.error(res.meta.msg)
        //关闭对话框
        this.editDialogVisible = false
        //更新数据列表
        this.getUserInfo()
        //显示提示信息
        this.$message.success(res.meta.msg)
      })
    },

    //点击删除按钮时，显示对应提示信息（是否确认删除）
    async deleteClick(id) {
      const res = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      // console.log(res);    确定返回confirm,取消返回cancel
      if (res != 'confirm') return this.$message('已取消删除')

      const { data: res2 } = await deleteUser(id)
      if (res2.meta.status != 200) return this.$message.error(res2.meta.msg)
      this.$message.success(res2.meta.msg)

      this.getUserInfo()

      // console.log(res2);
    },

    //分配角色
    async setRole(row) {
      this.userInfo = row
      // console.log(row);
      const {data: res} = await getRolesList()
      if(res.meta.status != 200) return this.$message.error(res.meta.msg)
      this.rolesList = res.data

      this.setRoleDialogVisible = true
    },
    async setRoleClick() {
      //分配用户角色
      if(!this.SelectID) return this.$message.error('请选择要分配的角色')
      const {data: res2} = await allotRoles(this.userInfo.id, {rid: this.SelectID})
      if(res2.meta.status != 200) return this.$message.error(res2.meta.msg)
      this.$message.success(res2.meta.msg)
      this.getUserInfo()
      this.setRoleDialogVisible = false
    },
    setRoleFormClosed() {
      this.userInfo = {}
      this.SelectID = ''
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
.el-pagination {
  margin-top: 15px;
}
</style>
