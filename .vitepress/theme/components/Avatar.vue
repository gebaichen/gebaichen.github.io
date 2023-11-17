<script setup>
const Login = () => {
  location.href = '/passport/login.html';
};
</script>

<template>
  <div class="Avatar">
    <el-dropdown :hide-on-click="false">
      <el-avatar
          class="el-dropdown-link"
          :size="25"
          style="object-fit: cover;"
          src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
      >
      </el-avatar>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="Login">登录</el-dropdown-item>
          <el-dropdown-item>退出</el-dropdown-item>
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
  border-left: 1px solid #e7e7e8;
  padding-left: 10px;

}

:deep(:focus-visible) {
  outline: none;
}
</style>