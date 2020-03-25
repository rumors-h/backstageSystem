<template>
  <el-container id="home">
    <el-header>
      <div>
        <img src="~assets/img/logo.png" alt />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="exit">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <!-- 菜单折叠按钮 -->
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- 菜单 -->
        <el-menu
          :default-active="this.$route.path"
          class="el-menu-vertical-demo"
          background-color="#313743"
          text-color="#fff"
          active-text-color="#359bff"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          
        >
          <!--unique-opened 只开开启一个子菜单 
            router开启路由模式，默认以index的值作为路由地址
            default-active	当前激活菜单的 index
          -->
          <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
            <template slot="title">
              <i :class="iconList[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item
              :index="'/' + subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { getMenuList } from 'network/menu'
export default {
  data() {
    return {
      menuList: [],
      iconList: {
        '125': 'iconfont icon-users',
        '103': 'iconfont icon-tijikongjian',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-baobiao'
      },
      isCollapse: false
    }
  },
  async created() {
    const { data: res } = await getMenuList()
    if (res.meta.status != 200) return this.$message.error(res.meta.msg)
    this.menuList = res.data
  },
  methods: {
    exit() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    }
  }
}
</script>

<style lang="less" scoped>
.el-header {
  display: flex;
  justify-content: space-between;
  background-color: #363d40;
  > div {
    display: flex;
    align-items: center;

    img {
      width: 50px;
      background-color: #e9edf1;
      border-radius: 50%;
    }
    span {
      color: #e9edf1;
      font-size: 18px;
      margin-left: 20px;
    }
  }
}
.el-aside {
  background: #313743;
  .toggle-button {
    color: white;
    background-color: #475163;
    text-align: center;
    line-height: 24px;
    font-size: 13px;
    cursor: pointer;
    letter-spacing: 0.2em;
  }
  .el-menu {
    border-right: 0;
  }
}
.el-main {
  background: #e9edf1;
}
.iconfont {
  margin-right: 10px;
}
</style>
