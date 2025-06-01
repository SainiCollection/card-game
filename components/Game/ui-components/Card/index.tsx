import { useCallback, useRef } from 'react';
import { Animated, LayoutChangeEvent, PanResponder, View } from 'react-native';
import { CardLayoutProps, CardProps, CardRenderProps } from './cad';
import CardView from './CardView';

const Card: React.FC<CardProps> = ({ name, cardIndex = -1, groupIndex = -1, onRender, ...restCardProps }) => {
  const pan = useRef(new Animated.ValueXY()).current;
  const cardRef = useRef<View>(null);

  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    const layout: CardLayoutProps = { ...event.nativeEvent.layout };
    const cardRenderInfo: CardRenderProps = { name, cardIndex, groupIndex, layout };
    onRender?.(cardRenderInfo);
  }, [name, cardIndex, groupIndex, onRender]);

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
      onPanResponderMove: Animated.event(
        [null, { dx: pan.x, dy: pan.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: () => {
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
      }}
    >
      <CardView name={name} onLayout={handleLayout} {...restCardProps} />
    </Animated.View>
  );
};

export default Card;
