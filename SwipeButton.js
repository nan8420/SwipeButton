import React from 'react';
import {StyleSheet} from 'react-native';

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
} from 'react-native-reanimated';
import {useState} from 'react';

const BUTTON_WIDTH = 350;
const BUTTON_HEIGHT = 100;
const BUTTON_PADDING = 10;
const SWIPEABLE_DIMENSIONS = BUTTON_HEIGHT - 2 * BUTTON_PADDING;

const H_SWIPE_RANGE = BUTTON_WIDTH - 2 * BUTTON_PADDING - SWIPEABLE_DIMENSIONS;

// H_SWIPE_RANGE : 250

const SwipeButton = ({onToggle}) => {
  // Animated value for X translation
  const X = useSharedValue(0);
  // Toggled State
  const [toggled, setToggled] = useState(false);

  // Fires when animation ends
  const handleComplete = isToggled => {
    if (isToggled !== toggled) {
      setToggled(isToggled);
      onToggle(isToggled);
    }
  };

  // Gesture Handler Events
  const animatedGestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.completed = toggled;
    },
    onActive: (e, ctx) => {
      let newValue;

      if (ctx.completed) {
        // 오른족에서 왼쪽으로
        newValue = H_SWIPE_RANGE + e.translationX;
      } else {
        // 왼쪽에서 오른쪽으로
        newValue = e.translationX;
      }

      // console.log('newValue:', newValue);
      if (newValue >= 0 && newValue <= H_SWIPE_RANGE) {
        //  맨 왼쪽에서 더 왼쪽으로 가지 않거나,
        // 맨 오른쪽에서 더 오른쪽으로 가지 않았을 때
        // console.log('!!!!!!!!!');
        console.log('newValue:', newValue);
        X.value = newValue;
      }
    },
    onEnd: () => {
      if (X.value < BUTTON_WIDTH / 2 - SWIPEABLE_DIMENSIONS / 2) {
        // BUTTON_WIDTH / 2 - SWIPEABLE_DIMENSIONS / 2: 135
        // 오른족으로 밀 때 위치가 135가 넘지 않았을 때 제자리로
        X.value = withSpring(0);
        runOnJS(handleComplete)(false);
      } else {
        // 위치가 135가 넘을 때 맨 오른쪽으로 붙임
        X.value = withSpring(H_SWIPE_RANGE);
        runOnJS(handleComplete)(true);
      }
    },
  });

  const AnimatedStyles = {
    swipeable: useAnimatedStyle(() => {
      return {
        transform: [{translateX: X.value}],
      };
    }),
  };

  return (
    <GestureHandlerRootView>
      <Animated.View style={[styles.swipeCont]}>
        <PanGestureHandler onGestureEvent={animatedGestureHandler}>
          <Animated.View style={[styles.swipeable, AnimatedStyles.swipeable]} />
        </PanGestureHandler>
      </Animated.View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  swipeCont: {
    height: BUTTON_HEIGHT,
    width: BUTTON_WIDTH,
    // backgroundColor: '#fff',
    borderRadius: BUTTON_HEIGHT,
    padding: BUTTON_PADDING,
    display: 'flex',
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
