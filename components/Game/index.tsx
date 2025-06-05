import React, { useEffect, useRef, useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import Card from "./ui-components/Card";
import {
  cardDataType,
  CardDropProps,
  CardMoveProps,
  cardGroupDataType,
  CardProps,
  cardNameType,
} from "./ui-components/Card/cad";
import CardGroup from "./ui-components/CardGroup";
import { findClosestCard } from "./utils/basic";

type CardRow = CardProps[];
export type cardGroup = CardRow[];

function Game({ cardsData }: { cardsData: cardDataType }): React.JSX.Element {

  // Individual card ref------------------------
  const originalCardRef = useRef<{
    name: cardNameType;
    groupIndex: number;
    cardIndex: number;
  } | null>(null);

  // handle drag start---------------------------
  const handleCardStart = (card: {
    name: cardNameType;
    cardIndex: number;
    groupIndex: number;
  }) => {
    originalCardRef.current = card;
    console.log("Card drag started:", card);
    console.log("current Card drag started reference:", originalCardRef.current);
  };

  // Store initial positions
  const initialCardPositions = useRef<{
    [key: string]: { x: number; y: number; width: number; height: number };
  }>({});


  const [cardGroups, setCardGroups] = useState<cardDataType>([
    ...cardsData,
    [{ name: "back" }],
  ]);
  const [groupVersion, setGroupVersion] = useState(0);
  const updateGroups = (updatedGroups: cardDataType) => {
    setCardGroups(updatedGroups);
    setGroupVersion((v) => v + 1); // Increment to signal rerender
  };

  // Reset initial positions on cardGroups change
  useEffect(() => {
    // force all cards to re-measure their positions
    setTimeout(() => {
      initialCardPositions.current = {}; // clear old layout
      console.log("Card positions reset due to cardGroups change.", initialCardPositions.current);
    }, 0);
  }, [cardGroups]);

  const [movingCardKey, setMovingCardKey] = useState<CardMoveProps | null>(
    null
  );

  const [hoveredGroup, setHoveredGroup] = useState<{
    groupIndex: number;
    cardIndex: number;
  } | null>(null);

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
  const handleDrop = (draggedCard: CardDropProps) => {
    const cardKey = `${draggedCard.groupIndex}-${draggedCard.cardIndex}`;
    const cardLayout = initialCardPositions.current[cardKey];

    const cleanup = () => {
      setMovingCardKey(null);
      setHoveredGroup(null);
    };

    if (!cardLayout) {
      cleanup();
      return;
    }

    const result = findClosestCard(
      draggedCard,
      cardGroups,
      initialCardPositions
    );

    // ✅ If the drop target is not valid (outside any group), do nothing
    if (!result) {
      console.warn("Drop rejected: outside any valid target group.");
      cleanup();
      return;
    }

    const {
      newCardGroupIndex,
      newCardIndex,
      prevCardIndex,
      prevCardGroup,
      cardName,
    } = result;

    console.log("Returned by findClosestCard ->", {
      "new group": newCardGroupIndex,
      "new index": newCardIndex,
      "prev group": prevCardGroup,
      "prev index": prevCardIndex,
      "name": cardName,
    });

    // Clone state
    const updatedCardGroups = cardGroups.map(group => [...group]);

    const sourceGroup = updatedCardGroups[prevCardGroup];
    const cardToMoveIndex = sourceGroup.findIndex(card => card.name === cardName);

    // If card not found → skip
    if (cardToMoveIndex === -1) {
      cleanup();
      return;
    }

    const [cardToMove] = sourceGroup.splice(cardToMoveIndex, 1);

    // ✅ Determine correct insert index
    let insertIndex = newCardIndex;
    const targetLayout = initialCardPositions.current[`${newCardGroupIndex}-${newCardIndex}`];

    if (newCardIndex === 0 && draggedCard.position.x < (targetLayout?.x ?? 0)) {
      insertIndex = 0;
    } else {
      insertIndex = newCardIndex + 1;
    }

    // ✅ Adjust for reordering within same group
    if (
      prevCardGroup === newCardGroupIndex &&
      cardToMoveIndex < insertIndex
    ) {
      insertIndex -= 1;
    }

    // ✅ Final insert
    const targetGroup = updatedCardGroups[newCardGroupIndex];
    targetGroup.splice(insertIndex, 0, cardToMove);

    // ✅ Update state
    updateGroups(updatedCardGroups);
    console.log("✅ Card moved:", {
      name: cardName,
      from: `${prevCardGroup}-${cardToMoveIndex}`,
      to: `${newCardGroupIndex}-${insertIndex}`,
    });

    cleanup();
  };






  // handle card move----------------------------------------------------
  const handleMove = (movingCard: CardMoveProps) => {
    const cardKey = `${movingCard.groupIndex}-${movingCard.cardIndex}`;
    const cardLayout = initialCardPositions.current[cardKey];

    if (!cardLayout) return;

    const result = findClosestCard(
      movingCard,
      cardGroups,
      initialCardPositions
    );

    if (result) {
      setHoveredGroup({
        groupIndex: result.newCardGroupIndex,
        cardIndex: result.newCardIndex,
      });
    } else {
      setHoveredGroup(null);
    }

    setMovingCardKey(movingCard);
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
            onCardStart={handleCardStart}
            movingCard={movingCardKey}
            hoveredGroup={hoveredGroup}  // 👈 pass this down
            groupVersion={groupVersion}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardGroupContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 60,
    backgroundColor: "#f0f0f0",
  },
});

export default Game;
