<script setup lang="ts">
export interface Movie {
  id: number
  title: string
  releaseYear: number
  rating: number
  review: string

  username?: string

}

defineProps<{
  movie: Movie
}>()

const emit = defineEmits<{
(e: 'delete', id: number): void
  (e: 'edit', movie: Movie): void


}>()

</script>

<template>
  <div class="movie-item">
    <h3 class="movie-title">{{ movie.title }}</h3>

    <div class="movie-year">
      <span class="rat">Rating:</span>
      <span class="rating-value">{{ movie.rating }}/5</span>
    </div>

    <p class="movie-review">{{ movie.review }}</p>

    <div class="btn-row">
      <button class="edit-btn" @click="emit('edit', movie)">
        Edit
      </button>

      <button class="delete-btn" @click="emit('delete', movie.id)">
        Delete
      </button>
    </div>
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

.btn-row{
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.delete-btn{
  padding: 0.4rem 0.8rem;
  border: none;
  border-radius: 6px;
  background-color: #e74c3c;
  color: white;
  cursor: pointer;
}

.delete-btn:hover{
  background-color: #c0392b;
}
.edit-btn {
  padding: 0.4rem 0.8rem;
  border: none;
  border-radius: 6px;
  background-color: #3498db;
  color: white;
  cursor: pointer;
}

.edit-btn:hover {
  background-color: #2980b9;
}
</style>
