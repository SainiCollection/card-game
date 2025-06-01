import { StyleSheet } from "react-native";

import Game, { cardGroup } from "@/components/Game";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useState } from "react";
import { cardDataType } from "@/components/Game/ui-components/Card/cad";

const dataSet: cardDataType = [
  [
    { name: "3_of_diamonds" },
    { name: "4_of_clubs" },
    { name: "5_of_hearts" },
    { name: "6_of_spades" },
  ]
];

export default function TabTwoScreen() {
  const [cards] = useState<cardDataType>(dataSet);
  console.log("cards", cards);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Explore</ThemedText>
      </ThemedView>

      <Game cardsData={cards} />
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
});
