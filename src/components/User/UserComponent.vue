<script lang="ts" setup>
import {onMounted, ref} from "vue";
import request, {Code, JSONResult, PagedResult} from "../../network/axios.ts";
import {ElMessage} from "element-plus";
import type {User} from "./type.d.ts";
import {Delete, View} from "@element-plus/icons-vue";

let currentPage = ref<number>(1); //当前页面ID
let pageSize = ref<number>(10); //页面大小
let total = ref<number>(); //总词条数
let userList = ref<Array<User>>();
let userSearchList = ref<Array<User>>();
let pageSizeList = ref<Array<number>>([5, 10, 20]);
let query = ref<string>('');
let isInSearch = ref<boolean>(false);

const USER_COMMON = "启用中";

async function load() {
  const result: JSONResult<PagedResult<Array<User>>> =
      (await request.get(
          `/ums/all?pageID=${currentPage.value}&pageSize=${pageSize.value}`
      )).data;
  if (result.code !== Code.CODE_SUCCESS) {
    return ElMessage.error(result.message);
  }
  const pagedData: PagedResult<Array<User>> = result.data;
  query.value = "";
  isInSearch.value = false;
  userList.value = (pagedData.data);
  userSearchList.value = [];
  currentPage.value = pagedData.pageID;
  pageSize.value = pagedData.pageCount;
  total.value = pagedData.total;
}

async function search() {
  const result: JSONResult<PagedResult<Array<User>>> =
      (await request.get(
          `/ums/search?pageID=${currentPage.value}
          &pageSize=${pageSize.value}&query=${query.value}`
      )).data;
  if (result.code !== Code.CODE_SUCCESS) {
    return ElMessage.error(result.message);
  }
  isInSearch.value = true;
  const pagedData: PagedResult<Array<User>> = result.data;
  userList.value = [];
  userSearchList.value = (pagedData.data);
  currentPage.value = pagedData.pageID;
  pageSize.value = pagedData.pageCount;
  total.value = pagedData.total;
}


async function banUser(id: string) {
  const result: JSONResult<String> = (await
      request.post(`/ums/ban?userID=${id}`)).data;
  if (result.code !== Code.CODE_SUCCESS) {
    return ElMessage.error(result.message);
  }
  if (isInSearch.value === true) {
    await search();
  } else {
    await load();
  }
  return ElMessage.info(result.message);
}

async function reactivateUser(id: String) {
  const result: JSONResult<String> = (await
      request.post(`/ums/reactivate?userID=${id}`)).data;
  if (result.code !== Code.CODE_SUCCESS) {
    return ElMessage.error(result.message);
  }
  if (isInSearch.value === true) {
    await search();
  } else {
    await load();
  }
  return ElMessage.info(result.message);
}

const handleSizeChange = (val: number) => {
  pageSize.value = val;
  if (isInSearch.value === true) {
    search();
  } else {
    load();
  }
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val;
  if (isInSearch.value === true) {
    search();
  } else {
    load();
  }
}

onMounted(() => {
  load();
})


</script>

<template>
  <el-breadcrumb class="breadcrumb" separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>用户管理</el-breadcrumb-item>
  </el-breadcrumb>
  <el-card>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-input v-model="query"
                  clearable placeholder="用户名/手机号/邮箱"
                  @clear="load">
          <template #append>
            <el-button @click="search">
              <el-icon>
                <Search/>
              </el-icon>
            </el-button>
          </template>
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-button :icon="Delete" type="warning" @click="load">重置</el-button>
      </el-col>
    </el-row>

    <el-table id="user-table" :data="isInSearch?userSearchList:userList" border stripe>
      <el-table-column label="序号" type="index"></el-table-column>
      <el-table-column label="用户名称" prop="name"></el-table-column>
      <el-table-column label="手机号" prop="phone"></el-table-column>
      <el-table-column label="邮箱" prop="email"></el-table-column>
      <el-table-column label="角色" prop="userRole"></el-table-column>
      <el-table-column label="账号状态" prop="status"></el-table-column>
      <el-table-column label="操作">
        <template v-slot="scope">
          <el-button :icon="View" type="success">
            详情
          </el-button>
          <el-dropdown class="operation-dropdown" split-button
                       type="warning">
            更多
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item v-if="scope.row.status===USER_COMMON"
                                  type="danger"
                                  @click="banUser(scope.row.id)">
                  禁用账号
                </el-dropdown-item>
                <el-dropdown-item
                    v-else type="primary"
                    @click="reactivateUser(scope.row.id)">
                  启用账号
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
        :page-sizes="pageSizeList"
        :total="total"
        background
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"/>
  </el-card>
</template>

<style scoped>
.breadcrumb {
  margin: 1.25rem;
}

#user-table {
  margin: 1rem;
}

.operation-dropdown {
  white-space: nowrap;
  display: inline-block;
}
</style>