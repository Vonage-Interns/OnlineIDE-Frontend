<template>
        <div id="belowheader">
            <!-- This is side pannel contents -->
                <div id="sidepannel">
                    <button id="folderstructure" v-on:click="handleFolder" v-bind:style="{ backgroundColor: folder ? 'aqua' : '#3d3b3b' }"><img v-bind:src="require('@/assets/folderchat.png')" class="folderbutton" style="height:40px"></button>
                    <button id="search" v-on:click="handleSearch" v-bind:style="{ backgroundColor: search ? 'aqua' : '#3d3b3b' }"><img v-bind:src="require('@/assets/searchchat.png')" style="height:30px;width:30px" ></button>
                    <button id="settings" v-on:click="handleSettings" v-bind:style="{ backgroundColor: settings ? 'aqua' : '#3d3b3b' }"><img v-bind:src="require('@/assets/settings.png')" ></button>
                    <button id="logout" v-on:click="handleLogout" style="margin-top:420px" v-bind:style="{ backgroundColor: logoutButton ? 'aqua' : '#3d3b3b'}"><img v-bind:src="require('@/assets/logout.png')" ></button>

                </div>
            <!-- This is the side pannel ending -->
            <div v-if="folder" id="folderpanel" style="display:grid;background-color:#212126">
                <div style="width:200px;cursor: pointer;" v-bind:style="{width:widthPreviousDiv+'px'}">
                    <h4 style="text-align: center;color:white;background-color:#212126;height:40px;padding:10px">{{en.Projects}}</h4>
                    <div v-on:click="handleInfo" style="background-color:#2c3038;text-align: left;color:white;font-weight:bold">{{ en.info }}</div>               
                        <div v-if="info==true" style="color:white;">
                            <div style="margin-left:10px;display:flex;margin-top:10px">
                              <img src="https://avatars.githubusercontent.com/u/3462323" alt="" style="height:20px;border-radius:10px;"><h5 style="margin-left:5px;color:#cccccc">{{en.bibi}}</h5>
                            </div>
                        <div style="margin-top:10px">
                            <h4 style="text-align: left;margin-left:10px">{{en.editor}}</h4>
                            <h5 style="text-align:left;margin-left:11px;color:#9e9e9e;margin-bottom: 20px;">{{en.starter_project}}</h5>
                        </div>
                        </div>
                    <div>
                        <div style="display:flex;background-color:#2c3038" v-on:mouseover="showFileAndFolder" v-on:mouseleave="hideFileAndFolder">
                            <div class="showarrow" @click="handleShowProjects">
                                <font-awesome-icon :icon="['fas', 'chevron-right']" class="rightarrow" v-if="!$store.state.ShowFiles.clicked"/>
                                <font-awesome-icon :icon="['fas', 'chevron-down']" class="downarrow" v-if="$store.state.ShowFiles.clicked"/>
                                <div style="display:flex;gap:1px;color:white;font-size:20px;font-weight:bold" class="main">{{ $store.state.ProjectStore.projectName?$store.state.ProjectStore.projectName.slice(0,3):"Files"}} <div class="project"><img src="@/assets/delete.png" class="delete" @click="deleteProject($store.state.ProjectStore.projectName)"/><img src="@/assets/edit.png" class="edit" @click="handleProjectRenameToggle()"/><font-awesome-icon icon="file" v-on:click="addFile" style="width:15px;height:15px;margin:8px"/><font-awesome-icon :icon="['fas', 'folder']" style="width:15px;height:15px;margin:8px" v-on:click="addFolder"/></div></div>        
                                <input style="border:2px solid black;transform:translateX(-25px);" v-if="renameFolder" v-model="newName" v-on:keyup.enter="renameProject($store.state.ProjectStore.projectName,newName)" placeholder="" >                    
                            </div>                        
                                <button v-if="fileShow" style="background:none;color:white;border:none;margin-top:15px" v-bind:style="{marginLeft:(widthFromSlider>0?widthFromSlider:-(widthFromSlider))+'px'}"></button>
                                <button v-if="folderShow" style="margin-left:5px;background:none;color:white;border:none;margin-top:15px"></button>  
                        </div>
                            <div>
                                <input style="border:2px solid black;transform:translateX(-25px);" v-if="this.addingFolder" v-on:keyup.enter="pushToFolder" placeholder="" v-model="newFolder">
                            </div>
                            <div>
                                <input style="border:2px solid black;transform:translateX(-25px);" v-if="this.addingFile" v-on:keyup.enter="pushToFiles(0)" placeholder="" v-model="newFile">
                            </div>
                        <!-- when click show files in project -->
                        <div class="show-files" v-if="$store.state.ShowFiles.clicked">
                            <ul class="project-files">
                            <div class="file-with-icon" v-for="(file,index) in $store.state.ShowFiles.projectFiles" :key=index  style="background-color:#212126;width:100%;color:white;text-align:left;list-style:none;font-size:20px" v-bind:style="{backgroundColor:indexOfClickedFileHoverDown === index? 'grey': indexOfClickedFileDown === index? '#147DF5': '#212126',}" v-on:mouseover="handleParticularFileHoverDown(file,index)" v-on:mouseleave="handleParticularFileMouseLeaveDown">
                             <li  v-on:click="()=>{openFile(file,0),handleParticularFileDown(file,index)}">{{file}}</li>
                             <div class="root-files">
                             <img src="@/assets/delete.png" class="delete" @click="deleteFile(file,0)"/>
                             <img src="@/assets/edit.png" class="edit" @click="editFile(file)"/>
                             </div>
                            </div>
                            </ul>
                        </div>
                        <div v-if="$store.state.ShowFiles.clicked" style="display:grid">
                                <div v-for="(Folder,index) in fetchFolders()" v-bind:key="index" style="margin-left:20px;display:flex;flex-wrap:wrap;background-color:#212126;color:white;" class="folder-name-div">
                                    <div style="display:flex;padding:2px;font-size:20px" @click="toggleFolderClick(Folder,0)" class="parentfolder">
                                        <font-awesome-icon :icon="['fas', 'chevron-right']" class="rightarrow" v-if="!folderClickStates[Folder.name]"/>
                                        <font-awesome-icon :icon="['fas', 'chevron-down']" class="downarrow" v-if="folderClickStates[Folder.name]"/>
                                        {{ Folder.name }}
                                        <div class="folder-icons">
                                        <img src="@/assets/delete.png" class="delete" @click="deleteFolder(Folder.name)"/>
                                        <img src="@/assets/edit.png" class="edit" @click="updateFolderName(Folder.name)"/>
                                        </div>
                                        <input style="border:2px solid black;" v-if="FolderRenameInput" v-on:keyup.enter="folderRenameProcess(Folder)" placeholder="" v-model="newFolderName">
                                        <button class="file-button-inside-folder" v-on:click="inputInsideFolder(Folder.name)" style="background:none;color:white;border:none" v-bind:style="{ marginLeft: '5px' }"><font-awesome-icon icon="file" /></button><button class="folder-button-inside-folder" v-on:click="toggleFolderInsideFolder(Folder)" style="background-color:#212126;color:white;border:none"><font-awesome-icon :icon="['fas', 'folder']" /></button>
                                    </div>
                                    <button v-show="folderClickStates[Folder.name]" v-for="(file,index) in filesPertainingToFolder(Folder.name)"  :key="index" style="background-color:#212126;width:100%;color:white;text-align: left;margin-left:20px;border:none;font-size:20px;padding:3px;" v-on:click="()=>{openFile(file,1),handleParticularFileUp(file,index)}" v-bind:style="{backgroundColor:indexOfClickedFileHoverUp === index? 'grey': indexOfClickedFileUp === index? '#147DF5': '#212126',}" v-on:mouseover="handleParticularFileHoverUp(file,index)" v-on:mouseleave="handleParticularFileMouseLeaveUp" class="fol-files"><span>{{ file }}</span><div class="fol-files-img"><img src="@/assets/delete.png" style="width:20px;height:20px;object-fit:cover" @click="deleteFileInsideFolder(file,Folder,1)"/><img src="@/assets/edit.png" class="edit" @click="editFileInFolder(file,Folder.name)"/></div></button>

                                    <div v-show="folderClickStates[Folder.name]" v-for="(folder,index) in fetchFolderInsideFolders(Folder)"  :key="index" style="background-color:#212126;width:100%;color:white;text-align:left;margin-left:20px;border:none;font-size:20px;padding:3px"  @click="fetchFilesInsideFolderinFolder(Folder.id,folder)" class="nested-folder"> 
                                    <font-awesome-icon :icon="['fas', 'chevron-right']" class="rightarrow" v-if="!folderClickStates[folder]"/>
                                    <font-awesome-icon :icon="['fas', 'chevron-down']" class="downarrow" v-if="folderClickStates[folder]"/>
                                    <span @click="toggleFolderClick(folder,1)"> {{ folder }}</span><img src="@/assets/delete.png" style="margin:0px" class="delete-nested-folder" @click.stop="deleteFolderinFolder(Folder.id,folder)" /><img src="@/assets/edit.png" class="edit-nested-folder" @click.stop="updateFolderinFolder(Folder.id,folder)" /><button class="file-button-inside-folder" style="background:none;color:white;border:none;margin-left:5px"   @click.stop="inputInsideFolderInFolder(Folder.id,folder)"><font-awesome-icon icon="file" /></button>
                                    <li v-show="folderClickStates[folder]" v-for="file in $store.getters['FileSelected/fetchNestFiles']($store.getters['FileSelected/getFolderIdInFolder'](folder, Folder.id))" :key="file.id" @click=openNestedFile(Folder.id,folder,file) style="list-style-type:none">{{ file }}</li>
                                    </div>
                                    <button v-show="folderClickStates[Folder.name] && $store.state.FileSelected.hideLoadMore[Folder.name]!=true" @click="fetchRemaining(Folder)" style="background-color:blue;width:70%;color:white;text-align: center;margin-left:20px;font-size:20px;padding:3px">{{en.load_more}}</button>
                                </div>
                                <input style="border:2px solid black;" v-if="inputInsideFolderToggle" v-on:keyup.enter="addFileToFolder(1)" placeholder="" v-model="fileInsideFolderName">
                                <input style="border:2px solid black;" v-if="folderInsideFolder" v-on:keyup.enter="addFolderToFolder()" placeholder="" v-model="folderInsideFolderName">
                                <input style="border:2px solid black;" v-if="inputInsideFolderInFolderToggle" v-on:keyup.enter="addFolderInFolderFile()" placeholder="" v-model="folderInsideFolderFileName">
                        </div>
                    </div>
                </div>
            </div>
            <div v-else-if="search" id="searchpanel" style="display:grid;background-color:#212126;overflow:hidden">
                <div style="width:200px;" v-bind:style="{width:widthPreviousDiv+'px'}">
                        <h4 style="text-align: left;color:#cccccc;height:30px;font-family:sans-serif;margin-left:10px;margin-top:10px;">{{en.search}}</h4>
                        <input placeholder="Seach" style="border:black 2px; background-color:#35373d;color:#9d9d9e;transform:translateX(-20px);height:23px">
                </div>
            </div>

