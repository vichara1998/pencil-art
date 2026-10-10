import {
  useCallback,
  useState,
} from 'react'

import {
  DEFAULT_PANEL_VISIBILITY,
} from '../constants'

export function usePanelVisibility() {
  const [
    panels,
    setPanels,
  ] = useState(
    DEFAULT_PANEL_VISIBILITY,
  )

  const toggleLeftPanel =
    useCallback(() => {
      setPanels((current) => ({
        ...current,
        left: !current.left,
      }))
    }, [])

  const toggleRightPanel =
    useCallback(() => {
      setPanels((current) => ({
        ...current,
        right: !current.right,
      }))
    }, [])

  const showLeftPanel =
    useCallback(() => {
      setPanels((current) => ({
        ...current,
        left: true,
      }))
    }, [])

  const hideLeftPanel =
    useCallback(() => {
      setPanels((current) => ({
        ...current,
        left: false,
      }))
    }, [])

  const showRightPanel =
    useCallback(() => {
      setPanels((current) => ({
        ...current,
        right: true,
      }))
    }, [])

  const hideRightPanel =
    useCallback(() => {
      setPanels((current) => ({
        ...current,
        right: false,
      }))
    }, [])

  return {
    panels,

    toggleLeftPanel,
    toggleRightPanel,

    showLeftPanel,
    hideLeftPanel,

    showRightPanel,
    hideRightPanel,
  }
}