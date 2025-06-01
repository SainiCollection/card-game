import React from 'react';
import { Text, View } from 'react-native';
import Card from './ui-components/Card';
import { CardProps } from './ui-components/Card/cad';

type CardRow = CardProps[];
export type cardGroup = CardRow[];


function Game({ cards }: { cards: cardGroup }): React.JSX.Element {

  return (
    <View>
      <View>
        <Text style={{ textAlign: 'center', marginVertical: 20 }}>
          MetaData
        </Text>
      </View>
      <View>
        {cards.map((row, rowIndex) => (
          <View key={rowIndex} style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 10 }}>
            {row.map((card, cardIndex) => (
              <Card
                key={`${rowIndex}-${cardIndex}`}
                name={card.name}
                cardIndex={cardIndex}
                groupIndex={rowIndex}
                onRender={(cardRender) => {
                  console.log('Card Rendered:', cardRender);
                }}
              />
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

export default Game;
