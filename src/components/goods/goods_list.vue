<template>
  <div>
    <el-breadcrumb separator=">">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="2">
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <!-- 表单 -->
            <el-input
              placeholder="请输入内容"
              v-model="queryInfo.query"
              clearable
            ></el-input>
            <!-- 表单 -->
          </div>
        </el-col>
        <el-col :span="3">
          <el-button icon="el-icon-search" circle @click="queryMes"></el-button>
        </el-col>

        <el-col :span="4"
          ><div class="grid-content bg-purple">
            <!-- 按钮 -->
            <el-button type="primary" @click="skipToAdd">添加商品</el-button>
            <!-- 按钮 -->
          </div></el-col
        >
      </el-row>
      <!-- table表格 -->
      <el-table :data="tableData" style="width: 100%" border stripe="">
        <el-table-column type="index" label="#" width="50"> </el-table-column>
        <el-table-column prop="goods_name" label="商品名称" width="270">
        </el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" width="160">
        </el-table-column>
        <el-table-column prop="goods_weight" label="商品质量" width="140">
        </el-table-column>
        <el-table-column label="创建时间">
          <template slot-scope="scope">
            {{ scope.row.add_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="getGoods(scope.row.goods_id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteMes(scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="sizeChange"
        @current-change="pageChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 20, 50]"
        :page-size="5"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
      <!-- table表格 -->
    </el-card>
    <el-dialog title="提示" :visible.sync="editVis" width="55%">
      <span>编辑</span>
      <!-- 编辑表格 -->
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="商品名称" prop="goods_name">
          <el-input v-model="editForm.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" prop="goods_price">
          <el-input v-model="editForm.goods_price"></el-input>
        </el-form-item>
        <el-form-item label="商品质量" prop="goods_weight">
          <el-input v-model="editForm.goods_weight"></el-input>
        </el-form-item>
      </el-form>
      <!-- 编辑表格 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVis = false">取 消</el-button>
        <el-button type="primary" @click="editFormSubmit">提 交</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 20,
      },
      total: 0,
      tableData: [],
      editVis: false,
      editForm: {},
      editFormRules: {
        goods_name: [
          { required: true, trigger: "blur", message: "请填写商品名称" },
          { min: 2, max: 45, trigger: "blur", message: "请填写2~45个字符" },
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
    };
  },
  created() {
    this.getGoodsList();
  },
  methods: {
    getGoodsList: async function () {
      const { data: res } = await this.$http.get("goods", {
        params: this.queryInfo,
      });
      if (res.meta.status != 200) return this.$message.error("请求失败!");
      this.tableData = res.data.goods;
      this.total = res.data.total;
    },
    sizeChange: function (newsize) {
      this.queryInfo.pagesize = newsize;
      this.getGoodsList();
    },
    pageChange: function (newpage) {
      this.queryInfo.pagenum = newpage;
      this.getGoodsList();
    },
    queryMes: function () {
      this.getGoodsList();
    },
    deleteMes: async function (id) {
      const select = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (select != "confirm") return this.$message.info("已经取消删除");
      const { data: res } = await this.$http.delete(`goods/${id}`);
      if (res.meta.status != 200) return this.$message.error("删除失败");
      this.getGoodsList();
    },
    // 跳转到添加页面
    skipToAdd: function () {
      this.$router.push("/goods/add");
    },
    // 编辑商品
    async getGoods(id) {
      const { data: res } = await this.$http.get(`goods/${id}`);
      if (res.meta.status != 200)
        return this.$message.error("获取编辑信息失败");
      this.editVis = true;
      this.editForm = res.data;
    },
    // 提交编辑
    async editFormSubmit() {
      this.$refs.editFormRef.validate((valid) => {
        if (!valid) return this.$message.error("请正确填写各种项");
      });
      const { data: res } = await this.$http.put(
        `goods/${this.editForm.goods_id}`,
        this.editForm
      );
      if (res.meta.status != 200) return this.$message.error("修改失败");

      this.$message.success("修改成功");
      this.editVis = false;
      this.getGoodsList();
    },
  },
};
</script>

<style lang="less" scoped>
.el-card {
  margin-top: 15px;
}
.el-table {
  margin-top: 15px;
}
</style>