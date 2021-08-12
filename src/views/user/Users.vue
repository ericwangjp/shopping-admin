<template>
  <div>
    <!--    顶部面包屑-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--内容卡片区域-->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="10">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            class="input-with-select"
            @clear="getUsers"
            clearable
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUsers"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="dialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>

      <!--      用户列表-->
      <el-table :data="userList" stripe border style="width: 100%">
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column
          prop="username"
          label="姓名"
          width="120"
        ></el-table-column>
        <el-table-column
          prop="email"
          label="邮箱"
          width="180"
        ></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column label="状态" width="80">
          <template slot-scope="scope">
            <el-switch
              @change="handleUserState(scope.row)"
              v-model="scope.row.mg_state"
              active-color="#409eff"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editUser(scope.row.id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteUser(scope.row.id)"
            ></el-button>
            <el-tooltip
              class="item"
              effect="dark"
              content="分配权限"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="permissionDispatch(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!--      页面底部分页-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[2, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!--    增加用户-->
    <el-dialog
      title="添加用户"
      @close="closeDialog"
      :visible.sync="dialogVisible"
      width="50%"
    >
      <el-form
        :model="addForm"
        :rules="addRules"
        ref="addFormRef"
        label-width="100px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!--    编辑用户-->
    <el-dialog
      title="编辑用户"
      @close="closeEditDialog"
      :visible.sync="editDialogVisible"
      width="50%"
    >
      <el-form
        :model="editForm"
        :rules="addRules"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserSubmit">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限-->
    <el-dialog
      title="分配权限"
      @close="closePermissionDialog"
      :visible.sync="permissionDialogVisible"
      width="50%"
    >
      <p>
        用户名：<span>{{ userInfo.username }}</span>
      </p>
      <p>
        角色：<span>{{ userInfo.role_name }}</span>
      </p>
      <span>新分配的角色：</span>
      <el-select v-model="selRole" placeholder="请选择">
        <el-option
          v-for="item in roleList"
          :key="item.id"
          :label="item.roleName"
          :value="item.id"
        >
        </el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="permissionDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setUserPermission">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { http } from '@/network/http'

export default {
  name: 'Users',
  data() {
    const checkEmail = (rule, value, callback) => {
      const regEmail = /^([a-zA-Z0-9]+[_|_|\-|.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/
      if (!regEmail.test(value)) {
        console.log('邮箱检查不通过')
        return callback(new Error('请输入正确的邮箱'))
      }
      callback()
    }

    const checkMobile = (rule, value, callback) => {
      const regMobile = /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/
      if (!regMobile.test(value)) {
        return callback(new Error('请输入正确的手机号码'))
      }
      callback()
    }
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      userList: [],
      dialogVisible: false,
      editDialogVisible: false,
      permissionDialogVisible: false,
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editForm: {
        username: '',
        email: '',
        mobile: '',
        id: ''
      },
      addRules: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 20,
            message: '长度在 3 到 20 个字符',
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
            message: '长度在 3 到 20 个字符',
            trigger: 'blur'
          }
        ],
        email: [
          {
            required: true,
            message: '请输入邮箱',
            trigger: 'blur'
          },
          {
            validator: checkEmail,
            trigger: 'blur'
          }
        ],
        mobile: [
          {
            required: true,
            message: '请输入手机号码',
            trigger: 'blur'
          },
          {
            validator: checkMobile,
            trigger: 'blur'
          }
        ]
      },
      userInfo: {},
      selRole: '',
      roleList: []
    }
  },
  mounted() {
    this.getUsers()
  },
  methods: {
    getUsers() {
      http({
        url: 'users',
        method: 'get',
        params: this.queryInfo
      }).then(response => {
        console.log(response)
        if (response.meta.status === 200) {
          this.total = response.data.total
          this.userList = response.data.users
        } else {
          this.$message.error(response.meta.msg)
        }
      })
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getUsers()
    },
    handleCurrentChange(curPage) {
      this.queryInfo.pagenum = curPage
      this.getUsers()
    },
    handleUserState(state) {
      http({
        url: `users/${state.id}/state/${state.mg_state}`,
        method: 'put'
      }).then(response => {
        if (response.meta.status === 200) {
          this.$message.success('更新用户状态成功！')
        } else {
          state.mg_state = !state.mg_state
          this.$message.error(response.meta.msg)
        }
      })
    },
    closeDialog() {
      this.$refs.addFormRef.resetFields()
    },
    closeEditDialog() {
      this.$refs.editFormRef.resetFields()
    },
    addUser() {
      this.$refs.addFormRef.validate(validate => {
        if (!validate) return
        http({
          url: 'users',
          method: 'post',
          data: this.addForm
        }).then(response => {
          if (response.meta.status === 201) {
            this.$message.success('添加成功!')
            this.dialogVisible = false
            this.getUsers()
          } else {
            this.$message.error(response.meta.msg)
          }
        })
      })
    },
    editUserSubmit() {
      this.$refs.editFormRef.validate(valid => {
        if (!valid) return
        http({
          url: 'users/' + this.editForm.id,
          method: 'put',
          data: this.editForm
        }).then(response => {
          if (response.meta.status === 200) {
            this.$message.success('更新用户信息成功！')
            this.editDialogVisible = false
            this.getUsers()
          } else {
            this.$message.error(response.meta.msg)
          }
        })
      })
    },
    editUser(id) {
      this.editDialogVisible = true
      http({
        url: `users/${id}`,
        method: 'get'
      }).then(response => {
        if (response.meta.status === 200) {
          this.editForm = response.data
        } else {
          this.$message.error(response.meta.msg)
        }
      })
    },
    deleteUser(id) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          http({
            url: 'users/' + id,
            method: 'delete'
          }).then(response => {
            if (response.meta.status === 200) {
              this.$message.success('删除成功！')
              this.getUsers()
            } else {
              this.$message.error(response.meta.msg)
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    closePermissionDialog() {
      this.selRole = ''
    },
    setUserPermission() {
      if (!this.selRole) {
        this.$message.info('请选择角色!')
        return
      }
      http({
        url: `users/${this.userInfo.id}/role`,
        method: 'put',
        data: {
          rid: this.selRole
        }
      }).then(response => {
        if (response.meta.status === 200) {
          this.$message.success('用户权限分配成功！')
          this.getUsers()
          this.permissionDialogVisible = false
        } else {
          this.$message.error(response.meta.msg)
        }
      })
    },
    permissionDispatch(role) {
      this.userInfo = role
      http({
        url: 'roles',
        method: 'get'
      }).then(response => {
        if (response.meta.status === 200) {
          this.roleList = response.data
          this.permissionDialogVisible = true
        } else {
          this.$message.error(response.meta.msg)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.el-breadcrumb {
  margin-bottom: 15px;
}

.el-table {
  margin-top: 15px;
}

.el-pagination {
  margin-top: 15px;
}
</style>
