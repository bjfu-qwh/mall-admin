<script setup lang="ts">
import {onMounted, ref} from "vue";
import request, {PagedResult} from "../../network/axios.ts";
import {JSONResult} from "../../network/axios.ts";
import {ElMessage} from "element-plus";
import {User} from "./index.ts";

let currentPage = ref<number>(1);
let pageSize = ref<number>(10);
let users = ref<Array<User>>();

async function load() {
  const result: JSONResult<PagedResult<Array<User>>> = (await request.get(`/ums/all`)).data;
  if (result.code !== 200) {
    return ElMessage.error(result.message);
  }
  const pagedData: PagedResult<Array<User>> = result.data;
  users.value = pagedData.data;
  currentPage.value = pagedData.pageID;
  pageSize.value = pagedData.pageCount;
  console.log(currentPage, pageSize);
}

onMounted(() => {
  load();
})


</script>

<template>
  <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>用户管理</el-breadcrumb-item>
  </el-breadcrumb>
  <el-card>
    <el-table :data="users" border stripe>
      <el-table-column label="序号" type="index"></el-table-column>
      <el-table-column label="用户ID" prop="id"></el-table-column>
      <el-table-column label="用户名称" prop="name"></el-table-column>
      <el-table-column label="用户性别" prop="gender"></el-table-column>
      <el-table-column label="手机号" prop="phone"></el-table-column>
      <el-table-column label="邮箱" prop="email"></el-table-column>
      <el-table-column label="操作">
        <el-button type="success">
          详情
        </el-button>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<style scoped>
.breadcrumb {
  margin: 1.25rem;
}
</style>