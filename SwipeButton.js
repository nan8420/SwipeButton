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

const H_WAVE_RANGE = SWIPEABLE_DIMENSIONS + 2 * BUTTON_PADDING;
const H_SWIPE_RANGE = BUTTON_WIDTH - 2 * BUTTON_PADDING - SWIPEABLE_DIMENSIONS;
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

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
        newValue = H_SWIPE_RANGE + e.translationX;
      } else {
        newValue = e.translationX;
      }

      if (newValue >= 0 && newValue <= H_SWIPE_RANGE) {
        X.value = newValue;
      }
    },
    onEnd: () => {
      if (X.value < BUTTON_WIDTH / 2 - SWIPEABLE_DIMENSIONS / 2) {
        X.value = withSpring(0);
        runOnJS(handleComplete)(false);
      } else {
        X.value = withSpring(H_SWIPE_RANGE);
        runOnJS(handleComplete)(true);
      }
    },
  });

  const InterpolateXInput = [0, H_SWIPE_RANGE];
  const AnimatedStyles = {
    swipeCont: useAnimatedStyle(() => {
      return {};
    }),
    colorWave: useAnimatedStyle(() => {
      return {
        width: H_WAVE_RANGE + X.value,

        opacity: interpolate(X.value, InterpolateXInput, [0, 1]),
      };
    }),
    swipeable: useAnimatedStyle(() => {
      return {
        backgroundColor: interpolateColor(
          X.value,
          [0, BUTTON_WIDTH - SWIPEABLE_DIMENSIONS - BUTTON_PADDING],
          ['#06d6a0', '#fff'],
        ),
        transform: [{translateX: X.value}],
      };
    }),
    swipeText: useAnimatedStyle(() => {
      return {
        opacity: interpolate(
          X.value,
          InterpolateXInput,
          [0.7, 0],
          Extrapolate.CLAMP,
        ),
        transform: [
          {
            translateX: interpolate(
              X.value,
              InterpolateXInput,
              [0, BUTTON_WIDTH / 2 - SWIPEABLE_DIMENSIONS],
              Extrapolate.CLAMP,
            ),
          },
        ],
      };
    }),
  };

  return (
    <GestureHandlerRootView>
      <Animated.View style={[styles.swipeCont, AnimatedStyles.swipeCont]}>
        <AnimatedLinearGradient
          style={[AnimatedStyles.colorWave, styles.colorWave]}
          colors={['#06d6a0', '#1b9aaa']}
          start={{x: 0.0, y: 0.5}}
          end={{x: 1, y: 0.5}}
        />
        <PanGestureHandler onGestureEvent={animatedGestureHandler}>
          <Animated.View style={[styles.swipeable, AnimatedStyles.swipeable]} />
        </PanGestureHandler>
        <Animated.Text style={[styles.swipeText, AnimatedStyles.swipeText]}>
          Swipe Me
        </Animated.Text>
      </Animated.View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  swipeCont: {
    height: BUTTON_HEIGHT,
    width: BUTTON_WIDTH,
    backgroundColor: '#fff',
    borderRadius: BUTTON_HEIGHT,
    padding: BUTTON_PADDING,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  colorWave: {
    position: 'absolute',
    left: 0,
    height: BUTTON_HEIGHT,
    borderRadius: BUTTON_HEIGHT,
  },
  swipeable: {
    position: 'absolute',
    left: BUTTON_PADDING,
    height: SWIPEABLE_DIMENSIONS,
    width: SWIPEABLE_DIMENSIONS,
    borderRadius: SWIPEABLE_DIMENSIONS,
    zIndex: 3,
  },
  swipeText: {
    alignSelf: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    zIndex: 2,
    color: '#1b9aaa',
  },
});

export default SwipeButton;

// //  필수 기능만
// import React from 'react';
// import {StyleSheet} from 'react-native';

// import LinearGradient from 'react-native-linear-gradient';

