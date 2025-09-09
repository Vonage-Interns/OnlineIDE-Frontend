import { mount } from '@vue/test-utils'
import SideBar from '@/views/SideBar.vue'
import { createStore } from 'vuex'

Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: jest.fn((key) => {
      if (key === 'email') return 'testuser@example.com'
      return null
    }),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn()
  },
  writable: true
})


const store = createStore({
  modules: {
    FileStore: {
      namespaced: true,
      state: () => ({
        slideropen: false
      }),
      mutations: {
        toggleSlider(state) {
          state.slideropen = !state.slideropen
        }
      }
    },
    TerminalStore: {
      namespaced: true,
      state: () => ({
        terminalVisible: false
      })
    }
  }
})

describe('SideBar.vue', () => {
  let wrapper

  beforeEach(() => {
    store.state.FileStore.slideropen = false
    wrapper = mount(SideBar, {
      global: {
        plugins: [store],
        stubs: {
          'font-awesome-icon': true,
          'TerminalView': true
        }
      }
    })
  })

  it('renders properly', () => {
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.vm.username).toBe('testuser') 
  })

  it('checks initial slider state', () => {
    expect(wrapper.vm.$store.state.FileStore.slideropen).toBe(false)
  })

  it('toggles slider on action', async () => {
    wrapper.vm.$store.commit('FileStore/toggleSlider')
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.$store.state.FileStore.slideropen).toBe(true)
  })
  it('returns correct content object based on slider state', async () => {

  await wrapper.vm.$nextTick()  
  let content = wrapper.vm.content
  expect(content.marginLeft).toBe('90px')
  expect(content.paddingTop).toBe('300px')

  
  wrapper.vm.$store.commit('FileStore/toggleSlider')
  await wrapper.vm.$nextTick()
  
  content = wrapper.vm.content
  expect(content.marginLeft).toBe('-150px')
  expect(content.paddingTop).toBe('300px')
})
it('updates username when localStorage email changes', async () => {
  
  expect(wrapper.vm.username).toBe('testuser')


  window.localStorage.getItem.mockImplementation((key) => {
    if (key === 'email') return 'testuser@example.com'
    return null
  })

  
  await wrapper.vm.$nextTick()

  expect(wrapper.vm.username).toBe('testuser')
})


})

