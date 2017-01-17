import {
  StatusBar,
  PixelRatio,
  Platform,
  Dimensions
} from 'react-native';

const { width, height} = Dimensions.get('window');
const STATUS_HEIGHT = (Platform.Version && Platform.Version >= 19) ? StatusBar.currentHeight : 0;

//global.THEME_COLOR = ['#F44336','#E91E63','#9C27B0','#673AB7','#3F51B5','#2196F3','#304FFE','#2962FF','#009688','#4CAF50','#689F38','#FDD835','#FFB300','#FF8F00','#FF6F00','#EF6C00','#FF6D00','#FF5722','#F4511E','#FF3D00','#795548','#607D8B','#757575','#212121']

//global.THEME_INDEX = 0;

global.$ = {
  STATUS_HEIGHT: STATUS_HEIGHT,
  THEME_COLOR: 'red',
  THEME_INDEX:0,
  WIDTH: width,
  HEIGHT: height,
  PixelRatio: PixelRatio.get(),
}

global.api = {
  getMovies: 'http://api.skyrj.com/api/movies/',
  getSubject: 'https://api.douban.com/v2/movie/subject/',
  PlayYouku: 'http://api.skyrj.com/api/PlayYouku?vid=',
  PlayBilibili: 'http://api.skyrj.com/api/PlayBilibili?vid='
}