<div v-else-if="settings" id="settingspanel" style="background-color:#212126;overflow:hidden">
                    <div style="width:200px;" v-bind:style="{width:widthPreviousDiv+'px'}">
                        <h4 style="text-align:left;color:#cccccc;height:30px;margin-left:10px;margin-top:10px">{{en.settings}}</h4>
                    </div>
                    <div style="color:#cccccc"><h4 style="transform:translateX(-40px);">{{en.dev_server}}</h4></div>
                    <div>
                        <h5 style="margin-right:60px;margin-top:15px;color:#cccccc">{{en.reload_server}}</h5>
                        <select style="background-color:#36373c;color:#cccccc;width:160px;margin-right:20px">
                            <option>{{en.hot_reload}}</option>
                            <option>{{en.page_reload}}</option>
                        </select>
                    </div>
                    <div>
                        <h5 style="margin-right:60px;margin-top:15px;color:#cccccc">{{en.reload_trigger}}</h5>
                        <select style="background-color:#36373c;color:#cccccc;width:160px;margin-right:20px">
                            <option>{{en.edit}}</option>
                            <option>{{en.save}}</option>
                            <option>{{en.keystroke}}</option>
                        </select>
                    </div>
                    <div>
                        <h5 style="margin-right:25px;margin-top:15px;color:#cccccc">{{en.clearConsole}}</h5>
                        <select style="background-color:#36373c;color:#cccccc;width:160px;margin-right:20px">
                            <option>{{en.enabled}}</option>
                            <option>{{en.disabled}}</option>
                        </select>
                    </div>
                </div>
            <div v-show="activePanel!=null" v-on:mousedown="startDragging($event,activePanel)" id="sliderdiv">

            </div>
        <div class="editor">
         <AceEditor v-model:currentFile="currentFile" v-model:filelist="openFiles" @closeFile="closeFile"  @update:filelist="(newList) => openFiles = newList"  v-if="openFiles.length!==0"/>
        <welcome-page v-else></welcome-page>
          <div style="position: fixed; bottom: 0; width: 100%; z-index: 100;background-color:black">
                    <terminal-view></terminal-view>
           </div>
        </div>
    </div>
