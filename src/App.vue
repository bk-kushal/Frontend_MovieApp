<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import MovieAPI from './components/MovieAPI.vue'

type AuthUser = { username: string }

const user = ref<AuthUser | null>(null)
const mode = ref<'login' | 'register'>('login')
const msg = ref('')

// cinematic entrance control
const uiReady = ref(false)

const form = reactive({
  username: '',
  password: '',
})
const canSubmit = computed(() => form.username.trim() !== '' && form.password.trim() !== '')

const API_BASE = 'https://backend-movieapp-mh3p.onrender.com'

onMounted(() => {
  const saved = localStorage.getItem('movieapp_user')
  if (saved) user.value = JSON.parse(saved)

  // start animations after first paint
  requestAnimationFrame(() => {
    uiReady.value = true
  })
})

function setUser(u: AuthUser) {
  user.value = u
  localStorage.setItem('movieapp_user', JSON.stringify(u))
}

function logout() {
  const ok = window.confirm('Are you sure you want to log out?')
  if (!ok) return

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
  <div class="app" :class="{ ready: uiReady }">
    <div class="hero">
      <div class="hero-vignette" aria-hidden="true"></div>
      <div class="hero-grain" aria-hidden="true"></div>

      <Transition name="cinematic-header" appear>
        <header class="app-header" v-if="uiReady">
          <h1>My Movie App</h1>

          <Transition name="fade" mode="out-in">
            <div v-if="user" class="userbar" key="userbar">
              <span class="usertext">
                Logged in as <b>{{ user.username }}</b>
              </span>
              <button class="btn btn-ghost" @click="logout">Logout</button>
            </div>
          </Transition>
        </header>
      </Transition>
    </div>

    <main class="content">
      <Transition name="cinematic-main" mode="out-in" appear>
        <!-- Auth card -->
        <section v-if="!user" class="auth-wrap" :key="'auth'">
          <div class="auth-card" v-if="uiReady">
            <div class="auth-glow" aria-hidden="true"></div>

            <div class="auth-header">
              <h2 class="auth-title">Track films you’ve watched</h2>
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
        <div v-else :key="'movies'">
          <MovieAPI :username="user.username" />
        </div>
      </Transition>
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
  overflow: hidden;
}

/* stronger, film-like overlay that animates in */
.hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(
    1200px 500px at 50% 20%,
    rgba(0, 0, 0, 0.18),
    rgba(0, 0, 0, 0.65)
  ),
  linear-gradient(180deg, rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.55));
  pointer-events: none;
  z-index: 0;

  opacity: 0;
  transition: opacity 1600ms cubic-bezier(0.2, 0.8, 0.2, 1);
}

/* vignette edges */
.hero-vignette {
  position: absolute;
  inset: -40px;
  background: radial-gradient(closest-side, rgba(0, 0, 0, 0) 55%, rgba(0, 0, 0, 0.55));
  pointer-events: none;
  z-index: 0;
  opacity: 0;
  transition: opacity 1800ms ease;
}

/* fake film grain (subtle) */
.hero-grain {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  opacity: 0;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.7' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23n)' opacity='.25'/%3E%3C/svg%3E");
  mix-blend-mode: overlay;
  transition: opacity 1600ms ease;
}

.app.ready .hero::before,
.app.ready .hero-vignette,
.app.ready .hero-grain {
  opacity: 1;
}

/* ---------- HEADER CARD ---------- */
.app-header {
  background-color: rgba(255, 255, 255, 0.92);
  padding: 1.5rem 2rem;
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.25);
  text-align: center;

  position: relative;
  z-index: 1;

  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.35);
  backdrop-filter: blur(10px);
}

.app-header h1 {
  color: #1f2a36;
  font-size: 2.6rem;
  font-weight: 900;
  letter-spacing: 0.4px;
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
  color: #1f2a36;
  font-weight: 700;
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
  font-weight: 900;
  cursor: pointer;
  transition: transform 120ms ease, opacity 120ms ease, box-shadow 160ms ease;
}

