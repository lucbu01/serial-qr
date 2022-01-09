export function mmToPx(value: number) {
  return value * 3.7795275591;
}

export function pxToMm(value: number) {
  return value * 0.2645833333;
}

export function mmToPt(value: number) {
  return value * 2.8346456693;
}

export function ptToMm(value: number) {
  return value * 0.3527777778;
}

export const A4 = { width: 210, height: 297 };

export const couvertFormats = {
  left: {
    width: 100,
    height: 45,
    bottom: 65,
    right: 109
  },
  right: {
    width: 100,
    height: 45,
    bottom: 65,
    right: 12
  },
  right_new: {
    width: 90,
    height: 40,
    bottom: 77,
    right: 17
  }
};
