<template>
  <section class="works">
    <h1>עבודות נבחרות</h1>
    <div class="grid">
      <div class="work" v-for="work in works" :key="work.metadata.title" @click="openModal(work, 0)">
        <img :src="work.media[0].src" v-if="work.media[0].type === 'image'" />
        <video :src="work.media[0].src" v-else muted></video>
      </div>
    </div>

    <!-- Full-screen modal -->
    <div v-if="modal.active" class="modal" @click.self="closeModal">
      <button class="modal-close" @click="closeModal">&#10005;</button>
      <button class="modal-prev" v-show="isFirstMedia"  @click.stop="prevMedia" :disabled="modal.currentIndex === 0">&#8592;</button>

      <div class="modal-content">
        <video v-if="modal.work.media[modal.currentIndex].type === 'video'" :src="modal.work.media[modal.currentIndex].src" controls autoplay></video>
        <img v-else :src="modal.work.media[modal.currentIndex].src" />
        
        <div class="metadata">
          <h2>{{ modal.work.metadata.title }} ({{ modal.work.metadata.year }})</h2>
          <p><strong>Medium:</strong> {{ modal.work.metadata.medium }}</p>
          <p><strong>Size:</strong> {{ modal.work.metadata.size }}</p>
          <p>{{ modal.work.metadata.description }}</p>
          <p class="media-number">{{ modal.currentIndex + 1 }} / {{ modal.work.media.length }}</p>
        </div>
      </div>

      <button class="modal-next" v-show="isLastMedia" @click.stop="nextMedia" :disabled="modal.currentIndex === modal.work.media.length - 1">&#8594;</button>
    </div>
  </section>
</template>

<script>
export default {
  name: 'Works',
  data() {
    return {
      works: [],
      modal: {
        active: false,
        work: null,
        currentIndex: 0
      }
    }
  },

  computed:{
    computed: {
  isFirstMedia() {
    return this.modal.currentIndex === 0
  },

  isLastMedia() {
    if (!this.modal.work || !this.modal.work.media) return true
    return this.modal.currentIndex === this.modal.work.media.length - 1
  }
}

  },

  async created() {
    const imageModules = import.meta.glob('../assets/works/*/*.jpg', { eager: true, import: 'default' });
    const videoModules = import.meta.glob('../assets/works/*/*.mp4', { eager: true, import: 'default' });
    const metadataModules = import.meta.glob('../assets/works/*/metadata.json', { eager: true, import: 'default' });

    const worksMap = {};

    // ארגון תמונות
    for (const path in imageModules) {
      const match = path.match(/works\/([^\/]+)\/([^\/]+)\.jpg$/);
      if (!match) continue;
      const folder = match[1];
      if (!worksMap[folder]) worksMap[folder] = { media: [], metadata: {} };
      worksMap[folder].media.push({ type: 'image', src: imageModules[path] });
    }

    // ארגון וידאו
    for (const path in videoModules) {
      const match = path.match(/works\/([^\/]+)\/([^\/]+)\.mp4$/);
      if (!match) continue;
      const folder = match[1];
      if (!worksMap[folder]) worksMap[folder] = { media: [], metadata: {} };
      worksMap[folder].media.unshift({ type: 'video', src: videoModules[path] }); // וידאו ראשון
    }

    // מיון לפי שם קובץ
    for (const folder in worksMap) {
      worksMap[folder].media.sort((a, b) => {
        const nameA = a.src.split('/').pop().replace(/\.(jpg|mp4)$/, '');
        const nameB = b.src.split('/').pop().replace(/\.(jpg|mp4)$/, '');
        return nameA.localeCompare(nameB, undefined, { numeric: true });
      });
    }

    // ייבוא metadata
    for (const path in metadataModules) {
      const match = path.match(/works\/([^\/]+)\/metadata\.json$/);
      if (!match) continue;
      const folder = match[1];
      worksMap[folder].metadata = metadataModules[path];
    }

    this.works = Object.values(worksMap);
  },
  methods: {
    openModal(work, index) {
      this.modal.active = true;
      this.modal.work = work;
      this.modal.currentIndex = index;
    },
    closeModal() {
      this.modal.active = false;
      this.modal.work = null;
      this.modal.currentIndex = 0;
    },
    nextMedia() {
      if (this.modal.currentIndex < this.modal.work.media.length - 1) this.modal.currentIndex++;
    },
    prevMedia() {
      if (this.modal.currentIndex > 0) this.modal.currentIndex--;
    }
  }
}
</script>

<style scoped>
.works {
  padding: 40px 20px;
  background-color: #111;
  color: white;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.work {
  cursor: pointer;
  overflow: hidden;
  border-radius: 8px;
}

.work img, .work video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 6px;
  transition: transform 0.3s;
}

.work img:hover, .work video:hover {
  transform: scale(1.05);
}

/* Modal full-screen */
.modal {
  position: fixed;
  top:0; left:0;
  width:100vw;
  height:100vh;
  background-color: rgba(0,0,0,0.95);
  display:flex;
  align-items:center;
  justify-content:center;
  z-index:1000;
}

.modal-content {
  max-width: 90vw;
  max-height: 90vh;
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
}

.modal-content img, .modal-content video {
  max-width:100%;
  max-height:70vh;
  object-fit:contain;
  border-radius:8px;
}

.metadata {
  margin-top:15px;
  text-align:center;
}

.metadata h2 {
  margin-bottom:5px;
}

.metadata p {
  margin:3px 0;
}

.media-number {
  margin-top:5px;
  font-size:0.9rem;
  color:#ccc;
}

.modal-close, .modal-prev, .modal-next {
  position:absolute;
  background-color: rgba(255,255,255,0.2);
  border:none;
  color:white;
  font-size:2rem;
  cursor:pointer;
  padding:10px 15px;
  border-radius:5px;
  transition: background 0.2s;
}

.modal-close:hover, .modal-prev:hover, .modal-next:hover {
  background-color: rgba(255,255,255,0.5);
}

.modal-close { top:20px; right:30px; }
.modal-prev { left:30px; top:50%; transform: translateY(-50%);}
.modal-next { right:30px; top:50%; transform: translateY(-50%);}
</style>
