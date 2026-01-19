<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import MovieItem from './MovieItem.vue'
import type { Movie } from './MovieItem.vue'
import axios from 'axios'

const props = defineProps<{
  username: string
}>()

const movies = ref<Movie[]>([])
const error = ref<string>('')

const API_ROOT = 'https://backend-movieapp-mh3p.onrender.com'
const MOVIES_URL = `${API_ROOT}/movies`

const showForm = ref(false)

const title = ref('')
const releaseYear = ref<number>(new Date().getFullYear())
const rating = ref<number>(3)
const review = ref('')
const editingId = ref<number | null>(null)

function resetForm() {
  title.value = ''
  releaseYear.value = new Date().getFullYear()
  rating.value = 3
  review.value = ''
  editingId.value = null
}

function openAddForm() {
  resetForm()
  error.value = ''
  showForm.value = true
}

function closeForm() {
  resetForm()
  error.value = ''
  showForm.value = false
}

// Sorting + Filtering state
type SortMode = 'newest' | 'oldest' | 'ratingHigh' | 'ratingLow' | 'titleAZ' | 'titleZA'
const sortMode = ref<SortMode>('newest')

const query = ref('')
const minRating = ref<number>(0)
const yearFrom = ref<number | ''>('')
const yearTo = ref<number | ''>('')

function clearFilters() {
  query.value = ''
  minRating.value = 0
  yearFrom.value = ''
  yearTo.value = ''
  sortMode.value = 'newest'
}

const visibleMovies = computed(() => {
  const q = query.value.trim().toLowerCase()
  const yf = yearFrom.value === '' ? -Infinity : Number(yearFrom.value)
  const yt = yearTo.value === '' ? Infinity : Number(yearTo.value)

  let list = movies.value.filter((m) => {
    const titleText = (m.title ?? '').toLowerCase()
    const reviewText = (m.review ?? '').toLowerCase()

    const inText = q === '' || titleText.includes(q) || reviewText.includes(q)
    const inRating = (m.rating ?? 0) >= minRating.value

    const y = m.releaseYear ?? 0
    const inYear = y >= yf && y <= yt

    return inText && inRating && inYear
  })

  const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' })

  list = [...list].sort((a, b) => {
    switch (sortMode.value) {
      case 'newest':
        return (b.releaseYear ?? 0) - (a.releaseYear ?? 0)
      case 'oldest':
        return (a.releaseYear ?? 0) - (b.releaseYear ?? 0)
      case 'ratingHigh':
        return (b.rating ?? 0) - (a.rating ?? 0)
      case 'ratingLow':
        return (a.rating ?? 0) - (b.rating ?? 0)
      case 'titleAZ':
        return collator.compare(a.title ?? '', b.title ?? '')
      case 'titleZA':
        return collator.compare(b.title ?? '', a.title ?? '')
    }
  })

  return list
})

async function fetchMovies() {
  try {
    const response = await axios.get(MOVIES_URL, {
      params: { username: props.username },
    })
    movies.value = response.data
    error.value = ''
  } catch (err) {
    console.error('Failed to fetch movies:', err)
    error.value = 'Could not load movies. Please try again later.'
  }
}

async function createMovie() {
  try {
    if (!title.value.trim()) {
      error.value = 'Please enter a title.'
      return
    }

    const payload = {
      title: title.value,
      releaseYear: releaseYear.value,
      rating: rating.value,
      review: review.value,
      username: props.username,
    }

    const response = await axios.post(MOVIES_URL, payload)
    movies.value.push(response.data)

    closeForm()
  } catch (err) {
    console.error('Failed to add movie:', err)
    error.value = 'Could not add movie. Please try again later.'
  }
}

async function deleteMovie(id: number) {
  try {
    await axios.delete(`${MOVIES_URL}/${id}`)
    movies.value = movies.value.filter((m) => m.id !== id)

    if (editingId.value === id) closeForm()
    error.value = ''
  } catch (err) {
    console.error('Failed to delete movie:', err)
    error.value = 'Could not delete movie. Please try again later.'
  }
}

