<template>
  <section class="videos" v-if="filteredProjects.length > 0">
    <h1>עבודות וידאו</h1>
    <div class="projects-container">
      <div
        class="project"
        v-for="project in filteredProjects"
        :key="project.metadata.title"
      >
        <h2>{{ project.metadata.title }} ({{ project.metadata.year }})</h2>
        <p>{{ project.metadata.description }}</p>
        <p>
          <strong>Medium:</strong> {{ project.metadata.medium }} |
          <strong>Duration:</strong> {{ project.metadata.duration }}
        </p>

        <div class="media-wrapper" v-if="project.media.length > 0">
          <button
            @click="prevMedia(project)"
            :disabled="project.currentIndex === 0"
            class="nav-btn"
          >
            &#8592;
          </button>

          <div class="media">
            <!-- YouTube embed -->
            <iframe
              v-if="project.media[project.currentIndex].type === 'youtube'"
              :src="'https://www.youtube.com/embed/' + project.media[project.currentIndex].src"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            ></iframe>

            <!-- Image -->
            <img
              v-else-if="project.media[project.currentIndex].type === 'image'"
              :src="project.media[project.currentIndex].src"
            />

            <p class="media-number">
              {{ project.currentIndex + 1 }} / {{ project.media.length }}
            </p>
          </div>

          <button
            @click="nextMedia(project)"
            :disabled="project.currentIndex === project.media.length - 1"
            class="nav-btn"
          >
            &#8594;
          </button>
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
      projects: [],
    };
  },
  computed: {
    // ✅ מסנן פרויקטים שיש להם מדיה
    filteredProjects() {
      return this.projects.filter(
        project => project && project.media && project.media.length > 0
      );
    }
  },
  async created() {
    const metadataModules = import.meta.glob(
      '../assets/videos/*/metadata.json',
      { eager: true, import: 'default' }
    );

    const projectsMap = {};

    for (const path in metadataModules) {
      const match = path.match(/videos\/([^\/]+)\/metadata\.json$/);
      if (!match) continue;
      const folder = match[1];
      const metadata = metadataModules[path];

      const media = [];

      // YouTube videos
      if (metadata.youtube && Array.isArray(metadata.youtube)) {
        metadata.youtube.forEach((id) => {
          media.push({ type: 'youtube', src: id });
        });
      }

      // Images
      if (metadata.images && Array.isArray(metadata.images)) {
        metadata.images.forEach((img) => {
          media.push({ type: 'image', src: img });
        });
      }

      projectsMap[folder] = { metadata, media, currentIndex: 0 };
    }

    this.projects = Object.values(projectsMap);
  },
  methods: {
    nextMedia(project) {
      if (project.currentIndex < project.media.length - 1) project.currentIndex++;
    },
    prevMedia(project) {
      if (project.currentIndex > 0) project.currentIndex--;
    },
  },
};
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
  height: auto;
  background-color: black;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
}

.media img,
.media iframe {
  max-width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 6px;
}

.media-number {
  margin-top: 8px;
  font-size: 1rem;
}

.nav-btn {
  background-color: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  font-size: 2rem;
  cursor: pointer;
  padding: 10px 15px;
  border-radius: 6px;
  transition: background 0.2s;
}

.nav-btn:hover {
  background-color: rgba(255, 255, 255, 0.5);
}

.nav-btn:disabled {
  background-color: rgba(255, 255, 255, 0.1);
  cursor: default;
}

/* רספונסיבי */
@media (max-width: 768px) {
  .media {
    width: 80vw;
  }
}

@media (max-width: 480px) {
  .media {
    width: 90vw;
  }
}
</style>
