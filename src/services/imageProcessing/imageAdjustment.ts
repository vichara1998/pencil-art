import { clamp } from '../../utils/math'

export function adjustImage(
  source: ImageData,
  brightness: number,
  contrast: number,
): ImageData {
  const output = new ImageData(
    source.width,
    source.height,
  )

  const brightnessOffset =
    brightness * 2.55

  const contrastFactor =
    (259 * (contrast + 255)) /
    (255 * (259 - contrast))

  for (
    let index = 0;
    index < source.data.length;
    index += 4
  ) {
    const red = source.data[index]
    const green = source.data[index + 1]
    const blue = source.data[index + 2]

    output.data[index] = clamp(
      contrastFactor *
          (red + brightnessOffset - 128) +
        128,
      0,
      255,
    )

    output.data[index + 1] = clamp(
      contrastFactor *
          (green + brightnessOffset - 128) +
        128,
      0,
      255,
    )

    output.data[index + 2] = clamp(
      contrastFactor *
          (blue + brightnessOffset - 128) +
        128,
      0,
      255,
    )

    output.data[index + 3] =
      source.data[index + 3]
  }

  return output
}