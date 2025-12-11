<template>
  <div class="infinite-scroll-view">
    <div class="movie-grid">
      <div v-for="movie in movies" :key="movie.id" class="movie-card">
        <img :src="movie.poster_url" :alt="movie.title">
        <h3>{{ movie.title }}</h3>
      </div>
    </div>
    <div v-if="loading" class="loading">
      Loading...
    </div>
  </div>
</template>

<script>
export default {
  props: ['movies'],
  data() {
    return {
      loading: false
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll)
  },
  methods: {
    handleScroll() {
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 100) {
        this.$emit('load-more')
      }
    }
  }
}
</script>