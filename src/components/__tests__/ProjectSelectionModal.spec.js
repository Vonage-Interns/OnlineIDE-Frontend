
import { mount, flushPromises } from '@vue/test-utils';
import ProjectSelectionModal from '@/views/ProjectSelectionModal.vue';

describe('ProjectSelectionModal.vue', () => {
  let wrapper;
  let mockStore;

  beforeEach(() => {
    mockStore = {
      getters: {
        'ProjectStore/checkProjectsAvailability': true,
        'ProjectStore/fetchProjects': ['Project1', 'Project2']
      },
      commit: jest.fn()
    };

    wrapper = mount(ProjectSelectionModal, {
      global: {
        mocks: {
          $store: mockStore
        },
        stubs: {
          'img': true 
        }
      }
    });
  });

  it('renders project list when available', () => {
    const projects = wrapper.findAll('.project h5');
    expect(projects.length).toBe(2);
    expect(projects[0].text()).toBe('Project1');
    expect(projects[1].text()).toBe('Project2');
  });

  it('calls store commit when a project is clicked', async () => {
    const firstProject = wrapper.findAll('.project h5')[0];
    await firstProject.trigger('click');
    expect(mockStore.commit).toHaveBeenCalledWith('FileSelected/clearAll');
    expect(mockStore.commit).toHaveBeenCalledWith('ProjectStore/assignSelectedproject', 'Project1');
  });

  it('calls store commit when modal is closed', async () => {
  await wrapper.find('.modal-wrapper').trigger('click.self');
  expect(mockStore.commit).toHaveBeenCalledWith('ProjectStore/displayProjects');
});


  it('sets hover index correctly', async () => {
    const firstProject = wrapper.findAll('.project h5')[0];
    await firstProject.trigger('mouseover');
    expect(wrapper.vm.projectIndex).toBe(0);
    await firstProject.trigger('mouseleave');
    expect(wrapper.vm.projectIndex).toBeNull();
  });
});
