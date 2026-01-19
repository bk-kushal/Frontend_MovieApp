<script setup lang="ts">
export interface Movie {
  id: number
  title: string
  releaseYear: number
  rating: number
  review: string
  username?: string
}

const props = defineProps<{
  movie: Movie
}>()

const emit = defineEmits<{
  (e: 'delete', id: number): void
  (e: 'edit', movie: Movie): void
}>()

function stars(rating: number) {
  const r = Math.max(0, Math.min(5, Math.round(rating)))
  return '★★★★★'.slice(0, r) + '☆☆☆☆☆'.slice(0, 5 - r)
}
</script>

<template>
  <article class="card">
    <header class="top">
      <div class="title-row">
        <h3 class="title">
          {{ movie.title }}
          <span class="year">({{ movie.releaseYear }})</span>
        </h3>

        <div class="rating">
          <span class="stars" aria-label="rating stars">{{ stars(movie.rating) }}</span>
          <span class="score">{{ movie.rating }}/5</span>
        </div>
      </div>

      <div class="divider"></div>
    </header>

    <p class="review" :title="movie.review">
      {{ movie.review || 'No review yet.' }}
    </p>

    <footer class="actions">
      <button class="btn btn-edit" @click="emit('edit', props.movie)">
        Edit
      </button>

      <button class="btn btn-delete" @click="emit('delete', props.movie.id)">
        Delete
      </button>
    </footer>
  </article>
</template>

<style scoped>
/* Netflix-ish card vibe: dark, clean, soft glow */
.card {
  border-radius: 18px;
  padding: 1.25rem 1.25rem 1rem;
  background: linear-gradient(180deg, rgba(24, 26, 32, 0.92), rgba(24, 26, 32, 0.86));
  color: #eef2f7;
  box-shadow: 0 14px 34px rgba(0, 0, 0, 0.22);
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease;
}

.card:hover {
  transform: translateY(-3px);
  box-shadow: 0 18px 46px rgba(0, 0, 0, 0.28);
  border-color: rgba(255, 255, 255, 0.14);
}

.top {
  margin-bottom: 0.9rem;
}

.title-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.title {
  margin: 0;
  font-size: 1.25rem;
  letter-spacing: 0.2px;
  line-height: 1.25;
  font-weight: 800;
}

.year {
  font-weight: 700;
  opacity: 0.75;
  margin-left: 0.4rem;
  font-size: 0.95rem;
}

.rating {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.15rem;
  min-width: 84px;
}

.stars {
  font-size: 1.05rem;
  letter-spacing: 1px;
  line-height: 1;
  user-select: none;
}

.score {
  font-size: 0.85rem;
  opacity: 0.8;
  font-weight: 700;
}

.divider {
  margin-top: 0.85rem;
  height: 1px;
  background: rgba(255, 255, 255, 0.10);
}

/* Review text */
.review {
  margin: 0;
  font-size: 0.98rem;
  line-height: 1.6;
  color: rgba(238, 242, 247, 0.9);

  /* clamp to keep cards tidy */
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Buttons */
.actions {
  display: flex;
  gap: 0.6rem;
  margin-top: 1rem;
}

.btn {
  border: none;
  border-radius: 12px;
  padding: 0.65rem 0.9rem;
  font-weight: 800;
  cursor: pointer;
  transition: transform 120ms ease, opacity 120ms ease;
}

.btn:active {
  transform: translateY(1px);
}

.btn-edit {
  background: rgba(255, 255, 255, 0.12);
  color: #eef2f7;
}

.btn-edit:hover {
  opacity: 0.92;
}

.btn-delete {
  background: rgba(231, 76, 60, 0.95);
  color: white;
}

.btn-delete:hover {
  opacity: 0.92;
}

/* Responsive */
@media (max-width: 540px) {
  .title-row {
    flex-direction: column;
    align-items: flex-start;
  }
  .rating {
    align-items: flex-start;
  }
}
</style>
