import { View } from "react-native";
import Card from "../Card";
import { cardGroupDataType, CardProps } from "../Card/cad";

type CardGroupProps = {
  cards: cardGroupDataType;
  groupIndex: number;
  onCardDrop: CardProps["onDrop"];
  onCardMove: CardProps["onMove"];
  onCardRender: CardProps["onRender"];
  movingCard:any;
};

const CardGroup: React.FC<CardGroupProps> = ({
  cards,
  groupIndex,
  onCardDrop,
  onCardRender,
  onCardMove,
  movingCard,
}) => {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
        marginVertical: 10,
        position: "relative",
        zIndex: movingCard?.groupIndex === groupIndex ? 10 : 1,
      }}
    >
      {cards.map((card, cardIndex) => (
        <Card
          key={`${card.name}-${groupIndex}-${cardIndex}`}
          name={card.name}
          cardIndex={cardIndex}
          groupIndex={groupIndex}
          onDrop={onCardDrop}
          onRender={onCardRender}
          onMove={onCardMove}
          style={{ marginRight: -10 }}
          isMoving={movingCard?.cardIndex === cardIndex && movingCard?.groupIndex === groupIndex}
        />
      ))}
    </View>
  );
};

export default CardGroup;
