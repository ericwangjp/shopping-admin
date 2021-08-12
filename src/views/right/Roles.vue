<template>
  <div>
    <!--    顶部面包屑-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--内容卡片区域-->
    <el-card class="box-card">
      <el-row>
        <el-col>
          <el-button type="primary" @click="addRole">添加角色</el-button>
        </el-col>
      </el-row>
      <!--      角色列表-->
      <el-table
        :data="roleList"
        stripe
        border
        style="width: 100%">
        <el-table-column type="expand" width="80">
          <template slot-scope="scope">
            <el-row v-for="(item1,idx1) in scope.row.children" :key="item1.id"
                    :class="['bdbottom',idx1===0?'bdtop':'']" class="vcenter">
              <!-- 一级权限列表-->
              <el-col :span="5">
                <el-tag closable @close="removePermission(scope.row,item1.id)">{{ item1.authName }}</el-tag>
                <i class=" el-icon-caret-right"></i>
              </el-col>
              <!--二、三级权限列表-->
              <el-col :span="19">
                <!--二级权限-->
                <el-row v-for="(item2,idx2) in item1.children" :key="item2.id"
                        :class="[idx2===0?'':'bdtop']" class="vcenter">
                  <el-col :span="6">
                    <el-tag type="success" closable @close="removePermission(scope.row,item2.id)">{{ item2.authName }}
                    </el-tag>
                    <i class=" el-icon-caret-right"></i>
                  </el-col>
                  <!--三级权限-->
                  <el-col :span="18">
                    <el-tag type="warning" closable v-for="item3 in item2.children"
                            :key="item3.id" @close="removePermission(scope.row,item3.id)">{{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="序号" width="80"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column prop="level" label="操作" width="300">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="editUser(scope.row)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteUser(scope.row.id)">删除</el-button>
            <el-tooltip class="item" effect="dark" content="分配权限" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini" @click="showPermissionDialog(scope.row)">分配权限
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!--分配权限弹框-->
    <el-dialog
      title="权限分配"
      @close="clearDialogData"
      :visible.sync="permissionDialogVisible"
      width="50%">
      <!--树形控件-->
      <el-tree
        ref="treeRef"
        :data="permissionList"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
        :props="permissionProps">
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="permissionDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updatePermission">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { http } from '@/network/http'

export default {
  name: 'Roles',
  data () {
    return {
      roleList: [],
      permissionDialogVisible: false,
      permissionList: [],
      permissionProps: {
        children: 'children',
        label: 'authName'
      },
      defKeys: [],
      roleId: ''
    }
  },
  mounted () {
    this.getRoleList()
  },
  methods: {
    getRoleList () {
      http({
        url: 'roles',
        method: 'get'
      }).then(response => {
        if (response.meta.status === 200) {
          this.roleList = response.data
        } else {
          this.$message.error(response.meta.msg)
        }
      })
    },
    addRole () {
    },
    editUser (id) {
    },
    deleteUser (id) {
    },
    removePermission (role, permissionId) {
      this.$confirm('此操作将删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        http({
          url: `roles/${role.id}/rights/${permissionId}`,
          method: 'delete'
        }).then(response => {
          if (response.meta.status === 200) {
            role.children = response.data
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          } else {
            this.$message.error(response.meta.msg)
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    showPermissionDialog (role) {
      this.roleId = role.id
      http({
        url: 'rights/tree',
        method: 'get'
      }).then(response => {
        if (response.meta.status === 200) {
          this.getNodeKeys(role, this.defKeys)
          this.permissionDialogVisible = true
          this.permissionList = response.data
        } else {
          this.$message.error(response.meta.msg)
        }
      })
    },
    getNodeKeys (node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.getNodeKeys(item, arr)
      })
    },
    clearDialogData () {
      this.defKeys = []
    },
    updatePermission () {
      const keys = [...this.$refs.treeRef.getCheckedKeys(), ...this.$refs.treeRef.getHalfCheckedKeys()]
      http({
        url: `roles/${this.roleId}/rights`,
        method: 'post',
        data: {
          rids: keys.join(',')
        }
      }).then(response => {
        if (response.meta.status === 200) {
          this.permissionDialogVisible = false
          this.$message.success('权限分配成功！')
          //  刷新列表
          this.getRoleList()
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

.el-tag {
  margin: 8px;
}

.bdbottom {
  border-bottom: 1px solid #eeeeee;
}

.bdtop {
  border-top: 1px solid #eeeeee;
}

.vcenter {
  display: flex;
  align-items: center;
}
</style>
