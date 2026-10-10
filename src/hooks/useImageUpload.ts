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

  const [
    uploadProgress,
    setUploadProgress,
  ] = useState<{
    phase: 'reading' | 'decoding'
    progress: number
  } | null>(null)

  const fileInputRef =
    useRef<HTMLInputElement>(null)

  const loadRequestRef =
    useRef(0)

  const fileReaderRef =
    useRef<FileReader | null>(null)

  const loadFile = useCallback(
    (file: File) => {
      setError('')

      fileReaderRef.current?.abort()

      const loadRequest =
        ++loadRequestRef.current

      if (
        !isSupportedImageFile(file)
      ) {
        setUploadProgress(null)
        setError(
          'Unsupported image format. Please use PNG, JPG, WEBP, BMP, or GIF.',
        )
        return
      }

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

      setUploadProgress({
        phase: 'reading',
        progress: 0,
      })

      const reader = new FileReader()
      fileReaderRef.current = reader

      reader.onprogress = (event) => {
        if (
          loadRequest === loadRequestRef.current &&
          event.lengthComputable
        ) {
          setUploadProgress({
            phase: 'reading',
            progress: Math.round(
              (event.loaded / event.total) * 95,
            ),
          })
        }
      }

      reader.onerror = () => {
        if (loadRequest === loadRequestRef.current) {
          setUploadProgress(null)
          setError('Unable to read the selected image.')
        }
      }

      reader.onabort = () => {
        if (loadRequest === loadRequestRef.current) {
          setUploadProgress(null)
        }
      }

      reader.onload = () => {
        if (
          loadRequest !== loadRequestRef.current ||
          !(reader.result instanceof ArrayBuffer)
        ) {
          return
        }

        setUploadProgress({
          phase: 'decoding',
          progress: 95,
        })

        const objectUrl = URL.createObjectURL(
          new Blob([reader.result], { type: file.type }),
        )
        const nextImage = new Image()

        nextImage.onload = () => {
          URL.revokeObjectURL(objectUrl)

          if (loadRequest === loadRequestRef.current) {
            setImage(nextImage)
            setUploadProgress(null)
          }
        }

        nextImage.onerror = () => {
          URL.revokeObjectURL(objectUrl)

          if (loadRequest === loadRequestRef.current) {
            setUploadProgress(null)
            setError('Unable to load the selected image.')
          }
        }

        nextImage.src = objectUrl
      }

      reader.readAsArrayBuffer(file)
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
      loadRequestRef.current++
      fileReaderRef.current?.abort()
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
      fileReaderRef.current?.abort()
      fileReaderRef.current = null
      setImage(null)
      setError('')
      setUploadProgress(null)

      void clearSavedSourceImage().catch(
        () => {},
      )
    }, [])

  return {
    image,
    error,
    isDragging,
    uploadProgress,

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