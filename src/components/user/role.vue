<template>
  <div>
    <el-breadcrumb separator=">">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-dialog title="提示" :visible.sync="buttonVis" width="30%">
        <span>这是一段信息</span>
        <span slot="footer" class="dialog-footer">
          <el-form
            ref="buttonMesRef"
            :model="buttonMes"
            label-width="80px"
            :rules="buttonMesRule"
          >
            <el-form-item label="角色名称" prop="roleName">
              <el-input v-model="buttonMes.roleName"></el-input>
            </el-form-item>
            <el-form-item label="角色描述">
              <el-input v-model="buttonMes.roleDesc"></el-input>
            </el-form-item>
          </el-form>
          <el-button @click="buttonVis = false">取 消</el-button>
          <el-button type="primary" @click="addRoleSubmit">确 定</el-button>
        </span>
      </el-dialog>
      <el-button type="primary" @click="buttonVis = true">添加角色</el-button>
      <el-table :data="roleMes" border stripe="">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              v-for="(item, index) in scope.row.children"
              :key="item.id"
              :gutter="20"
              :class="['bb', index == 0 ? 'bt' : '', 'vflex']"
            >
              <el-col :span="5"
                ><el-tag closable @close="closeTag(scope.row, item.id)">{{
                  item.authName
                }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级嵌套 -->
              <el-col :span="18">
                <el-row
                  :key="c_item.id"
                  v-for="(c_item, index2) in item.children"
                  :class="['bb', index2 == 0 ? '' : 'bt', 'vflex']"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="closeTag(scope.row, c_item.id)"
                    >
                      {{ c_item.authName }}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18" class="vflex">
                    <el-tag
                      :key="cC_item.id"
                      closable
                      v-for="cC_item in c_item.children"
                      type="warning"
                      @close="closeTag(scope.row, cC_item.id)"
                      >{{ cC_item.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
              <!-- 二级嵌套 -->
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"> </el-table-column>
        <el-table-column prop="roleName" label="角色名称"> </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="roleEdit(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteRole(scope.row.id)"
              >删除</el-button
            >
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="editTree(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 对话框 -->
      <el-dialog title="提示" :visible.sync="editVis" width="30%">
        <span>这是一段信息</span>
        <span slot="footer" class="dialog-footer">
          <el-form
            :model="searchRole"
            :rules="editFormRule"
            ref="editRoleRef"
            label-width="100px"
            class="demo-ruleForm"
          >
            <el-form-item label="用户名称" prop="roleName">
              <el-input v-model="searchRole.roleName"></el-input>
            </el-form-item>
            <el-form-item label="用户描述">
              <el-input v-model="searchRole.roleDesc"></el-input>
            </el-form-item>
          </el-form>
          <el-button @click="editVis = false">取 消</el-button>
          <el-button type="primary" @click="editRoleSubmit">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 对话框 -->
      <!-- 对话框 -->
      <el-dialog
        title="提示"
        :visible.sync="treeVis"
        width="30%"
        @close="clearDef"
      >
        <span>这是一段信息</span>
        <span slot="footer" class="dialog-footer">
          <el-tree
            :data="treeMes"
            ref="treeRef"
            :props="treeProps"
            show-checkbox
            default-expand-all
            :default-checked-keys="defKey"
            node-key="id"
          ></el-tree>
          <el-button @click="treeVis = false">取 消</el-button>
          <el-button type="primary" @click="treeSubmit()">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 对话框 -->
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      roleMes: [],
      editVis: false,
      buttonVis: false,
      treeVis: false,
      buttonMes: {
        roleName: "",
        roleDesc: "",
      },
      buttonMesRule: {
        roleName: [
          { required: true, message: "请输入角色名臣", trigger: "blur" },
          {
            min: 2,
            max: 10,
            message: "请输入2~10个字符",
            trigger: "blur",
          },
        ],
      },
      searchRole: {},
      defKey: [],
      treeMes: [],
      editFormRule: {
        roleName: [
          { required: true, message: "请输入名称", trigger: "blur" },
          {
            min: 2,
            max: 15,
            trigger: "blur",
          },
        ],
      },
      treeProps: {
        label: "authName",
        children: "children",
      },
      roleId: "",
    };
  },
  methods: {
    getRoleMes: async function () {
      const { data: res } = await this.$http.get("roles");
      console.log(res);
      if (res.meta.status != 200)
        return this.$message.error("获取用户详情失败");
      this.roleMes = res.data;
    },
    roleEdit: async function (id) {
      const { data: res } = await this.$http.get("roles/" + id);
      console.log(res);
      if (res.meta.status != 200) {
        return this.$message.error("发生错误");
      }
      this.searchRole = res.data;
      this.editVis = true;
    },

    // --------- button ------------
    addRoleSubmit: function () {
      this.$refs.buttonMesRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post("roles", this.buttonMes);
        if (res.meta.status != 201)
          return this.$message.error("创建失败,请重新尝试");
        this.getRoleMes();
        this.$message.success("创建成功");
        // 15324774288
      });
      this.buttonVis = false;
    },
    stopAdding: function () {
      this.$refs.addUserRef.resetFields();
    },
    modifyRole: async function (id) {
      this.userEditVis = true;
      const { data: res } = await this.$http.get("users/" + id);
      if (res.meta.status != 200)
        return this.$message.error("请求用户数据失败");

      this.editUser = res.data;
    },
    editRoleSubmit: function () {
      this.$refs.editRoleRef.validate(async (valid) => {
        if (!valid) return this.$message.error("修改请求失败");
        this.userEdit -= 0;
        const { data: res } = await this.$http.put(
          "roles/" + this.searchRole.roleId,
          {
            roleName: this.searchRole.roleName,
            roleDesc: this.searchRole.roleDesc,
          }
        );
        if (res.meta.status != 200) return this.$message.error(res.meta.msg);
        this.editVis = false;
        this.getRoleMes();
        this.$message.success("用户信息修改成功");
      });
    },

    deleteRole: async function (id) {
      const select = await this.$confirm("删除该角色 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).catch((err) => err);
      if (select != "confirm") return this.$message.info("删除取消");
      const { data: res } = await this.$http.delete("roles/" + id);
      console.log(res);
      if (res.meta.status != 200) {
        return this.$message.error("出错了,删除失败");
      }
      this.getRoleMes();
      return this.$message.success("删除成功");
    },
    closeTag: async function (role, rid) {
      const mes = await this.$confirm("确定要删除该权限?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).catch((err) => err);
      if (mes != "confirm") return this.$message.info("取消删除");
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rid}`
      );
      if (res.meta.status != 200) return this.$message.error("删除失败");
      // 微操↓
      role.children = res.data;
      this.$message.success("操作成功");
    },
    // --------- button ------------
    editTree: async function (role) {
      const { data: res } = await this.$http.get("rights/tree");
      if (res.meta.status != 200) return this.$message.error("发生错误");

      this.treeMes = res.data;
      this.recursion(role, this.defKey);
      this.treeVis = true;
      this.roleId = role.id;
    },
    recursion: function (node, arr) {
      if (!node.children) {
        return arr.push(node.id);
      }
      node.children.forEach((item) => {
        this.recursion(item, arr);
      });
    },
    clearDef: function () {
      this.defKey = [];
    },
    treeSubmit: async function () {
      const arr1 = this.$refs.treeRef.getCheckedKeys();
      const arr2 = this.$refs.treeRef.getHalfCheckedKeys();
      const rId = arr1.join(",");
      const {
        data: res,
      } = await this.$http.post(`roles/${this.roleId}/rights/`, { rids: rId });
      if (res.meta.status != 200) return this.$message.error("修改请求失败！");
      this.getRoleMes();
      this.$message.success("修改成功");
      this.treeVis = false;
    },
  },
  created() {
    this.getRoleMes();
  },
};
</script>
<style lang = "less" scoped>
.el-card {
  margin-top: 15px;
}
.el-button {
  margin-bottom: 10px;
}
.bt {
  border-top: 1px solid #eee;
}
.bb {
  border-bottom: 1px solid #eee;
}
.el-tag {
  margin: 10px;
}
.vflex {
  display: flex;
  align-items: center;
}
</style>
