export enum EndpointUri {
  AUTH = '/auth',
  REGISTER = AUTH + '/register',
  LOGIN = AUTH + '/login',
  REFRESH = AUTH + '/refresh',
  LOGOUT = AUTH + '/logout',
  ME = '/me',
  PROGRESS = ME + '/progress',
  GAME_RESULTS = ME + '/game-results',
  BEST_GAME_RESULTS = GAME_RESULTS + '/best',
  TEACHER_STUDENTS = '/teacher/students'
}
