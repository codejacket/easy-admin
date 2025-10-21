import { colord } from 'colord'

export function mixColor(...colors) {
  return colord(
    colors.reduce(
      (acc, color) => {
        let { r, g, b, a } = colord(color).toRgb()
        acc.r += acc.a * a * r
        acc.g += acc.a * a * g
        acc.b += acc.a * a * b
        acc.a *= 1 - a
        return acc
      },
      {
        r: 0,
        g: 0,
        b: 0,
        a: 1,
      },
    ),
  ).alpha(1)
}

export function fade(color, opacity) {
  return colord(color).alpha(opacity).toHex()
}

export function invert(color) {
  return colord(color).invert().toHex()
}

export { colord }
