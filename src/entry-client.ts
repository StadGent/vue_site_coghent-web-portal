import createApp from './app'

//const { app, router } = createApp()

createApp(false).then(({ app, router }) => {
  router.isReady().then(() => {
    app.mount('#app')
  })
})