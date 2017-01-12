import {
  StatusBar,
  PixelRatio,
  Platform,
  Dimensions
} from 'react-native';

const { width, height} = Dimensions.get('window');
const STATUS_HEIGHT = (Platform.Version && Platform.Version >= 19) ? StatusBar.currentHeight : 0;

global.$ = {
  STATUS_HEIGHT: STATUS_HEIGHT,
  THEME_COLOR: 'dodgerblue',
  WIDTH:width,
  HEIGHT:height,
  PixelRatio:PixelRatio.get(),
}

global.api = {
  getMovies: 'http://api.skyrj.com/api/movies/',
  getSubject:'https://api.douban.com/v2/movie/subject/',
  PlayYouku:'http://api.skyrj.com/api/PlayYouku?vid=',
  PlayBilibili:'http://api.skyrj.com/api/PlayBilibili?vid='
}
