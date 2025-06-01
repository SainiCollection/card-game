import { View } from "react-native";
import Card from "../Card";
import { cardGroupDataType, CardProps } from "../Card/cad";

type CardGroupProps = {
  cards: cardGroupDataType;
  groupIndex: number;
  onCardDrop: CardProps["onDrop"];
  onCardRender: CardProps["onRender"];
};

const CardGroup: React.FC<CardGroupProps> = ({
  cards,
  groupIndex,
  onCardDrop,
  onCardRender,
}) => {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
        marginVertical: 10,
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
        />
      ))}
    </View>
  );
};

export default CardGroup;
