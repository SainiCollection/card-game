import {
  CardDropProps,
  cardNameType,
  cardGroupDataType,
  CardLayoutProps,
  HoveredGroupType,
} from "../ui-components/Card/cad";

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


// find closest method for card drag and drop
export const findClosestCard = (
  draggedCard: CardDropProps,
  cardGroups: cardGroupDataType[],
  initialCardPositions: React.MutableRefObject<{
    [key: string]: CardLayoutProps;
  }>
): {
  newCardGroupIndex: number;
  newCardIndex: number;
  prevCardIndex: number;
  prevCardGroup: number;
  cardName: string;
} | null => {
  const { name, cardIndex, groupIndex, position } = draggedCard;

  const sourceRow = cardGroups[groupIndex];
  const draggedCardIndex = sourceRow.findIndex((c) => c.name === name);
  if (draggedCardIndex === -1) return null;

  let closestGroupIndex: number | null = null;
  let closestCardIndex: number | null = null;
  let closestDistance = Infinity;

  const draggedCenterX = position.x;
  const draggedCenterY = position.y;

  cardGroups.forEach((group, gIndex) => {
    group.forEach((card, cIndex) => {
      const key = `${gIndex}-${cIndex}`;
      const layout = initialCardPositions.current[key];
      if (!layout) return;

      // Skip self
      if (gIndex === groupIndex && cIndex === cardIndex) return;

      const { x, y, width, height } = layout;
      const centerX = x + width / 2;
      const centerY = y + height / 2;

      const isInsideX = draggedCenterX >= x && draggedCenterX <= x + width;
      const isInsideY = draggedCenterY >= y && draggedCenterY <= y + height;

      const isBeforeFirst =
        cIndex === 0 &&
        draggedCenterX >= x - width / 1.3 && draggedCenterX < x &&
        draggedCenterY >= y && draggedCenterY <= y + height;

      if ((isInsideX && isInsideY) || isBeforeFirst) {
        const dx = draggedCenterX - centerX;
        const dy = draggedCenterY - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestGroupIndex = gIndex;
          closestCardIndex = cIndex;
        }
      }
    });
  });

  if (
    closestGroupIndex === null ||
    closestCardIndex === null ||
    !initialCardPositions.current[`${closestGroupIndex}-${closestCardIndex}`]
  ) {
    console.log("❌ No valid drop target: not over a card or pre-card zone");
    return null;
  }

  return {
    newCardGroupIndex: closestGroupIndex,
    newCardIndex: closestCardIndex,
    prevCardIndex: cardIndex,
    prevCardGroup: groupIndex,
    cardName: name,
  };
};
