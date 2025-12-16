import { createRouter, createWebHistory } from 'vue-router'
import MovieList from '@/components/MovieList.vue'
import MovieDetail from '@/views/MovieDetail.vue'
import SearchPage from '@/views/SearchPage.vue'
import SignInPage from '@/views/SignIn.vue'
import HomeView from '@/views/HomeView.vue'
import WishlistPage from '@/views/WishlistPage.vue'
import PopularPage from '../views/PopularPage.vue'

const routes = [
  {
    path: '/',
    redirect: '/signin'
  },
  {
    path: '/signin',
    name: 'SignIn',
    component: SignInPage
  },
  { 
    path: '/home',
    name: 'Home',
    component: HomeView,
    meta: { requiresAuth: true }
  },
  {
    path: '/movie/:id',
    name: 'MovieDetail',
    component: MovieDetail
  },
  {
    path: '/search',
    name: 'Search',
    component: SearchPage
  },
  {
    path: '/popular',
    name: 'Popular',
    component: PopularPage
  },
  {
    path: '/wishlist',
    name: 'Wishlist',
    component: WishlistPage
  }
]

const router = createRouter({
  history: createWebHistory('/movielist.github.io/'),
  routes
})

router.beforeEach((to, from, next) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn')
  // /signin 가고 있으면 무조건 통과
  if (to.path === '/signin') {
    next()
  } 
  // 다른 페이지인데 로그아웃이면 /signin으로
  else if (!isLoggedIn) {
    next('/signin')
  } 
  // 로그인 상태면 정상 이동
  else {
    next()
  }
})

export default router