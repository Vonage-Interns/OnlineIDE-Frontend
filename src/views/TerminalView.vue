<template >
    <div v-if="$store.state.TerminalStore.terminalVisible">
    <div class="sliderDiv" style="height:7px;background-color:blue;cursor:col-resize" v-on:mousedown="startDraggable" >
    </div>
    <div v-bind:style="`height:${startHeight}px;overflow:auto`">
        <!-- <div v-for="(inputs,index) in historyInputs" v-bind:key="index">
            <div class="terminal-area" style="display:flex">
                <h2 style="color:white">{{ $store.state.ProjectStore.projectName?$store.state.ProjectStore.projectName:"Files"}}:</h2>
                <input type="text" v-bind:placeholder="`${inputs}`" style="width:100%;height:20px;padding-top:5px;background-color:black;color:white;border:none">
            </div>
        </div>
        <div class="output-display">
            <div v-for="(output,index) in $store.getters['TerminalStore/getTerminalOutput']" v-bind:key="index" style="color:white;border:2px solid white">
                {{ output }}
            </div>
        </div> -->
        <div style="display:flex">
            <!-- <h3 style="margin-left:600px;color:white">Terminal Area</h3> -->
            <!-- <img src="@/assets/crossicon.png" style="height:25px;width:25px;margin-left:680px" @click="$store.commit('TerminalStore/handleTerminalVisibleFalse')"/> -->
             <h4 @click="$store.commit('TerminalStore/handleTerminalVisibleFalse')" style="margin-left:700px;color:yellow">{{en.hide}}</h4>
        </div>
        <div v-for="(input, index) in historyInputs" :key="index">
            <div class="terminal-area" style="display:flex">
            <h3 style="color:white">{{ $store.state.ProjectStore.projectName?$store.state.ProjectStore.projectName:"Files "}}</h3>
            <h3 style="color:white;padding:3px 10px">%</h3>
            <input type="text" :placeholder="input" style="width:100%;height:20px;padding-top:5px;background-color:black;color:white;border:none;margin:0" />
            </div>
            <div class="output-display" style="transform:translateX(-500px)">
                <div v-if="$store.getters['TerminalStore/getTerminalOutput'][index]" style="color:white;border:none" >
                    <div v-html="$store.getters['TerminalStore/getTerminalOutput'][index].replaceAll('\n', '<br />')"></div>
                </div>
            </div>
        </div>
        <div class="terminal-area" style="display:flex">
            <h2 style="color:white">{{ $store.state.ProjectStore.projectName?$store.state.ProjectStore.projectName:"Files"}}</h2>
            <h3 style="color:white;padding:3px 10px">%</h3>
            <input type="text" placeholder="" v-model="contentEntered" style="width:100%;height:20px;padding-top:5px;background-color:black;color:white;border:none" class="input-terminal" v-on:keydown.enter="nextLineOnEnter">
        </div>
    </div>
    </div>
</template>
<script>
import en from '@/locales/en';
export default({
    name:'TerminalView',
    data(){
        return{
            en,
            enterButtonClicked:false,
            contentEntered:"",
            historyInputs:[],
            startHeight:200,
            startY:null,
            startOriginial:null,
            htmlTag:'<br/>'
        }
    },
    methods:{
        async nextLineOnEnter(){
           this.enterButtonClicked=true;
           let val=await this.$store.dispatch('TerminalStore/addtoTerminalInput',this.contentEntered);
           this.historyInputs=this.$store.getters['TerminalStore/getTerminalInput'];
           if(val){
              this.$store.dispatch('TerminalStore/sendInputToBackend',this.contentEntered);
              this.contentEntered=""
           }
           else{
            this.contentEntered=""
           }
        },
        startDraggable(e){
            this.startY=e.clientY;
            this.startOriginial=this.startHeight;
            window.addEventListener('mousemove',this.onDrag);
            window.addEventListener('mouseup',this.stopDrag)
        },
        onDrag(e){
            // let delta=this.startY-e.clientY;
            this.startHeight=this.startOriginial+(this.startY-e.clientY);
            // this.$store.commit('TerminalStore/changeHeight',this.startHeight);
        },
        stopDrag(){
            window.removeEventListener('mousemove',this.onDrag);
            window.removeEventListener('mouseup',this.stopDrag);
        }
    }
})
</script>
<style>
/* .terminal-area{
    height:40%;
    width:100%;
    background-color:pink;
} */
.input-terminal:focus {
  background-color: black;
  outline: none;
}
</style>
