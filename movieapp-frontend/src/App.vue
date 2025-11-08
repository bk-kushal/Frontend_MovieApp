<script setup lang="ts">
import MovieList from './components/MovieList.vue'
</script>

<template>
  <div class="app">
    <header class="app-header">
      <h1>My Movie App</h1>
    </header>
    <main>
      <MovieList />
    </main>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,
    sans-serif;
  background-color: #ffffff;
  color: #333;
}

#app {
  min-height: 100vh;
}
</style>

<style scoped>
.app {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.app-header {
  background-color: rgba(255, 255, 255, 0.95);
  padding: 1.5rem 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.app-header h1 {
  color: #2c3e50;
  font-size: 2.5rem;
  font-weight: 700;
}

main {
  padding: 2rem 1rem;
}
</style>
