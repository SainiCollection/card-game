type ResizeProps =
  | {
    originalWidth: number;
    originalHeight: number;
    targetWidth: number;
    targetHeight?: never;
  }
  | {
    originalWidth: number;
    originalHeight: number;
    targetWidth?: never;
    targetHeight: number;
  };

export function resizeWithAspectRatio({
  originalWidth,
  originalHeight,
  targetWidth,
  targetHeight,
}: ResizeProps): { width: number; height: number } {
  if (targetWidth !== undefined) {
    return {
      width: targetWidth,
      height: (originalHeight * targetWidth) / originalWidth,
    };
  } else {
    return {
      width: (originalWidth * targetHeight) / originalHeight,
      height: targetHeight,
    };
  }
}
