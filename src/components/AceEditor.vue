
 <template>
  <div style="max-width: 100vw; overflow-x: auto;">
    <div class="editor-top">
      <div 
        v-for="(f,index) in filelist" 
        :key="index" 
        class="file" 
        draggable="true"
        @dragstart="onDragStart(index)"
        @dragover.prevent
        @drop="onDrop(index)"
        :style="{ 
          fontWeight: f.id === props.currentFile?.id ? 'bold' : 'normal', 
          color: f.id === props.currentFile?.id ? 'white' : 'lightgrey', 
          backgroundColor: f.id === props.currentFile?.id ? '#212121' : '#282922',
          margin: 0 
        }"
      >
        <span @click="emit('update:currentFile', f)">{{ f.fileName }}</span>
        <img src="@/assets/crossicon.png" @click.stop="emit('closeFile', f.id)" class="cross"/>
      </div>
    </div>

    <div>
      <VAceEditor        
        v-model:value="code"
        :lang="'javascript'"
        :theme="selectedtheme"
        class="editor"
        @update:value="codeChange"
        :options="{enableLiveAutocompletion: true,showPrintMargin: false,}"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits } from 'vue'
import { VAceEditor } from 'vue3-ace-editor'
import debounce from 'lodash.debounce'
import { useStore } from 'vuex'

import 'ace-builds/src-noconflict/mode-javascript'
import 'ace-builds/src-noconflict/theme-monokai'
import 'ace-builds/src-noconflict/theme-github'
import 'ace-builds/src-noconflict/theme-chrome'
import 'ace-builds/src-noconflict/ext-language_tools'

const code = ref(null)
const oldCode = ref(null) 
const selectedtheme = ref('monokai')

const props = defineProps({
  currentFile: Object,
  filelist: Array
})
const store = useStore()
const emit = defineEmits(['update:currentFile','closeFile','update:filelist'])

const dragIndex = ref(null)

function onDragStart(index) {
  dragIndex.value = index
}
function onDrop(dropIndex) {
  const updated = [...props.filelist]
  const [moved] = updated.splice(dragIndex.value, 1)
  updated.splice(dropIndex, 0, moved)
  emit('update:filelist', updated)
  dragIndex.value = null
}


// watch(() => props.currentFile, async (newFile) => {
//   if (newFile) {
//     let content = await store.dispatch('FileStore/getFileContents', newFile.id)

//     if (typeof content === "string") {
//       content = JSON.parse(content);
//     }
    
//     const wholeContent = Object.values(content).join("\n");
//     console.log("the whole content is", wholeContent);
//     code.value = wholeContent;
//     oldCode.value = wholeContent;
//   }
// });


watch(() => props.currentFile, async (newFile) => {
  if (newFile) {
    let content = await store.dispatch('FileStore/getFileContents', newFile.id)

    // Only parse if content is a non-empty string
    if (typeof content === "string") {
      try {
        content = content.trim() ? JSON.parse(content) : {};
      } catch (e) {
        content = {};
        console.error("Failed to parse file content as JSON:", e);
      }
    }

    const wholeContent = Object.values(content).join("\n");
  
    code.value = wholeContent;
    oldCode.value = wholeContent;
  }
});



function getChangedLines(oldStr, newStr) {
  const oldLines = (oldStr || "").split("\n")
  const newLines = (newStr || "").split("\n")
  const diff = {}
  const maxLen = Math.max(oldLines.length, newLines.length)
  for (let idx = 0; idx < maxLen; idx++) {
    const oldLine = oldLines[idx] ?? "" 
    const newLine = newLines[idx] ?? "" 
    if (oldLine !== newLine) {
      diff[idx + 1] = newLine
    }
  }
  return diff
}



const autoSave = debounce(async (file, newCode) => {
  if (!oldCode.value) oldCode.value = ""
  const changes = getChangedLines(oldCode.value, newCode)
  if (Object.keys(changes).length > 0) {
    await store.dispatch('FileStore/saveContent', {
      id: file.id,
      content: changes 
    })
    oldCode.value = newCode 
  }
}, 1000)

function codeChange(newCode) {
  if (props.currentFile?.id) {
    autoSave(props.currentFile, newCode)
  }
}
</script>

<style scoped>
.editor{
  height: 1000px; 
  width: 1440px;
  font-size:20px;
  margin: 0px;
  position: relative;
  overflow: auto;
  max-height: 100vh;
}
.editor-top{
  display: flex;
  height:50px;
  background-color: #282922;
  position:relative;
  overflow-x: auto;
}
.file{
  color: black;
  background-color: #282922;
  width:auto;
  margin: 5px;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap:8px;
}
.file img{
  object-fit: cover;
  width:20px;
  height:20px;
  color:white;
  cursor: pointer;
}
.theme{
  width:100px;
  height:30px;
  margin-top:10px
}
.file span{
  font-size:20px;
}
.cross{
  opacity:1;
}
.cross:hover{
  opacity: 0.6;
}
</style>
