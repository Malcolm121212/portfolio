<template>
  <section class="videos">
    <h1>עבודות וידאו</h1>

    <!-- מצב טעינה -->
    <p v-if="!isReady" class="loading">
      טוען עבודות…
    </p>

    <!-- תוכן -->
    <div v-else class="projects-container">
      <div
        class="project"
        v-for="project in projects"
        :key="project.title"
      >
        <h2>{{ project.title }} ({{ project.year }})</h2>
        <p>{{ project.description }}</p>
        <p class="meta">
          <strong>Medium:</strong> {{ project.medium }} |
          <strong>Duration:</strong> {{ project.duration }}
        </p>

        <div class="media-wrapper">
          <button
            class="nav-btn"
            @click="prevMedia(project)"
            :disabled="project.currentIndex === 0"
          >
            ←
          </button>

          <div class="media">
            <!-- YouTube -->
            <iframe
              v-if="project.media[project.currentIndex].type === 'youtube'"
              :src="youtubeEmbed(project.media[project.currentIndex].src)"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            ></iframe>

            <!-- Image -->
            <img
              v-else
              :src="project.media[project.currentIndex].src"
              alt=""
            />

            <p class="media-number">
              {{ project.currentIndex + 1 }} / {{ project.media.length }}
            </p>
          </div>

          <button
            class="nav-btn"
            @click="nextMedia(project)"
            :disabled="project.currentIndex === project.media.length - 1"
          >
            →
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
      isReady: false
    }
  },

  mounted() {
    // 🔹 כאן את רק מכניסה YouTube IDs ו/או תמונות
    this.projects = [
      {
        title: 'Project One',
        year: 2024,
        description: 'עבודת וידאו עם דימויים נלווים',
        medium: 'Video',
        duration: '2:30',
        currentIndex: 0,
        media: [
          { type: 'youtube', src: 'YPUSBxx99fMg' },
           { type: 'youtube', src: 'QGGJGJLl5As' }
         // { type: 'image', src: '/images/project1-1.jpg' }
        ]
      },
      // {
      //   title: 'Project Two',
      //   year: 2023,
      //   description: 'עבודת וידאו',
      //   medium: 'Video',
      //   duration: '1:40',
      //   currentIndex: 0,
      //   media: [
      //     { type: 'youtube', src: 'YOUTUBE_ID_2' }
      //   ]
      // }
    ]

    // ✅ מרנדרים רק אחרי שהנתונים קיימים
    this.isReady = true
  },

  methods: {
    nextMedia(project) {
      if (project.currentIndex < project.media.length - 1) {
        project.currentIndex++
      }
    },
    prevMedia(project) {
      if (project.currentIndex > 0) {
        project.currentIndex--
      }
    },
    youtubeEmbed(id) {
      return `https://www.youtube.com/embed/${id}`
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

.loading {
  text-align: center;
  color: #aaa;
}

.projects-container {
  display: flex;
  flex-direction: column;
  gap: 50px;
}

.project {
  background-color: black;
  padding: 20px;
  border-radius: 12px;
}

.meta {
  color: #ccc;
  margin-bottom: 15px;
}

.media-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.media {
  width: 60vw;
  max-width: 900px;
  aspect-ratio: 16 / 9;
  background: black;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.media iframe,
.media img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 8px;
}

.media-number {
  margin-top: 8px;
  font-size: 0.9rem;
  color: #ccc;
}

.nav-btn {
  background-color: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  font-size: 2rem;
  cursor: pointer;
  padding: 10px 14px;
  border-radius: 8px;
}

.nav-btn:disabled {
  opacity: 0.3;
  cursor: default;
}

/* 📱 מובייל */
@media (max-width: 768px) {
  .media {
    width: 90vw;
  }

  .nav-btn {
    font-size: 1.6rem;
    padding: 8px 10px;
  }
}
</style>
