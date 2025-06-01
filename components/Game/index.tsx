import React, { useRef, useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import Card from "./ui-components/Card";
import {
  cardDataType,
  CardDropProps,
  cardGroupDataType,
  CardProps,
} from "./ui-components/Card/cad";
import CardGroup from "./ui-components/CardGroup";
import { findClosestCard } from "./utils/basic";

type CardRow = CardProps[];
export type cardGroup = CardRow[];

function Game({ cardsData }: { cardsData: cardDataType }): React.JSX.Element {
  // Store initial positions
  const initialCardPositions = useRef<{
    [key: string]: { x: number; y: number; width: number; height: number };
  }>({});

  const [cardGroups, setCardGroups] = useState<cardDataType>([...cardsData, [{name: "back"}]]);

  const handleRender = ({
    name,
    cardIndex,
    groupIndex,
    layout,
  }: {
    name: string;
    cardIndex: number;
    groupIndex: number;
    layout: { x: number; y: number; width: number; height: number };
  }) => {
    const key = `${groupIndex}-${cardIndex}`;
    initialCardPositions.current[key] = layout;
    console.log(`Card Rendered: ${name} at x: ${layout.x}`);
  };

  const handleDrop = (dragedCard: CardDropProps) => {
    findClosestCard(dragedCard); // in progress

    const { name, cardIndex, groupIndex, position } = dragedCard;
    const sourceGroupIndex = groupIndex;

    const sourceRow = [...cardGroups[sourceGroupIndex]];
    const draggedCardIndex = sourceRow.findIndex((c) => c.name === name);
    if (draggedCardIndex === -1) return;

    const draggedCard = sourceRow[draggedCardIndex];

    let closestGroupIndex: number | null = null;
    let closestCardIndex: number | null = null;
    let closestDistance = Infinity;

    cardGroups.forEach((group, gIndex) => {
      group.forEach((card, cIndex) => {
        const key = `${gIndex}-${cIndex}`;
        const layout = initialCardPositions.current[key];
        if (!layout) return;

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
      return;
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

    if (!layout) return;

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

    setCardGroups(newCardGroup);
  };

  return (
    <View>
      <View>
        <Text style={{ textAlign: "center", marginVertical: 20 }}>
          MetaData
        </Text>
      </View>
      <View style={styles.cardGroupContainer}>
        {cardGroups.map((row: cardGroupDataType, rowIndex) => (
          <CardGroup
            key={rowIndex}
            groupIndex={rowIndex}
            cards={row}
            onCardRender={handleRender}
            onCardDrop={handleDrop}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardGroupContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 40,
  },
});

export default Game;
