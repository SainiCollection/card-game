import { Image, StyleSheet, View } from 'react-native';
import { resizeWithAspectRatio } from '../../utils/basic';
import { CardViewProps } from './cad';

const CardView: React.FC<CardViewProps> = ({ name, ...restCardProps }) => {
  const imageSize = resizeWithAspectRatio({
    originalWidth: 222,
    originalHeight: 323,
    targetWidth: 44,
  });

  return (
    <View
      style={[styles.cardContainer, { width: imageSize.width, height: imageSize.height }]}
      {...restCardProps}
    >
      <View style={[styles.fullWidth]}>
        <Image
          accessibilityLabel={name}
          source={name ? cardImages[name] : cardImages.back}
          style={[styles.fullWidth]}
        />
      </View>
    </View>
  );
};

export default CardView;

const styles = StyleSheet.create({
  cardContainer: {
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    backgroundColor: 'white',
    padding: 2,
    borderRadius: 3,
  },

  fullWidth: {
    width: '100%',
    height: '100%',
  },
});

const cardImages = {
  '2_of_diamonds': require('../../assets/cards/png/2_of_diamonds.png'),
  '3_of_diamonds': require('../../assets/cards/png/3_of_diamonds.png'),
  '4_of_diamonds': require('../../assets/cards/png/4_of_diamonds.png'),
  '5_of_diamonds': require('../../assets/cards/png/5_of_diamonds.png'),
  '6_of_diamonds': require('../../assets/cards/png/6_of_diamonds.png'),
  '7_of_diamonds': require('../../assets/cards/png/7_of_diamonds.png'),
  '8_of_diamonds': require('../../assets/cards/png/8_of_diamonds.png'),
  '9_of_diamonds': require('../../assets/cards/png/9_of_diamonds.png'),
  '10_of_diamonds': require('../../assets/cards/png/10_of_diamonds.png'),
  'jack_of_diamonds': require('../../assets/cards/png/jack_of_diamonds.png'),
  'queen_of_diamonds': require('../../assets/cards/png/queen_of_diamonds.png'),
  'king_of_diamonds': require('../../assets/cards/png/king_of_diamonds.png'),
  'ace_of_diamonds': require('../../assets/cards/png/ace_of_diamonds.png'),

  '2_of_clubs': require('../../assets/cards/png/2_of_clubs.png'),
  '3_of_clubs': require('../../assets/cards/png/3_of_clubs.png'),
  '4_of_clubs': require('../../assets/cards/png/4_of_clubs.png'),
  '5_of_clubs': require('../../assets/cards/png/5_of_clubs.png'),
  '6_of_clubs': require('../../assets/cards/png/6_of_clubs.png'),
  '7_of_clubs': require('../../assets/cards/png/7_of_clubs.png'),
  '8_of_clubs': require('../../assets/cards/png/8_of_clubs.png'),
  '9_of_clubs': require('../../assets/cards/png/9_of_clubs.png'),
  '10_of_clubs': require('../../assets/cards/png/10_of_clubs.png'),
  'jack_of_clubs': require('../../assets/cards/png/jack_of_clubs.png'),
  'queen_of_clubs': require('../../assets/cards/png/queen_of_clubs.png'),
  'king_of_clubs': require('../../assets/cards/png/king_of_clubs.png'),
  'ace_of_clubs': require('../../assets/cards/png/ace_of_clubs.png'),

  '2_of_hearts': require('../../assets/cards/png/2_of_hearts.png'),
  '3_of_hearts': require('../../assets/cards/png/3_of_hearts.png'),
  '4_of_hearts': require('../../assets/cards/png/4_of_hearts.png'),
  '5_of_hearts': require('../../assets/cards/png/5_of_hearts.png'),
  '6_of_hearts': require('../../assets/cards/png/6_of_hearts.png'),
  '7_of_hearts': require('../../assets/cards/png/7_of_hearts.png'),
  '8_of_hearts': require('../../assets/cards/png/8_of_hearts.png'),
  '9_of_hearts': require('../../assets/cards/png/9_of_hearts.png'),
  '10_of_hearts': require('../../assets/cards/png/10_of_hearts.png'),
  'jack_of_hearts': require('../../assets/cards/png/jack_of_hearts.png'),
  'queen_of_hearts': require('../../assets/cards/png/queen_of_hearts.png'),
  'king_of_hearts': require('../../assets/cards/png/king_of_hearts.png'),
  'ace_of_hearts': require('../../assets/cards/png/ace_of_hearts.png'),

  '2_of_spades': require('../../assets/cards/png/2_of_spades.png'),
  '3_of_spades': require('../../assets/cards/png/3_of_spades.png'),
  '4_of_spades': require('../../assets/cards/png/4_of_spades.png'),
  '5_of_spades': require('../../assets/cards/png/5_of_spades.png'),
  '6_of_spades': require('../../assets/cards/png/6_of_spades.png'),
  '7_of_spades': require('../../assets/cards/png/7_of_spades.png'),
  '8_of_spades': require('../../assets/cards/png/8_of_spades.png'),
  '9_of_spades': require('../../assets/cards/png/9_of_spades.png'),
  '10_of_spades': require('../../assets/cards/png/10_of_spades.png'),
  'jack_of_spades': require('../../assets/cards/png/jack_of_spades.png'),
  'queen_of_spades': require('../../assets/cards/png/queen_of_spades.png'),
  'king_of_spades': require('../../assets/cards/png/king_of_spades.png'),
  'ace_of_spades': require('../../assets/cards/png/ace_of_spades.png'),

  'black_joker': require('../../assets/cards/png/black_joker.png'),
  'red_joker': require('../../assets/cards/png/red_joker.png'),
  'back': require('../../assets/cards/png/back.png'),
};
