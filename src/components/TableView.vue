<template>
  <div class="table-view">
    <table>
      <thead>
        <tr>
          <th>포스터</th>
          <th>제목</th>
          <th>평점</th>
          <th>개봉일</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="movie in movies"
          :key="movie.id"
          @click="handleSelect(movie.id)"
          class="clickable-row"
        >
          <td>
            <img
              :src="getPosterUrl(movie.poster_path)"
              :alt="movie.title"
            />
          </td>
          <td>{{ movie.title }}</td>
          <td>{{ movie.vote_average }}</td>
          <td>{{ movie.release_date }}</td>
        </tr>
      </tbody>
    </table>

    <div class="pagination">
      <button @click="prevPage" :disabled="currentPage === 1">이전</button>
      <span>{{ currentPage }}</span>
      <button @click="nextPage">다음</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TableView',
  props: {
    movies: {
      type: Array,
      required: true,
    },
    currentPage: {
      type: Number,
      required: true,
    },
  },
  emits: ['prev', 'next', 'select'],
  methods: {
    getPosterUrl(posterPath) {
      if (!posterPath) return ''
      // 테이블이라 리스트보다 작은 이미지 사용
      return `https://image.tmdb.org/t/p/w185${posterPath}`
    },
    prevPage() {
      this.$emit('prev')
    },
    nextPage() {
      this.$emit('next')
    },
    handleSelect(id) {
      this.$emit('select', id)
    },
  },
}
</script>

<style scoped>
.table-view {
  width: 100%;
  padding: 20px;
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  color: white;
}

th,
td {
  padding: 10px;
  border-bottom: 1px solid #444;
  text-align: left;
}

img {
  width: 60px;
  border-radius: 4px;
}

.clickable-row {
  cursor: pointer;
}

.clickable-row:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

.pagination {
  margin-top: 16px;
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
}

button {
  background-color: #0066ff;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  background-color: #555;
  cursor: not-allowed;
}
</style>
