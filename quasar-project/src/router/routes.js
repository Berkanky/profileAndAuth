
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/home', name:'home',component: () => import('pages/IndexPage.vue') },
      { path:'/login',name:'login',component:() => import('pages/login.vue')},
      { path:'/profile/:id',name:'profile',component:() => import('pages/profile.vue')},
      { path:'/resume/:id',name:'resume',component:() => import('pages/resume.vue')}
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
