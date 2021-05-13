<template>
  <div>
    <el-breadcrumb separator=">">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 提醒 -->
      <el-alert title="Attion! 只允许选择第三级分类相关设置参数" type="warning">
      </el-alert>
      <!-- 级联选择器 -->
      <el-cascader
        v-model="cascaderId"
        :options="cascaderOptions"
        :props="cascaderProps"
        @change="cascaderChange"
      ></el-cascader>
      <el-tabs v-model="activeName" @tab-click="clickTabs">
        <el-button type="primary" :disabled="isBtnDisabled" @click="addMes"
          >添加参数</el-button
        >
        <!-- 动态属性 -->
        <el-tab-pane label="动态参数" name="many"
          >动态数据
          <el-table :data="manyTable" style="width: 100%" stripe border>
            <el-table-column type="expand">
              <!-- 展开列 -->
              <template slot-scope="scope">
                <el-tag
                  :key="index"
                  v-for="(item, index) in scope.row.attr_vals"
                  closable
                  @close="closeTag(index, scope.row)"
                >
                  {{ item }}
                </el-tag>
                <!-- 添加标签 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVis"
                  v-model="scope.row.inputVal"
                  ref="saveTagInput"
                  size="small"
                  @blur="blurTag(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
                <!-- 添加标签 -->
              </template>
              <!-- 展开列 -->
            </el-table-column>
            <el-table-column label="#" width="180" type="index">
            </el-table-column>
            <el-table-column prop="attr_name" label="属性名称">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="editMes(scope.row)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="deleteForm(scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 静态属性 -->
        <el-tab-pane label="静态属性" name="only"
          >静态属性
          <el-table :data="onlyTable" style="width: 100%" sbimbotripe border>
            <el-table-column type="expand"
              ><!-- 展开列 -->
              <template slot-scope="scope">
                <el-tag
                  :key="index"
                  v-for="(item, index) in scope.row.attr_vals"
                  closable
                  @close="closeTag(index, scope.row)"
                >
                  {{ item }}
                </el-tag>
                <!-- 添加标签 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVis"
                  v-model="scope.row.inputVal"
                  ref="saveTagInput"
                  size="small"
                  @blur="blurTag(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
                <!-- 添加标签 -->
              </template>
              <!-- 展开列 -->
            </el-table-column>
            <el-table-column label="#" width="180" type="index">
            </el-table-column>
            <el-table-column prop="attr_name" label="属性名称">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="editMes(scope.row)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="deleteForm(scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <!-- 添加对话框 -->
      <el-dialog title="添加参数" :visible.sync="addVis" width="30%">
        <span>{{ tableData }}</span>
        <el-form
          :model="addForm"
          :rules="addFormRules"
          ref="addFormRef"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="属性名称" prop="addText">
            <el-input v-model="addForm.addText"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addVis = false">取 消</el-button>
          <el-button type="primary" @click="addFormSubmit">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 编辑对话框 -->
      <el-dialog :title="tableData" :visible.sync="editVis" width="30%">
        <span>编辑信息</span>
        <el-form
          :model="editForm"
          :rules="editFormRules"
          ref="editFormRef"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="编辑内容" prop="editText">
            <el-input v-model="editForm.editText"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editVis = false">取 消</el-button>
          <el-button type="primary" @click="editFormSubmit">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      activeName: "many",
      goodsList: [],
      // 级联选择器
      cascaderProps: {
        expandTrigger: "hover",
        label: "cat_name",
        value: "cat_id",
      },
      cascaderId: [],
      cascaderOptions: [],
      manyTable: [],
      onlyTable: [],
      // 对话框
      editVis: false,
      editFormRules: {
        editText: [
          { required: true, trigger: "blur", message: "请填写修改名称" },
          { min: 2, max: 10 },
        ],
      },
      editForm: {
        editText: "",
      },
      addVis: false,
      addFormRules: {
        addText: [
          { required: true, trigger: "blur", message: "请填写添加信息" },
          { min: 2, max: 10 },
        ],
      },
      addForm: {
        addText: "",
      },
      editVal: {},
      // 添加标签
      // inputVis : false,
      // inputVal : ''
    };
  },
  created() {
    this.getGoodsList();
  },
  methods: {
    // 点击标签页获取数据时间
    clickTabs: async function () {
      if (!this.isBtnDisabled) {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: this.activeName },
          }
        );
        if (res.meta.status != 200) return this.$message.error("请求失败");

        res.data.forEach((item) => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];
          item.inputVis = false;
          item.inputVal = "";
        });
        if (this.activeName == "many") {
          this.manyTable = res.data;
        } else {
          this.onlyTable = res.data;
        }
      }
    },
    // 级联选择器的参数获得
    getGoodsList: async function () {
      const { data: res } = await this.$http.get("categories");
      if (res.meta.status != 200) {
        return this.$message.error("获取参数失败");
      }
      this.goodsList = res.data;
      this.cascaderOptions = this.goodsList;
    },
    // 级联选择器值改变
    cascaderChange: function () {
      if (this.cascaderId.length != 3) {
        return (this.cascaderId = []);
      }
      this.clickTabs();
    },
    //  编辑按钮
    editMes: async function (mes) {
      this.editVis = true;
      this.editVal = mes;
    },
    // 编辑表单提交
    editFormSubmit: async function () {
      this.$refs.editFormRef.validate((valid) => {
        if (!valid) return this.$message.error("验证失败");
      });
      const { data: res } = await this.$http.put(
        `categories/${this.editVal.cat_id}/attributes/${this.editVal.attr_id}`,
        {
          attr_name: this.editForm.editText,
          attr_sel: this.activeName,
        }
      );
      if (res.meta.status != 200) return this.$message.error(res.meta.msg);
      this.clickTabs();
      this.$message.success("更新成功");
      this.editVis = false;
    },
    // 添加按钮
    addMes: async function () {
      this.addVis = true;
    },
    // 提交添加表单
    addFormSubmit: async function () {
      this.$refs.addFormRef.validate((valid) => {
        if (!valid) return this.$message.error("验证失败,请重新填写");
      });
      const { data: res } = await this.$http.post(
        `categories/${this.cateId}/attributes`,
        {
          attr_name: this.addForm.addText,
          attr_sel: this.activeName,
        }
      );
      if (res.meta.status != 201) {
        return this.$message.error("创建失败");
      }
      this.$message.success("创建成功");
      this.clickTabs();
      this.addForm.addText = "";
      this.addVis = false;
    },
    deleteForm: async function (msg) {
      const mes = await this.$confirm("确定要删除该属性?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).catch((err) => err);
      const { data: res } = await this.$http.delete(
        `categories/${this.cateId}/attributes/${msg.attr_id}`
      );
      if (res.meta.status != 200) return this.$message.error("删除失败");
      this.clickTabs();
      this.$message.success("删除成功");
    },
    // 添加标签事件
    showInput: function (msg) {
      msg.inputVis = true;
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    // 写完标签
    blurTag: async function (msg) {
      console.log(msg.inputVal.trim().length);
      if (msg.inputVal.trim().length == 0) {
        row.inputVal = "";
        row.inputVis = false;
        return;
      }
      msg.attr_vals.push(msg.inputVal.trim());
      msg.inputVal = "";
      msg.inputVis = false;
      this.doTag(msg);
    },
    // 编辑 tag
    doTag: async function (msg) {
      const { data: res } = await this.$http.put(
        `categories/${this.cateId}/attributes/${msg.attr_id}`,
        {
          attr_name: msg.attr_name,
          attr_sel: this.activeName,
          attr_vals: msg.attr_vals.join(" "),
        }
      );
      if (res.meta.status != 200) {
        return this.$message.error(res.meta.msg);
      }
    },

    // 删除标签
    closeTag: async function (index, msg) {
      msg.attr_vals.splice(index);
      this.doTag(msg);
    },
  },
  computed: {
    // 按钮高亮
    isBtnDisabled: function () {
      if (this.cascaderId.length == 3) {
        return false;
      }
      return true;
    },
    cateId: function () {
      if (this.cascaderId.length == 3) {
        return this.cascaderId[2];
      }
      return null;
    },
    tableData: function () {
      if (this.activeName == "many") return "动态属性";
      return "静态属性";
    },
  },
};
</script>
<style lang="less" scoped>
.el-card {
  margin: 15px;
}
.el-cascader {
  margin: 15px;
  width: 28%;
}
.el-button {
  margin-top: 15px;
  margin-left: 15px;
}

.el-tag {
  margin-left: 20px;
}
.input-new-tag {
  margin-top: 15px;
  width: 220px;
}
.el-input {
  margin-left: 15px;
}
</style>