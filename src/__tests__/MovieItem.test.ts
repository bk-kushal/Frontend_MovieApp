import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MovieItem from '../components/MovieItem.vue'

describe('MovieItem', () => {
  it('emits edit and delete events', async () => {
    const wrapper = mount(MovieItem, {
      props: {
        movie: {
          id: 1,
          title: 'Test Movie',
          releaseYear: 2020,
          rating: 4,
          review: 'Nice',
          username: 'alice',
        },
      },
    })

    await wrapper.find('button.edit-btn').trigger('click')
    expect(wrapper.emitted('edit')).toBeTruthy()

    await wrapper.find('button.delete-btn').trigger('click')
    expect(wrapper.emitted('delete')).toBeTruthy()
    expect(wrapper.emitted('delete')![0]).toEqual([1])
  })
})