function startEdit(movie: Movie) {
  showForm.value = true
  error.value = ''

  editingId.value = movie.id
  title.value = movie.title
  releaseYear.value = movie.releaseYear
  rating.value = movie.rating ?? 3
  review.value = movie.review ?? ''
}

async function updateMovie() {
  try {
    if (editingId.value === null) return

    if (!title.value.trim()) {
      error.value = 'Please enter a title.'
      return
    }

    const payload = {
      title: title.value,
      releaseYear: releaseYear.value,
      rating: rating.value,
      review: review.value,
      username: props.username,
    }

    const response = await axios.put(`${MOVIES_URL}/${editingId.value}`, payload)

    movies.value = movies.value.map((m) => (m.id === editingId.value ? response.data : m))

    closeForm()
  } catch (err) {
    console.error('Failed to update movie:', err)
    error.value = 'Could not update movie. Please try again later.'
  }
}

onMounted(() => {
  if (props.username) fetchMovies()
})

watch(
  () => props.username,
  (newUsername) => {
    if (newUsername) fetchMovies()
    else movies.value = []
  }
)
</script>

<template>
  <div class="movie-list">
    <h2 class="list-title">Movie List</h2>

    <div class="toolbar">
      <button v-if="!showForm" class="primary-btn" @click="openAddForm">
        + Add a movie
      </button>

      <div v-else class="form-header">
        <h3 class="form-title">{{ editingId ? 'Edit Movie' : 'Add a Movie' }}</h3>
        <button class="ghost-btn" @click="closeForm">✕ Close</button>
      </div>
    </div>

    <!-- Form (only visible when showForm) -->
    <div v-if="showForm" class="add-box">
      <div class="grid">
        <div class="field">
          <label class="label">Title</label>
          <input class="input" v-model="title" placeholder="e.g. Interstellar" />
        </div>

        <div class="field">
          <label class="label">Release year</label>
          <input class="input" v-model.number="releaseYear" type="number" />
        </div>

        <div class="field">
          <label class="label">Rating</label>
          <select class="input" v-model.number="rating">
            <option :value="1">1</option>
            <option :value="2">2</option>
            <option :value="3">3</option>
            <option :value="4">4</option>
            <option :value="5">5</option>
          </select>
        </div>

        <div class="field full">
          <label class="label">Review</label>
          <textarea class="input" v-model="review" rows="3" placeholder="Write a short review..."></textarea>
        </div>
      </div>

      <div class="actions">
        <button class="primary-btn" @click="editingId ? updateMovie() : createMovie()">
          {{ editingId ? 'Save Changes' : 'Add Movie' }}
        </button>

        <button class="secondary-btn" @click="closeForm">
          Cancel
        </button>
      </div>

      <div v-if="error" class="error">{{ error }}</div>
    </div>

    <!-- Two-column area: movies left, filters right -->
    <div class="layout">
      <!-- LEFT: Movies -->
      <div class="list-column">
        <div v-if="!error && visibleMovies.length > 0" class="movies-container">
          <MovieItem
            v-for="movie in visibleMovies"
            :key="movie.id"
            :movie="movie"
            @delete="deleteMovie"
            @edit="startEdit"
          />
        </div>

        <div v-else-if="!error && visibleMovies.length === 0" class="empty-state">
          <p>No movies match your filters. Try clearing them.</p>
        </div>

        <div v-else-if="error" class="empty-state">
          <p>{{ error }}</p>
        </div>
      </div>

      <!-- RIGHT: Filters -->
      <aside class="filter-column">
        <div class="filter-card">
          <div class="filter-head">
            <h3 class="filter-title">Sort & Filter</h3>
            <button class="chip-btn" type="button" @click="clearFilters">Clear</button>
          </div>

          <div class="control">
            <label class="label">Search</label>
            <input class="input" v-model="query" placeholder="Search title or review..." />
          </div>

          <div class="control">
            <label class="label">Sort</label>
            <select class="input" v-model="sortMode">
              <option value="newest">Release year (newest)</option>
              <option value="oldest">Release year (oldest)</option>
              <option value="ratingHigh">Rating (high → low)</option>
              <option value="ratingLow">Rating (low → high)</option>
              <option value="titleAZ">Title (A → Z)</option>
              <option value="titleZA">Title (Z → A)</option>
            </select>
          </div>

          <div class="control">
            <label class="label">Min rating</label>
            <select class="input" v-model.number="minRating">
              <option :value="0">Any</option>
              <option :value="1">1+</option>
              <option :value="2">2+</option>
              <option :value="3">3+</option>
              <option :value="4">4+</option>
              <option :value="5">5 only</option>
            </select>
          </div>

          <div class="control">
            <label class="label">Year from</label>
            <input class="input" v-model.number="yearFrom" type="number" placeholder="e.g. 2000" />
          </div>

          <div class="control">
            <label class="label">Year to</label>
            <input class="input" v-model.number="yearTo" type="number" placeholder="e.g. 2026" />
          </div>

          <div class="hint">
            Showing <b>{{ visibleMovies.length }}</b> of <b>{{ movies.length }}</b>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.movie-list {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.list-title {
  color: #2c3e50;
  font-size: 2rem;
  margin-bottom: 1rem;
  text-align: center;
}

/* Toolbar */
.toolbar {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}

.form-header {
  width: 100%;
  max-width: 1200px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.25rem 0.25rem;
}

.form-title {
  margin: 0;
  color: #2c3e50;
}

/* Buttons */
.primary-btn {
  padding: 0.85rem 1rem;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 700;
  background: #2c3e50;
  color: white;
}

.primary-btn:hover {
  opacity: 0.92;
}

.secondary-btn {
  padding: 0.85rem 1rem;
  border: 1px solid #d8dde3;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 700;
  background: white;
  color: #2c3e50;
}

.secondary-btn:hover {
  background: #f6f7f9;
}

.ghost-btn {
  border: none;
  background: transparent;
  cursor: pointer;
  font-weight: 700;
  color: #2c3e50;
  padding: 0.5rem 0.75rem;
  border-radius: 10px;
}

.ghost-btn:hover {
  background: rgba(44, 62, 80, 0.08);
}

/* Form card */
.add-box {
  background-color: rgba(255, 255, 255, 0.96);
  padding: 1.25rem;
  border-radius: 16px;
  margin: 0 auto 1.25rem;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.08);
  max-width: 1200px;
}

