<template>
  <div>
    <!--    顶部面包屑-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--内容卡片区域-->
    <el-card class="box-card">
      <!--      用户列表-->
      <el-table
        :data="permissionList"
        stripe
        border
        style="width: 100%">
        <el-table-column type="index" label="序号" width="80"></el-table-column>
        <el-table-column prop="authName" label="权限名称"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level === '0'">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.level === '1'">二级</el-tag>
            <el-tag type="warning" v-else>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { http } from '@/utils/http'

export default {
  name: 'Rights',
  data () {
    return {
      permissionList: []
    }
  },
  mounted () {
    http({
      // list / tree
      url: 'rights/list',
      method: 'get'
    }).then(response => {
      if (response.meta.status === 200) {
        this.permissionList = response.data
      } else {
        this.$message.error(response.meta.msg)
      }
    })
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
</style>
