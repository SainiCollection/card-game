import { useCallback, useEffect, useRef } from "react";
import { Animated, LayoutChangeEvent, PanResponder, View } from "react-native";
import { CardLayoutProps, CardProps, CardRenderProps } from "./cad";
import CardView from "./CardView";

const Card: React.FC<CardProps> = ({
  name,
  cardIndex = -1,
  groupIndex = -1,
  onRender,
  onDrop,
  onMove,
  style,
  isMoving,
  ...restCardProps
}) => {
  const pan = useRef(new Animated.ValueXY()).current;
  const cardRef = useRef<View>(null);

  // ✅ Capture initial position safely
  const cardInitialPosition = useCallback(() => {
    if (!cardRef.current) return;
    // Delay to ensure layout is stable
    setTimeout(() => {
      cardRef.current?.measureInWindow((x, y, width, height) => {
        // console.log("[Initial Position]", {
        //   name,
        //   cardIndex,
        //   groupIndex,
        //   position: { x, y, width, height },
        // });

        // Optionally, you can lift this up via onRender
        onRender?.({
          name,
          cardIndex,
          groupIndex,
          layout: { x, y, width, height },
        });
      });
    }, 0); // You could also try requestAnimationFrame if needed
  }, [name, cardIndex, groupIndex, onRender]);

  useEffect(() => {
    cardInitialPosition(); // Call once on mount
  }, [cardInitialPosition]);

  const handleLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const layout: CardLayoutProps = { ...event.nativeEvent.layout };
      const cardRenderInfo: CardRenderProps = {
        name,
        cardIndex,
        groupIndex,
        layout,
      };
      onRender?.(cardRenderInfo);
    },
    [name, cardIndex, groupIndex, onRender]
  );

  const panResponder = useRef(
    PanResponder.create({
      // Ask to be the responder for pan gestures
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => false,
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => false,
      onPanResponderGrant: () => {
        pan.setOffset({
          x: (pan.x as any).__getValue(),
          y: (pan.y as any).__getValue(),
        });
        pan.setValue({ x: 0, y: 0 });
      },
      // on Move-------------------------------------------------------------------
      onPanResponderMove: (_, gestureState) => {
        pan.setValue({ x: gestureState.dx, y: gestureState.dy });

        cardRef.current?.measureInWindow((x, y) => {

          onMove?.({
            name,
            cardIndex,
            groupIndex,
            position: { x, y },
          });
        });
      },

      // on Release----------------------------------------------------------------
      onPanResponderRelease: () => {
        cardRef.current?.measureInWindow((x, y) => {
          console.log("Card dropped at:", { x, y });
          onDrop?.({
            name,
            cardIndex,
            groupIndex,
            position: { x, y },
          });
        });

        pan.flattenOffset();
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start();
      },
      onPanResponderTerminationRequest: () => true, // Allow other components to take over
      onPanResponderTerminate: () => {
        pan.flattenOffset();
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start();
      },
      onShouldBlockNativeResponder: () => true, // Prevent native components from becoming responder
    })
  ).current;

  return (
    <Animated.View
      ref={cardRef}
      {...panResponder.panHandlers}
      style={{
        transform: [{ translateX: pan.x }, { translateY: pan.y }],
        zIndex: isMoving ? 100 : 1, // Bring to front when moving
      }}
    >
      <CardView
        name={name}
        onLayout={handleLayout}
        {...restCardProps}
        style={style}
      />
    </Animated.View>
  );
};

export default Card;
