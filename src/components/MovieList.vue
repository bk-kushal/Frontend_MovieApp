<script setup lang="ts">
import { ref } from 'vue'
import MovieItem from './MovieItem.vue'
import type { Movie } from './MovieItem.vue'

const movies = ref<Movie[]>([
  {
    id: 1,
    title: 'The Shawshank Redemption',
    releaseYear: 1994,
    rating: 5,
    review: 'An inspiring story about hope and friendship. One of the best films ever made.',
  },
  {
    id: 2,
    title: 'Inception',
    releaseYear: 2010,
    rating: 5,
    review: 'Mind-bending thriller with stunning visuals. Christopher Nolan at his best.',
  },
  {
    id: 3,
    title: 'The Dark Knight',
    releaseYear: 2010,
    rating: 5,
    review: "Heath Ledger's performance as the Joker is legendary. A masterpiece.",
  },
  {
    id: 4,
    title: 'Pulp Fiction',
    releaseYear: 1994,
    rating: 4,
    review: 'Quentin Tarantino classic with great dialogue and non-linear storytelling.',
  },
])
</script>

<template>
  <div class="movie-list">
    <h2 class="list-title">My Favorite Movies</h2>
    <div v-if="movies.length > 0" class="movies-container">
      <MovieItem v-for="movie in movies" :key="movie.id" :movie="movie" />
    </div>
    <div v-else class="empty-state">
      <p>No movies in your list yet. Start adding your favorites!</p>
    </div>
  </div>
</template>

<style scoped>
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
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #999;
  font-size: 1.1rem;
}
</style>
