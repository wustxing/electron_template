import { createApp, toRaw } from 'vue'


export default (App, { router } = {}) => {
  const app = createApp(App)

  if (router) {
    app.use(router)
  }


  app.config.globalProperties.$electron = window.electron

  app.config.globalProperties.$toRaw = toRaw

  app.mount('#app').$nextTick(() => {
    // Remove Preload scripts loading
    // postMessage({ payload: 'removeLoading' }, '*')
  })

  return app
}
