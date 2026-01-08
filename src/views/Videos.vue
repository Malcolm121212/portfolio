<template>
  <section class="videos">
    <h1>עבודות וידאו</h1>
    <div class="projects-container">
      <div class="project" v-for="project in projects" :key="project.metadata.title">
        <h2>{{ project.metadata.title }} ({{ project.metadata.year }})</h2>
        <p>{{ project.metadata.description }}</p>
        <p><strong>Medium:</strong> {{ project.metadata.medium }} | <strong>Duration:</strong> {{ project.metadata.duration }}</p>

        <div class="media-wrapper">
          <button @click="prevMedia(project)" :disabled="project.currentIndex === 0" class="nav-btn">&#8592;</button>
          
          <div class="media">
            <video v-if="project.media[project.currentIndex].type === 'video'" :src="project.media[project.currentIndex].src" controls></video>
            <img v-else :src="project.media[project.currentIndex].src" />
            <p class="media-number">{{ project.currentIndex + 1 }} / {{ project.media.length }}</p>
          </div>

          <button @click="nextMedia(project)" :disabled="project.currentIndex === project.media.length - 1" class="nav-btn">&#8594;</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'Videos',
  data() {
    return {
      projects: []
    }
  },
  async created() {
    const videoModules = import.meta.glob('../assets/videos/*/*.mp4', { eager: true, import: 'default' });
    const imageModules = import.meta.glob('../assets/videos/*/*.jpg', { eager: true, import: 'default' });
    const metadataModules = import.meta.glob('../assets/videos/*/metadata.json', { eager: true, import: 'default' });

    const projectsMap = {};

    // ארגון וידאו
    for (const path in videoModules) {
      const match = path.match(/videos\/([^\/]+)\/([^\/]+)\.mp4$/);
      if (!match) continue;
      const folder = match[1];
      if (!projectsMap[folder]) projectsMap[folder] = { media: [], metadata: {}, currentIndex: 0 };
      projectsMap[folder].media.push({ type: 'video', src: videoModules[path] });
    }

    // ארגון תמונות
    for (const path in imageModules) {
      const match = path.match(/videos\/([^\/]+)\/([^\/]+)\.jpg$/);
      if (!match) continue;
      const folder = match[1];
      if (!projectsMap[folder]) projectsMap[folder] = { media: [], metadata: {}, currentIndex: 0 };
      projectsMap[folder].media.push({ type: 'image', src: imageModules[path] });
    }

    // מיון תמונות לפי שם קובץ
    for (const folder in projectsMap) {
      projectsMap[folder].media.sort((a, b) => {
        const nameA = a.src.split('/').pop().replace(/\.(jpg|mp4)$/,'');
        const nameB = b.src.split('/').pop().replace(/\.(jpg|mp4)$/,'');
        return nameA.localeCompare(nameB, undefined, { numeric: true });
      });
    }

    // ייבוא metadata
    for (const path in metadataModules) {
      const match = path.match(/videos\/([^\/]+)\/metadata\.json$/);
      if (!match) continue;
      const folder = match[1];
      projectsMap[folder].metadata = metadataModules[path];
    }

    this.projects = Object.values(projectsMap);
  },
  methods: {
    nextMedia(project) {
      if (project.currentIndex < project.media.length - 1) project.currentIndex++;
    },
    prevMedia(project) {
      if (project.currentIndex > 0) project.currentIndex--;
    }
  }
}
</script>

<style scoped>
.videos {
  padding: 40px 20px;
  background-color: #111;
  color: white;
}

.projects-container {
  display: flex;
  flex-direction: column;
  gap: 50px;
}

.project {
  background-color: black;
  padding: 20px;
  border-radius: 10px;
}

.project h2 {
  margin-bottom: 8px;
}

.project p {
  margin-bottom: 10px;
  color: #ccc;
}

.media-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
}

.media {
  flex-shrink: 0;
  width: 60vw;
  height: 40vh;
  background-color: black;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
}

.media img, .media video {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 6px;
}

.media-number {
  margin-top: 8px;
  font-size: 1rem;
}

.nav-btn {
  background-color: rgba(255,255,255,0.2);
  border: none;
  color: white;
  font-size: 2rem;
  cursor: pointer;
  padding: 10px 15px;
  border-radius: 6px;
  transition: background 0.2s;
}

.nav-btn:hover {
  background-color: rgba(255,255,255,0.5);
}

.nav-btn:disabled {
  background-color: rgba(255,255,255,0.1);
  cursor: default;
}

/* רספונסיבי */
@media (max-width: 768px) {
  .media {
    width: 80vw;
    height: 30vh;
  }
}

@media (max-width: 480px) {
  .media {
    width: 90vw;
    height: 25vh;
  }
}
</style>
