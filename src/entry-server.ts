import createApp from './app'

export default function () {
  /*const { app, } = createApp(false)

  return {
    app,
  }*/

  createApp(false).then(({ app }) => {
    return app
  })
}