.btn:active {
  transform: translateY(1px);
}

.btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.btn-primary {
  background: #111827;
  color: white;
  box-shadow: 0 12px 28px rgba(17, 24, 39, 0.22);
}

.btn-primary:hover {
  opacity: 0.94;
}

.btn-ghost {
  background: rgba(17, 24, 39, 0.08);
  color: #111827;
}

.btn-ghost:hover {
  background: rgba(17, 24, 39, 0.12);
}

/* ---------- AUTH CARD (dramatic) ---------- */
.auth-wrap {
  max-width: 460px;
  margin: 0 auto;
}

.auth-card {
  position: relative;
  overflow: hidden;

  background: rgba(255, 255, 255, 0.96);
  border-radius: 18px;
  padding: 1.5rem;
  box-shadow: 0 18px 55px rgba(0, 0, 0, 0.16);
  border: 1px solid rgba(44, 62, 80, 0.10);

  /* extra cinematic entrance even without transitions */
  animation: authPop 700ms cubic-bezier(0.2, 0.9, 0.2, 1) both;
  animation-delay: 140ms;
}

.auth-glow {
  position: absolute;
  inset: -40%;
  background: radial-gradient(circle at 30% 20%, rgba(17, 24, 39, 0.22), transparent 55%);
  pointer-events: none;
  opacity: 0.9;
}

@keyframes authPop {
  from {
    opacity: 0;
    transform: translateY(18px) scale(0.985);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.auth-header {
  text-align: center;
  margin-bottom: 1rem;
  position: relative;
  z-index: 1;
}

.auth-title {
  margin: 0;
  font-size: 1.6rem;
  color: #111827;
  font-weight: 950;
}

.auth-subtitle {
  margin: 0.35rem 0 0;
  color: #6b7682;
  font-weight: 700;
}

/* Tabs */
.auth-tabs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
  background: rgba(17, 24, 39, 0.06);
  border-radius: 14px;
  padding: 0.4rem;
  margin: 1rem 0 1.1rem;
  position: relative;
  z-index: 1;
}

.tab {
  border: none;
  background: transparent;
  padding: 0.7rem 0.8rem;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 950;
  color: #111827;
}

.tab.active {
  background: white;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.10);
}

/* Form */
.auth-form {
  display: grid;
  gap: 0.6rem;
  position: relative;
  z-index: 1;
}

.label {
  font-size: 0.9rem;
  font-weight: 800;
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
  transition: border-color 160ms ease, box-shadow 160ms ease;
}

.input:focus {
  border-color: #111827;
  box-shadow: 0 0 0 4px rgba(17, 24, 39, 0.10);
}

.auth-error {
  margin-top: 0.5rem;
  text-align: center;
  color: #c0392b;
  font-weight: 800;
}

/* ---------- TRANSITIONS ---------- */
.cinematic-header-enter-active {
  transition: opacity 900ms cubic-bezier(0.2, 0.8, 0.2, 1),
  transform 900ms cubic-bezier(0.2, 0.8, 0.2, 1);
}
.cinematic-header-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}
.cinematic-header-enter-to {
  opacity: 1;
  transform: translateY(0);
}

.cinematic-main-enter-active,
.cinematic-main-leave-active {
  transition: opacity 520ms ease, transform 520ms ease;
}
.cinematic-main-enter-from,
.cinematic-main-leave-to {
  opacity: 0;
  transform: translateY(16px);
}
.cinematic-main-enter-to,
.cinematic-main-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 240ms ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Accessibility: reduce motion */
@media (prefers-reduced-motion: reduce) {
  .hero::before,
  .hero-vignette,
  .hero-grain {
    transition: none !important;
  }
  .cinematic-header-enter-active,
  .cinematic-main-enter-active,
  .cinematic-main-leave-active,
  .fade-enter-active,
  .fade-leave-active {
    transition: none !important;
  }
  .auth-card {
    animation: none !important;
  }
}
</style>
