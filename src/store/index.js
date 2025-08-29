
import Vuex from 'vuex';
import auth from './Auth'
import FileSelected from './FileSelected';
import TerminalStore from './TerminalStore';
import ProjectStore from './ProjectStore';
import FileStore from './FileStore';
import ShowFiles from './ShowFiles';

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