</template>


<script>


import WelcomePage from '@/components/WelcomePage.vue';
import AceEditor from '../components/AceEditor.vue'
import TerminalView from './TerminalView.vue'
import en from '@/locales/en';



export default({
    components:{
     AceEditor,
     TerminalView,
     WelcomePage,
    },
    provide(){
      return {
       activePanel:()=>this.activePanel
      }
    },
    data(){
        return{
            en,
            folder:false,
            search:false,
            settings:false,
            startX:0,
            startWidth:0,
            activePanel:null,
            info:false,
            addingFile:false,
            newFile:"",
            file:false,
            availableFiles:[],
            widthPreviousDiv:200,
            addingFolder:false,
            newFolder:"",
            inputInsideFolderToggle:false,
            fileInsideFolderName:"",
            folderName:"",
            filesInsideFolder:[],
            currentFile:null,
            openFiles:[],
            indexOfClickedFile:null,
            indexOfClickedFileHover:null,
            widthFromSlider:100,
            fileShow:false,
            folderShow:false,
            indexOfClickedFileHoverDown:null,
            indexOfClickedFileDown:null,
            folderClickStates: {},
            showFilesInsideFolder:false,
            indexOfClickedFileHoverUp:null,
            indexOfClickedFileUp:null,
            idTrack:[],
            logoutButton:false,
            renameFolder:false,
            newName:"",
            FolderRenameInput:false,
            newFolderName:"",
            folderInsideFolder:false,
            folderInsideFolderName:"",
            parentFolderId:0,
            inputInsideFolderInFolderToggle:false,
            folderInsideFolderFileName:"",
            folderInName:"",
            arr:[]
        }
    },
    methods:{
        addFolderToFolder(){
            this.$store.dispatch('ProjectStore/folderInsideFolder',{id:this.parentFolderId,name:this.folderInsideFolderName});
            this.folderInsideFolder=false;
            this.parentFolderId=0;
        },
        toggleFolderInsideFolder(Folder){
            console.log("the folder Finder ",Folder);
            this.parentFolderId=Folder.id;
            if(this.folderInsideFolder==true){
                this.folderInsideFolder=false;
                return;
            }
            this.folderInsideFolder=true;
        },
        handleLogout(){
            localStorage.clear()
            this.$router.push('/login');
        },
        handleParticularFileHoverUp(fileName,index){
            this.indexOfClickedFileHoverUp=index;
            console.log(fileName);
        },
        handleParticularFileMouseLeaveUp(){
            this.indexOfClickedFileHoverUp=null;
        },
        handleParticularFileHoverDown(fileName,index){
            console.log(fileName);
            this.indexOfClickedFileHoverDown=index;
        },
        handleParticularFileMouseLeaveDown(){
            this.indexOfClickedFileHoverDown=null;
        },
        handleParticularFileUp(fileName,index){
            console.log(fileName,index);
            if(this.indexOfClickedFileUp===index){
                this.indexOfClickedFileUp="";
                this.indexOfClickedFile=""
                this.indexOfClickedFileDown=""
                return;
            }
            this.indexOfClickedFileDown=""
            this.indexOfClickedFile="";
            this.indexOfClickedFileUp=index;
        },
        handleParticularFileDown(fileName,index){
            console.log(fileName,index);
            if(this.indexOfClickedFileDown===index){
                this.indexOfClickedFileDown="";
                this.indexOfClickedFileUp="";
                this.indexOfClickedFile=""
                return;
            }
            this.indexOfClickedFile="";
            this.indexOfClickedFileUp="";
            this.indexOfClickedFileDown=index;
        },
        handleParticularFile(fileName,index){
            console.log(fileName,index);
            if(this.indexOfClickedFile===index){
                this.indexOfClickedFile="";
                this.indexOfClickedFileDown="";
                return;
            }
            this.indexOfClickedFileDown="";
            this.indexOfClickedFile=index;
        },
        handleParticularFileHover(fileName,index){
            console.log(fileName);
            this.indexOfClickedFileHover=index;
        },
        handleParticularFileMouseLeave(){
            this.indexOfClickedFileHover=null;
        },
        hideFileAndFolder(){
            this.fileShow=false;
            this.folderShow=false;
        },
        handleShowProjects(){
         this.c=!this.c
         this.file=false
         this.$store.dispatch('ShowFiles/userClicked')
        },
        showFileAndFolder(){
            this.fileShow=true;
            this.folderShow=true;
        },
        filesPertainingToFolder(name){
            return this.$store.getters['FileSelected/fetchFolderFiles'](name);
        },
        fetchFolderInsideFolders(Folder){
            return this.$store.getters['FileSelected/fetchFolderInsideFolders'](Folder);
        },
        fetchFolders(){
            return this.$store.getters['FileSelected/folderAvailable']
        },
        inputInsideFolder(name){
            this.inputInsideFolderToggle=true;
            this.folderName=name;
        },
        inputInsideFolderInFolder(folderid,folder){
            this.parentFolderId=folderid
            this.inputInsideFolderInFolderToggle=true;
            this.folderInName=folder;
        },
        async addFileToFolder(folder){
            const newfile=this.fileInsideFolderName.trim()
            const ext=this.fileInsideFolderName.includes(".js")
            if(newfile=="" || ext==false || newfile==".js")
            {
            alert("enter valid file name");
            return;
            }
            const duplicate=this.$store.getters['FileSelected/checkduplicatefilefolder'](this.fileInsideFolderName,this.folderName)
            if(duplicate==false){
            let arr=[this.fileInsideFolderName,this.folderName]
            await this.$store.dispatch('FileSelected/addFileToFolder',arr);
            await this.$store.dispatch('FileStore/saveContent',{fileName:this.newFile,content:''})
            this.openFile(this.fileInsideFolderName,folder)
            this.inputInsideFolderToggle=false;
            }
            else
            alert("File name already exist!")
            this.fileInsideFolderName="";
        },
        async addFolderInFolderFile(){
            console.log(this.folderInsideFolderFileName)
            const newfile=this.folderInsideFolderFileName.trim()
            const ext=this.folderInsideFolderFileName.includes(".js")
            if(newfile=="" || ext==false || newfile==".js")
            {
            alert("enter valid file in folder name");
            return;
            }
            const nestedfolderId =this.$store.getters['FileSelected/getFolderIdInFolder'](this.folderInName,this.parentFolderId)
            const duplicate=this.$store.getters['FileSelected/checkduplicatefilefolderinfolder'](nestedfolderId,this.folderInsideFolderFileName)
            if(duplicate==false){
            let arr=[this.parentFolderId,this.folderInName,this.folderInsideFolderFileName]
            this.inputInsideFolderInFolderToggle=false;
            await this.$store.dispatch('FileSelected/addFileToFolderInFolder',arr);
            this.openNestedFile(this.parentFolderId,this.folderInName,this.folderInsideFolderFileName)
            // this.openFile(this.parentFolderId,this.folderInsideFolderFileName,this.folderInName)
            }
            else
            alert("File name already exist!")
            this.folderInsideFolderFileName="";
        },
        pushToFolder(){
            this.newFolder=this.newFolder.trim()
            if(this.newFolder=="")
            {
            alert("enter valid folder name")
            return;
            }
            const duplicate=this.$store.getters['FileSelected/checkduplicate'](this.newFolder)
            if(duplicate==false)
            {
            console.log("pushing folders");
            this.$store.dispatch('FileSelected/addToFolder',this.newFolder);
            this.folder=true
            }
            else
            alert("folder already exist!!")
            this.newFolder="";
            this.addingFolder=false;
        }, 
        addFolder(){
            this.addingFolder=!this.addingFolder;
        },
        async pushToFiles(folder){
            const newfile=this.newFile.trim()
            const ext=this.newFile.includes(".js")
            if(newfile==""||ext==false || newfile === ".js")
            {
            alert("enter valid file name");
            return;
            }
            const duplicate=this.$store.getters['ShowFiles/checkduplicate'](this.newFile)
            if(duplicate==false)
            {
            await this.$store.dispatch('FileSelected/addFile',this.newFile);
            await this.$store.dispatch('FileStore/saveContent',{fileName:this.newFile,content:''})
            this.openFile(this.newFile,folder)
            this.file=true;
            }
            else
            alert("file name already exist!!")
            this.addingFile=false;
            this.newFile="";
        },
        addFile(){
            this.addingFile=!this.addingFile;
        },
        handleInfo(){
            if(this.info==true){
                this.info=false;
                return;
            }
            this.info=true;
        },
        handleFolder(){
            this.$store.commit('TerminalStore/handleTerminalVisibleTrue');
            if(this.folder==true){
                this.folder=false;
                this.activePanel=null
                return;
            }
            console.log("folder button clicked");
            this.folder=true;
            this.activePanel=0
            this.search=false;
            this.settings=false;
        },
        handleSearch(){
            this.$store.commit('TerminalStore/handleTerminalVisibleTrue');
            if(this.search==true){
                this.search=false;
                this.activePanel=null
                return;
            }
            console.log("Search button clicked");
            this.search=true;
            this.activePanel=1
            this.settings=false;
            this.folder=false;
        },
        handleSettings(){
            this.$store.commit('TerminalStore/handleTerminalVisibleTrue');
            if(this.settings==true){
                this.settings=false;
                this.activePanel=null
                return;
            }
            console.log("Settings button is clicked");
            this.settings=true;
            this.activePanel=2;
            this.search=false;
            this.folder=false;
        },
        checkPanel(x){
            if(x==0){
                return 'folderpanel';
            }
            else if(x==1){
                return 'searchpanel'
            }
            else if(x==2){
                return 'settingspanel';
            }
        },
        startDragging(e){
            this.startX=e.clientX;
            console.log("clicked div",this.startX);
            this.startWidth=this.widthPreviousDiv;
            window.addEventListener('mousemove',this.onDragging);
            window.addEventListener('mouseup',this.stopDragging);
        },
        onDragging(e){
            console.log("dragdiv")
            const delta=e.clientX-this.startX;
            this.widthPreviousDiv=this.startWidth+delta;
            console.log(this.widthPreviousDiv)
            this.widthFromSlider=e.clientX-185;
        },
        stopDragging(){
            console.log("stopdragger")
            window.removeEventListener('mousemove',this.onDragging);
            window.removeEventListener('mouseup',this.stopDragging);
        },
       async openFile(file,folder) {
            const id=this.$store.getters['FileSelected/checkIfFileExist'](file,folder);
            if (!this.idTrack.includes(id)) {
            this.idTrack.push(id)
            this.openFiles.push({id:id,fileName:file});
            }
            const content = await this.$store.dispatch('FileStore/getFileContents', id);
            this.currentFile = { id:id, fileName: file ,content:content};
            //  this.currentFile = { id:id, fileName: file };
        },
        async openNestedFile(pfid,folder,file) {
            const nestedfolderId =this.$store.getters['FileSelected/getFolderIdInFolder'](folder,pfid)
            const id=this.$store.getters['FileSelected/checkIfNestedFileExist'](file,nestedfolderId);
            await this.$store.dispatch('FileStore/saveContent',{id:id,content:''})
            if (!this.idTrack.includes(id)) {
            this.idTrack.push(id)
            this.openFiles.push({id:id,fileName:file});
            }
             const content = await this.$store.dispatch('FileStore/getFileContents', id)
             this.currentFile = { id:id, fileName: file ,content:content};
            // this.currentFile = { id:id, fileName: file };
        },
      closeFile(id) {
        const index = this.openFiles.findIndex(f => f.id === id);
        if (index !== -1) {
          this.openFiles.splice(index, 1);

          const idTrackIndex = this.idTrack.indexOf(id);
          if (idTrackIndex !== -1) {
          this.idTrack.splice(idTrackIndex, 1);
          }
          if (this.currentFile?.id === id) {
           this.currentFile = this.openFiles[index] || this.openFiles[index - 1] || null;
          }
        }
       },
        toggleFolderClick(folder,nested_folder) {
          if(nested_folder==0)
          {
          const key = folder.name
          this.folderClickStates[key]=!this.folderClickStates[key]     
          if(this.$store.state.FileSelected.initialCall[folder.name]!==true)
          {
            this.$store.dispatch('FileSelected/FetchExistedFilesInFolder',folder.name);
          }   
          return;
          }
          this.folderClickStates[folder]=!this.folderClickStates[folder]   
        },
        fetchRemaining(folder){
          this.$store.dispatch('FileSelected/FetchExistedFilesInFolder', folder.name);
        },
        deleteFile(file,location){
            const userClickedOk = confirm("Are you sure you want to delete?");
            console.log("the file and location is ",file, location);
            if(userClickedOk){
                this.$store.dispatch('ShowFiles/deleteFile',{fileName:file,location:location});
            }
        },
        deleteFolder(folder)
        {
        const userClickedOk = confirm("Are you sure you want to delete?");
        if(userClickedOk)
        {
            this.$store.dispatch('FileSelected/deleteFolder', folder);
        }
        },
        deleteProject(project){
          const userClickedOk = confirm("Are you sure you want to delete?");
        if(userClickedOk)
        {
            this.$store.dispatch('ProjectStore/deleteProject',project)
        }  
        },
        deleteFileInsideFolder(file,Folder,location){
            console.log("this is the content file inside folkder delete",file,Folder.id,location);
            const userClickedOk = confirm("Are you sure you want to delete?");
            if(userClickedOk){
                this.$store.dispatch('FileSelected/deleteFileInsideFolder',{fileName:file,folderId:Folder.id,location:location});
            }
        },
        editFile(file){
           let userInput = prompt("Enter new file name:");
           if(!userInput)return;
           if(userInput.trim()!="")
           {
            this.$store.dispatch('FileSelected/editFile',{oldFile:file,newFile:userInput});
           }   
        },
        editFileInFolder(file,folder){
             let userInput = prompt("Enter new file name:");
             if(!userInput)return;
           if(userInput.trim()!="")
           {
            this.$store.dispatch('FileSelected/editFileInFolder',{oldFile:file,newFile:userInput,folder:folder});
           }   
        },
        handleProjectRenameToggle(){
            if(this.renameFolder==true){
                this.renameFolder=false;
                return;
            }
            this.renameFolder=true;
        },
        renameProject(projectName){
            this.renameFolder=false;
            console.log("the project name that has t be renamd is ",projectName);
            this.$store.dispatch('ProjectStore/updateProjectName',{projectName:projectName,newName:this.newName})
        },
        updateFolderName(){
            if(this.FolderRenameInput==true){
                this.FolderRenameInput=false;
                return;
            }
            this.FolderRenameInput=true;
        },
        folderRenameProcess(Folder){
            this.FolderRenameInput=false;
            console.log("this is the coming input ",Folder,"and the ",this.newFolderName);
            this.$store.dispatch('FileSelected/FolderRename',{folder:Folder,FolderNew:this.newFolderName});    
        },
        deleteFolderinFolder(parentFolderId,folder){
        const userClickedOk = confirm("Are you sure you want to delete?");
        if(userClickedOk)
        {
            this.$store.dispatch('FileSelected/deleteFolderInFolder',{parentFolderId:parentFolderId,folder:folder});
        }
        console.log("f in f succesful")
        },
        updateFolderinFolder(parentFolderId,folder){
            let userInput = prompt("Enter new folder in folder name:");
            if(!userInput)return;
           if(userInput.trim()!="")
           {
            this.$store.dispatch('FileSelected/updateFolderinFolder',{oldFolder:folder,newFolder:userInput,parentFolderId:parentFolderId});
           } 
        },
         async fetchFilesInsideFolderinFolder(id,folder){
           const nestedfolderId =this.$store.getters['FileSelected/getFolderIdInFolder'](folder,id)
           await this.$store.dispatch('FileSelected/fetchExistedNestedFiles',{folderId:nestedfolderId,id:id})
            this.arr=this.$store.getters['FileSelected/fetchNestFiles'](nestedfolderId)
            console.log("coming",this.arr)
        }
}
});

