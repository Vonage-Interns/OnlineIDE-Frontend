<template>
    <div id="signup">
        <div id="signupdetails">
            <img id="logo" v-bind:src="require('@/assets/image3.png')" alt="image">
            <form id="headingform" v-on:submit.prevent="handleInfo">
                <div id="signhead" style="transform:translateY(20px)">
                    <h1 style="padding:10px" id="sinupheadings">{{en.welcome_back}}</h1>
                    <h4 id="sinupheadingsbelow">{{en.Sign_in_line}}</h4>
                </div>
                <div id="altersignup" style="transform:translateY(25px)">
                    <button id="github" type="button">{{en.github}}</button>
                    <button id="github" type="button">{{en.google}}</button>
                </div>
                <h4 id="signupor" style="transform:translateY(20px)">- or -</h4>
                <div id="signinputdiv" style="transform:translateY(20px)" :class="checkError">
                    <input type="text" class="signupinput" placeholder="Enter E-mail" v-model="email">
                    <p v-if="emailnull" class="error-text">{{en.email_not_null}}</p>
                    <input type="password" class="signupinput" placeholder="Enter Password" v-model="password">
                    <p v-if="passwordnull" class="error-text">{{en.password_not_null}}</p>
                </div>
                <button id="singupbutton" type="submit" style="transform:translateY(-15px)">Log In</button>
                <p style="transform:translateY(-30px);"><router-link to="/signup" style="color:#a2a2a3">{{en.No_account_signup}}</router-link></p>
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
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useToast } from 'vue-toastification'
const toast = useToast()

const email = ref('')
const password = ref('')
const router = useRouter()
const store = useStore()
const emailnull=ref(false)
const passwordnull=ref(false)
const nullvalue=ref(true)

const validateEmail=()=>{
  if(!email.value.trim())
  emailnull.value=true;
  else
  emailnull.value=false;
  if(!password.value.trim())
  passwordnull.value=true
  else
  passwordnull.value=false
  if(passwordnull.value==false&&emailnull.value==false)
  nullvalue.value=false
}


const handleInfo = async () => {
    validateEmail(); 
  
  if (emailnull.value || passwordnull.value) {
    return;
  }
  localStorage.setItem('email',email.value)
  const verified = await store.dispatch('auth/checkLogin', {
    email: email.value,
    password: password.value
  })


  if (verified==false) {
    toast.error("Invalid email or password")
  } else {
    toast.success("login Successful")
    router.push('/compiler')
  }
}
</script>




<style scoped>
#logo{
  width:200px;
  height:50px;
  object-fit: cover;
  border-radius: 5px;
  background-color: rgb(28,31,37);
  transform:translateX(-80px);
  margin-top:20px;
  margin-left: 10px;
}
#sinupheadings{
    font-family:sans-serif;
    color: white;

}
#sinupheadingsbelow{
    color:grey;
    height:20px;
    transform:translateY(-20px);
}
#signup{
    background-color:#0B0C0E;
   
    height:100vh;
    width:100vw;
    position:fixed;
    display:flex;
}
#signupdetails{
    display:grid;
    margin-left:80px;
}
#headingform{
    transform:translateY(-150px);
    display:grid;
    width:500px;
    gap:10px;
}
.signupinput{
    background-color:black;
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
    margin-top:20px
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
     background-color: black;
     width:1000px;
     display:grid;
     align-content: center;
     justify-content:center;
}
#signuprightcontent{
    width:500px;
    color:grey;
}

.error-text {
  color: red;
  font-size: 0.9rem;
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
    transform:translateY(-100px);
}
@media screen and (max-width: 1024px){
    #signupdetails{
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap:100px
    }
    #headingform{
        margin-top:40px;
        
    }
    #signup{
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
}



/* not this is whart extra */

@media screen and (max-width: 1035px) {
  /* Hide the right content section */
  #signupcontent {
    display: none !important;
  }

  /* Fullscreen signup layout */
  #signup {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    width: 100%;
    padding: 30px 20px;
    background-color: #0B0C0E;
  }

  /* Center logo */
  #logo {
    transform: none;
    margin: 0 auto 25px;
    display: block;
    width: 160px;
    height: auto;
  }

  /* Main container for signup */
  #signupdetails {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 25px;
  }

  /* Form container */
  #headingform {
    width: 100%;
    max-width: 360px;
    transform: none;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 18px;
    background-color: #141414;
    padding: 25px;
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.4);
  }

  /* Title & subtitle */
  #sinupheadings {
    font-size: 1.7rem;
    text-align: center;
    margin-bottom: 5px;
  }
  #sinupheadingsbelow {
    font-size: 0.9rem;
    text-align: center;
    max-width: 300px;
    line-height: 1.4;
    margin: 0 auto;
    color: #aaa;
  }

  /* Alternative login buttons */
  #github {
    width: 100%;
    height: 48px;
    font-size: 1rem;
    font-weight: 500;
    border-radius: 8px;
    margin-top: 5px;
    transform:translateX(-100px);
  }

  /* Divider */
  #signupor {
    font-size: 0.85rem;
    color: #a2a2a3;
    margin: 10px 0;
  }

  /* Input fields */
  .signupinput {
    width: 100%;
    height: 45px;
    border-radius: 8px;
    padding-left: 12px;
    font-size: 0.95rem;
    background-color: black;
    border: 1px solid grey;
    box-sizing: border-box;
    transform:translateX(-100px) translateY(-30px);
  }

  /* Signup button - perfectly aligned with inputs */
  #singupbutton {
    width: 200px;
    height: 28px;
    font-size: 1rem;
    font-weight: 600;
    border-radius: 8px;
    background-color: rgb(34, 32, 32);
    color: white;
    border: 2px solid grey;
    transition: all 0.3s ease;
    box-sizing: border-box;
    transform:translateX(-50px)
  }
  #singupbutton:hover {
    background-color: grey;
    color: black;
  }

  /* Account link */
  p {
    text-align: center;
    font-size: 0.9rem;
    margin-top: 5px;
    color: #a2a2a3;
    
  }
}



</style>