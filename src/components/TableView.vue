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
        <tr v-for="movie in movies" :key="movie.id">
          <td><img :src="movie.poster_url" :alt="movie.title"></td>
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