</script>

<style scoped>

#belowheader{
    display:flex;
    position:fixed;
    top:50px;
    background-color: #3d3b3b;
}
#sidepannel{
    display: grid;
    margin-top:20px;
    width:80px;
    height:40px;
    align-items: center;
    justify-content: center;
    

}
#sidepannel button{
/* background-color: #3d3b3b; */
border:none;
padding:30px;

}


#sidepannel button img{
    width:24px;
    height:24px;
    object-fit: cover;
    border:none;
}
#sidepannel button:hover{
    background:white !important;
}
#sidepannel #logout:hover {
    background: red !important; /* Only for logout */
}

#sliderdiv{
  width: 5px;
  cursor: col-resize;
  background-color:grey;
  height: 100vh;
}
#sliderdiv:hover{
  width: 5px;
  background-color: skyblue;
  cursor: col-resize;
  height: 100vh;
}
.file-button-inside-folder{
    display:none;
}
.folder-button-inside-folder{
    display:none;
}
.folder-name-div:hover .file-button-inside-folder{
    display:inline;
}
.folder-name-div:hover .folder-button-inside-folder{
    display:inline;
}
.showarrow{
    margin-top:10px;
    display: flex;
    gap:5px
}
.rightarrow{
    color:white;
    width:8px;
    margin-top:5px
}
.downarrow{
    color:white;
    width:14px;
    height:20px;
    margin-top:3px
}
.project-files{
    display: flex;
    flex-direction: column;
    gap:5px;
    margin-left:-14px
}

