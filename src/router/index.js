import Vue from 'vue'
import Router from 'vue-router'
import imp from '@/components/Import'
import ProjectInfo from '@/components/ProjectInfo'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/imp'
    },
    {
      path: '/imp',
      name: 'imp',
      component: imp,
    },
    {
      path: '/ProjectInfo',
      component: ProjectInfo
    }

  ]
})
