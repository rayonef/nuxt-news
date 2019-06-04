import Cookie from 'js-cookie'

export const saveUserData = ({ idToken, expiresIn }, user) => {
  const tokenExpiration = Date.now() + expiresIn * 1000
  localStorage.setItem('jwt', idToken)
  localStorage.setItem('expiresIn', tokenExpiration)
  localStorage.setItem('user', JSON.stringify(user))
  Cookie.set('jwt', idToken)
  Cookie.set('expiresIn', expiresIn)
  Cookie.set('user', user.email)
  Cookie.set('avatar', user.avatar)
}

export const getUserFromCookie = (req) => {
  if (!req.headers.cookie) return

  const jwtCookie = req.headers.cookie.split(';').find(c => c.trim().startsWith('jwt'))
  const expiresInCookie = req.headers.cookie.split(';').find(c => c.trim().startsWith('expiresIn'))
  const userCookie = req.headers.cookie.split(';').find(c => c.trim().startsWith('user'))
  const avatarCookie = req.headers.cookie.split(';').find(c => c.trim().startsWith('avatar'))

  if (!jwtCookie || !expiresInCookie || !userCookie || !avatarCookie) return

  const jwt = jwtCookie.split('=')[1]
  const expiresIn = expiresInCookie.split('=')[1]
  const user = userCookie.split('=')[1]
  const avatar = avatarCookie.split('=')[1]

  return { jwt, expiresIn, user: { user, avatar } }
}

export const getUserFromLocalStorage = () => {
  if (localStorage) {
    const jwt = localStorage.getItem('jwt')
    const expiresIn = localStorage.getItem('expiresIn')
    const user = JSON.parse(localStorage.getItem('user'))

    return { jwt, expiresIn, user }
  }
}

export const clearUserData = () => {
  if (!process.server) {
    localStorage.removeItem('jwt')
    localStorage.removeItem('expiresIn')
    localStorage.removeItem('user')
  }
  Cookie.remove('jwt')
  Cookie.remove('expiresIn')
  Cookie.remove('user')
  Cookie.remove('avatar')
}
