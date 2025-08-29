
<template>
    <div id="signup">
        <div id="signupdetails">
            <img id="logo" v-bind:src="require('@/assets/image3.png')" alt="image">
            <form id="headingform" v-on:submit.prevent="handleInfo">
                <div id="signhead">
                    <h1 id="sinupheadings">{{en.get_started}}</h1>
                    <h3 id="sinupheadingsbelow">{{en.create_ide}}</h3>
                </div>
                <div id="altersignup">
                    <button id="github" type="button">{{en.github}}</button>
                    <button id="github" type="button">{{en.google}}</button>
                </div>
                <h4 id="signupor">- or -</h4>
                <div id="signinputdiv">
                    <input class="signupinput" placeholder="Enter First Name" type="text" v-model="firstName" >
                    <p v-if="firstNameNull" class="error-text">{{en.first_name_notnull}}</p>
                    <input class="signupinput" placeholder="Enter Last Name" type="text" v-model="lastName" >
                    <p v-if="lastNameNull" class="error-text">{{en.last_name_notnull}}</p>
                    <input class="signupinput" placeholder="Enter E-mail" type="text" v-model="email" >
                    <p v-if="EmailNull" class="error-text">{{en.email_not_null}}</p>
                    <input class="signupinput" placeholder="Enter Password" type="password" v-model="password" >
                    <p v-if="passwordNull" class="error-text">{{en.password_not_null}}</p>
                </div>
                <button id="singupbutton" type="submit" v-bind:style="{ marginTop: spaceFromTop + 'px' }" v-on:click="handleSpaceFromTop">Sign Up</button>
            </form>
        </div>
        <div id="signupcontent">
            <div id="signuprightcontent">
                <h2>{{en.Vonage_Ide}}</h2>
                <img id="facesign" v-bind:src="require('@/assets/face.jpeg')">
                <h3 id="nameface">{{en.Tom_preston}}</h3>
                <h5 id="facedetails">{{en.founder_info}}</h5>
            </div>
        </div>
    </div>
</template>
<script setup>
import en from '@/locales/en'
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
const store = useStore()
const router = useRouter()
const toast = useToast()
const firstName = ref('')
const lastName = ref('')
const email = ref('')
let atratePresent=ref(false)
const password = ref('')
let firstNameNull=ref(false)
let lastNameNull=ref(false)
let EmailNull=ref(false)
let passwordNull=ref(false)
let EmailInvalid=ref(false)
let spaceFromTop=ref(10)
const handleSpaceFromTop=async ()=>{
    spaceFromTop.value = 10
    if (firstName.value === "" && lastName.value === "" && email.value === "" && password.value === "") {
        spaceFromTop.value = 100
        return;
    }
    if(firstName.value==""){
        spaceFromTop.value+=25;
    }
    if(lastName.value==""){
        spaceFromTop.value+=25;
    }
    if(email.value==""){
        spaceFromTop.value+=25;
    }
    if(password.value==""){
        spaceFromTop.value+=25;
    }
}
const handleInfo = async () => {
   let fname=firstName;
   let lname=lastName;
   let mail=email;
   let psswrd=password;
   if(fname.value==""){
    firstNameNull.value=true;
   }
   if(lname.value==""){
    lastNameNull.value=true;
   }
   if(mail.value==""){
    EmailNull.value=true;
   }
   if(psswrd.value==""){
    passwordNull.value=true;
   }
   if(psswrd.value!=""){
    let count=0;
    for(let a of psswrd.value){
        console.log(a);
        count=count+1;
    }
    if(count<6){
        toast.error("invalid password");
    }
   }
   if(fname.value!=""){
        firstNameNull.value=false;
    }
    if(lname.value!=""){
        lastNameNull.value=false;
    }
    if(mail.value!=""){
        EmailNull.value=false;
    }
    if(psswrd.value!=""){
        passwordNull.value=false;
    }
    if(email.value!=""){
        if(email.value.includes("@gmail.com")){
            atratePresent.value=true;
        }
    }
   if(atratePresent.value==false && EmailNull.value!=true){
        EmailInvalid.value=true;
        toast.error("email is invalid");
        return;
    }
    if(fname.value=="" || lname.value=="" || mail.value==""){
        return;
    }
    const res = await store.dispatch('auth/fetchUserInfo', {
        firstName: firstName.value,
        lastName: lastName.value,
        email: email.value,
        password: password.value
  })
  firstName.value = ''
  lastName.value = ''
  email.value = ''
  password.value = ''
  if (res) {
    toast.success('User Registered Successfully!', {
      timeout: 3000
    })
    router.push('/login')
  } else {
    toast.error('User already Registered')
  }
}
</script>
<style scoped>
.error-text{
    color:red;
}
#logo{
  width:200px;
  height:50px;
  object-fit: cover;
  border-radius: 5px;
  background-color: rgb(28,31,37);
  transform:translateX(-80px);
  margin-top:20px;
}
#sinupheadings{
    font-family: sans-serif;
    color: white;
}
#sinupheadingsbelow{
    color:grey;
    height:20px;
    transform:translateY(-20px);
}
#signup{
    background-color:#0b0c0e;
    height:100vh;
    width:100vw;
    position:fixed;
    display:flex;
}
#signupdetails{
    display:grid;
    margin-left:100px;
}
#headingform{
    transform:translateY(-100px);
    display:grid;
    width:500px;
    gap:10px;
}
.signupinput{
    background-color:#121417;
    border: 1px solid grey;
    color:white;
    width:300px;
    height:30px;
    margin-top:5px;
    margin-left:110px;
}
#singupbutton{
    color:white;
    background-color:rgb(34, 32, 32);
    border-radius:10px;
    width:300px;
    margin-left:110px;
    height:50px;
    border:2px solid grey;
}
#signhead{
    display:grid;
}
#signinputdiv{
    height:100px;
    display:grid;
}
#altersignup{
    display:grid;
}
#github{
color:white;
    background-color:rgb(34, 32, 32);
    border:2px solid grey;
    width:300px;
    height:50px;
    margin-left:110px;
    border-radius:10px;
}
#signupor{
    color:grey;
    height:5px;
    transform:translateX(5px);
}
#signupcontent{
     background-color: #000000;
     width:1000px;
     display:grid;
     align-content: center;
     justify-content:center;
}
#signuprightcontent{
    width:500px;
    color:grey;
}
#facesign{
    border-radius:100px;
    height:50px;
    transform:translateX(-140px) translateY(5px);
}
#nameface{
    transform:translateY(-50px);
    color:white;
}
#facedetails{
    color:grey;
    transform:translateX(40px) translateY(-50px);
}
#have-an-account{
    transform:translateY(40px);
}
</style>