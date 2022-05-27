import createApp from './app'

//const { app, router } = createApp()

createApp(true).then(({ app, router }) => {
  router.isReady().then(() => {
    app.mount('#app')
  })
})