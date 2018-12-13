import {
    StatusBar,
    PixelRatio,
    AsyncStorage,
    Platform,
    Dimensions
  } from 'react-native';
  
  if (!__DEV__) {
    global.console = {
      info: () => {},
      log: () => {},
      warn: () => {},
      debug: () => {},
      error: () => {}
    };
  }
  
  const { width, height} = Dimensions.get('window');
  const STATUS_HEIGHT = Platform.OS==='ios'?20:(Platform.Version>19?StatusBar.currentHeight:0);

  global.__IOS__ = Platform.OS==='ios';
  
  global.$ = {
    STATUS_HEIGHT: STATUS_HEIGHT,
    WIDTH: width,
    HEIGHT: height,
    PixelRatio: PixelRatio.get(),
  }

  