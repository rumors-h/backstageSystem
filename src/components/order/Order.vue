<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getOrders">
            <el-button slot="append" icon="el-icon-search" @click="getOrders"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table :data="orderList" stripe border style="width: 100%">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="order_number" label="订单编号"></el-table-column>
        <el-table-column prop="order_price" label="订单价格" width="180px"></el-table-column>
        <el-table-column label="是否付款" width="180px">
          <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.pay_status==='0'">未付款</el-tag>
            <el-tag type="success" v-else>已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货" width="180px"></el-table-column>
        <el-table-column label="下单时间" width="180px">
          <template slot-scope="scope">{{scope.row.create_time|dataFormat}}</template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog"></el-button>
            <el-button
              size="mini"
              type="success"
              icon="el-icon-location"
              @click="showLocationDialog(scope.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 编辑 -->
    <el-dialog title="修改地址" :visible.sync="editDialogVisible" width="50%">
      <el-form
        ref="addressFormRef"
        :model="addressForm"
        :rules="addressFormRules"
        label-width="85px"
      >
        <el-form-item label="省市区/县" prop="add1">
          <el-cascader
            v-model="addressForm.add1"
            :options="cityDate"
            :props="{ expandTrigger: 'hover' }"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="add2">
          <el-input v-model="addressForm.add2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editClick">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 物流状态 -->
    <el-dialog title="物流状态" :visible.sync="locationDialogVisible" width="50%">
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in activities"
          :key="index"
          :timestamp="activity.time"
        >{{activity.context}}</el-timeline-item>
      </el-timeline>
      <span slot="footer" class="dialog-footer">
        <el-button @click="locationDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="locationClick">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getOrders, getLocation } from 'network/orders'
import cityDate from './citydata'
export default {
  components: {},
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      orderList: [],
      total: 0,
      editDialogVisible: false,
      locationDialogVisible: false,
      addressForm: {
        add1: [],
        add2: ''
      },
      addressFormRules: {
        add1: [{ required: true, message: '请选择省市区/县', trigger: 'blur' }],
        add2: [{ required: true, message: '请输入详细地址', trigger: 'blur' }]
      },
      selectKeys: [],
      cityDate,
      activities: []
    }
  },
  created() {
    this.getOrders()
  },
  methods: {
    async getOrders() {
      const { data: res } = await getOrders(this.queryInfo)
      if (res.meta.status != 200) return this.$message.error(res.meta.msg)
      this.orderList = res.data.goods
      this.total = res.data.total
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrders()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getOrders()
    },
    showEditDialog() {
      this.editDialogVisible = true
    },
    editClick() {},
    async showLocationDialog(row) {
      const {data: res} = await getLocation()
      if (res.meta.status != 200) return this.$message.error(res.meta.msg)
      // console.log(res);
      this.activities = res.data
      
      this.locationDialogVisible = true

    },
    locationClick() {
      this.locationDialogVisible = false
    }
  }
}
</script>

<style scoped>
.el-cascader {
  width: 100%;
}
</style>
