export default function ({
  store,
  error
}) {
  if (!store.state.auth.token) {
    error({
      message: 'You are not connected',
      statusCode: 403
    })
  }
}
