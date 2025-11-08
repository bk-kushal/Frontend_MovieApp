<script setup lang="ts">
export interface Movie {
  id: number
  title: string
  rating: number
  review: string
}

defineProps<{
  movie: Movie
}>()
</script>

<template>
  <div class="movie-item">
    <h3 class="movie-title">{{ movie.title }}</h3>
    <div class="movie-rating">
      <span class="rating-label">Rating:</span>
      <span class="rating-value">{{ movie.rating }}/5</span>
    </div>
    <p class="movie-review">{{ movie.review }}</p>
  </div>
</template>

<style scoped>
.movie-item {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.movie-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.movie-title {
  margin: 0 0 0.75rem 0;
  color: #2c3e50;
  font-size: 1.25rem;
}

.movie-rating {
  margin-bottom: 0.75rem;
  color: #555;
}

.rating-label {
  font-weight: 600;
  margin-right: 0.5rem;
}

.rating-value {
  color: #ff9800;
  font-weight: bold;
}

.movie-review {
  margin: 0;
  color: #666;
  line-height: 1.5;
}
</style>
