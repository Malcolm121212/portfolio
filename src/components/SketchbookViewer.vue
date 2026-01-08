<template>
  <div class="viewer" tabindex="0" @keydown.esc="close">
    <button class="close" @click="close">✕</button>

    <div class="arrow left" @click="prev">
      ‹
    </div>

    <div class="page-frame">
      <img :src="images[current]" />
    </div>

    <div class="arrow right" @click="next">
      ›
    </div>
    <div class="page-num">
        <p>{{ current+1 }} / {{ length }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    images: Array,
    startIndex: Number
  },

  data() {
    return {
      current: this.startIndex,
      length: this.images.length
    }
  },

  mounted() {
    this.$el.focus()
    document.body.style.overflow = 'hidden'
  },

  unmounted() {
    document.body.style.overflow = ''
  },

  methods: {
    close() {
      this.$emit('close')
    },
    next() {
      this.current = (this.current + 1) % this.images.length
    },
    prev() {
      this.current =
        (this.current - 1 + this.images.length) % this.images.length
    }
  }
}
</script>

<style scoped>
/* ===============================
   משתנה שליטה מרכזי
   =============================== */
.viewer {
  --image-scale: 0.65; /* 🔧 שחקי עם זה (0.5 – 0.8) */

  position: fixed;
  inset: 0;
  background: black;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ===============================
   מסגרת הדף
   =============================== */
.page-frame {
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.page-frame img {
  max-width: calc(100vw * var(--image-scale));
  max-height: calc(100vh * var(--image-scale));
  object-fit: contain;
  background: black;
}

/* ===============================
   חיצים
   =============================== */
.arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  font-size: 48px;
  color: white;
  opacity: 0;
  cursor: pointer;
  user-select: none;
  padding: 24px;
  transition: opacity 0.3s ease;
}

.page-num{
  top: 86vh;
  left: 50vw;
  font-size: 24px;
  color: white;
  text-align: center;
  position: absolute;
  transform: translateX(-50%);
}

.viewer:hover .arrow {
  opacity: 0.6;
}

.arrow:hover {
  opacity: 1;
}

.left {
  left: 24px;
}

.right {
  right: 24px;
}

/* ===============================
   סגירה
   =============================== */
.close {
  position: absolute;
  top: 24px;
  right: 32px;
  font-size: 22px;
  background: none;
  color: white;
  border: none;
  cursor: pointer;
  opacity: 0.7;
}

.close:hover {
  opacity: 1;
}

/* ===============================
   מובייל – דפדוף immersive
   =============================== */
@media (max-width: 768px) {
  .viewer {
    --image-scale: 1;
  }

  .arrow {
    opacity: 0.8;
    font-size: 40px;
  }
}
</style>
