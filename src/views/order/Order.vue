<template>
  <div>
    <!--    顶部面包屑-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--内容卡片区域-->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="10">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            class="input-with-select"
            @clear="getOrders"
            clearable
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getOrders"
            ></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!--      用户列表-->
      <el-table :data="orderList" stripe border style="width: 100%">
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column prop="order_number" label="订单编号"></el-table-column>
        <el-table-column
          prop="order_price"
          label="订单价格"
          width="120"
        ></el-table-column>
        <el-table-column prop="order_pay" label="是否付款" width="120">
          <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.order_pay === '0'"
              >未付款</el-tag
            >
            <el-tag type="success" v-else>已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="is_send"
          label="是否发货"
          width="120"
        ></el-table-column>
        <el-table-column prop="create_time" label="下单时间" width="200">
          <template slot-scope="scope">
            {{ scope.row.create_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
            ></el-button>
            <el-button
              type="success"
              icon="el-icon-location"
              size="mini"
              @click="showExpressDialog(scope.row.id)"
            ></el-button>
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

    <!-- 修改地址弹框 -->
    <el-dialog
      title="修改地址"
      :visible.sync="dialogAddressVisible"
      width="50%"
      @close="resetForm"
    >
      <el-form
        :model="editAddressForm"
        :rules="editAddressRules"
        ref="editAddressRef"
        label-width="100px"
      >
        <el-form-item label="省市区/县" prop="username">
          <el-input v-model="editAddressForm.username"></el-input>
        </el-form-item>
        <el-form-item label="详细地址" prop="address">
          <el-input v-model="editAddressForm.address"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogAddressVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitEdit">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 物流进度查询弹框 -->
    <el-dialog
      title="物流查询"
      :visible.sync="dialogExpressVisible"
      width="50%"
      @close="resetExpressForm"
    >
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in progressInfo"
          :key="index"
          :timestamp="activity.timestamp"
        >
          {{ activity.content }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import { http } from '@/utils/http'

export default {
  components: {},
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5,
        user_id: '',
        pay_status: '',
        is_send: '',
        order_fapiao_title: '',
        order_fapiao_company: '',
        order_fapiao_content: '',
        consignee_addr: ''
      },
      total: 0,
      orderList: [],
      dialogAddressVisible: false,
      editAddressForm: {
        username: [],
        address: ''
      },
      editAddressRules: {
        username: [
          {
            required: true,
            message: '省市区/县',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 20,
            message: '长度在 1 到 20 个字符',
            trigger: 'blur'
          }
        ],
        address: [
          {
            required: true,
            message: '详细地址',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 20,
            message: '长度在 1 到 20 个字符',
            trigger: 'blur'
          }
        ]
      },
      dialogExpressVisible: false,
      progressInfo: [
        {
          content: '活动按期开始',
          timestamp: '2018-04-15'
        },
        {
          content: '通过审核',
          timestamp: '2018-04-13'
        },
        {
          content: '创建成功',
          timestamp: '2018-04-11'
        }
      ]
    }
  },
  computed: {},
  methods: {
    getOrders() {
      http({
        url: 'orders',
        method: 'get',
        params: this.queryInfo
      }).then(response => {
        if (response.meta.status === 200) {
          this.orderList = response.data.goods
          this.total = response.data.total
        } else {
          this.$message.error(response.meta.msg)
        }
      })
    },
    showEditDialog(id) {
      this.dialogAddressVisible = true
    },
    showExpressDialog(id) {
      this.queryExpressInfo()
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrders()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getOrders()
    },
    submitEdit() {
      this.dialogAddressVisible = false
    },
    resetForm() {
      this.$refs.editAddressRef.resetFields()
    },
    resetExpressForm() {},
    queryExpressInfo() {
      // 此接口已不通.临时处理方式
      this.dialogExpressVisible = true
      http({
        url: 'kuaidi/804909574412544580',
        method: 'get'
      }).then(response => {
        if (response.meta.status === 200) {
          this.progressInfo = response.data
          this.dialogExpressVisible = true
        } else {
          this.$message.error(response.meta.msg)
        }
      })
    }
  },
  created() {},
  mounted() {
    this.getOrders()
  }
}
</script>

<style lang="less" scoped>
.box-card {
  margin-top: 15px;

  .el-table {
    margin-top: 15px;
  }

  .el-pagination {
    margin-top: 15px;
  }
}
</style>
