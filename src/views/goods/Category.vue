<template>
  <div>
    <!--顶部面包屑-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!--内容卡片区域-->
    <el-card>
      <el-button type="primary" @click="showAddCategoryDialog"
        >添加分类</el-button
      >
      <!--      商品分类-->
      <tree-table
        class="tree-table"
        ref="table"
        :data="goodsList"
        :columns="columns"
        show-index
        stripe
        border
        :expand-type="false"
        :selection-type="false"
      >
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="!scope.row.cat_deletedfalse"
            style="color:lightgreen"
          ></i>
          <i class="el-icon-error" style="color:red" v-else></i>
        </template>

        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag v-else-if="scope.row.cat_level === 1" type="success"
            >二级</el-tag
          >
          <el-tag v-else type="warning">三级</el-tag>
        </template>

        <template slot="opt">
          <el-button type="primary" icon="el-icon-edit">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete">删除</el-button>
        </template>
      </tree-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[2, 4, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加分类弹框 -->
    <el-dialog
      title="添加分类"
      @close="closeCategoryDialog"
      :visible.sync="addCategiryDialogVisible"
      width="50%"
    >
      <el-form
        :model="addCategoryForm"
        :rules="addCategoryRules"
        ref="addCategoryRef"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCategoryForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类" prop="aa">
          <el-cascader
            v-model="selCategory"
            :options="parentCategoryList"
            :props="cascaderProps"
            @change="handleCategoryChange"
            clearable
          >
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCategiryDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCategory">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { http } from '@/utils/http'

export default {
  components: {},
  data() {
    return {
      goodsList: [],
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      columns: [
        { label: '分类名称', prop: 'cat_name' },
        { label: '是否有效', type: 'template', template: 'isok' },
        { label: '排序', type: 'template', template: 'order' },
        { label: '操作', type: 'template', template: 'opt' }
      ],
      addCategoryRules: {
        cat_name: [
          {
            required: true,
            message: '请输入分类名称',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 20,
            message: '长度在 3 到 20 个字符',
            trigger: 'blur'
          }
        ]
      },
      addCategiryDialogVisible: false,
      addCategoryForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      parentCategoryList: [],
      selCategory: [],
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover',
        checkStrictly: true
      }
    }
  },
  computed: {},
  methods: {
    getCategoryList() {
      http({
        url: 'categories',
        mtehod: 'get',
        params: this.queryInfo
      }).then(response => {
        if (response.meta.status === 200) {
          this.total = response.data.total
          this.goodsList = response.data.result
        } else {
          this.$message.error(response.meta.msg)
        }
      })
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getCategoryList()
    },
    handleCurrentChange(page) {
      this.queryInfo.pagenum = page
      this.getCategoryList()
    },
    showAddCategoryDialog() {
      http({
        url: 'categories',
        method: 'get',
        params: {
          type: 2
        }
      }).then(response => {
        if (response.meta.status === 200) {
          this.parentCategoryList = response.data
          this.addCategiryDialogVisible = true
        } else {
          this.$message.error(response.meta.msg)
        }
      })
    },
    addCategory() {
      // 表单验证
      this.$refs.addCategoryRef.validate(valid => {
        if (!valid) return
        http({
          url: 'categories',
          method: 'post',
          data: this.addCategoryForm
        }).then(response => {
          if (response.meta.status === 201) {
            this.$message.success('添加成功！')
            this.addCategiryDialogVisible = false
            this.getCategoryList()
          } else {
            this.$message.error(response.meta.msg)
          }
        })
      })
    },
    closeCategoryDialog() {
      this.$refs.addCategoryRef.resetFields()
      this.addCategoryForm.cat_pid = 0
      this.addCategoryForm.cat_level = 0
      this.selCategory = []
    },
    handleCategoryChange() {
      // console.log(this.selCategory)
      if (this.selCategory.length > 0) {
        this.addCategoryForm.cat_pid = this.selCategory[
          this.selCategory.length - 1
        ]
        this.addCategoryForm.cat_level = this.selCategory.length
      } else {
        this.addCategoryForm.cat_pid = 0
        this.addCategoryForm.cat_level = 0
      }
    }
  },
  created() {},
  mounted() {
    this.getCategoryList()
  }
}
</script>

<style lang="less" scoped>
.el-breadcrumb {
  margin-bottom: 15px;
}
.tree-table {
  margin-top: 15px;
}

.el-cascader {
  width: 100%;
}

// @deep:~'>>>';

// @{deep} div {
// ::v-deep.el-cascader-panel {
//   height: 200px;
// }
// }
</style>

<style lang="less">
.el-cascader-panel {
  height: 200px;
}
</style>
