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

export const findClosestCard = (
  dragedCard: CardDropProps,
  cardGroups: cardGroupDataType[],
  // positions: { x: number; y: number },
  initialCardPositions: React.MutableRefObject<{
    [key: string]: CardLayoutProps;
  }>
): HoveredGroupType | null => {
  const { name, cardIndex, groupIndex, position } = dragedCard;
  const sourceGroupIndex = groupIndex;

  const sourceRow = [...cardGroups[sourceGroupIndex]];
  const draggedCardIndex = sourceRow.findIndex((c) => c.name === name);
  if (draggedCardIndex === -1) return null;

  const draggedCard = sourceRow[draggedCardIndex];

  let closestGroupIndex: number | null = null;
  let closestCardIndex: number | null = null;
  let closestDistance = Infinity;

  cardGroups.forEach((group, gIndex) => {
    group.forEach((card, cIndex) => {
      const key = `${gIndex}-${cIndex}`;
      const layout = initialCardPositions.current[key];
      if (!layout) return null;

      // Skip the dragged card itself
      if (gIndex === groupIndex && cIndex === cardIndex) return;

      const centerX = layout.x + layout.width / 2;
      const dx = Math.abs(position.x - centerX);

      if (dx < closestDistance) {
        closestDistance = dx;
        closestGroupIndex = gIndex;
        closestCardIndex = cIndex;
      }
    });
  });

  if (closestGroupIndex === null || closestCardIndex === null) {
    console.log("❌ No valid drop target found.");
    return null;
  }

  const newCardGroup = [...cardGroups];

  // Remove dragged card from source
  newCardGroup[sourceGroupIndex] = newCardGroup[sourceGroupIndex].filter(
    (c) => c.name !== name
  );

  // Insert into target group
  const targetRow = [...newCardGroup[closestGroupIndex]];
  const layout =
    initialCardPositions.current[`${closestGroupIndex}-${closestCardIndex}`];

  if (!layout) return null;

  let insertAt = closestCardIndex + 1;

  if (closestCardIndex === 0 && position.x < layout.x) {
    insertAt = 0;
  }

  // Adjust index if moving within the same group and forward
  if (sourceGroupIndex === closestGroupIndex && draggedCardIndex < insertAt) {
    insertAt -= 1;
  }

  targetRow.splice(insertAt, 0, draggedCard);
  newCardGroup[closestGroupIndex] = targetRow;

  return {newCardGroup, closestGroupIndex, closestCardIndex};
};
