<template>
  <div>
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link>
    <router-view #default="{ Component }">
      <Suspense>
        <component :is="Component" />
      </Suspense>
    </router-view>
  </div>
</template>

<style>
@import url(./style.css);
</style>

