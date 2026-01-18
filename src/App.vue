<script setup lang="ts">
import MovieAPI from './components/MovieAPI.vue'

</script>

<template>
  <div class="app">
    <div class="hero">
      <header class="app-header">
        <h1>My Movie App</h1>
      </header>
    </div>

    <main class="content">
      <MovieAPI />
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
  background-color: #f5f6fa
}

.hero {
  height: 320px; /* fixed height so it NEVER stretches */
  background-image: url('/detectiveLoki.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  display: flex;
  align-items: center;
  justify-content: center;

  position: relative;
}

.hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
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

.content {
  padding: 2rem 1rem;
}
</style>
