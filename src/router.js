import Vue from 'vue'
import Router from 'vue-router'
import Movies from './modules/movies/Movies.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Movies,
    },
  ]
})
