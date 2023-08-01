import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export function useScrollTop() {
  const exclusionPathes = ['/market/efts', '/profile', '/market/collections']
  const { pathname } = useLocation()

  useEffect(() => {
    if (exclusionPathes.find(item => pathname.includes(item))) return
    window.scrollTo(0, 0)
  }, [pathname])
}
