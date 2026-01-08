<template>
  <nav class="navbar">
    <router-link to="/">בית</router-link>
    <router-link to="/works">עבודות</router-link>
    <router-link to="/sketchbooks">סקצבוקים</router-link>
    <router-link to="/videos">וידאו</router-link>
  </nav>
</template>

<style scoped>
.navbar {
  display: flex;
  width: 100vw;
  max-width:100%;
  gap: 25px;
  background-color: #000000;
  font-weight: bold;
  padding: 15px 30px;

  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000; 
}


.navbar a {
  text-decoration: none;
  color: #ebebeb;
}

.navbar a.router-link-active {
  color: #ff0000;
}
</style>
