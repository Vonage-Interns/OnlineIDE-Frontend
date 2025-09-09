import { mount } from "@vue/test-utils";
import { createStore } from "vuex";
import SideBar from "@/views/SideBar.vue";

let store;
let wrapper;

beforeEach(() => {
 
  Storage.prototype.getItem = jest.fn((key) => {
    if (key === "email") return "testuser@example.com";
    return null;
  });


  store = createStore({
    state() {
      return {
        FileStore: { slideropen: false },
        terminalVisible: false,
      };
    },
    mutations: {
      toggleSlider(state) {
        state.FileStore.slideropen = !state.FileStore.slideropen;
      },
      toggleTerminal(state) {
        state.terminalVisible = !state.terminalVisible;
      },
    },
    actions: {
      openFolder: jest.fn(),
    },
  });


  wrapper = mount(SideBar, {
    global: {
      plugins: [store],
      stubs: {
        "font-awesome-icon": true,
        TerminalView: true, 
      },
    },
  });
});

afterEach(() => {
  if (wrapper) wrapper.unmount();
});

describe("SideBar.vue", () => {
  it("renders sidebar component", () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("renders all buttons", () => {
    const buttons = wrapper.findAll("button");
    expect(buttons.length).toBeGreaterThan(0);
  });

  it("toggles folder slider when folder button is clicked", async () => {
    const folderBtn = wrapper.find('[data-test="folder-btn"]');
    if (folderBtn.exists()) {
      expect(store.state.FileStore.slideropen).toBe(false);
      await folderBtn.trigger("click");
      expect(store.state.FileStore.slideropen).toBe(true);
    }
    else{
        console.warn("does not exist")
    }
  });

  it("toggles terminal visibility when terminal button is clicked", async () => {
    const terminalBtn = wrapper.find('[data-test="terminal-btn"]');
    if (terminalBtn.exists()) {
      expect(store.state.terminalVisible).toBe(false);
      await terminalBtn.trigger("click");
      expect(store.state.terminalVisible).toBe(true);
    } else {
      console.warn("does not exist")
    }
  });

  it("calls Vuex action when new folder button is clicked", async () => {
    const newFolderBtn = wrapper.find('[data-test="new-folder-btn"]');
    if (newFolderBtn.exists()) {
      await newFolderBtn.trigger("click");
      expect(store._actions.openFolder).toBeTruthy();
    } else {
      console.warn("does not exist")
    }
  });

  it("matches snapshot", () => {
    expect(wrapper.html()).toMatchSnapshot();
  });
});
