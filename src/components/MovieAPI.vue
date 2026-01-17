<script setup lang="ts">
import { ref, onMounted } from 'vue'
import MovieItem from './MovieItem.vue'
import type { Movie } from './MovieItem.vue'
import axios from 'axios'

const movies = ref<Movie[]>([])
const error = ref<string>('')

const API_BASE = 'https://backend-movieapp-mh3p.onrender.com/movies'


async function fetchMovies() {
  try {
    const response = await axios.get(API_BASE)
    movies.value = response.data
  } catch (err) {
    console.error('Failed to fetch movies:', err)
    error.value = 'Could not load movies. Please try again later.'
  }
}
async function deleteMovie(id: number) {
  try {
    await axios.delete(`${API_BASE}/${id}`)//remove from UI immediately
    movies.value = movies.value.filter((m) => m.id !== id)
  }
  catch (err) {
    console.error('Failed to delete movie:',err)
    error.value = 'Could not delete movie. Please try again later.'
  }
}

onMounted(() => {
  fetchMovies()
})
</script>

<template>
  <div class="movie-list">
    <h2 class="list-title">Movie List (From Backend)</h2>

    <div v-if="error" class="error">{{ error }}</div>

    <div v-else-if="movies.length > 0" class="movies-container">
      <MovieItem
        v-for="movie in movies"
        :key="movie.id"
        :movie="movie"
        @delete="deleteMovie"
      />
    </div>

    <div v-else class="empty-state">
      <p>No movies available. Please check back later!</p>
    </div>
  </div>
</template>

<style scoped>
/* You can reuse the same styles as MovieList.vue */
.movie-list {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.list-title {
  color: #2c3e50;
  font-size: 2rem;
  margin-bottom: 1.5rem;
  text-align: center;
}

.movies-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #999;
  font-size: 1.1rem;
}

.error {
  text-align: center;
  color: red;
  margin-bottom: 1rem;
}
</style>
