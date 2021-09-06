import createApp from './app'

export default function () {
  /*const { app, } = createApp(false)

  return {
    app,
  }*/

  createApp().then(({ app }) => {
    return app
  })
}
