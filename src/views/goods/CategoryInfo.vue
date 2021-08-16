<template>
  <div>
    <!--顶部面包屑-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片内容区 -->
    <el-card>
      <el-alert
        title="注意：只允许为第三级分类设置相关参数"
        type="warning"
        show-icon
        :closable="false"
      >
      </el-alert>
      <el-row>
        <el-col>
          <span>选择商品分类：</span>
          <el-cascader
            v-model="selCategory"
            :options="categoryList"
            :props="cascaderProps"
            @change="handleCategoryChange"
            clearable
          >
          </el-cascader>
        </el-col>
      </el-row>

      <!-- tab标签 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!-- 动态参数 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            size="mini"
            :disabled="isButtonEnabled"
            @click="showAddDialog"
            >添加参数</el-button
          >
          <el-table :data="paramsList" stripe border style="width: 100%">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(tag, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="removeTags(i, scope.row)"
                >
                  {{ tag }}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.taginputValue"
                  ref="tagInputRef"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showTagInput(scope.row)"
                  >+ 添加</el-button
                >
              </template>
            </el-table-column>
            <el-table-column
              type="index"
              label="序号"
              width="100"
            ></el-table-column>
            <el-table-column prop="attr_name" label="参数名称">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scopes">
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-edit"
                  @click="editPropsDialog(scopes.row)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  @click="deletePropsDialog(scopes.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 静态属性 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            size="mini"
            :disabled="isButtonEnabled"
            @click="showAddDialog"
            >添加属性</el-button
          >
          <el-table :data="propsList" stripe border style="width: 100%">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(tag, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="removeTags(i, scope.row)"
                >
                  {{ tag }}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.taginputValue"
                  ref="tagInputRef"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showTagInput(scope.row)"
                  >+ 添加</el-button
                >
              </template>
            </el-table-column>
            <el-table-column
              type="index"
              label="序号"
              width="100"
            ></el-table-column>
            <el-table-column prop="attr_name" label="参数名称">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scopes">
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-edit"
                  @click="editPropsDialog(scopes.row)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  @click="deletePropsDialog(scopes.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加属性公用弹框 -->
    <el-dialog
      :title="'添加' + title"
      @close="closeAddDialog"
      :visible.sync="addDialogVisible"
      width="50%"
    >
      <el-form
        :model="addForm"
        :rules="addRules"
        ref="addRef"
        label-width="100px"
      >
        <el-form-item :label="title" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addData">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑属性公用弹框 -->
    <el-dialog
      :title="'编辑' + title"
      @close="closeEditDialog"
      :visible.sync="editDialogVisible"
      width="50%"
    >
      <el-form
        :model="editForm"
        :rules="editRules"
        ref="editRef"
        label-width="100px"
      >
        <el-form-item :label="title" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editData">确 定</el-button>
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
      categoryList: [],
      selCategory: [],
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover'
      },
      activeName: 'many',
      paramsList: [],
      propsList: [],
      addDialogVisible: false,
      addRules: {
        attr_name: [
          {
            required: true,
            message: '请输入参数',
            trigger: 'blur'
          },
          {
            min: 2,
            max: 20,
            message: '长度在 2 到 20 个字符',
            trigger: 'blur'
          }
        ]
      },
      addForm: {
        attr_name: ''
      },
      editDialogVisible: false,
      editForm: {
        attr_name: ''
      },
      editRules: {
        attr_name: [
          {
            required: true,
            message: '请输入参数',
            trigger: 'blur'
          },
          {
            min: 2,
            max: 20,
            message: '长度在 2 到 20 个字符',
            trigger: 'blur'
          }
        ]
      },
      propInfo: {}
    }
  },
  computed: {
    isButtonEnabled() {
      return this.selCategory.length !== 3
    },
    categoryId() {
      if (this.selCategory.length === 3) {
        return this.selCategory[2]
      } else {
        return null
      }
    },
    title() {
      if (this.activeName === 'many') {
        return '动态参数'
      }
      return '静态属性'
    }
  },
  methods: {
    getCategoryList() {
      http({
        url: 'categories',
        method: 'get',
        params: {
          type: 3
        }
      }).then(response => {
        if (response.meta.status === 200) {
          this.categoryList = response.data
        } else {
          this.$message.error(response.meta.msg)
        }
      })
    },
    getParamsList() {
      http({
        url: `categories/${this.categoryId}/attributes`,
        method: 'get',
        params: {
          sel: this.activeName
        }
      }).then(response => {
        if (response.meta.status === 200) {
          response.data.forEach(item => {
            item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
            // 处理每一行的输入框显示与隐藏
            item.inputVisible = false
            item.taginputValue = ''
          })
          if (this.activeName === 'many') {
            this.paramsList = response.data
          } else {
            this.propsList = response.data
          }
        } else {
          this.$message.error(response.meta.msg)
        }
      })
    },
    addParams() {
      http({
        url: `categories/${this.categoryId}/attributes`,
        method: 'post',
        data: {
          attr_name: this.addForm.attr_name,
          attr_sel: this.activeName,
          attr_vals: ''
        }
      }).then(response => {
        if (response.meta.status === 201) {
          this.$message.success('添加成功！')
          this.getParamsList()
          this.addDialogVisible = false
        } else {
          this.$message.error(response.meta.msg)
        }
      })
    },
    handleListData() {
      if (this.selCategory.length !== 3) {
        this.selCategory = []
        this.paramsList = []
        this.propsList = []
        return
      }
      this.getParamsList()
    },
    handleCategoryChange() {
      this.handleListData()
    },
    handleTabClick() {
      this.handleListData()
    },
    closeAddDialog() {
      this.$refs.addRef.resetFields()
    },
    showAddDialog() {
      this.addDialogVisible = true
    },
    addData() {
      this.$refs.addRef.validate(valid => {
        if (!valid) return
        this.addParams()
      })
    },
    closeEditDialog() {
      this.$refs.editRef.resetFields()
    },
    // 上送编辑参数
    editData() {
      this.$refs.editRef.validate(valid => {
        if (!valid) return
        http({
          url: `categories/${this.categoryId}/attributes/${this.propInfo.attr_id}`,
          method: 'put',
          data: {
            attr_name: this.editForm.attr_name,
            attr_sel: this.activeName
            // attr_vals: this.propInfo.attr_vals
          }
        }).then(response => {
          if (response.meta.status === 200) {
            this.$message.success('修改成功！')
            this.editDialogVisible = false
            this.getParamsList()
          } else {
            this.$message.error(response.meta.msg)
          }
        })
      })
    },
    deleteProps(props) {
      http({
        url: `categories/${this.categoryId}/attributes/${props.attr_id}`,
        method: 'delete'
      }).then(response => {
        if (response.meta.status === 200) {
          this.$message.success('删除成功！')
          this.getParamsList()
        } else {
          this.$message.error(response.meta.msg)
        }
      })
    },
    // 点击编辑按钮
    editPropsDialog(propInfo) {
      this.propInfo = propInfo
      this.editForm.attr_name = propInfo.attr_name
      this.editDialogVisible = true
    },
    deletePropsDialog(propInfo) {
      this.$confirm('此操作将永久删除该属性, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.deleteProps(propInfo)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    handleInputConfirm(row) {
      if (row.taginputValue.trim().length !== 0) {
        row.attr_vals.push(row.taginputValue.trim())
        // 上送服务端
        http({
          url: `categories/${this.categoryId}/attributes/${row.attr_id}`,
          method: 'put',
          data: {
            attr_name: row.attr_name,
            attr_sel: this.activeName,
            attr_vals: row.attr_vals.join(' ')
          }
        }).then(response => {
          if (response.meta.status === 200) {
            this.$message.success('添加成功！')
          } else {
            this.$message.error(response.meta.msg)
          }
        })
      }
      row.inputVisible = false
      row.taginputValue = ''
    },
    showTagInput(row) {
      row.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.tagInputRef.$refs.input.focus()
      })
    },
    removeTags(i, row) {
      row.attr_vals.splice(i, 1)
      http({
        url: `categories/${this.categoryId}/attributes/${row.attr_id}`,
        method: 'put',
        data: {
          attr_name: row.attr_name,
          attr_sel: this.activeName,
          attr_vals: row.attr_vals.join(' ')
        }
      }).then(response => {
        if (response.meta.status === 200) {
          this.$message.success('删除成功！')
        } else {
          this.$message.error(response.meta.msg)
        }
      })
    }
  },
  created() {},
  mounted() {
    this.getCategoryList()
  }
}
</script>

<style lang="less" scoped>
.el-card {
  margin-top: 15px;
}

.el-row {
  margin: 15px 0;

  .el-cascader {
    width: 300px;
  }
}

.el-table {
  margin-top: 15px;
}

.el-tag {
  margin: 0 10px 0 0;
}

.input-new-tag {
  width: 150px;
}
</style>

<style lang="less">
.el-cascader-panel {
  height: 200px;
}
</style>
