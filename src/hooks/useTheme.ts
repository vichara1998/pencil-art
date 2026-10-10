import {
  useEffect,
  useState,
} from 'react'

type Theme = 'light' | 'dark'

const THEME_STORAGE_KEY = 'grid-pencil-art:theme:v1'

function getInitialTheme(): Theme {
  try {
    const storedTheme =
      window.localStorage.getItem(
        THEME_STORAGE_KEY,
      )

    if (
      storedTheme === 'light' ||
      storedTheme === 'dark'
    ) {
      return storedTheme
    }

    if (
      window.matchMedia(
        '(prefers-color-scheme: dark)',
      ).matches
    ) {
      return 'dark'
    }
  } catch {
    return 'light'
  }

  return 'light'
}

export function useTheme() {
  const [theme, setTheme] =
    useState<Theme>(getInitialTheme)

  useEffect(() => {
    try {
      window.localStorage.setItem(
        THEME_STORAGE_KEY,
        theme,
      )
    } catch {
      return
    }
  }, [theme])

  return {
    theme,
    setTheme,
  }
}