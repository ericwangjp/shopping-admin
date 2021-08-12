<template>
  <el-container>
    <!--    头部-->
    <el-header>
      <div>
        <img src="../assets/logo.png" alt="">
        <span>后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出登录</el-button>
    </el-header>
    <!--页面主体区域开始-->
    <el-container>
      <!--      侧边栏-->
      <el-aside :width="isCollapse?'64px':'200px'">
        <!--        展开/收缩-->
        <el-radio-group v-model="isCollapse">
          <el-radio-button :label="false">展开</el-radio-button>
          <el-radio-button :label="true">收起</el-radio-button>
        </el-radio-group>

        <el-menu
          @open="handleOpen"
          @close="handleClose"
          class="el-menu-vertical"
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409eff"
          unique-opened
          router
          :default-active="activePath"
          :collapse="isCollapse">
          <!--          一级菜单-->
          <el-submenu :index="item.id+''" v-for="(item,index) in menuList" :key="item.id">
            <template slot="title">
              <i :class="fistIcons[index]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <!--            二级菜单-->
            <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id"
                          @click="handleActive('/'+subItem.path)">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span slot="title">{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>

      <!--      主体区域-->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
// @ is an alias to /src
import { http } from '@/network/http'

export default {
  name: 'Home',
  components: {},
  data () {
    return {
      menuList: [],
      fistIcons: ['el-icon-user-solid', 'el-icon-s-promotion', 'el-icon-s-goods', 'el-icon-s-order', 'el-icon-s-platform'],
      isCollapse: false,
      activePath: ''
    }
  },
  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    handleOpen () {
    },
    handleClose () {
    },
    getMenuList () {
      http({
        url: 'menus',
        method: 'get'
      }).then(response => {
        if (response.meta.status === 200) {
          this.menuList = response.data
        } else {
          this.$message.error(response.meta.msg)
        }
      })
    },
    handleActive (path) {
      this.activePath = path
      window.sessionStorage.setItem('activePath', path)
    }
  },
  created () {
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  mounted () {
    this.getMenuList()
  }
}
</script>
<style lang="less" scoped>

.el-container {
  height: 100%;
}

.el-header {
  background-color: #373d41;
  color: #ffffff;
  text-align: center;
  line-height: 60px;
  align-items: center;
  display: flex;
  font-size: 20px;
  justify-content: space-between;

  div {
    display: flex;
    align-items: center;

    > img {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background-color: #eeeeee;
    }

    > span {
      margin-left: 10px;
    }
  }

}

.el-aside {
  background-color: #333744;
  //color: #333;
  //text-align: center;
  //line-height: 200px;

  .el-menu {
    border-right: none;
  }

  //.el-menu-vertical:not(.el-menu--collapse) {
  //  width: 200px;
  //  min-height: 400px;
  //}
  .el-radio-group {
    //width: 50px;
    margin: 10px;
  }
}

.el-main {
  background-color: #eaedf1;
  color: #333;
  //text-align: center;
  //line-height: 160px;
}

body > .el-container {
  margin-bottom: 40px;
}

</style>
