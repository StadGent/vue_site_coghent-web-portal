import createApp from './app'

//const { app, router } = createApp()

createApp().then(({ app, router }) => {
  router.isReady().then(() => {
    app.mount('#app')
  })
})