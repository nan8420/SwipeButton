import React from 'react';
import {StyleSheet, Dimensions} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';

import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  Extrapolate,
  interpolateColor,
  runOnJS,
  withTiming,
} from 'react-native-reanimated';
import {useState} from 'react';

const BUTTON_WIDTH = 350;
const BUTTON_HEIGHT = 100;
const BUTTON_PADDING = 10;
const SWIPEABLE_DIMENSIONS = BUTTON_HEIGHT - 2 * BUTTON_PADDING;

// H_SWIPE_RANGE : 250

const H_SWIPE_RANGE = BUTTON_WIDTH - 2 * BUTTON_PADDING - SWIPEABLE_DIMENSIONS;

const {width: SCREEN_WIDTH} = Dimensions.get('window');

const THRESHOLD = SCREEN_WIDTH / 3;

const SwipeButton = ({onToggle}) => {
  const translateX = useSharedValue(0);
  const [toggled, setToggled] = useState(false);

  const handleComplete = isToggled => {
    if (isToggled !== toggled) {
      setToggled(isToggled);
    }
  };

  const animatedGestureHandler = useAnimatedGestureHandler({
    onStart: (_, context) => {
      context.x = translateX.value;
      context.completed = toggled;
    },

    onActive: (event, context) => {
      let newValue;
      if (context.completed) {
        // 오른족에서 왼쪽으로
        newValue = Math.max(event.translationX + context.x, 0);
      } else {
        // 왼쪽에서 오른쪽으로
        newValue = event.translationX;
      }

      if (newValue >= 0 && newValue <= H_SWIPE_RANGE) {
        //  맨 왼쪽에서 더 왼쪽으로 가지 않거나,
        // 맨 오른쪽에서 더 오른쪽으로 가지 않았을 때
        translateX.value = newValue;
      }
    },
    onEnd: () => {
      if (translateX.value <= THRESHOLD) {
        translateX.value = withTiming(0);
        runOnJS(handleComplete)(false);
      } else {
        translateX.value = withTiming(H_SWIPE_RANGE);
        runOnJS(handleComplete)(true);
      }
    },
  });

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {perspective: 100},
        {
          translateX: translateX.value,
        },
      ],
    };
  }, []);

  return (
    <GestureHandlerRootView>
      <Animated.View style={[styles.swipeCont]}>
        <PanGestureHandler onGestureEvent={animatedGestureHandler}>
          <Animated.View style={[styles.swipeable, rStyle]} />
        </PanGestureHandler>
      </Animated.View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  swipeCont: {
    height: BUTTON_HEIGHT,
    width: BUTTON_WIDTH,
    borderRadius: BUTTON_HEIGHT,
    padding: BUTTON_PADDING,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'pink',
  },

  swipeable: {
    position: 'absolute',
    left: BUTTON_PADDING,
    height: SWIPEABLE_DIMENSIONS,
    width: SWIPEABLE_DIMENSIONS,
    borderRadius: SWIPEABLE_DIMENSIONS,
    zIndex: 3,
    backgroundColor: 'lightblue',
  },
});

export default SwipeButton;
