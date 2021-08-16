<template>
  <div>
    <!--顶部面包屑-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--内容卡片区域-->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="10">
          <el-input
            placeholder="请输入内容"
            v-model="goodsQuery.query"
            class="input-with-select"
            clearable
            @clear="getGoodsList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getGoodsList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="goAddPage">添加商品</el-button>
        </el-col>
      </el-row>

      <!--      商品列表-->
      <el-table :data="goodsList" stripe border style="width: 100%">
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称"></el-table-column>
        <el-table-column
          prop="goods_price"
          label="商品价格(元)"
          width="110"
        ></el-table-column>
        <el-table-column
          prop="goods_weight"
          width="90"
          label="商品重量"
        ></el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="180">
          <template slot-scope="scope">
            {{ scope.row.add_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editGoods(scope.row.goods_id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteGoods(scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--      页面底部分页-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="goodsQuery.pagenum"
        :page-sizes="[2, 5, 10, 15]"
        :page-size="goodsQuery.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { http } from '@/utils/http'
export default {
  components: {},
  data() {
    return {
      goodsQuery: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      goodsList: [],
      addForm: {
        goods_name: '',
        password: ''
      },
      addRules: {
        goods_name: [],
        password: []
      }
    }
  },
  computed: {},
  methods: {
    getGoodsList() {
      http({
        url: 'goods',
        method: 'get',
        params: this.goodsQuery
      }).then(response => {
        if (response.meta.status === 200) {
          this.goodsList = response.data.goods
          this.total = response.data.total
        } else {
          this.$message.error(response.meta.msg)
        }
      })
    },
    goAddPage() {
      this.$router.push('/goods/add')
    },
    handleSizeChange(newSize) {
      this.goodsQuery.pagesize = newSize
      this.getGoodsList()
    },
    handleCurrentChange(curPage) {
      this.goodsQuery.pagenum = curPage
      this.getGoodsList()
    },
    editGoods(id) {},
    deleteGoods(id) {
      this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          http({
            url: 'goods/' + id,
            method: 'delete'
          }).then(response => {
            if (response.meta.status === 200) {
              this.$message.success('删除成功！')
              this.getGoodsList()
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
    }
  },
  created() {},
  mounted() {
    this.getGoodsList()
  }
}
</script>

<style lang="less" scoped>
.box-card {
  margin-top: 15px;

  .el-table {
    margin-top: 15px;
    margin-bottom: 15px;
  }
}
</style>
