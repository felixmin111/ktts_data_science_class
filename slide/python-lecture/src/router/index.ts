import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import Routes from './uri.route'

const routes: RouteRecordRaw[] = [
  {
    path: Routes.HOME.path,
    name: Routes.HOME.name,
    component: () => import('@/views/home/HomeView.vue'),
    meta: { title: Routes.HOME.title, menuKey: Routes.HOME.menuKey }
  },
  {
    path: Routes.LESSON.path,
    name: Routes.LESSON.name,
    component: () => import('@/views/lesson/LessonView.vue'),
    meta: { title: Routes.LESSON.title, menuKey: Routes.LESSON.menuKey }
  },
  {
    path: Routes.GAMES.path,
    name: Routes.GAMES.name,
    component: () => import('@/views/games/GamesView.vue'),
    meta: { title: Routes.GAMES.title, menuKey: Routes.GAMES.menuKey }
  },
  {
    path: Routes.GAME_PLAY.path,
    name: Routes.GAME_PLAY.name,
    component: () => import('@/views/games/GamePlayView.vue'),
    meta: { title: Routes.GAME_PLAY.title, menuKey: Routes.GAME_PLAY.menuKey }
  },
  {
    path: Routes.PLAYGROUND.path,
    name: Routes.PLAYGROUND.name,
    component: () => import('@/views/playground/PlaygroundView.vue'),
    meta: { title: Routes.PLAYGROUND.title, menuKey: Routes.PLAYGROUND.menuKey }
  },
  {
    path: Routes.NOT_FOUND.path,
    name: Routes.NOT_FOUND.name,
    component: () => import('@/views/error/NotFoundView.vue'),
    meta: { title: Routes.NOT_FOUND.title }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: () => ({ top: 0 })
})

export default router
