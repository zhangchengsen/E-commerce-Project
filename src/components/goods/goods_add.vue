<template>
  <div>
    <el-breadcrumb separator=">">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert title="添加商品信息" type="info" center show-icon> </el-alert>
      <el-steps :active="activeName - 0" align-center="">
        <el-step title="基本属性" description=""></el-step>
        <el-step title="商品参数" description=""></el-step>
        <el-step title="商品属性" description=""></el-step>
        <el-step title="商品图片" description=""></el-step>
        <el-step title="商品内容" description=""></el-step>
        <el-step title="完成" description=""></el-step>
      </el-steps>
      <el-form
        :model="addFormData"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-tabs
          :tab-position="'left'"
          v-model="activeName"
          :before-leave="beforeLeave"
          @tab-click="tabClick"
        >
          <!-- 标签页中的form -->
          <el-tab-pane label="基本属性" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addFormData.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addFormData.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品质量" prop="goods_weight">
              <el-input v-model="addFormData.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addFormData.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类">
              <el-cascader
                v-model="cascaderId"
                :options="categoriesMes"
                :props="cascaderProp"
                @change="cascaderChange"
              ></el-cascader>
            </el-form-item>
            <!--标签页的form -->
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <!-- 多复选框 -->
            <el-form-item
              :label="item.attr_name"
              v-for="item in paramsData"
              :key="item.attr_id"
            >
              <el-checkbox-group b v-model="item.attr_vals">
                <el-checkbox
                  border
                  :label="cb"
                  v-for="(cb, i) in item.attr_vals"
                  :key="i"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <!-- 多复选框 -->
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <!-- 静态属性 -->
            <el-form-item
              :label="item.attr_name"
              v-for="item in paramsOnlyData"
              :key="item.attr_id"
              label-width="200px"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
            <!-- 静态属性 -->
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- 图片上传 -->
            <el-upload
              class="upload-demo"
              :action="uploadURL"
              :headers="uploadHeader"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :on-success="picSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>

            <!-- 图片上传 -->
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addFormData.goods_introduce"></quill-editor>
            <!-- 点击添加然后验证 -->
            <el-button type="primary" @click.stop="add">添加</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <el-dialog title="提示" :visible.sync="imgVis" width="40%">
      <span>查看图片</span>
      <img :src="imgSrc" alt="" class="img" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="imgVis = false">取 消</el-button>
        <el-button type="primary" @click="imgVis = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import _ from "lodash";

export default {
  data() {
    return {
      activeName: 0,
      addFormRules: {
        goods_name: [
          { required: true, trigger: "blur", message: "请填写商品名称" },
          { min: 2, max: 30, trigger: "blur", message: "请填写2~30个字符" },
        ],
        goods_price: [
          { required: true, trigger: "blur", message: "请填写商品名称" },
        ],
        goods_weight: [
          { required: true, trigger: "blur", message: "请填写商品重量" },
          ,
        ],
        goods_number: [
          { required: true, trigger: "blur", message: "请填写商品数量" },
        ],
      },
      addFormData: {
        goods_name: "",
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [],
        // 商品id
        pics: [],
        goods_introduce: "",
      },
      cascaderId: [],
      cascaderProp: {
        label: "cat_name",
        expandTrigger: "hover",
        value: "cat_id",
        children: "children",
      },
      // 商品分类参数
      categoriesMes: [],
      paramsData: [],
      paramsOnlyData: [],
      uploadHeader: {
        Authorization: window.sessionStorage.getItem("token"),
      },
      uploadURL: "http://127.0.0.1:8888/api/private/v1/upload",
      imgSrc: "",
      imgVis: false,
    };
  },
  methods: {
    async getCategories() {
      const { data: res } = await this.$http.get("categories");
      if (res.meta.status != 200) return this.$message.error("获取参数失败");
      this.categoriesMes = res.data;
    },
    cascaderChange() {
      if (this.cascaderId.length != 3) {
        return (this.cascaderId = []);
      }
    },
    beforeLeave(activeName, oldName) {
      if (oldName === "0" && this.cascaderId.length != 3) {
        this.$message.info("请先选择商品分类");
        return false;
      }
    },
    async tabClick() {
      if (this.activeName != "0") {
        // 动态
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: {
              sel: "many",
            },
          }
        );
        if (res.meta.status != 200) return this.$message.error(res.meta.msg);
        res.data.forEach((item) => {
          item.attr_vals =
            item.attr_vals == "" ? [] : item.attr_vals.split(" ");
        });
        this.paramsData = res.data;
        console.log(this.paramsData);

        // 静态
        const { data: ret } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: {
              sel: "only",
            },
          }
        );
        if (ret.meta.status != 200) return this.$message.error(ret.meta.msg);

        this.paramsOnlyData = ret.data;
      }
    },
    // 预览图片
    handlePreview(file) {
      this.imgSrc = file.response.data.url;
      console.log(this.imgSrc);
      this.imgVis = true;
    },
    // 删除图片
    handleRemove(file) {
      const filePath = file.response.data.tmp_path;
      var i = this.addFormData.pics.findIndex((x) => {
        return x.pic == filePath;
      });
      this.addFormData.pics.splice(i);
    },
    // 成功上传图片
    picSuccess: function (response) {
      const picInfo = {
        pic: response.data.tmp_path,
      };
      this.addFormData.pics.push(picInfo);
    },
    // 最后
    async add() {
      this.$refs.addFormRef.validate((valid) => {
        if (!valid) return this.$message.error("请填写必要项");
      });
      this.addFormData.goods_cat = this.cascaderId;
      var form = _.cloneDeep(this.addFormData);
      form.goods_cat = form.goods_cat.join(",");
      this.addFormData.attrs = [];
      this.paramsData.forEach((item) => {
        const newInfo = {
          attr_id: item.attr_id,
          attr_value: item.attr_vals.join(" "),
        };
        this.addFormData.attrs.push(newInfo);
      });
      this.paramsOnlyData.forEach((item) => {
        const newInfo = {
          attr_id: item.attr_id,
          attr_value: item.attr_vals,
        };
        this.addFormData.attrs.push(newInfo);
      });
      form.attrs = this.addFormData.attrs;
      const { data: res } = await this.$http.post("goods", form);
      console.log(res);
      if (res.meta.status != 201) return this.$message.error("添加请求失败");
      this.$message.success("添加成功");
      this.$router.push("/categories");
    },
  },
  created() {
    this.getCategories();
  },
  computed: {
    cateId() {
      if (this.cascaderId.length == 3) return this.cascaderId[2];
      else return [];
    },
  },
};
</script>

<style lang="less" scoped>
.el-card {
  margin-top: 15px;
}
.el-tabs {
  margin-top: 20px;
}
.el-form-item {
  width: 400px !important;
}
.img {
  width: 100%;
}
.el-button {
  margin-top: 15px;
}
</style>