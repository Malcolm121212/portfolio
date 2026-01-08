<template>
  <div class="sketchbooks-page">
    <section
      v-for="(book, bookIndex) in sketchbooks"
      :key="book.slug"
      class="sketchbook-section"
      @mouseenter="hoverIndex = bookIndex"
      @mouseleave="hoverIndex = null"
    >
      <h2>
        {{ book.title }}
        <span>{{ book.year }}</span>
      </h2>
      <p class="description">{{ book.description }}</p>

      <div class="preview-wrapper">
        <!-- חץ שמאלי -->
        <button
          class="arrow left"
          v-show="hoverIndex === bookIndex"
          @click="prevPreview(bookIndex)"
          @mouseenter="startHoverScroll(bookIndex, 'prev')"
          @mouseleave="stopHoverScroll(bookIndex)"
          :disabled="book.startIndex === 0"
        >&#8592;</button>

        <!-- סטריפ התמונות -->
        <div class="preview-container" ref="containerRefs" :data-index="bookIndex">
          <div
            class="preview-strip"
            :style="{ transform: 'translateX(' + -book.startIndex * imageWidth + 'px)' }"
          >
            <img
              v-for="(img, imgIndex) in book.images"
              :key="img"
              :src="img"
              class="preview-image"
              @click="openViewer(bookIndex, imgIndex)"
              @load="onImageLoad(bookIndex)"
            />
          </div>
        </div>

        <!-- חץ ימני -->
        <button
          class="arrow right"
          v-show="hoverIndex === bookIndex"
          @click="nextPreview(bookIndex)"
          @mouseenter="startHoverScroll(bookIndex, 'next')"
          @mouseleave="stopHoverScroll(bookIndex)"
          :disabled="book.startIndex + book.visibleCount >= book.images.length"
        >&#8594;</button>
      </div>
    </section>

    <SketchbookViewer
      v-if="viewerOpen"
      :images="activeImages"
      :startIndex="activeIndex"
      @close="viewerOpen = false"
    />
  </div>
</template>

<script>
import SketchbookViewer from '../components/SketchbookViewer.vue'

const sketchbookImages = import.meta.glob(
  '/src/assets/sketchbooks/**/*.{jpg,jpeg,png,webp}',
  { eager: true }
)

const sketchbookMetadata = import.meta.glob(
  '/src/assets/sketchbooks/**/metadata.json',
  { eager: true }
)

export default {
  components: { SketchbookViewer },

  data() {
    return {
      sketchbooks: [],
      viewerOpen: false,
      activeImages: [],
      activeIndex: 0,
      hoverIndex: null,
      containerRefs: [],
      imageWidth: 200, // ברירת מחדל, תתעדכן לפי תמונה
      hoverIntervals: {}
    }
  },

  created() {
    this.buildSketchbooks()
    window.addEventListener('resize', this.updateVisibleCount)
  },

  beforeUnmount() {
    window.removeEventListener('resize', this.updateVisibleCount)
  },

  methods: {
    buildSketchbooks() {
      const books = {}

      Object.entries(sketchbookMetadata).forEach(([path, mod]) => {
        const parts = path.split('/')
        const folder = parts[parts.length - 2]
        const metadata = mod.default

        books[folder] = {
          slug: folder,
          title: metadata.title,
          year: metadata.year || '',
          description: metadata.description || '',
          images: [],
          startIndex: 0,
          visibleCount: 1
        }
      })

      Object.entries(sketchbookImages).forEach(([path, mod]) => {
        const parts = path.split('/')
        const folder = parts[parts.length - 2]
        const src = mod.default
        if (books[folder]) books[folder].images.push(src)
      })

      this.sketchbooks = Object.values(books).map(book => {
        book.images.sort((a,b)=>a.localeCompare(b))
        return book
      })

      this.$nextTick(() => {
        this.updateVisibleCount()
      })
    },

    openViewer(bookIndex, imgIndex) {
      this.activeImages = this.sketchbooks[bookIndex].images
      this.activeIndex = imgIndex
      this.viewerOpen = true
    },

    onImageLoad(bookIndex) {
      const container = this.$refs.containerRefs[bookIndex]
      if (container) {
        const img = container.querySelector('img')
        if (img) this.imageWidth = img.clientWidth
      }
      this.updateVisibleCount()
    },

    updateVisibleCount() {
      this.sketchbooks.forEach((book, index) => {
        const container = this.$refs.containerRefs[index]
        if (container) {
          const containerWidth = container.clientWidth
          book.visibleCount = Math.floor(containerWidth / this.imageWidth)
        }
      })
    },

    nextPreview(bookIndex) {
      const book = this.sketchbooks[bookIndex]
      if (book.startIndex + book.visibleCount < book.images.length) book.startIndex++
    },

    prevPreview(bookIndex) {
      const book = this.sketchbooks[bookIndex]
      if (book.startIndex > 0) book.startIndex--
    },

    startHoverScroll(bookIndex, direction) {
      this.stopHoverScroll(bookIndex)
      this.hoverIntervals[bookIndex] = setInterval(() => {
        if (direction === 'next') this.nextPreview(bookIndex)
        else this.prevPreview(bookIndex)
      }, 300)
    },

    stopHoverScroll(bookIndex) {
      if (this.hoverIntervals[bookIndex]) {
        clearInterval(this.hoverIntervals[bookIndex])
        this.hoverIntervals[bookIndex] = null
      }
    }
  }
}
</script>

<style scoped>
.sketchbooks-page {
  background: black;
  color: white;
  padding: 80px 40px;
}

.sketchbook-section {
  margin-bottom: 120px;
  position: relative;
}

h2 {
  font-weight: 300;
  margin-bottom: 8px;
}

h2 span {
  opacity: 0.5;
  font-size: 0.9rem;
  margin-left: 8px;
}

.description {
  opacity: 0.7;
  margin-bottom: 24px;
}

.preview-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.preview-container {
  overflow: hidden;
  flex: 1;
}

.preview-strip {
  display: flex;
  transition: transform 0.3s ease;
  gap: 16px;
}

.preview-image {
  height: 200px;
  object-fit: contain;
  cursor: pointer;
  flex-shrink: 0;
}

/* חיצים */
.arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0,0,0,0.7);
  border: none;
  color: white;
  font-size: 2rem;
  cursor: pointer;
  padding: 8px;
  z-index: 2;
  display: none;
}

.sketchbook-section:hover .arrow {
  display: block;
}

.arrow.left {
  left: 0;
}

.arrow.right {
  right: 0;
}

.arrow:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

/* רספונסיביות */
@media (max-width: 768px) {
  .preview-image {
    height: 150px;
  }
  .arrow {
    font-size: 1.5rem;
    padding: 6px;
  }
}

@media (max-width: 480px) {
  .preview-image {
    height: 120px;
  }
}
</style>
