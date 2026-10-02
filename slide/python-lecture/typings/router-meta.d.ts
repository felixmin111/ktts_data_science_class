import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    menuKey?: string
    /** Reachable without signing in (login, register). */
    public?: boolean
    /** Only users with this role may open the route. */
    role?: 'TEACHER'
    layout?: 'blank'
  }
}
