<template>
  <!-- <v-container>
    <v-main> <router-view></router-view> </v-main>
  </v-container> -->
  <router-view v-slot="{ Component, route }">
    <template v-if="route.meta.requiresLayout">
      <v-container>
        <v-main>
          <component :is="Component" />
        </v-main>
      </v-container>
    </template>
    <template v-else>
      <component :is="Component" />
    </template>
  </router-view>
</template>
