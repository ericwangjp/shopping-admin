<template>
  <div>
    <!--顶部面包屑-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!--内容卡片区域-->
    <el-card class="box-card">
      <el-alert
        title="添加商品信息"
        type="info"
        center
        show-icon
        :closable="false"
      >
      </el-alert>
      <!-- 横向进度条 -->
      <el-steps :active="active - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- 垂直tab -->
      <el-form
        :model="goodsForm"
        :rules="goodsFormRules"
        ref="goodsFormRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          tab-position="left"
          v-model="active"
          :before-leave="tabChange"
          @tab-click="tabClicked"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="goodsForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input
                v-model="goodsForm.goods_price"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input
                v-model="goodsForm.goods_weight"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input
                v-model="goodsForm.goods_number"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="goodsForm.goods_cat"
                :options="categoryList"
                :props="props"
                @change="handleSelChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              :label="item.attr_name"
              v-for="item in catAttrs"
              :key="item.attr_id"
            >
              <!-- 复选框组 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  v-for="(attr, i) in item.attr_vals"
                  :label="attr"
                  :key="i"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="item.attr_name"
              v-for="item in staticAttrs"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              :action="uploadUrl"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headers"
              :on-success="uploadSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">
                只能上传jpg/png文件，且不超过2M
              </div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor
              ref="myQuillEditor"
              v-model="goodsForm.goods_introduce"
            />
            <el-button class="btn-add" type="primary" @click="addGoods"
              >添加商品</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <el-dialog title="图片预览" :visible.sync="dialogVisible" width="50%">
      <img :src="previewImgPath" />
    </el-dialog>
  </div>
</template>

<script>
import { http } from '@/utils/http'
import { BASE_URL } from '@/utils/consts'
export default {
  components: {},
  data() {
    return {
      active: '0',
      goodsForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [],
        goods_introduce: '',
        pics: [],
        attrs: []
      },
      goodsFormRules: {
        goods_name: [
          {
            required: true,
            message: '请输入商品名称',
            trigger: 'blur'
          }
        ],
        goods_price: [
          {
            required: true,
            message: '请输入商品价格',
            trigger: 'blur'
          }
        ],
        goods_weight: [
          {
            required: true,
            message: '请输入商品重量',
            trigger: 'blur'
          }
        ],
        goods_number: [
          {
            required: true,
            message: '请输入商品数量',
            trigger: 'blur'
          }
        ],
        goods_cat: [
          {
            required: true,
            message: '请选择商品分类',
            trigger: 'blur'
          }
        ]
      },
      categoryList: [],
      props: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      catAttrs: [],
      staticAttrs: [],
      uploadUrl: `${BASE_URL}upload`,
      headers: {
        Authorization: window.sessionStorage.getItem('token')
      },
      previewImgPath: '',
      dialogVisible: false
    }
  },
  computed: {
    categoryId() {
      if (this.goodsForm.goods_cat.length === 3) {
        return this.goodsForm.goods_cat[2]
      }
      return null
    }
  },
  methods: {
    addGoods() {
      this.$refs.goodsFormRef.validate(valid => {
        if (!valid) return this.$message.error('请填写必要的表单项！')
        const form = Object.assign({}, this.goodsForm)
        form.goods_cat = form.goods_cat.join(',')
        // 处理动态参数
        this.catAttrs.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          this.goodsForm.attrs.push(newInfo)
        })
        // 处理静态属性
        this.staticAttrs.forEach(item => {
          const newAttrs = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          this.goodsForm.attrs.push(newAttrs)
        })
        form.attrs = this.goodsForm.attrs
        http({
          url: 'goods',
          method: 'post',
          data: form
        }).then(response => {
          if (response.meta.status === 201) {
            this.$message.success('商品添加成功！')
            this.$router.push('/goods')
          } else {
            this.$message.error(response.meta.msg)
          }
        })
      })
    },
    getCategoriesList() {
      http({
        url: 'categories',
        method: 'get'
      }).then(response => {
        if (response.meta.status === 200) {
          this.categoryList = response.data
        } else {
          this.$message.error(response.meta.msg)
        }
      })
    },
    handleSelChange() {
      if (this.goodsForm.goods_cat.length !== 3) {
        this.goodsForm.goods_cat = []
      }
    },
    tabChange(activeName, oldActiveName) {
      if (oldActiveName === '0' && this.goodsForm.goods_cat.length !== 3) {
        this.$message.error('请先选择商品分类！')
        return false
      }
    },
    tabClicked() {
      if (this.active === '1') {
        http({
          url: `categories/${this.categoryId}/attributes`,
          method: 'get',
          params: {
            sel: 'many'
          }
        }).then(response => {
          if (response.meta.status === 200) {
            response.data.forEach(item => {
              item.attr_vals =
                item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
            })
            this.catAttrs = response.data
          } else {
            this.$message.error(response.meta.msg)
          }
        })
      } else if (this.active === '2') {
        http({
          url: `categories/${this.categoryId}/attributes`,
          method: 'get',
          params: {
            sel: 'only'
          }
        }).then(response => {
          if (response.meta.status === 200) {
            // response.data.forEach(item => {
            //   item.attr_vals =
            //     item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
            // })
            this.staticAttrs = response.data
          } else {
            this.$message.error(response.meta.msg)
          }
        })
      }
    },
    // 图片预览
    handlePreview(file) {
      console.log(file)
      this.previewImgPath = file.response.data.url
      this.dialogVisible = true
    },
    // 移除已选中的上传的文件
    handleRemove(file) {
      const filePath = file.response.data.tmp_path
      const index = this.goodsForm.pics.findIndex(item => item.pic === filePath)
      this.goodsForm.pics.splice(index, 1)
      console.log(this.goodsForm)
    },
    uploadSuccess(response) {
      if (response.meta.status === 200) {
        this.goodsForm.pics.push(response.data.tmp_path)
      }
    }
  },
  created() {},
  mounted() {
    this.getCategoriesList()
  }
}
</script>

<style lang="less" scoped>
.box-card {
  margin-top: 15px;

  .el-steps {
    margin-top: 15px;

    /deep/.el-step__title {
      font-size: 14px;
    }
  }

  .el-tabs {
    margin-top: 15px;
  }

  .el-cascader {
    width: 300px;
  }

  /deep/.el-checkbox {
    margin: 0 10px 0 0 !important;
  }

  .btn-add {
    margin-top: 15px;
  }
}

.el-dialog {
  /deep/img {
    width: 100%;
  }
}
</style>

<style lang="less">
.el-cascader-panel {
  height: 200px;
}

.ql-container {
  min-height: 300px;
}
</style>
