import API_BASE_URL from "@/config";
import StorageWrapper from "./storageWrapper";
export default ({
    namespaced: true,
    state() {
        return {
            fileNameWithContent: [],
            slideropen: false
        }
    },
    mutations: {
        changefileNameWithContent(state, payload) {
            let flag = false;
            if (state.fileNameWithContent.length > 0) {
                for (let a of state.fileNameWithContent) {
                    if (payload.fileid === a.fileld) {
                        a.content = payload.content;
                        flag = true;
                    }
                }
                if (flag) {
                    return;
                }
            }
            state.fileNameWithContent.push(payload);
        },
        toggleSlider(state) {
            state.slideropen = !state.slideropen
        }
    },
    actions: {
        async getFileContent(context, fileName) {
            for (let name of context.state.fileNameWithContent) {
                if (name.filename === fileName) {
                    return name.content;
                }
            }
            const files = context.rootGetters['FileSelected/fetchFiles'];
            let fileId = null;
            for (let s of files) {
                if (s.fileName == fileName) {
                    fileId = s.id;
                }
            }
            const token = StorageWrapper.get("token"); 
            const res = await fetch(`${API_BASE_URL}/api/files/${fileId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const response = await res.json();
            return response.data ? response.data.content : ''
        },
        async getFileContents(context, fileId) {
            for (let name of context.state.fileNameWithContent) {
                if (name.fileId == fileId) {
                    return name.content;
                }
            }
            const token = StorageWrapper.get("token"); 
            const res = await fetch(`${API_BASE_URL}/api/files/${fileId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const response = await res.json();
            return response.data ? response.data.content : ''
        },
        // async saveContent(context, { id, content }) {
        //     const token1=localStorage.getItem('token'); 
        //     try{
        //             const res=await fetch(`${API_BASE_URL}/api/files/${id}/content`, {
        //                 method:'PUT',
        //                 headers: {
        //                     'Content-Type': 'application/json',
        //                     'Authorization': `Bearer ${token1}`
        //                 },
        //                 body:JSON.stringify({
        //                     "content":content,
        //                 })
        //         });
        //         const response=await res.text();
        //         console.log("the response im getting after saving ",response);
        //         const fileContent={
        //             "fileid":id,
        //             "content":content,
        //         } 
        //         context.commit('changefileNameWithContent',fileContent);
        //     }catch(err){
        //         console.log("the error is not working bro",err);
        //     }

        // }
        async saveContent(context, { id, content }) {
            const token = StorageWrapper.get("token"); 



            try {
                const res = await fetch(`${API_BASE_URL}/api/files/${id}/content`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        content
                    })
                });

                const response = await res.text();
                console.log("the response after saving: ", response);


                const existingFile = context.state.fileNameWithContent.find(f => f.fileid === id);
                if (existingFile && existingFile.content) {
                    let updatedContent = existingFile.content.split("\n");


                    for (let lineNum in content) {
                        const index = parseInt(lineNum, 10) - 1;
                        updatedContent[index] = content[lineNum];
                    }

                    const finalContent = updatedContent.join("\n");

                    context.commit('changefileNameWithContent', {
                        fileid: id,
                        content: finalContent
                    });
                }

            } catch (err) {
                console.error("error while saving content", err);
            }
        }
    }
})
