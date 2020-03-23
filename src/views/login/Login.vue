<template>
  <div class="login">
    <div class="login-box">
      <!-- 头像 -->
      <div class="login-img">
        <img src="~assets/img/logo.png" alt />
      </div>
      <!-- 表单 -->
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginFormRules"
        label-width="0px"
        class="form"
      >
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            prefix-icon="iconfont icon-3702mima"
            type="password"
          ></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { Login } from 'network/login'
export default {
  data() {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      loginFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 5, max: 15, message: '长度在 5 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    reset() {
      this.$refs.loginFormRef.resetFields()
    },
    login() {
      // this.$refs.loginFormRef.validate(async valid => {//vaild 布尔值，判断有没有匹配设定的rules
      //   if(!valid) return
      //   const{data: res} = await this.$http.post("login",this.loginForm)
      //   if(res.meta.status != 200) return this.$message.error('登陆失败')
      //   this.$message.success('登陆成功')
      //   window.sessionStorage.setItem("token",res.data.token)
      //   this.$router.push('/home')
      // })
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await Login(this.loginForm)
        if (res.meta.status != 200) return this.$message.error('登陆失败')
        this.$message.success('登陆成功')
        window.sessionStorage.setItem('token', res.data.token)
        this.$router.push('/home')
      })
    }
  },
  components: {}
}
</script>

<style lang="less" scoped>
.login {
  position: relative;
  background-color: #2b4b6b;
  height: 100%;
}
.login-box {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 10px;

  .login-img {
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 130px;
    height: 130px;
    padding: 10px;
    border: 1px solid #eee;
    border-radius: 50%;
    background-color: #fff;

    img {
      width: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
  .form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 20px;
    .btns {
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>
