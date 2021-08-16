<template>
  <div class="login-container">
    <div class="login-box">
      <!--      头像-->
      <div class="avatar-box">
        <img src="../assets/logo.png">
      </div>

      <el-form ref="loginFormRef" :rules="loginRules" :model="loginForm" label-width="0px" class="input-data">
        <!--用户名-->
        <el-form-item prop="username">
          <el-input prefix-icon="el-icon-user" v-model="loginForm.username"></el-input>
        </el-form-item>
        <!--密码-->
        <el-form-item prop="password">
          <el-input prefix-icon="el-icon-lock" v-model="loginForm.password" type="password"></el-input>
        </el-form-item>
        <!--按钮-->
        <el-form-item class="sub-btn">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetData">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { http } from '@/utils/http'

export default {
  data () {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 20,
            message: '用户名长度在 3 到 20 个字符',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 20,
            message: '密码长度在 3 到 20 个字符',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    resetData () {
      this.$refs.loginFormRef.resetFields()
    },
    login () {
      this.$refs.loginFormRef.validate(validate => {
        if (!validate) return
        http({
          url: 'login',
          method: 'POST',
          params: {
            username: this.loginForm.username,
            password: this.loginForm.password
          }
        }).then(response => {
          console.log(response)
          if (response.meta.status !== 200) {
            this.$message.error(response.meta.msg)
          } else {
            this.$message.success(response.meta.msg)
            window.sessionStorage.setItem('token', response.data.token)
            this.$router.push('/home')
          }
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login-container {
  background-color: #2b4b6b;
  height: 100%;

  .login-box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    .avatar-box {
      width: 130px;
      height: 130px;
      border: 1px solid #eee;
      border-radius: 50%;
      padding: 10px;
      box-shadow: 0 0 10px #ddd;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #fff;

      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eeeeee;
      }
    }

    .input-data {
      position: absolute;
      bottom: 0;
      padding: 0 20px;
      width: 100%;
      box-sizing: border-box;

      .sub-btn {
        display: flex;
        justify-content: flex-end;
      }
    }
  }
}
</style>