.file-with-icon{
    display: flex;
    gap:25px
}
.delete{
    width:18px;
    height:18px;
    object-fit: cover;
    margin: 5px;
}
.edit{
   width:15px;
    height:15px;
    object-fit: cover;
    margin-left:0px;
    margin-top:5px;
}
 .project{
  display:flex;
  opacity:0
 }
 .main:hover .project{
    opacity: 1;
 }
 .root-files{
  display:flex;
  opacity:0
 }
 .project-files:hover .root-files{
    opacity: 1;
 }
 .folder-icons{
    display: flex;
    opacity: 0;
 }
 .parentfolder:hover  .folder-icons{
   opacity: 1;
 }
 .fol-files{
    display: flex;
 }
 .fol-files-img{
    display: flex;
    opacity: 0;
 }
 .fol-files:hover .fol-files-img{
    opacity: 1;
 }
 .delete-nested-folder{
    width:18px;
    height:18px;
    object-fit: cover;
    margin: 5px;
    opacity: 0;
}
.edit-nested-folder{
   width:15px;
    height:15px;
    object-fit: cover;
    margin-left:0px;
    margin-top:5px;
    opacity: 0;
}
 .nested-folder:hover .delete-nested-folder ,
 .nested-folder:hover .edit-nested-folder{
   opacity: 1;
 }
 
</style>