.grid {
  display: grid;
  grid-template-columns: 1.4fr 0.8fr 0.6fr;
  gap: 0.9rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.field.full {
  grid-column: 1 / -1;
}

.label {
  font-size: 0.9rem;
  color: #5b6773;
  font-weight: 600;
}

.input {
  padding: 0.75rem 0.85rem;
  border-radius: 12px;
  border: 1px solid #d8dde3;
  font-size: 1rem;
  outline: none;
  background: white;
}

.input:focus {
  border-color: #2c3e50;
}

.actions {
  margin-top: 1rem;
  display: flex;
  gap: 0.75rem;
}

.error {
  margin-top: 0.75rem;
  text-align: center;
  color: #c0392b;
  font-weight: 600;
}

/* Two-column layout */
.layout {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 1.5rem;
  align-items: start;
}

.list-column {
  min-width: 0;
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

/* Filter panel */
.filter-column {
  position: relative;
}

.filter-card {
  background: rgba(255, 255, 255, 0.96);
  border-radius: 16px;
  padding: 1.1rem;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.08);
  position: sticky;
  top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.filter-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

.filter-title {
  margin: 0;
  color: #2c3e50;
  font-size: 1.1rem;
  font-weight: 800;
}

.chip-btn {
  border: 1px solid rgba(44, 62, 80, 0.18);
  background: rgba(44, 62, 80, 0.06);
  color: #2c3e50;
  border-radius: 999px;
  padding: 0.35rem 0.7rem;
  font-weight: 800;
  cursor: pointer;
}

.chip-btn:hover {
  background: rgba(44, 62, 80, 0.1);
}

.hint {
  margin-top: 0.25rem;
  color: #6b7682;
  font-weight: 600;
  font-size: 0.95rem;
}

/* Responsive */
@media (max-width: 900px) {
  .layout {
    grid-template-columns: 1fr;
  }

  .filter-card {
    position: static;
  }

  .grid {
    grid-template-columns: 1fr;
  }

  .actions {
    flex-direction: column;
  }
}
</style>
