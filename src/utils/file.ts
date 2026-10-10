import {
  SUPPORTED_IMAGE_EXTENSIONS,
  SUPPORTED_IMAGE_TYPES,
} from '../constants'

export function isSupportedImageFile(
  file: File,
): boolean {
  if (
    SUPPORTED_IMAGE_TYPES.includes(file.type)
  ) {
    return true
  }

  const fileName = file.name.toLowerCase()

  return SUPPORTED_IMAGE_EXTENSIONS.some(
    (extension) =>
      fileName.endsWith(extension),
  )
}