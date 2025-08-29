<template>
    <div class="nav">
    <div class="nav-left">
    <img src="../assets/image.png" class="ide"/>
    </div>
    <div class="nav-center">
        <li>{{en.bolt_new}}</li>
        <li>{{en.web_containers}}</li>
        <li href="">{{en.careers}}</li>
    </div>
    <div class="nav-right">
        <button><router-link to='/signup'>{{en.register}}</router-link></button>
        <button><router-link to='/login'>{{en.sign_in}}</router-link></button>
    </div>
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
.ide {
  width:200px;
  height:50px;
  object-fit: cover;
  border-radius: 5px;
  background-color: rgb(28,31,37);
}

a {
  text-decoration: none;
  color: #fff;
  font-family: sans-serif;
  font-size: 18px;
}

.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 16px 20px;
  background-color: rgb(28,31,37);
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}


.nav-center {
  display: flex;
  gap: 40px;
  list-style: none;
  color: ghostwhite;
  font-family: sans-serif;
  flex-shrink: 1;
  flex-wrap: wrap;
}

.nav-center li {
  font-size: 15px;
  cursor: pointer;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.nav-right button {
  width: 90px;
  background-color: rgba(29, 78, 106, 0.12);
  color: #fff;
  padding: 8px 12px;
  border: 0.1px solid rgb(64, 63, 63);
  border-radius: 10px;
  font-family: sans-serif;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.nav-right button:hover {
  background-color: rgba(29, 78, 106, 0.25);
}


@media screen and (max-width: 1024px) {
  .nav {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .nav-left,
  .nav-center,
  .nav-right {
    width: 100%;
    justify-content: flex-start;
  }

  .nav-center {
    gap: 20px;
    flex-wrap: wrap;
  }

  .nav-right {
    gap: 10px;
    flex-wrap: wrap;
  }

  .nav-right button {
    width: 100px;
  }
}

@media screen and (max-width: 767px) {
  .nav {
    padding: 12px 16px;
    align-items: center;
  }

  .nav-left {
    justify-content: center;
    width: 100%;
  }

  .nav-center {
    flex-direction: column;
    gap: 10px;
    align-items: center;
    width: 100%;
  }

  .nav-center li {
    font-size: 16px;
  }

  .nav-right {
    flex-direction: column;
    align-items: center; 
    gap: 10px;
    width: 100%;
  }

  .nav-right button {
    width: auto;      
    padding: 8px 16px; 
    cursor:pointer
  }

  a {
    font-size: 16px;
  }
}
</style>
