import React, { useEffect, useRef, useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import Card from "./ui-components/Card";
import {
  cardDataType,
  CardDropProps,
  CardMoveProps,
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

  const [cardGroups, setCardGroups] = useState<cardDataType>([
    ...cardsData,
    [{ name: "back" }],
  ]);
  const [movingCardKey, setMovingCardKey] = useState<CardMoveProps | null>(
    null
  );

  // handle card render----------------------------------------------------
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
  };

  // handle card drop----------------------------------------------------
  const handleDrop = (dragedCard: CardDropProps) => {
    const cardKey = `${dragedCard.groupIndex}-${dragedCard.cardIndex}`;
    const cardLayout = initialCardPositions.current[cardKey];
    if (cardLayout) {
      const result = findClosestCard(
        dragedCard,
        cardGroups,
        // cardLayout,
        initialCardPositions
      ); // in progress
      if (result) {
        const { newCardGroup, closestGroupIndex, closestCardIndex } = result;
        setCardGroups(newCardGroup);
        if (newCardGroup) {
          console.log("Card group ------->:", newCardGroup, closestGroupIndex,closestCardIndex);
        }
      }
    }

    // setMovingCardKey(null);
  };

  // handle card move----------------------------------------------------
  const handleMove = (movingCard: CardMoveProps) => {
    // const cardKey = `${movingCard.groupIndex}-${movingCard.cardIndex}`;
    // const cardLayout = initialCardPositions.current[cardKey];
    // const positions = { x: cardLayout.x, y: cardLayout.y };
    // const result = findClosestCard(
    //   movingCard,
    //   cardGroups,
    //   // positions,
    //   initialCardPositions
    // );
    // if (result) {
    //   const { newCardGroup, closestGroupIndex, closestCardIndex } = result;
    //   console.log("Currently hover group:", newCardGroup, closestGroupIndex, closestCardIndex);
    // } else {
    //   console.log("Currently not over any card.");
    // }
    // setMovingCardKey(movingCard);
  };

  return (
    <View>
      <View>
        <Text style={{ textAlign: "center", marginVertical: 20 }}>
          MetaData: {JSON.stringify(movingCardKey)}
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
            onCardMove={handleMove}
            movingCard={movingCardKey}
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
    backgroundColor: "#f0f0f0",
  },
});

export default Game;
