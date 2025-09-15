
import { mount } from '@vue/test-utils';
import CompilerView from '@/views/CompilerView.vue';

describe('CompilerView.vue', () => {
  it('renders without crashing', () => {

    const $store = {
      state: {
        ProjectStore: {
          modalDisplay: false,
          projectsDisplay: false,
        },
      },
    };

    const wrapper = mount(CompilerView, {
      global: {
        mocks: {
          $store,
        },
        stubs: {
          'compiler-header': true,
          'side-bar': true,
          'create-project-modal': true,
          'project-selection-modal': true,
        },
      },
    });

    
    expect(wrapper.exists()).toBe(true);


    const wholeCompiler = wrapper.find('#wholecompiler');
    expect(wholeCompiler.element.style.opacity).toBe('1');
  });

  it('renders modal when modalDisplay is true', async () => {
    const $store = {
      state: {
        ProjectStore: {
          modalDisplay: true,
          projectsDisplay: false,
        },
      },
    };

    const wrapper = mount(CompilerView, {
      global: {
        mocks: { $store },
        stubs: {
          'compiler-header': true,
          'side-bar': true,
          'create-project-modal': true,
          'project-selection-modal': true,
        },
      },
    });

    expect(wrapper.findComponent({ name: 'CreateProjectModal' }).exists()).toBe(true);
  });

  it('renders project selection modal when projectsDisplay is true', async () => {
    const $store = {
      state: {
        ProjectStore: {
          modalDisplay: false,
          projectsDisplay: true,
        },
      },
    };

    const wrapper = mount(CompilerView, {
      global: {
        mocks: { $store },
        stubs: {
          'compiler-header': true,
          'side-bar': true,
          'create-project-modal': true,
          'project-selection-modal': true,
        },
      },
    });

    expect(wrapper.findComponent({ name: 'ProjectSelectionModal' }).exists()).toBe(true);
  });
});
