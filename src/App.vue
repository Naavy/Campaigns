<template>
  <DashboardCampaigns />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import DashboardCampaigns from "./components/DashboardCampaigns.vue";

export default defineComponent({
  name: "App",
  components: {
    DashboardCampaigns,
  },
});
</script>

<style lang="scss">
body {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  background-color: #282c34;
  color: white;
}

#app {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 60px;
}
</style>