// import {
//   PanGestureHandler,
//   PanGestureHandlerGestureEvent,
//   GestureHandlerRootView,
// } from 'react-native-gesture-handler';
// import Animated, {
//   useAnimatedGestureHandler,
//   useSharedValue,
//   useAnimatedStyle,
//   withSpring,
//   interpolate,
//   Extrapolate,
//   interpolateColor,
//   runOnJS,
// } from 'react-native-reanimated';
// import {useState} from 'react';

// const BUTTON_WIDTH = 350;
// const BUTTON_HEIGHT = 100;
// const BUTTON_PADDING = 10;
// const SWIPEABLE_DIMENSIONS = BUTTON_HEIGHT - 2 * BUTTON_PADDING;

// const H_SWIPE_RANGE = BUTTON_WIDTH - 2 * BUTTON_PADDING - SWIPEABLE_DIMENSIONS;

// // H_SWIPE_RANGE : 250

// const SwipeButton = ({onToggle}) => {
//   // Animated value for X translation
//   const X = useSharedValue(0);
//   // Toggled State
//   const [toggled, setToggled] = useState(false);

//   // Fires when animation ends
//   const handleComplete = isToggled => {
//     if (isToggled !== toggled) {
//       setToggled(isToggled);
//       onToggle(isToggled);
//     }
//   };

//   // Gesture Handler Events
//   const animatedGestureHandler = useAnimatedGestureHandler({
//     onStart: (_, ctx) => {
//       ctx.completed = toggled;
//     },
//     onActive: (e, ctx) => {
//       let newValue;
//       if (ctx.completed) {
//         // 오른족에서 왼쪽으로
//         newValue = H_SWIPE_RANGE + e.translationX;
//       } else {
//         // 왼쪽에서 오른쪽으로
//         newValue = e.translationX;
//       }

//       // console.log('newValue:', newValue);
//       if (newValue >= 0 && newValue <= H_SWIPE_RANGE) {
//         //  맨 왼쪽에서 더 왼쪽으로 가지 않거나,
//         // 맨 오른쪽에서 더 오른쪽으로 가지 않았을 때
//         // console.log('!!!!!!!!!');
//         X.value = newValue;
//       }
//     },
//     onEnd: () => {
//       if (X.value < BUTTON_WIDTH / 2 - SWIPEABLE_DIMENSIONS / 2) {
//         // BUTTON_WIDTH / 2 - SWIPEABLE_DIMENSIONS / 2: 135
//         // 오른족으로 밀 때 위치가 135가 넘지 않았을 때 제자리로
//         X.value = withSpring(0);
//         runOnJS(handleComplete)(false);
//       } else {
//         // 위치가 135가 넘을 때 맨 오른쪽으로 붙임
//         X.value = withSpring(H_SWIPE_RANGE);
//         runOnJS(handleComplete)(true);
//       }
//     },
//   });

//   const AnimatedStyles = {
//     swipeable: useAnimatedStyle(() => {
//       return {
//         transform: [{translateX: X.value}],
//       };
//     }),
//   };

//   return (
//     <GestureHandlerRootView>
//       <Animated.View style={[styles.swipeCont]}>
//         <PanGestureHandler onGestureEvent={animatedGestureHandler}>
//           <Animated.View style={[styles.swipeable, AnimatedStyles.swipeable]} />
//         </PanGestureHandler>
//       </Animated.View>
//     </GestureHandlerRootView>
//   );
// };

// const styles = StyleSheet.create({
//   swipeCont: {
//     height: BUTTON_HEIGHT,
//     width: BUTTON_WIDTH,
//     // backgroundColor: '#fff',
//     borderRadius: BUTTON_HEIGHT,
//     padding: BUTTON_PADDING,
//     // display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     flexDirection: 'row',
//     backgroundColor: 'pink',
//   },

//   swipeable: {
//     position: 'absolute',
//     left: BUTTON_PADDING,
//     height: SWIPEABLE_DIMENSIONS,
//     width: SWIPEABLE_DIMENSIONS,
//     borderRadius: SWIPEABLE_DIMENSIONS,
//     zIndex: 3,
//     backgroundColor: 'lightblue',
//   },
// });

// export default SwipeButton;
