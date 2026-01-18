<script setup lang="ts">
import { ref, onMounted } from 'vue'
import MovieItem from './MovieItem.vue'
import type { Movie } from './MovieItem.vue'
import axios from 'axios'

const movies = ref<Movie[]>([])
const error = ref<string>('')

const API_BASE = 'https://backend-movieapp-mh3p.onrender.com/movies'

//Login State
const username = ref(localStorage.getItem('username') || '')
const password = ref('')
const isLoggedIn = ref(!!username.value)

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

//Auth
async function register() {
  try {
    await axios.post(`${API_BASE}/auth/register`, {
      username: username.value,
      password: password.value,
    })
    error.value = 'Registered successfully! You can now login.'
  } catch {
    error.value = 'Registration failed'
  }
}

async function login() {
  try {
    const res = await axios.post(`${API_BASE}/auth/login`, {
      username: username.value,
      password: password.value,
    })

    if (res.data === 'Login successful') {
      localStorage.setItem('username', username.value)
      isLoggedIn.value = true
      fetchMovies()
      error.value = ''
    } else {
      error.value = res.data
    }
  } catch {
    error.value = 'Login failed'
  }
}

function logout() {
  localStorage.removeItem('username')
  isLoggedIn.value = false
  movies.value = []
}



async function fetchMovies() {
  try {
    const response = await axios.get(API_BASE)
    movies.value = response.data
  } catch (err) {
    console.error('Failed to fetch movies:', err)
    error.value = 'Could not load movies. Please try again later.'
  }
}

async function createMovie(){
  try {
    if (!title.value.trim()){
      error.value = 'Please enter a title.'
      return
    }
    const payload = {
      title: title.value,
      releaseYear: releaseYear.value,
      rating: rating.value,
      review: review.value,
    }

    const response = await axios.post(API_BASE, payload)
    movies.value.push(response.data)

    resetForm()
    error.value =''
  } catch (err) {
    console.error('Failed to add movie:',err)
    error.value = 'Could not add movie. Please try again later.'
  }

}
async function deleteMovie(id: number) {
  try {
    await axios.delete(`${API_BASE}/${id}`)//remove from UI immediately
    movies.value = movies.value.filter((m) => m.id !== id)

    if (editingId.value === id) resetForm()
    error.value = ''

  }

  catch (err) {
    console.error('Failed to delete movie:',err)
    error.value = 'Could not delete movie. Please try again later.'
  }
}
//
function startEdit(movie: Movie) {
  editingId.value = movie.id
  title.value = movie.title
  releaseYear.value = movie.releaseYear
  rating.value = movie.rating ?? 3
  review.value = movie.review ?? ''
}

//
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
    }

    const response = await axios.put(`${API_BASE}/${editingId.value}`, payload)

    //
    movies.value = movies.value.map((m) => (m.id === editingId.value ? response.data : m))

    resetForm()
    error.value = ''
  } catch (err) {
    console.error('Failed to update movie:', err)
    error.value = 'Could not update movie. Please try again later.'
  }
}
function cancelEdit() {
  resetForm()
}

onMounted(() => {
  fetchMovies()
})
</script>

<template>
  <div class="movie-list">

    <!---Login-->

    <div v-if="!isLoggedIn" class="add-box">
      <h3>Login / Register</h3>

      <input class="input" v-model="username" placeholder="Username" />
      <input class="input" v-model="password" type="password" placeholder="Password" />

      <button class="add-btn" @click="login">Login</button>
      <button class="cancel-btn" @click="register">Register</button>
    </div>

    <h2 class="list-title">Movie List </h2>

    <div class = "add-box">
      <h3 class="add-title">
        {{ editingId ? 'Edit Movie' : 'Add a Movie' }}
      </h3>

      <input class = "input" v-model="title" placeholder="Title"/>

      <input class = "input" v-model.number="releaseYear" type="number" placeholder=" Release year"/>

      <select class = "input" v-model.number ="rating">
        <option :value="1">1</option>
        <option :value="2">2</option>
        <option :value="3">3</option>
        <option :value="4">4</option>
        <option :value="5">5</option>
      </select>

      <textarea class="input" v-model="review" rows="3" placeholder="Write a review..."></textarea>

      <button class="add-btn" @click="editingId ? updateMovie() : createMovie()">
        {{ editingId ? 'Save Changes' : 'Add Movie' }}
      </button>

      <button v-if="editingId" class="cancel-btn" @click="cancelEdit">
        Cancel
      </button>

    </div>

    <div v-if="error" class="error">{{ error }}</div>

    <div v-else-if="movies.length > 0" class="movies-container">
      <MovieItem
        v-for="movie in movies"
        :key="movie.id"
        :movie="movie"
        @delete="deleteMovie"
        @edit="startEdit"
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
.add-box{
  background-color: rgba(255, 255, 255, 0.95);
  padding: 1rem;
  border-radius: 10px;
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.add-title{
  margin: 0;
  color: #2c3e50;
}

.input {
  padding: 0.7rem;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-size: 1rem;
}
.add-btn{
  padding: 0.75rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
}
.cancel-btn {
  padding: 0.75rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  background-color: #95a5a6;
  color: white;
}

.cancel-btn:hover {
  background-color: #7f8c8d;
}


</style>
