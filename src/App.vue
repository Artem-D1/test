<template>
  <div>
    <Books />
  </div>
</template>

<script>
import Books from "../src/components/books";

export default {
  name: "App",
  components: {
    Books,
  },
};
</script>

<style>
#app {
  font-family: Times, Times New Roman, serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
