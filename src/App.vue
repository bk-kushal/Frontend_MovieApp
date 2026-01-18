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

  // Your backend returns plain strings like "Login successful"
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

        <div
          v-if="user"
          style="margin-top: 0.75rem; display: flex; gap: 0.75rem; justify-content: center; align-items: center;"
        >
          <span>Logged in as <b>{{ user.username }}</b></span>
          <button @click="logout">Logout</button>
        </div>


      </header>
    </div>

    <main class="content">
      <section v-if="!user" style="max-width: 420px; margin: 0 auto;">
        <div style="background: white; padding: 1.5rem; border-radius: 16px; box-shadow: 0 6px 24px rgba(0,0,0,0.08);">
          <h2>{{ mode === 'login' ? 'Login' : 'Register' }}</h2>

          <form @submit.prevent="submitAuth" style="display: grid; gap: 0.75rem;">
            <input v-model="form.username" placeholder="Username" />
            <input v-model="form.password" type="password" placeholder="Password" />

            <button type="submit" :disabled="!canSubmit">
              {{ mode === 'login' ? 'Login' : 'Register' }}
            </button>

            <p v-if="msg" style="color: red;">{{ msg }}</p>
          </form>

          <button
            @click="mode = mode === 'login' ? 'register' : 'login'; msg = ''"
            style="margin-top: 1rem;"
          >
            {{ mode === 'login' ? 'Need an account? Register' : 'Already have an account? Login' }}
          </button>
        </div>
      </section>


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
