<template>
    <div class="content-section">
    <div class="content-header">
        <h1>{{en.how_product}}  &amp;</h1>
        <h1><span>{{en.engineering}}</span> {{en.teams}}</h1>
        <h1>{{en.work_together}}</h1>
    </div>
    <div class="content-para">
        <p>{{en.turn_text}}</p>
        <p>{{en.your_vision}}  <strong> {{en.create}} </strong>  {{en.and}} <strong> {{en.launch}} </strong> {{en.applications_directly}}</p>
        <p>{{en.browser}}</p>
    </div>
    <button>{{en.try_bolt}}</button>
    </div>
</template>

<script>
import en from '@/locales/en';
export default{
    data(){
      return{
        en,
      }
    }
}
</script>



<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Manrope&family=PT+Mono&family=Inter&display=swap');
.content-section{
 background-color: rgb(28,31,37);
 height:800px;
 text-align: left;
 color: white;
}

.content-header{
    display: grid;
    margin-top:100px;
    margin-left:80px;
}   
h1{
    color:white;
    font-family: sans-serif;
    font-size:90px;
    line-height: 1.2;
    margin: 0 0 10px 0;
    padding: 0;
    font-weight: bold;
} 
.content-para{
    display: grid;
    margin-top:40px;
    margin-left: 90px;
}
p{
    color: white;
    font-family: sans-serif;
    line-height: 2;
    font-size:18px
}
p strong{
    font-family: sans-serif;
    color:#fff;
    font-size: 20px;
}
button{
    margin-top:30px;
    margin-left: 90px;
    width:150px;
    height:52px;
    padding:10px;
    background-color: #1574ef;
    border-radius: 10px;
    border:none;
    color: #fff;
    font-size:18px;
    cursor: pointer;
}
span{
    background: linear-gradient(180deg, #0d86dd0f, #0d86dd33);
}
.content-header span{
        background: linear-gradient(180deg, #0d86dd33, #1b2632);
        border-radius: 20px;
        border:2px solid #0d86dd0f;
        padding-left:10px;
        padding-right:10px;
        font-family: sans-serif;
        font-weight:1;
}

@media screen and (max-width: 1024px) {
  .content-header{
    margin-left: 40px;
  }

  h1 {
    font-size: 60px;
  }

  .content-para {
    margin-left: 40px;
  }

  p {
    font-size: 16px;
    line-height: 1.2;
  }

  p strong {
    font-size: 18px;
  }

  button {
    margin-left: 40px;
    width: 140px;
    height: 48px;
    font-size: 16px;
  }
}

@media screen and (max-width: 768px) {
  .content-header {
    margin-left: 20px;
    margin-top: 60px;
  }

  h1 {
    font-size: 40px;
  }

  .content-para{
    margin-left: 20px;
    margin-top: 20px;
  }

  p {
    font-size: 15px;
    line-height: 1.4;
  }

  p strong {
    font-size: 17px;
  }

  button {
    margin-left: 20px;
    width: 130px;
    height: 44px;
    font-size: 15px;
  }
}

@media screen and (max-width: 480px) {
  h1 {
    font-size: 32px;
  }

  p {
    font-size: 14px;
  }

  p strong {
    font-size: 16px;
  }

  button {
    width: 120px;
    height: 42px;
    font-size: 14px;
  }
}


</style>
