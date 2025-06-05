import { StyleSheet, View } from "react-native";
import Card from "../Card";
import { cardGroupDataType, CardProps } from "../Card/cad";

type CardGroupProps = {
  cards: cardGroupDataType;
  groupIndex: number;
  onCardDrop: CardProps["onDrop"];
  onCardMove: CardProps["onMove"];
  onCardRender: CardProps["onRender"];
  onCardStart:CardProps["onStart"];
  groupVersion: number;
  movingCard: any;
  hoveredGroup: {
    groupIndex: number;
    cardIndex: number;
  } | null;
};

const CardGroup: React.FC<CardGroupProps> = ({
  cards,
  groupIndex,
  onCardDrop,
  onCardRender,
  onCardMove,
  movingCard,
  hoveredGroup,
  onCardStart,
  groupVersion
}) => {
  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: "red",
        justifyContent: "center",
        marginVertical: 10,
        position: "relative",
        zIndex: movingCard?.groupIndex === groupIndex ? 10 : 1,
      }}
    >
      {cards.map((card, cardIndex) => {
        const isHovered =
          hoveredGroup?.groupIndex === groupIndex &&
          hoveredGroup?.cardIndex === cardIndex;
        return <Card
          style={[
            styles.card,
            isHovered && styles.highlightedCard // 👈 apply highlight conditionally
          ]}
          key={`${card.name}-${groupIndex}-${cardIndex}`}
          name={card.name}
          cardIndex={cardIndex}
          groupIndex={groupIndex}
          onDrop={onCardDrop}
          onRender={onCardRender}
          onMove={onCardMove}
          onStart={onCardStart}
          groupVersion={groupVersion}
          isMoving={movingCard?.cardIndex === cardIndex && movingCard?.groupIndex === groupIndex}
        />
      })}
    </View>
  );
};

const styles = StyleSheet.create({

  card: {
    marginLeft:-10
  },
  highlightedCard: {
    borderColor: "#00BCD4",
    borderWidth: 2,
    backgroundColor: "#E0F7FA",
  },
});

export default CardGroup;
