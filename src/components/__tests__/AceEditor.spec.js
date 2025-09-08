
import { mount } from '@vue/test-utils'
import flushPromises from 'flush-promises'
import debounce from 'lodash.debounce'

jest.mock('lodash.debounce', () => jest.fn((fn) => fn))

describe('AceEditor.vue', () => {
  let filelist
  let currentFile
  let getFileContentsMock
  let saveContentMock
  let AceEditorFresh

  beforeEach(async () => {
    filelist = [
      { id: 1, fileName: 'file1.js' },
      { id: 2, fileName: 'file2.js' }
    ]
    currentFile = { id: 1, fileName: 'file1.js' }


    getFileContentsMock = jest.fn(() =>
      Promise.resolve({ line1: 'console.log("hi")' })
    )
    saveContentMock = jest.fn(() => Promise.resolve())

 
    jest.doMock('vuex', () => ({
      useStore: () => ({
        dispatch: jest.fn((action, payload) => {
          if (action === 'FileStore/getFileContents') return getFileContentsMock(payload)
          if (action === 'FileStore/saveContent') return saveContentMock(payload)
        }),
      }),
    }))


    const module = await import('@/components/AceEditor.vue')
    AceEditorFresh = module.default
  })

  it('renders file tabs correctly', () => {
    const wrapper = mount(AceEditorFresh, { props: { filelist, currentFile } })
    const files = wrapper.findAll('.file span')
    expect(files.length).toBe(2)
    expect(files[0].text()).toBe('file1.js')
    expect(files[1].text()).toBe('file2.js')
  })

  it('emits update:currentFile when a file is clicked', async () => {
    const wrapper = mount(AceEditorFresh, { props: { filelist, currentFile } })
    await wrapper.findAll('.file span')[1].trigger('click')
    expect(wrapper.emitted('update:currentFile')).toBeTruthy()
    expect(wrapper.emitted('update:currentFile')[0]).toEqual([filelist[1]])
  })

  it('emits closeFile when cross icon is clicked', async () => {
    const wrapper = mount(AceEditorFresh, { props: { filelist, currentFile } })
    await wrapper.findAll('.file img')[0].trigger('click')
    expect(wrapper.emitted('closeFile')).toBeTruthy()
    expect(wrapper.emitted('closeFile')[0]).toEqual([1])
  })

  it('updates filelist order on drag and drop', async () => {
    const wrapper = mount(AceEditorFresh, { props: { filelist, currentFile } })
    const files = wrapper.findAll('.file')
    await files[0].trigger('dragstart')
    await files[1].trigger('drop')
    expect(wrapper.emitted('update:filelist')).toBeTruthy()
    expect(wrapper.emitted('update:filelist')[0][0]).toEqual([
      { id: 2, fileName: 'file2.js' },
      { id: 1, fileName: 'file1.js' }
    ])
  })

  it('loads code from store on currentFile change', async () => {
  const wrapper = mount(AceEditorFresh, { props: { filelist, currentFile: null } })


  await wrapper.setProps({ currentFile: { id: 1, fileName: 'file1.js' } })
  

  await flushPromises()

  expect(wrapper.vm.code).toBe('console.log("hi")')
  expect(wrapper.vm.oldCode).toBe('console.log("hi")')
  expect(getFileContentsMock).toHaveBeenCalledWith(1)
})


  it('calls autoSave when code changes', async () => {
    const wrapper = mount(AceEditorFresh, { props: { filelist, currentFile } })

   
    await flushPromises()

    wrapper.vm.codeChange('console.log("changed")')
    await flushPromises()

    expect(saveContentMock).toHaveBeenCalled()
    expect(saveContentMock.mock.calls[0][0]).toEqual({
      id: 1,
      content: { 1: 'console.log("changed")' }
    })
  })
})
