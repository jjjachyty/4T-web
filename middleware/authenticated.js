export default function ({
  store,
  error,
  redirect,
  route
}) {
  if (!store.getters.isAuthenticated) {
    redirect(302, '/login', {redirect: route.fullPath})
  }
}
