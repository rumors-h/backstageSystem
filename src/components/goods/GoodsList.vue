<template>
  <div>
    <div v-if="showAddgoods">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-card>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-input
              placeholder="请输入内容"
              v-model="queryInfo.query"
              class="input-with-select"
              clearable
              @clear="getGoods"
            >
              <el-button slot="append" icon="el-icon-search" @click="getGoods,handleSizeChange(1)"></el-button>
            </el-input>
          </el-col>
          <el-col :span="6">
            <el-button type="primary" @click="addGoods">添加商品</el-button>
          </el-col>
        </el-row>
        <el-table :data="goodsList" style="width: 100%" border stripe>
          <el-table-column type="index"></el-table-column>
          <el-table-column prop="goods_name" label="商品名称"></el-table-column>
          <el-table-column prop="goods_price" label="商品价格(元)" width="100px"></el-table-column>
          <el-table-column prop="goods_weight" label="商品重量" width="90px"></el-table-column>
          <el-table-column label="创建时间" width="150px">
            <template slot-scope="scope">{{scope.row.add_time | dataFormat}}</template>
          </el-table-column>
          <el-table-column label="操作" width="120px">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
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
    </div>
    <div v-else>
      <add-goods @change="change"></add-goods>
    </div>
  </div>
</template>

<script>
import { getGoods } from 'network/goods'
import AddGoods from './AddGoods'
export default {
  components: {
    AddGoods
  },
  data() {
    return {
      showAddgoods: true,
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      goodsList: []
    }
  },
  created() {
    this.getGoods()
  },
  methods: {
    async getGoods() {
      const { data: res } = await getGoods(this.queryInfo)
      if (res.meta.status != 200) return this.$message.error(res.meta.msg)
      this.goodsList = res.data.goods
      this.total = res.data.total
      // console.log(res)
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoods()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getGoods()
    },
    addGoods() {
      this.showAddgoods = false
    },
   change() {
     this.showAddgoods = true
     this.getGoods()
   }
  }
}
</script>

<style scoped>
.el-card {
  margin-top: 20px;
}
.el-table {
  font-size: 13px;
  margin: 20px 0;
}
</style>
