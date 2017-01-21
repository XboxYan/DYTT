/**
 * index
 */
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  StatusBar,
  UIManager,
  Animated,
  TouchableOpacity,
  LayoutAnimation,
  InteractionManager,
  ToastAndroid
} from 'react-native';
import Touchable from '../common/touchable';
import Loading from '../common/loading';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Video } from 'react-native-media-kit';
import Orientation from 'react-native-orientation';
import RNIdle from 'react-native-idle';
import makeCancelable from '../../util/Cancelable'

global.$FULLSCREEN = false;

class Movie extends Component {
  constructor(props) {
    super(props);
    $FULLSCREEN = false;
    this.state = {
      actions: false,
      loaded: false,
      _loaded: false,
      isSlide: false,
      isMore: false,
      isPlay: false,
      fullScreen: false,
      hideStadus: false,
      current: 0,
      sourceIndex: 0,
      playUrl: '',
      movieinfo: {},
      moviesubject: {},
      AnimatedValue: new Animated.Value(0),
      yOffset: new Animated.Value(0),
    }
    this.setFullScreen = this.setFullScreen.bind(this);
    this.getPlayUrl = this.getPlayUrl.bind(this);
    this.turnSource = this.turnSource.bind(this);
    this.onLayout = this.onLayout.bind(this);
    this.toPlay = this.toPlay.bind(this);
    //处理安卓Back键
    const { navigator } = this.props;
    const routers = navigator.getCurrentRoutes();
    const top = routers[routers.length - 1];
    top.handleBack = this.handleBack.bind(this);
    UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  handleBack() {
    InteractionManager.runAfterInteractions(() => {
      if (this.state.fullScreen) {
        this.setFullScreen();
      } else {
        if (this.state.isPlay) {
          this.refs.video.pause();
          //记录播放进度

        }
        this.props.navigator.pop();
      }
    })
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.getMovieInfo();
      this.getMovieSubject();
    })
  }

  componentWillUnmount() {
    this.cancelable && this.cancelable.cancel();
    this.cancelable2 && this.cancelable2.cancel();
    this.cancelable3 && this.cancelable3.cancel();
    RNIdle.enableIdleTimer();
  }

  setFullScreen() {
    if ($FULLSCREEN) {
      Orientation.lockToPortrait();
    } else {
      this.scrollview.scrollTo({ y: 0 });
      Orientation.lockToLandscape();
    }
    $FULLSCREEN = !$FULLSCREEN;
    this.setState({
      fullScreen: !this.state.fullScreen,
      hideStadus: false
    })
  }

  turnSource(index) {
    this.setState({
      sourceIndex: index
    })
    this.getPlayUrl(index);
  }

  getPlayUrl(index) {
    let MoviePlayUrls = this.state.movieinfo.MoviePlayUrls[index];
    let playUrl = MoviePlayUrls.PlayUrl;

    if (MoviePlayUrls.sourceType.Name === 'Youku') {
      this.cancelable = makeCancelable(fetch(`${api.PlayYouku}${playUrl}`));
      this.cancelable.promise
        .then((response) => {
          if (response.ok) {
            return response.json()
          }
        })
        .then((responseData) => {
          this.setState({
            playUrl: responseData
          })
        })
        .catch(() => {
          ToastAndroid.show('网络有误~', ToastAndroid.SHORT);
        });
    } else if (MoviePlayUrls.sourceType.Name === 'Bilibili') {
      this.cancelable = makeCancelable(fetch(`${api.PlayBilibili}${playUrl}`));
      this.cancelable.promise
        .then((response) => {
          if (response.ok) {
            return response.json()
          }
        })
        .then((responseData) => {
          this.setState({
            playUrl: responseData
          })
        })
        .catch(() => {
          ToastAndroid.show('网络有误~', ToastAndroid.SHORT);
        });
    } else if (MoviePlayUrls.sourceType.Name === 'Sytv01') {
      //飞屋
    } else {
      this.setState({
        playUrl: playUrl
      })
    }
  }

  getMovieSubject() {
    const { route } = this.props;
    let URL = `${api.getSubject}${route.dbid}`;
    this.cancelable2 = makeCancelable(fetch(URL));
    this.cancelable2.promise
      .then((response) => {
        if (response.ok) {
          return response.json()
        }
      })
      .then((responseData) => {
        LayoutAnimation.spring();
        this.setState({
          loaded: true,
          moviesubject: responseData
        })
      })
      .catch(() => {
        ToastAndroid.show('网络有误~', ToastAndroid.SHORT);
      });
  }

  onLayout(e) {
    if (e.nativeEvent.layout.height > 110) {
      this.setState({
        isMore: true
      })
    }
  }

  getMovieInfo() {
    const { route } = this.props;
    let URL = `${api.getMovies}${route.id}`;
    this.cancelable3 = makeCancelable(fetch(URL));
    this.cancelable3.promise
      .then((response) => {
        if (response.ok) {
          return response.json()
        }
      })
      .then((responseData) => {
        let Data = JSON.parse(responseData);
        LayoutAnimation.spring();
        this.setState({
          _loaded: true,
          movieinfo: Data
        })
        this.getPlayUrl(0);
      })
      .catch(() => {
        ToastAndroid.show('网络有误~', ToastAndroid.SHORT);
      });
  }

  toPlay() {
    Animated.timing(this.state.AnimatedValue, {
      toValue: 1,
    }).start(() => {
      RNIdle.disableIdleTimer();
      this.setState({
        isPlay: true
      })
    });
  }


  render() {
    const { navigator, route } = this.props;
    let { movieinfo, moviesubject, _loaded, loaded, isSlide, sourceIndex, isMore, fullScreen } = this.state;
    let movieslist = movieinfo.MoviePlayUrls;
    let R = ($.WIDTH - 40) / 2;

    return (
      <View style={styles.content}>
        <View style={[styles.appbar, { paddingTop: $.STATUS_HEIGHT, backgroundColor: 'transparent' }, fullScreen && { zIndex: -1 }]}>
          <Animated.View style={[styles.appbg, {
            backgroundColor: $.THEME_COLOR,
            opacity: this.state.yOffset.interpolate({
              inputRange: [0, $.STATUS_HEIGHT + 50],
              outputRange: [0, 1]
            })
          }]}></Animated.View>
          <Touchable
            style={styles.btn}
            onPress={() => navigator.pop()}
            >
            <Icon name='keyboard-arrow-left' size={30} color='#fff' />
          </Touchable>
          <Animated.View style={[styles.title, {
            opacity: this.state.yOffset.interpolate({
              inputRange: [0, $.STATUS_HEIGHT + 45, $.STATUS_HEIGHT + 50],
              outputRange: [1, 1, 0]
            })
          }]}><Text style={{ fontSize: 16, color: '#fff' }} numberOfLines={1}>{(this.state.isPlay ? movieinfo.Name : '影片详情')}</Text></Animated.View>
          <Animated.Text style={[styles.apptitle, { textAlign: 'left', opacity: 0 }, {
            opacity: this.state.yOffset.interpolate({
              inputRange: [0, $.STATUS_HEIGHT + 45, $.STATUS_HEIGHT + 50],
              outputRange: [0, 0, 1]
            })
          }]} numberOfLines={1}>{movieinfo.Name}</Animated.Text>
        </View>
        <ScrollView
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: this.state.yOffset } } }]
          )}
          ref={(scrollview) => { this.scrollview = scrollview; } }
          showsVerticalScrollIndicator={false}
          scrollEnabled={!fullScreen}
          style={[styles.content, { backgroundColor: 'transparent' }]}>
          <View style={[styles.moviebg, { backgroundColor: $.THEME_COLOR }]}>
            <Image style={styles.imgbg} source={{ uri: movieinfo.Cover }} />
            <View style={[styles.moviebgmask, { backgroundColor: $.THEME_COLOR }]}></View>
          </View>
          <View style={[styles.papercon, styles.flexDirectionR, { marginTop: $.STATUS_HEIGHT + 50 }, fullScreen && styles.fullvideocon]}>
            <Animated.View style={[styles.topcover, {
              height: this.state.AnimatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [160, R * 9 / 8]
              })
            }]}>
              <Image style={styles.topimg} source={{ uri: movieinfo.Cover }} />
            </Animated.View>
            <View style={[styles.playbtnwrap, { zIndex: this.state.isPlay ? 1 : 10 }]}>
              <Animated.View
                style={[styles.playbtn, {
                  backgroundColor: $.THEME_COLOR,
                  zIndex: this.state.isPlay ? 0 : 10,
                  transform: [
                    {
                      translateX: this.state.AnimatedValue.interpolate({
                        inputRange: [0, 1],
                        outputRange: [35, R - 20]
                      })
                    },
                    {
                      translateY: this.state.AnimatedValue.interpolate({
                        inputRange: [0, 1],
                        outputRange: [60, R * 9 / 16 - 20]
                      })
                    },
                    {
                      scale: this.state.AnimatedValue.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 10]
                      })
                    }
                  ],
                  opacity: this.state.AnimatedValue.interpolate({
                    inputRange: [0, .4, 1],
                    outputRange: [.9, 1, 0]
                  })
                }]}>
                <TouchableOpacity onPress={this.toPlay} activeOpacity={.8}>
                  <Animated.View style={{
                    transform: [
                      {
                        scale: this.state.AnimatedValue.interpolate({
                          inputRange: [0, 1],
                          outputRange: [1, .2]
                        })
                      }]
                  }}>
                    <Icon name='play-arrow' color='#fff' size={30} />
                  </Animated.View>
                </TouchableOpacity>
              </Animated.View>
            </View>
            <View style={styles.topinfo}>
              <Text style={[styles.movietitle, { color: $.THEME_COLOR }]}>{(route.id + movieinfo.Name) || '加载中'}</Text>
              <View style={styles.moviescore}>
                <View style={styles.scorepro}>
                  {
                    loaded ? (<View style={styles.scorepro}><View style={[styles.scorebar, { backgroundColor: $.THEME_COLOR, flex: moviesubject.rating.average }]}></View><View style={{ flex: 10 - moviesubject.rating.average }}></View></View>) : null
                  }
                </View>
                <Text style={[styles.scoretext, { color: $.THEME_COLOR }]}>{'豆瓣' + (loaded ? moviesubject.rating.average : '0.0')}</Text>
              </View>
              <Text style={[styles.movietext, { fontStyle: 'italic' }]}>{_loaded && movieinfo.ReleaseDate.slice(0, 10)}</Text>
              <Text style={styles.movietext}>{'导演/' + (loaded ? moviesubject.directors.map((el) => ' ' + el.name) : ' ...')}</Text>
              <Text style={styles.movietext}>{'主演/' + (loaded ? moviesubject.casts.map((el) => ' ' + el.name) : ' ...')}</Text>
            </View>
            <Animated.View style={[styles.videowrap, { opacity: this.state.AnimatedValue }, fullScreen && styles.videofullwrap]}>
              {
                this.state.isPlay ? <TouchableOpacity onPress={() => { this.setState({ hideStadus: !this.state.hideStadus }) } } activeOpacity={1} delayPressIn={0} style={styles.videocon}>
                  <StatusBar animated={true} hidden={fullScreen} />
                  <View pointerEvents={(!fullScreen || this.state.hideStadus) ? 'none' : 'auto'} style={[styles.appbar, (!fullScreen || this.state.hideStadus) && { opacity: 0 }]}>
                    <Touchable
                      style={styles.btn}
                      onPress={this.setFullScreen}
                      >
                      <Icon name='keyboard-arrow-left' size={30} color='#fff' />
                    </Touchable>
                    <Text style={styles.apptitle} numberOfLines={1}>{movieinfo.Name || ''}</Text>
                    <View style={styles.btn}></View>
                  </View>
                  <Video
                    style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
                    src={this.state.playUrl}
                    ref='video'
                    autoplay={true}
                    preload='auto'
                    loop={false}
                    onPlayerProgress={(event) => this.setState({ current: event })}
                    controls={!this.state.hideStadus}
                    muted={false}
                    setFullScreen={this.setFullScreen}
                    />
                </TouchableOpacity> : null
              }
            </Animated.View>
          </View>
          <View style={styles.papercon}>
            <View style={styles.paperinner} onLayout={this.onLayout} >
              <Text style={styles.movietext}>分类</Text>
              {
                loaded ? (
                  <View>
                    <View style={styles.movieplaylist}>
                      {
                        moviesubject.countries.map((el, i) => (
                          <TouchableOpacity
                            activeOpacity={.8}
                            style={styles.moviegenres}
                            key={i}
                            ><Text style={styles.movieplaytext}>{el}</Text></TouchableOpacity>
                        ))
                      }
                    </View>
                    <View style={styles.movieplaylist}>
                      {
                        moviesubject.genres.map((el, i) => (
                          <TouchableOpacity
                            activeOpacity={.8}
                            style={styles.moviegenres}
                            key={i}
                            ><Text style={styles.movieplaytext}>{el}</Text></TouchableOpacity>
                        ))
                      }
                    </View>
                  </View>
                ) : <View style={styles.movieplaylist}><View style={styles.moviegenres}><Text style={styles.movieplaytext}></Text></View></View>
              }

            </View>
            <View style={[styles.Lline, { backgroundColor: $.THEME_COLOR }]}></View>
          </View>
          <View style={styles.papercon}>
            <View style={styles.paperinner}>
              <Text style={styles.movietext}>{route.isTv ? '选集' : '资源'}{~~(this.state.current / 1000)}</Text>
              <View style={styles.movieplaylist}>
                {
                  _loaded ? movieslist.map(
                    (el, i) => (
                      <TouchableOpacity
                        activeOpacity={.8}
                        key={i}
                        onPress={() => this.turnSource(i)}
                        style={styles.movieplayurl}
                        >
                        <Text style={styles.movieplaytext}>{movieslist[i].Name ? movieslist[i].Name : (route.isTv ? (i + 1) : '资源' + (i + 1))}</Text>
                        {
                          (i === sourceIndex) ? <View style={[styles.currentplay, { backgroundColor: $.THEME_COLOR }]}></View> : null
                        }
                      </TouchableOpacity>
                    )
                  ) : <View style={styles.movieplayurl}></View>
                }
              </View>
            </View>
            <View style={[styles.Lline, { backgroundColor: $.THEME_COLOR }]}></View>
          </View>
          <View style={styles.papercon}>
            <View style={styles.paperinner} onLayout={this.onLayout} >
              <Text style={styles.movietext}>剧情简介</Text>
              {
                loaded ? <Text numberOfLines={isSlide ? 0 : 5} style={styles.movietext}>{(moviesubject.summary || '暂无简介')}</Text> : <Loading size='small' />
              }
              {
                isMore ? <TouchableOpacity
                  activeOpacity={.8}
                  onPress={() => (
                    LayoutAnimation.spring(),
                    this.setState({
                      isSlide: !this.state.isSlide
                    })
                  )}
                  style={styles.slidebtn} ><Text style={[styles.slidebtntxt, { color: $.THEME_COLOR, }]}>{isSlide ? '收起简介' : '展开简介'}</Text></TouchableOpacity> : null
              }
            </View>
            <View style={[styles.Lline, { backgroundColor: $.THEME_COLOR }]}></View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: '#f1f1f1',
  },
  moviebg: {
    height: $.WIDTH * 9 / 16,
    paddingTop: $.STATUS_HEIGHT,
    width: $.WIDTH,
    position: 'absolute'
  },
  moviebgmask: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    opacity: .8
  },
  imgbg: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    resizeMode: 'cover',
  },
  papercon: {
    backgroundColor: '#fff',
    padding: 10,
    margin: 10,
    marginTop: 0,
    borderRadius: 2,
  },
  topcover: {
    width: 110,
    height: 160,
    backgroundColor: '#eee',
    borderRadius: 2,
  },
  topimg: {
    flex: 1,
    borderRadius: 2,
    resizeMode: 'cover',
  },
  topinfo: {
    flex: 1,
    marginLeft: 15,
  },
  movietitle: {
    paddingBottom: 5,
    fontSize: 18,
  },
  moviescore: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flexDirectionR: {
    flexDirection: 'row',
  },
  scorepro: {
    flex: 1,
    flexDirection: 'row',
    height: 6,
    backgroundColor: '#eee'
  },
  scorebar: {
    height: 6,
    flex: 0,
  },
  scoretext: {
    marginLeft: 10,
    fontSize: 14,
  },
  movietext: {
    fontSize: 14,
    color: '#666',
    marginTop: 5
  },
  paperinner: {
    paddingHorizontal: 5
  },
  Lline: {
    position: 'absolute',
    zIndex: 10,
    left: 0,
    top: 13,
    width: 4,
    height: 20
  },
  slidebtn: {
    position: 'absolute',
    zIndex: 10,
    top: 5,
    right: 5,
  },
  slidebtntxt: {
    fontSize: 12,
  },
  movieplayurl: {
    height: 40,
    minWidth: 50,
    backgroundColor: '#eee',
    borderBottomRightRadius: 10,
    borderTopLeftRadius: 10,
    justifyContent: 'center',
    margin: 5,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  movieplaylist: {
    marginTop: 5,
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  movieplaytext: {
    fontSize: 14,
    color: '#666',
    minWidth: 20,
    textAlign: 'center'
  },
  currentplay: {
    position: 'absolute',
    right: 4,
    top: 4,
    width: 5,
    height: 5,
    borderRadius: 5,
  },
  moviegenres: {
    height: 26,
    minWidth: 50,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 13,
    borderRadius: 13,
    marginRight: 5,
    marginTop: 5,
    backgroundColor: '#eee'
  },
  playbtnwrap: {
    position: 'absolute',
    left: 10,
    top: 10,
    right: 10,
    bottom: 10,
    zIndex: 10,
    overflow: 'hidden'
  },
  playbtn: {
    width: 40,
    height: 40,
    transform: [
      { translateX: 35 },
      { translateY: 60 }
    ],
    opacity: .9,
    zIndex: 20,
    borderRadius: 200,
    justifyContent: 'center',
    alignItems: 'center'
  },
  videowrap: {
    position: 'absolute',
    left: 10,
    top: 10,
    right: 10,
    bottom: 10,
    backgroundColor: '#000',
    zIndex: 5,
    borderRadius: 2,
    opacity: 0
  },
  videofullwrap: {
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  },
  videocon: {
    flex: 1,
    backgroundColor: '#000',
  },
  fullvideocon: {
    height: $.WIDTH,
    margin: 0,
    marginTop: 0,
    padding: 0
  },
  controls: {
    backgroundColor: "#eee",
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center'
  },
  appbar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,.5)',
    zIndex: 15
  },
  btn: {
    width: 50,
    height: 50,
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  apptitle: {
    textAlign: 'center',
    flex: 1,
    fontSize: 16,
    color: '#fff'
  },
  title: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: 50,
    bottom: 0,
    height: 50,
  },
  appbg: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    opacity: 0
  }
});

module.exports = Movie;
