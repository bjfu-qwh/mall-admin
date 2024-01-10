<script setup lang="ts">
import {useRouter} from "vue-router";
import {ref} from "vue";

const router = useRouter();
let activePath = ref();
let paths = [
  {
    path: "/user",
    title: "用户管理"
  },
  {
    path: "/store",
    title: "商品管理"
  }
]

function goto(path: string) {
  router.push(path);
  activePath.value = path;
}
</script>

<template>
  <el-container id="container">
    <el-header id="header">
      <div>
        <img alt="" src="../../assets/vue.svg"/>
        <span>后台管理系统</span>
      </div>
      <div>
        <span>你好</span>
        <el-image
            fit="fill"
            src="https://tse4-mm.cn.bing.net/th/id/OIP-C.ytZ3w0NP3JfGHzPzNXO25QAAAA?pid=ImgDet&rs=1"
            style="width: 50px; height: 50px; margin: 0 30px; cursor: pointer;">
        </el-image>
        <el-button type="info">退出</el-button>
      </div>
    </el-header>
    <el-container id="main">
      <el-aside id="aside" width="200px">
        <!-- 侧边栏菜单区 -->
        <el-menu
            :router="true"
            :default-active="activePath"
            active-text-color="#409eff"
            background-color="#333744"
            text-color="#fff"
            unique-opened>

          <el-menu-item class="menu-item" v-for="item in paths" :index="item.path" @click="goto(item.path)">
            <i class="el-icon-setting"></i>
            <span slot="title">{{ item.title }}</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main id="main">
        <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped>
#container {
  height: 100%;
  width: 100%;
}

#header {

  height: 80px;
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 20px;

  div {
    display: flex;
    align-items: center;

    span {
      margin-left: 15px;
      color: #fff;
    }

    img {
      width: 54px;
      display: inline-block;
      border-radius: 50%;
      background-color: #eee;
    }
  }

}

#aside {
  background-color: #333744;
}

#main {
  background-color: #eaedf1;
}

.menu-item {
  border-right: none;
}

</style>