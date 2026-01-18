import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import App from '../App.vue'

describe('App auth gating', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('shows login/register when not logged in', () => {
    const wrapper = mount(App)
    expect(wrapper.text()).toContain('Login')
    expect(wrapper.text()).toContain('Register')
  })

  it('shows logged-in state when user exists in localStorage', async () => {
    localStorage.setItem('movieapp_user', JSON.stringify({ username: 'alice' }))
    const wrapper = mount(App)

    await nextTick() // allow onMounted() to load localStorage

    expect(wrapper.text()).toContain('Logged in as')
    expect(wrapper.text()).toContain('alice')
  })
})
