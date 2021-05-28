<template>
  <div>
    <el-breadcrumb separator=">">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col :span="6">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table :data="orderMes" style="width: 100%">
        <el-table-column type="index" label="#" width="100"> </el-table-column>
        <el-table-column prop="order_number" label="订单编号" width="220">
        </el-table-column>
        <el-table-column prop="order_price" label="订单价格" width="150">
        </el-table-column>
        <el-table-column label="是否付款" width="200">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.order_pay" type="danger">未支付</el-tag>
            <el-tag v-else type="success">已支付</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="下单时间" width="200">
          <template slot-scope="scope">
            <span>{{ scope.row.create_time | dateFormat }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="操作" width="150">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editMes"
            ></el-button>
            <!-- 快递 -->
            <el-button
              type="success"
              icon="el-icon-position"
              size="mini"
              @click="requireMes(scope.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="sizeChange"
        @current-change="pageChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <el-dialog title="提示" :visible.sync="editVis" width="30%">
      <span>编辑</span>
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="省/区" prop="locate">
          <el-cascader
            v-model="cascaderId"
            :options="citydata"
            :props="cascaderProp"
            @change="handleChange"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address">
          <el-input v-model="editForm.address"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVis = false">取 消</el-button>
        <el-button type="primary" @click="editMesSubmit">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="提示" :visible.sync="deliverVis" width="50%">
      <span>快递信息信息</span>
      <el-timeline :reverse="reversed">
        <el-timeline-item
          v-for="(activity, index) in visMes"
          :key="index"
          :timestamp="activity.ftime"
        >
          {{ activity.context }}
        </el-timeline-item>
      </el-timeline>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deliverVis = false">取 消</el-button>
        <el-button type="primary" @click="deliverVis = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import citydata from "./citydata";
import deliverdata from "./deliverdata";
export default {
  data() {
    return {
      // 查询
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 5,
      },
      total: 0,
      //   订单页面信息

      orderMes: [],
      citydata,
      editFormRules: {
        locate: [{ required: true, trigger: "blur", message: "请选择地区" }],
        address: [
          { required: true, trigger: "blur", message: "请选择   地区" },
          { min: 3, max: 15, message: "请输入正确的地址" },
        ],
      },
      editForm: {
        locate: "",
        address: "",
      },
      cascaderProp: {
        expandTrigger: "hover",
      },
      cascaderId: [],
      editVis: false,
      deliverVis: false,
      deliverdata,
      visMes: {},
      reversed: false,
    };
  },
  created() {
    this.getOrderList();
  },
  methods: {
    async getOrderList() {
      const { data: res } = await this.$http.get("orders", {
        params: this.queryInfo,
      });
      if (res.meta.status != 200)
        return this.$message.error("订单页面请求失败");
      this.orderMes = res.data.goods;
      this.orderMes.forEach((item, i) => {
        item.order = i + (this.queryInfo.pagenum - 1) * 5;
      });
      this.total = res.data.total;
    },
    pageChange(newpage) {
      this.queryInfo.pagenum = newpage;
      this.getOrderList();
    },
    sizeChange(newsize) {
      this.queryInfo.pagesize = newsize;
      this.getOrderList();
    },
    editMes() {
      this.editVis = true;
    },
    handleChange() {
      if (this.cascaderId.length < 2) {
        this.cascaderId = [];
        return;
      }
    },
    editMesSubmit() {
      this.$refs.editFormRef.validate((valid) => {
        if (!valid) return this.$message.error("请重新填写表单");
      });
      this.$message.success("信息修改成功");
      this.editVis = false;

      // 等待接口...
    },
    async requireMes(msg) {
      this.deliverVis = true;
      this.visMes = deliverdata[msg.order];
    },
  },
};
</script>
<style lang="less" scoped>
.el-card {
  margin-top: 15px;
}
</style>