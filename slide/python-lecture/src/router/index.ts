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
    path: Routes.LOGIN.path,
    name: Routes.LOGIN.name,
    component: () => import('@/views/auth/LoginView.vue'),
    meta: { title: Routes.LOGIN.title, public: true, layout: 'blank' }
  },
  {
    path: Routes.REGISTER.path,
    name: Routes.REGISTER.name,
    component: () => import('@/views/auth/RegisterView.vue'),
    meta: { title: Routes.REGISTER.title, public: true, layout: 'blank' }
  },
  {
    path: Routes.HISTORY.path,
    name: Routes.HISTORY.name,
    component: () => import('@/views/history/HistoryView.vue'),
    meta: { title: Routes.HISTORY.title, menuKey: Routes.HISTORY.menuKey }
  },
  {
    path: Routes.TEACHER.path,
    name: Routes.TEACHER.name,
    component: () => import('@/views/teacher/TeacherDashboardView.vue'),
    meta: { title: Routes.TEACHER.title, menuKey: Routes.TEACHER.menuKey, role: 'TEACHER' }
  },
  {
    path: Routes.TEACHER_STUDENT.path,
    name: Routes.TEACHER_STUDENT.name,
    component: () => import('@/views/teacher/TeacherStudentView.vue'),
    meta: {
      title: Routes.TEACHER_STUDENT.title,
      menuKey: Routes.TEACHER_STUDENT.menuKey,
      role: 'TEACHER'
    }
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

/** Every page needs an account except login and register; teacher pages need the TEACHER role. */
router.beforeEach(async (to) => {
  const auth = useAuthStore()
  await auth.restoreSession()

  if (to.meta.public) {
    return auth.isAuthenticated ? { name: Routes.HOME.name } : true
  }
  if (!auth.isAuthenticated) {
    return { name: Routes.LOGIN.name, query: { redirect: to.fullPath } }
  }
  if (to.meta.role && auth.user?.role !== to.meta.role) {
    return { name: Routes.HOME.name }
  }
  return true
})

export default router
