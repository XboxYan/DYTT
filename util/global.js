import {
    StatusBar,
    PixelRatio,
    AsyncStorage,
    Platform,
    Dimensions
  } from 'react-native';
  
  //import Storage from 'react-native-storage';
  
  const { width, height} = Dimensions.get('window');
  const STATUS_HEIGHT = Platform.OS==='ios'?20:(Platform.Version>19?StatusBar.currentHeight:0);

  global.__IOS__ = Platform.OS==='ios';
  
  global.$ = {
    STATUS_HEIGHT: STATUS_HEIGHT,
    WIDTH: width,
    HEIGHT: height,
    PixelRatio: PixelRatio.get(),
  }
  
//   const storage = new Storage({
//     size: 1000,
//     storageBackend: AsyncStorage,
//     defaultExpires: 1000 * 3600 * 24,
//     enableCache: true,
//   })
  
//   global.storage = storage;
  
  
  