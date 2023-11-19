<script setup>
import {useData} from 'vitepress';
import {ref} from 'vue';

const {theme} = useData();
const localUrl = theme.value.localUrl;
const Login = () => {
  location.href = '/passport/login.html';
};
const localUser = localStorage.getItem('user');
let user = ref(null);
let user_avatar = ref('https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png');
let username = ref('未登录');
if (localUser) {
  user.value = JSON.parse(localUser);
  user_avatar.value = localUrl + user.value.avatar;
  username.value = user.value.username;
}

const Logout = () => {
  localStorage.setItem('jwt', '');
  // console.log(ret.data);
  localStorage.setItem('user', '');
  location.reload();
};
</script>

<template>
  <div class="Avatar">
    <el-dropdown :hide-on-click="false">
      <div class="el-dropdown-link">
        <el-avatar
            :size="20"
            style="object-fit: cover;margin-top: 2px"
            :src="user_avatar"
        >
        </el-avatar>
        <div class="username">{{ username }}</div>
      </div>
      <template #dropdown>
        <el-dropdown-menu>

          <el-dropdown-item @click="Login" v-if="!user">登录</el-dropdown-item>
          <el-dropdown-item @click="Logout">退出</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>

  </div>
</template>

<style scoped>
el-dropdown {
  color: white !important;
}

.Avatar {
  margin-left: 10px;
  border-left: 1px solid var(--vp-c-divider);
  padding-left: 15px;

}

.el-dropdown-link {
  display: flex;
  justify-items: left;
}

:deep(:focus-visible) {
  outline: none;
}

.username {
  margin-left: 5px;
  margin-top: 6px;
}
</style>