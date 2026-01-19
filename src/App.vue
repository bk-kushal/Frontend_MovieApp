<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import MovieAPI from './components/MovieAPI.vue'

type AuthUser = { username: string }

const user = ref<AuthUser | null>(null)
const mode = ref<'login' | 'register'>('login')
const msg = ref('')

const form = reactive({
  username: '',
  password: '',
})
const canSubmit = computed(() => form.username.trim() !== '' && form.password.trim() !== '')

const API_BASE = 'https://backend-movieapp-mh3p.onrender.com'

onMounted(() => {
  const saved = localStorage.getItem('movieapp_user')
  if (saved) user.value = JSON.parse(saved)
})

function setUser(u: AuthUser) {
  user.value = u
  localStorage.setItem('movieapp_user', JSON.stringify(u))
}

function logout() {
  user.value = null
  localStorage.removeItem('movieapp_user')
  localStorage.removeItem('username')
  form.username = ''
  form.password = ''
  msg.value = ''
  mode.value = 'login'
}

async function submitAuth() {
  msg.value = ''
  if (!canSubmit.value) {
    msg.value = 'Please enter username and password.'
    return
  }

  const endpoint = mode.value === 'login' ? '/auth/login' : '/auth/register'

  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: form.username.trim(),
      password: form.password,
    }),
  })

  const text = await res.text()

  if (text.toLowerCase().includes('successful')) {
    setUser({ username: form.username.trim() })
    msg.value = ''
    form.password = ''
  } else {
    msg.value = text || 'Something went wrong'
  }
}
</script>

<template>
  <div class="app">
    <div class="hero">
      <header class="app-header">
        <h1>My Movie App</h1>

        <div v-if="user" class="userbar">
          <span class="usertext">
            Logged in as <b>{{ user.username }}</b>
          </span>
          <button class="btn btn-ghost" @click="logout">Logout</button>
        </div>
      </header>
    </div>

    <main class="content">
      <!-- Auth card -->
      <section v-if="!user" class="auth-wrap">
        <div class="auth-card">
          <div class="auth-header">
            <h2 class="auth-title">Welcome</h2>
            <p class="auth-subtitle">Sign in to manage your movies</p>
          </div>

          <div class="auth-tabs">
            <button
              class="tab"
              :class="{ active: mode === 'login' }"
              type="button"
              @click="mode = 'login'; msg = ''"
            >
              Login
            </button>
            <button
              class="tab"
              :class="{ active: mode === 'register' }"
              type="button"
              @click="mode = 'register'; msg = ''"
            >
              Register
            </button>
          </div>

          <form class="auth-form" @submit.prevent="submitAuth">
            <label class="label">Username</label>
            <input
              class="input"
              v-model="form.username"
              placeholder="e.g. alice"
              autocomplete="username"
            />

            <label class="label">Password</label>
            <input
              class="input"
              v-model="form.password"
              type="password"
              placeholder="••••••••"
              :autocomplete="mode === 'login' ? 'current-password' : 'new-password'"
            />

            <button class="btn btn-primary" type="submit" :disabled="!canSubmit">
              {{ mode === 'login' ? 'Login' : 'Create account' }}
            </button>

            <p v-if="msg" class="auth-error">{{ msg }}</p>
          </form>
        </div>
      </section>

      <!-- Logged-in app -->
      <MovieAPI v-else :username="user.username" />
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
  background-color: #f5f6fa;
}

.hero {
  height: 320px;
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

  pointer-events: none;
  z-index: 0;
}

.app-header {
  background-color: rgba(255, 255, 255, 0.95);
  padding: 1.5rem 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;

  position: relative;
  z-index: 1;

  border-radius: 18px;
}

.app-header h1 {
  color: #2c3e50;
  font-size: 2.5rem;
  font-weight: 800;
}

/* Logged in mini bar */
.userbar {
  margin-top: 0.75rem;
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}

.usertext {
  color: #2c3e50;
  font-weight: 600;
}

/* Main spacing */
.content {
  padding: 2rem 1rem;
}

/* Buttons (shared) */
.btn {
  border: none;
  border-radius: 12px;
  padding: 0.75rem 1rem;
  font-weight: 800;
  cursor: pointer;
  transition: transform 120ms ease, opacity 120ms ease;
}

.btn:active {
  transform: translateY(1px);
}

.btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.btn-primary {
  background: #2c3e50;
  color: white;
}

.btn-primary:hover {
  opacity: 0.92;
}

.btn-ghost {
  background: rgba(44, 62, 80, 0.08);
  color: #2c3e50;
}

.btn-ghost:hover {
  background: rgba(44, 62, 80, 0.12);
}

/* Auth card */
.auth-wrap {
  max-width: 460px;
  margin: 0 auto;
}

.auth-card {
  background: rgba(255, 255, 255, 0.96);
  border-radius: 18px;
  padding: 1.5rem;
  box-shadow: 0 14px 34px rgba(0, 0, 0, 0.12);
  border: 1px solid rgba(44, 62, 80, 0.08);
}

.auth-header {
  text-align: center;
  margin-bottom: 1rem;
}

.auth-title {
  margin: 0;
  font-size: 1.6rem;
  color: #2c3e50;
  font-weight: 900;
}

.auth-subtitle {
  margin: 0.35rem 0 0;
  color: #6b7682;
  font-weight: 600;
}

/* Tabs */
.auth-tabs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
  background: rgba(44, 62, 80, 0.06);
  border-radius: 14px;
  padding: 0.4rem;
  margin: 1rem 0 1.1rem;
}

.tab {
  border: none;
  background: transparent;
  padding: 0.7rem 0.8rem;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 900;
  color: #2c3e50;
}

.tab.active {
  background: white;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.08);
}

/* Form */
.auth-form {
  display: grid;
  gap: 0.6rem;
}

.label {
  font-size: 0.9rem;
  font-weight: 700;
  color: #5b6773;
  margin-top: 0.25rem;
}

.input {
  padding: 0.85rem 0.95rem;
  border-radius: 12px;
  border: 1px solid #d8dde3;
  font-size: 1rem;
  outline: none;
  background: white;
}

.input:focus {
  border-color: #2c3e50;
}

.auth-error {
  margin-top: 0.5rem;
  text-align: center;
  color: #c0392b;
  font-weight: 700;
}
</style>
