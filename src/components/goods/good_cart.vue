<template>
  <div>
    <el-breadcrumb separator=">">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-button type="primary" @click="addGoods">添加商品</el-button>
      <tree-table
        class="tree-table"
        :data="queryList"
        :columns="columnsList"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        :show-row-hover="false"
      >
        <template slot="like" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            :style="styleG"
          ></i>
          <i class="el-icon-error" v-else :style="styleR"></i>
        </template>
        <template slot="permutation" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level == 0">一级</el-tag>
          <el-tag v-if="scope.row.cat_level == 1" type="success">二级</el-tag>
          <el-tag v-if="scope.row.cat_level == 2" tpye="warning">三级</el-tag>
        </template>
        <template slot="oper" slot-scope="scope">
          <el-button type="primary" @click="editGoods(scope.row.cat_id)"
            >编辑</el-button
          >
          <el-button type="danger" @click="removeGoods(scope.row.cat_id)"
            >删除</el-button
          >
        </template>
      </tree-table>
      <el-pagination
        @size-change="pageSizeChange"
        @current-change="pageChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, prev, pager, next,jumper "
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 对话框 -->
    <el-dialog title="添加商品" :visible.sync="dialogVis" width="30%">
      <el-form
        :model="editForm"
        :rules="editRules"
        ref="editRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            change-on-select
            size="small"
            clearable
            expand-trigger="hover"
            v-model="cascaderId"
            :options="cascaderOption"
            :props="cascaderProps"
            @change="cascaderChange"
          ></el-cascader>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVis = false">取 消</el-button>
        <el-button type="primary" @click="validForm">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑↓ -->
    <el-dialog title="添加商品" :visible.sync="editGoodsVis" width="30%">
      <el-form
        :model="editGoodsForm"
        :rules="editGoodsRules"
        ref="editGoodsRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editGoodsForm.cat_name"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editGoodsVis = false">取 消</el-button>
        <el-button type="primary" @click="editSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      queryList: [],
      columnsList: [
        {
          label: "商品",
          prop: "cat_name",
          minwidth: 120,
        },
        {
          label: "是否有效",
          type: "template",
          minwidth: 120,
          template: "like",
        },
        {
          label: "排序",
          minwidth: 120,
          type: "template",
          template: "permutation",
        },
        {
          label: "操作",
          type: "template",
          template: "oper",
        },
      ],
      styleG: {
        color: "lightgreen",
      },
      styleR: {
        color: "red",
      },

      editRules: {
        cat_name: [
          { required: true, trigger: "blur", message: "请输入分类名称" },
          { max: 10, min: 2 },
        ],
      },
      editForm: {
        cat_name: "",
        cat_pid: 0,
        cat_level: 0,
      },
      dialogVis: false,
      cascaderId: [],
      cascaderOption: [],
      cascaderProps: {
        expandTrigger: "hover",
        label: "cat_name",
        value: "cat_id",
        children: "children",
      },
      // 分页
      total: 0,
      removeVis: false,
      removeId: "",
      // 商品编辑
      editGoodsRules: {
        cat_name: [
          { required: true, trigger: "blur", message: "请输入分类名称" },
          { max: 10, min: 2 },
        ],
      },
      editGoodsVis: false,
      editGoodsForm: {
        cat_name: "",
      },
      editId: "",
    };
  },
  created() {
    this.getGoodsList();
  },
  methods: {
    getGoodsList: async function () {
      const { data: ret } = await this.$http.get("categories");
      this.total = ret.data.length;
      const { data: res } = await this.$http.get("categories", {
        params: this.queryInfo,
      });
      if (res.meta.status != 200) return this.$message.error("请求失败");
      this.queryList = res.data.result;
    },

    addGoods: async function () {
      this.dialogVis = true;
      if (this.total == 0) {
        const { data: res } = await this.$http.get("categories", {
          params: {
            type: 2,
          },
        });
      }

      if (res.meta.status != 200) return this.$message.error("获取信息失败");
      this.cascaderOption = res.data;
    },
    validForm: async function () {
      this.$refs.editRef.validate((valid) => {
        if (!valid) return this.$message.error("请重新填写");
      });
      const { data: res } = await this.$http.post("categories", this.editForm);
      if (res.meta.status != 201) return this.$message.error(res.meta.msg);
      this.getGoodsList();
      this.dialogVis = false;
      this.$message.success("创建成功");
    },
    cascaderChange: function () {
      this.editForm.cat_pid = this.cascaderId[this.cascaderId.length - 1];
      this.editForm.cat_level = this.cascaderId.length;
    },
    dialogClose() {
      this.$refs.editRef.resetFields();
      this.cascaderId = [];
    },
    // 分页
    pageSizeChange: function (newsize) {
      this.queryInfo.pagesize = newsize;
      this.getGoodsList();
    },
    pageChange: function (newpage) {
      this.queryInfo.pagenum = newpage;
      this.getGoodsList();
    },
    // 分页
    removeGoods: async function (id) {
      this.removeVis = true;
      this.removeId = id;
      const mes = await this.$confirm("确定要删除该分类?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).catch((err) => err);
      if (mes != "confirm") return this.$message.info("删除取消");
      const { data: res } = await this.$http.delete("categories/" + id);
      if (res.meta.status != 200) return this.$message.error(res.meta.msg);
      this.getGoodsList();
      this.$message.success("删除成功");
    },
    editGoods: function (id) {
      this.editId = id;
      this.editGoodsVis = true;
    },
    editSubmit: async function () {
      this.$refs.editGoodsRef.validate((valid) => {
        if (!valid) return this.$message.info("请填写分类名称！");
      });
      const { data: res } = await this.$http.put(
        "categories/" + this.editId,
        this.editGoodsForm
      );
      if (res.meta.status != 200) return this.$message.error("编辑失败");
      this.$message.success("编辑成功");
      this.getGoodsList();
      this.editGoodsVis = false;
    },
  },
};
</script>

<style lang="less" scoped>
.el-card {
  margin: 15px;
}
.tree-table {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>