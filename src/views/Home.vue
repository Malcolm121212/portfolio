<template>
  <div class="home">
    <div class="content">
      <h1 class="name">Yaara Feldman</h1>
      <p class="tagline">Portfolio of Works, Sketchbooks & Videos</p>

      <div class="links">
        <router-link to="/works" class="btn">עבודות נבחרות</router-link>
        <router-link to="/sketchbooks" class="btn">סקצבוקים</router-link>
        <router-link to="/videos" class="btn">וידאו</router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Home"
};
</script>

<style scoped>

.home {
  width: 100%;
  min-height: calc(100vh - 60px); /* אם יש navbar */
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #111;
}


.content {
  text-align: center;
  max-width: 90%;
  padding: 20px;
  box-sizing: border-box;
}

.name {
  font-size: 4rem;
  margin-bottom: 15px;
  font-family: 'Georgia', serif;
  letter-spacing: 2px;
  word-wrap: break-word;
}

.tagline {
  font-size: 1.5rem;
  margin-bottom: 40px;
  color: #ccc;
  word-wrap: break-word;
}

.links {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  text-decoration: none;
  background-color: rgba(255,255,255,0.1);
  color: white;
  padding: 12px 30px;
  border-radius: 6px;
  font-weight: bold;
  transition: background 0.3s, transform 0.2s;
  white-space: nowrap;
}

.btn:hover {
  background-color: rgba(255,255,255,0.3);
  transform: scale(1.05);
}

/* רספונסיבי */
@media (max-width: 1024px) {
  .name {
    font-size: 3.2rem;
  }
  .tagline {
    font-size: 1.3rem;
  }
  .btn {
    padding: 10px 20px;
  }
}

@media (max-width: 768px) {
  .name {
    font-size: 2.6rem;
  }
  .tagline {
    font-size: 1.1rem;
  }
}

@media (max-width: 480px) {
  .name {
    font-size: 2rem;
  }
  .tagline {
    font-size: 1rem;
  }
  .links {
    gap: 10px;
  }
  .btn {
    padding: 8px 16px;
    font-size: 0.9rem;
  }
}
</style>
