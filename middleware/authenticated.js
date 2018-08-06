export default function ({
  store,
  error,
  redirect,
  route
}) {
  console.log('authenticated--token', store.state.token)
  if (!store.getters.isAuthenticated) {
    redirect(302, '/login', {
      redirect: route.fullPath
    })
  }
}
