
import Vuex from 'vuex';
import auth from './modules/auth'
import FileSelected from './modules/FileSelected';
import TerminalStore from './modules/TerminalStore';
import ProjectStore from './modules/ProjectStore';
import FileStore from './modules/FileStore';
import ShowFiles from './modules/ShowFiles';

export default new Vuex.Store({
  modules: {
    auth,
    FileSelected,
    TerminalStore,
    ProjectStore,
    FileStore,
    ShowFiles
  }
})

