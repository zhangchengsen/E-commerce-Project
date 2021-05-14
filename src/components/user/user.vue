<template>
  <div>
    <el-breadcrumb separator=">">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row :gutter="2">
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <!-- 表单 -->
            <el-input
              placeholder="请输入内容"
              v-model="queryInfo.query"
              clearable
              @clear="getUserList"
            ></el-input>
            <!-- 表单 -->
          </div>
        </el-col>
        <el-col :span="3">
          <el-button
            icon="el-icon-search"
            circle
            @click="getUserList"
          ></el-button>
        </el-col>

        <el-col :span="4"
          ><div class="grid-content bg-purple">
            <!-- 按钮 -->
            <el-button type="primary" @click="dialogVis = true"
              >添加用户</el-button
            >
            <!-- 按钮 -->
          </div></el-col
        >
        <!-------------- 对话 -------------->
        <el-dialog
          title="提示"
          :visible.sync="dialogVis"
          width="30%"
          @close="stopAdding"
        >
          <!-- 添加 表单区域 -->

          <el-form
            :model="addUser"
            :rules="addUserRule"
            ref="addUserRef"
            label-width="100px"
            class="demo-ruleForm"
          >
            <el-form-item label="用户名称" prop="username">
              <el-input v-model="addUser.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input v-model="addUser.password"></el-input>
            </el-form-item>

            <el-form-item label="邮箱" prop="email">
              <el-input v-model="addUser.email"></el-input>
            </el-form-item>

            <el-form-item label="电话" prop="mobile">
              <el-input v-model="addUser.mobile"></el-input>
            </el-form-item>
          </el-form>
          <!-- 添加 表单区域 -->
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVis = false">取 消</el-button>
            <el-button type="primary" @click="submit">确 定</el-button>
            <!-------------- 对话 ----------->
          </span>
        </el-dialog>
      </el-row>
      <!--表格区域 -->

      <el-table stripe border :data="userList" style="width: 100%">
        <el-table-column prop="username" label="姓名" width="180">
        </el-table-column>
        <el-table-column prop="email" label="邮箱" width="180">
        </el-table-column>
        <el-table-column prop="mobile" label="电话" width="180">
        </el-table-column>
        <el-table-column prop="role_name" label="角色" width="180">
        </el-table-column>
        <el-table-column label="状态" width="180">
          <template slot-scope="msg">
            <!-- 开关 -->
            <el-switch
              v-model="msg.row.mg_state"
              active-color="#409EFF"
              inactive-color="#909399"
              @change="stateChange(msg.row)"
            >
            </el-switch>
            <!-- 开关 -->
          </template>
        </el-table-column>
        <el-table-column label="操作" width="190">
          <template slot-scope="msg">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="modifyUser(msg.row.id)"
            ></el-button>
            <el-button
              @click="deleteUser(msg.row.id)"
              type="danger"
              icon="el-icon-delete"
              size="mini"
            ></el-button>
            <el-tooltip
              class="item"
              effect="dark"
              content="分配权限"
              placement="top"
              :enterable="false"
            >
              <el-button
                @click="setRights(msg.row)"
                type="warning"
                icon="el-icon-setting"
                size="mini"
              >
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页功能 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="queryInfo.pagenum"
        :page-size="queryInfo.pagesize"
        layout="total, prev, pager, next ,jumper"
        :total="total"
      >
      </el-pagination>
      <!-- 分页功能 -->

      <!--表格区域 -->
      <!-- 用户修改 对话框 -->
      <el-dialog
        title="用户修改"
        :visible.sync="userEditVis"
        width="30%"
        @close="clearForm"
      >
        <span slot="footer" class="dialog-footer">
          <!-- 表单 -->
          <el-form
            :model="editUser"
            :rules="editUserRule"
            ref="editUserRef"
            label-width="100px"
            class="demo-ruleForm"
          >
            <el-form-item label="用户名称">
              <el-input disabled v-model="editUser.username"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="editUser.email"></el-input>
            </el-form-item>
            <el-form-item label="电话" prop="mobile">
              <el-input v-model="editUser.mobile"></el-input>
            </el-form-item>
          </el-form>
          <!-- 表单 -->
          <el-button @click="userEditVis = false">取 消</el-button>
          <el-button type="primary" @click="userEditSubmit">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 用户修改 对话框 -->
      <el-dialog title="提示" :visible.sync="setRightsVis" width="30%">
        <p>当前用户 : {{ userInfo.username }}</p>
        <p>当前角色 : {{ userInfo.role_name }}</p>
        <el-select v-model="setRightsMes" placeholder="请选择">
          <el-option
            v-for="item in setRightsPerson"
            :key="item.id"
            :label="item.roleName"
            :value="item.id"
          >
          </el-option>
        </el-select>
        <span slot="footer" class="dialog-footer">
          <el-button @click="setRightsVis = false">取 消</el-button>
          <el-button type="primary" @click="setRoleRights">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 用户权限修改 对话框 -->
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    var checkEmail = function (rule, val, cb) {
      const regEmail = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
      if (regEmail.test(val)) return cb();
      cb(new Error("请输入合法的邮箱"));
    };
    var checkMobile = function (rule, val, cb) {
      const regMobile = /^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/;
      if (regMobile.test(val)) return cb();
      cb(new Error("请输入合法的电话号码"));
    };
    return {
      userList: [],
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 5,
      },

      total: 0,
      dialogVis: false,
      userEditVis: false,
      addUser: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      editUser: {
        mobile: "",
        email: "",
      },
      addUserRule: {
        username: [
          { required: true, message: "请输入名称", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "名称长度应该在3~10个字符之间",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 3,
            max: 14,
            message: "密码格式错误",
            trigger: "blur",
          },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          {
            validator: checkEmail,
            trigger: "blur",
          },
        ],
        mobile: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          {
            validator: checkMobile,
            trigger: "blur",
          },
        ],
      },
      editUserRule: {
        mobile: [
          { required: true, message: "请输入要修改手机号码", trigger: "blur" },
          {
            validator: checkMobile,
            trigger: "blur",
          },
        ],
        email: [
          { required: true, message: "请输入要修改的邮箱", trigger: "blur" },
          {
            validator: checkEmail,
            trigger: "blur",
          },
        ],
      },
      roleRights: {},
      setRightsVis: false,
      setRightsMes: "",
      setRightsPerson: [],
      userInfo: {},
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    getUserList: async function () {
      const { data: res } = await this.$http.get("/users", {
        params: this.queryInfo,
      });
      if (res.meta.status != 200) return this.$message.error("获取失败");
      this.total = res.data.total;
      this.userList = res.data.users;
    },
    handleSizeChange: function (newsize) {
      this.queryInfo.pagesize = newsize;
      this.getUserList();
    },
    handleCurrentChange: function (newpage) {
      this.queryInfo.pagenum = newpage;

      this.getUserList();
    },
    stateChange: async function (userState) {
      const { data: res } = await this.$http.put(
        `users/${userState.id}/state/${userState.mg_state}`
      );
      if (res.meta.status != 200) {
        userState.mg_state = !userState.mg_state;
        return this.$message.error("状态修改失败");
      }
      this.$message.success("状态修改成功");
    },
    submit: function () {
      this.$refs.addUserRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post("users", this.addUser);
        if (res.meta.status != 201)
          return this.$message.error("创建失败,请重新尝试");
        this.getUserList();
        this.$message.success("创建成功");
        this.$dialogVis = false;
        // 15324774288
      });
      this.dialogVis = false;
      this.getUserList();
    },
    stopAdding: function () {
      this.$refs.addUserRef.resetFields();
    },
    modifyUser: async function (id) {
      this.userEditVis = true;
      const { data: res } = await this.$http.get("users/" + id);
      if (res.meta.status != 200)
        return this.$message.error("请求用户数据失败");

      this.editUser = res.data;
    },
    userEditSubmit: function () {
      this.$refs.editUserRef.validate(async (valid) => {
        if (!valid) return this.$message.error("修改请求失败");
        this.userEdit -= 0;
        const { data: res } = await this.$http.put(
          "users/" + this.editUser.id,
          {
            mobile: this.editUser.mobile,
            email: this.editUser.email,
          }
        );
        if (res.meta.status != 200) return this.$message.error(res.meta.msg);
        this.userEditVis = false;
        this.getUserList();
        this.$message.success("用户信息修改成功");
      });
    },
    clearForm: function () {
      this.$refs.editUserRef.resetFields();
    },
    deleteUser: async function (id) {
      const select = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (select != "confirm") return this.$message.info("删除取消");
      const { data: res } = await this.$http.delete("users/" + id);
      console.log(res);
      if (res.meta.status != 200) {
        return this.$message.error("出错了,删除失败");
      }
      this.getUserList();
      return this.$message.success("删除成功");
    },
    setRights: async function (msg) {
      console.log(msg);
      this.setRightsVis = true;
      this.userInfo = msg;
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status != 200)
        return this.$message.error("获取用户信息失败");
      console.log(res.data);
      this.setRightsPerson = res.data;
    },
    setRoleRights: async function () {
      const { data: res } = await this.$http.put(
        `users/${this.userInfo.id}/role`,
        {
          rid: this.setRightsMes,
        }
      );
      if (res.meta.status != 200) return this.$message.error(res.meta.msg);
      this.getUserList();
      this.$message.success("修改成功");
      this.setRightsVis = false;
      this.setRightsMes = "";
    },
  },
};
</script>
<style lang = "less" scoped>
.el-card {
  margin-top: 20px;
}
.el-col {
  margin-left: 8px;
}
.el-card {
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15) !important;
}
.el-table {
  margin-top: 15px;
  font-size: 12px;
}
</style>
