import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'

import type {
  ChangeEvent,
  DragEvent,
} from 'react'

import {
  isSupportedImageFile,
} from '../utils'

import {
  clearSavedSourceImage,
  getSavedSourceImage,
  saveSourceImage,
} from '../utils/imagePersistence'

export function useImageUpload() {
  const [
    image,
    setImage,
  ] = useState<HTMLImageElement | null>(
    null,
  )

  const [
    error,
    setError,
  ] = useState('')

  const [
    isDragging,
    setIsDragging,
  ] = useState(false)

  const fileInputRef =
    useRef<HTMLInputElement>(null)

  const loadRequestRef =
    useRef(0)

  const loadFile = useCallback(
    (file: File) => {
      setError('')

      if (
        !isSupportedImageFile(file)
      ) {
        setError(
          'Unsupported image format. Please use PNG, JPG, WEBP, BMP, or GIF.',
        )
        return
      }

      const loadRequest =
        ++loadRequestRef.current

      void saveSourceImage(file).catch(() => {
        if (
          loadRequest ===
          loadRequestRef.current
        ) {
          setError(
            'The image loaded, but could not be saved for restoring after refresh.',
          )
        }
      })

      const objectUrl =
        URL.createObjectURL(file)

      const nextImage =
        new Image()

      nextImage.onload = () => {
        URL.revokeObjectURL(
          objectUrl,
        )

        if (
          loadRequest ===
          loadRequestRef.current
        ) {
          setImage(nextImage)
        }
      }

      nextImage.onerror = () => {
        URL.revokeObjectURL(
          objectUrl,
        )

        if (
          loadRequest ===
          loadRequestRef.current
        ) {
          setError(
            'Unable to load the selected image.',
          )
        }
      }

      nextImage.src = objectUrl
    },
    [],
  )

  useEffect(() => {
    let isActive = true

    void getSavedSourceImage()
      .then((file) => {
        if (isActive && file) {
          loadFile(file)
        }
      })
      .catch(() => {})

    return () => {
      isActive = false
    }
  }, [loadFile])

  const openFilePicker =
    useCallback(() => {
      fileInputRef.current?.click()
    }, [])

  const handleFileChange =
    useCallback(
      (
        event: ChangeEvent<HTMLInputElement>,
      ) => {
        const file =
          event.target.files?.[0]

        if (file) {
          loadFile(file)
        }

        event.target.value = ''
      },
      [loadFile],
    )

  const handleDragEnter =
    useCallback(
      (event: DragEvent) => {
        event.preventDefault()
        event.stopPropagation()

        setIsDragging(true)
      },
      [],
    )

  const handleDragLeave =
    useCallback(
      (event: DragEvent) => {
        event.preventDefault()
        event.stopPropagation()

        if (
          event.currentTarget.contains(
            event.relatedTarget as Node | null,
          )
        ) {
          return
        }

        setIsDragging(false)
      },
      [],
    )

  const handleDragOver =
    useCallback(
      (event: DragEvent) => {
        event.preventDefault()
        event.stopPropagation()

        event.dataTransfer.dropEffect =
          'copy'

        setIsDragging(true)
      },
      [],
    )

  const handleDrop =
    useCallback(
      (event: DragEvent) => {
        event.preventDefault()
        event.stopPropagation()

        setIsDragging(false)

        const file =
          event.dataTransfer.files?.[0]

        if (file) {
          loadFile(file)
        }
      },
      [loadFile],
    )

  const clearImage =
    useCallback(() => {
      loadRequestRef.current++
      setImage(null)
      setError('')

      void clearSavedSourceImage().catch(
        () => {},
      )
    }, [])

  return {
    image,
    error,
    isDragging,

    fileInputRef,

    loadFile,
    openFilePicker,
    handleFileChange,

    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,

    clearImage,
  }
}