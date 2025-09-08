import { mount } from "@vue/test-utils"
import TerminalView from "@/views/TerminalView.vue"


const mockDispatch = jest.fn()
const mockCommit = jest.fn()

const makeWrapper = (overrides = {}) => {
  return mount(TerminalView, {
    global: {
      mocks: {
        $store: {
          state: {
            TerminalStore: { terminalVisible: true },
            ProjectStore: { projectName: "MyProject" },
          },
          getters: {
            "TerminalStore/getTerminalInput": ["echo hello"],
            "TerminalStore/getTerminalOutput": ["world"],
          },
          dispatch: mockDispatch,
          commit: mockCommit,
        },
      },
    },
    ...overrides,
  })
}

describe("TerminalView.vue", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders terminal when visible", () => {
    const wrapper = makeWrapper()
    expect(wrapper.find(".terminal-area").exists()).toBe(true)
  })

  it("hides terminal when hide button is clicked", async () => {
    const wrapper = makeWrapper()
    await wrapper.find("h4").trigger("click")
    expect(mockCommit).toHaveBeenCalledWith("TerminalStore/handleTerminalVisibleFalse")
  })

  it("adds input and clears field on enter (val=true)", async () => {
    mockDispatch.mockResolvedValueOnce(true)

    const wrapper = makeWrapper()
    const input = wrapper.find(".input-terminal")

    await input.setValue("ls -la")
    await input.trigger("keydown.enter")

    expect(mockDispatch).toHaveBeenCalledWith("TerminalStore/addtoTerminalInput", "ls -la")
    expect(mockDispatch).toHaveBeenCalledWith("TerminalStore/sendInputToBackend", "ls -la")
    expect(wrapper.vm.contentEntered).toBe("")
  })

  it("adds input but does not send to backend if val=false", async () => {
    mockDispatch.mockResolvedValueOnce(false)

    const wrapper = makeWrapper()
    const input = wrapper.find(".input-terminal")

    await input.setValue("invalid")
    await input.trigger("keydown.enter")

    expect(mockDispatch).toHaveBeenCalledWith("TerminalStore/addtoTerminalInput", "invalid")
    expect(mockDispatch).not.toHaveBeenCalledWith("TerminalStore/sendInputToBackend", "invalid")
    expect(wrapper.vm.contentEntered).toBe("")
  })

  it("renders history inputs and outputs", () => {
    const wrapper = makeWrapper()
    expect(wrapper.text()).toContain("HideMyProject")
  })

  it("changes height when dragging", async () => {
    const wrapper = makeWrapper()
   
    wrapper.vm.startDraggable({ clientY: 200 })
    wrapper.vm.onDrag({ clientY: 150 })

    expect(wrapper.vm.startHeight).toBeGreaterThan(200)
    wrapper.vm.stopDrag()


    expect(wrapper.vm.startY).toBe(200)
  })
})
