<template>
  <v-list class="px-2">
    <v-list-item
      class="text-lg rounded-lg"
      prepend-icon="mdi-weight-lifter"
      to="/"
    >
      <template #title>
        <p class="text-lg">My Workouts</p>
      </template>
    </v-list-item>

    <v-list-item
      class="text-lg rounded-lg"
      prepend-icon="mdi-chart-line"
      to="/progress"
    >
      <template #title>
        <p class="text-lg">Progress</p>
      </template>
    </v-list-item>
    <v-list-item
      prepend-icon="mdi-tape-measure"
      to="/measurements"
      class="text-lg rounded-lg"
    >
      <template #title>
        <p class="text-lg">Measurements</p>
      </template>
    </v-list-item>
  </v-list>
</template>
