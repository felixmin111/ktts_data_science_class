export const MenuKeys = {
  HOME: 'home',
  LESSON: 'lesson',
  GAMES: 'games',
  PLAYGROUND: 'playground',
  HISTORY: 'history',
  TEACHER: 'teacher'
} as const

const Routes = {
  HOME: { path: '/', name: 'home', title: 'nav.home', menuKey: MenuKeys.HOME },
  LESSON: {
    path: '/lessons/:lessonId/:sectionId?',
    name: 'lesson',
    title: 'nav.lesson',
    menuKey: MenuKeys.LESSON
  },
  GAMES: { path: '/games', name: 'games', title: 'nav.games', menuKey: MenuKeys.GAMES },
  GAME_PLAY: {
    path: '/games/:gameId',
    name: 'game-play',
    title: 'nav.games',
    menuKey: MenuKeys.GAMES
  },
  PLAYGROUND: {
    path: '/playground',
    name: 'playground',
    title: 'nav.playground',
    menuKey: MenuKeys.PLAYGROUND
  },
  LOGIN: { path: '/login', name: 'login', title: 'auth.login.title' },
  REGISTER: { path: '/register', name: 'register', title: 'auth.register.title' },
  HISTORY: {
    path: '/history',
    name: 'history',
    title: 'history.title',
    menuKey: MenuKeys.HISTORY
  },
  TEACHER: {
    path: '/teacher',
    name: 'teacher',
    title: 'teacher.title',
    menuKey: MenuKeys.TEACHER
  },
  TEACHER_STUDENT: {
    path: '/teacher/students/:studentId',
    name: 'teacher-student',
    title: 'teacher.title',
    menuKey: MenuKeys.TEACHER
  },
  NOT_FOUND: { path: '/:pathMatch(.*)*', name: 'not-found', title: 'notFound.title' }
} as const

export default Routes
