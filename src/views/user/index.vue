<template>
  <div class="app-container">
    <div class="ad-app-filter">
      <search-box :keyword.sync="keyword" @handleSearchClick="userList" @handleClearInput="userList" />
      <div class="ad-app-filter__operat">
        <el-button v-waves type="primary" icon="el-icon-plus" @click="handleCreateUserClick">添加用户</el-button>
      </div>
    </div>
    <div class="ad-app-table">
      <el-table
        v-loading="loading"
        :data="tableData"
        style="width: 100%"
        :header-cell-style="{ background: '#F5F6F8', color: '#191D30' }"
      >
        <el-table-column label="昵称" prop="nickname" min-width="200" />
        <el-table-column label="用户名" prop="username" min-width="180" />
        <el-table-column label="手机" prop="phone" min-width="180" />
        <el-table-column label="邮箱" prop="email" min-width="180" />
        <el-table-column label="企业微信" prop="workWechatId" min-width="180" />
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.enabled"
              inactive-color="#ff4949"
              @change="handleSwitchChange($event, scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="创建日期" min-width="180">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ new Date(scope.row.createTime) | parseTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="handleEdit(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <pagination :request="userList" :page.sync="pagination.page" :pageSize.sync="pagination.pageSize" :total="total" />
    <user-dialog
      :dialog.sync="dialog"
      :title="title"
      :formData.sync="formData"
      @handleSubmitClick="handleUserDialogSubmitClick"
    />
  </div>
</template>

<script>
import page from '@st/mixin/page';
import search from '@st/mixin/search';
import UserDialog from './components/UserDialog';

export default {
  name: 'User',
  components: { UserDialog },
  filters: {},
  mixins: [page, search],
  props: {},
  data() {
    return {
      tableData: [],
      // user-dialog
      dialog: false,
      title: null,
      formData: null,
      dialogType: null,
      // loading
      loading: true,
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.userList();
  },
  methods: {
    // 用户列表
    userList() {
      this.loading = true;
      this.$post(this.urls.account.list, {
        keyword: this.keyword,
        ...this.pagination,
      })
        .then(({ data, total }) => {
          this.tableData = data;
          this.total = total;
          this.loading = false;
        })
        .catch(() => {});
    },

    // 创建弹窗
    handleCreateUserClick() {
      this.dialog = true;
      this.dialogType = 'create';
      this.title = '创建用户';
    },

    // 表单操作
    handleEdit(row) {
      this.formData = row;
      this.dialog = true;
      this.dialogType = 'edit';
      this.title = '表单编辑';
    },

    // 状态修改
    handleSwitchChange(value, row) {
      const { nickname, auid, enabled } = row;
      this.$confirm(`此操作将${!value ? '禁用' : '启用'} ${nickname}, 是否继续？`, { type: 'warning' })
        .then(() => {
          this.$post(this.urls.account.update_status, { auid, enabled })
            .then(() => {
              this.$message.success('操作成功');
              this.userList();
            })
            .catch(() => {
              this.$message.success('操作失败');
            });
        })
        .catch(() => {
          row.enabled = !row.enabled;
        });
    },
    // 弹窗确定事件接口
    handleUserDialogSubmitClick(paramet) {
      const { nickname, username, phone, email, auid, password } = paramet;
      const data = { nickname, username, phone, email, auid };
      if (this.dialogType === 'create') data.password = password;
      const url = this.urls.account[this.dialogType === 'create' ? 'create' : 'update'];
      const message = this.dialogType === 'create' ? '创建成功' : '编辑成功';
      this.$post(url, data)
        .then(() => {
          this.userList();
          this.$message.success(message);
        })
        .catch(() => {});
    },
  },
};
</script>
