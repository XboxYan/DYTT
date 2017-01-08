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
  UIManager,
  TouchableOpacity,
  LayoutAnimation,
  InteractionManager,
  ToastAndroid
} from 'react-native';
import Touchable from '../common/touchable';
import AppBar from '../common/appbar';
import Loading from '../common/loading';
//import Orientation from 'react-native-orientation';


class Movie extends Component {
  constructor(props) {
    super(props);
    this.state = {
      actions: false,
      loaded: false,
      _loaded: false,
      isSlide: false,
      sourceIndex: 0,
      movieinfo: {},
      moviesubject: {}
    }
    this.turnSource = this.turnSource.bind(this);
    UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.getMovieInfo();
      this.getMovieSubject();
    })
  }

  componentWillMount() {
    //this.getMovieInfo()
  }

  turnSource(index){
    this.setState({
      sourceIndex:index
    })
  }

  getMovieSubject() {
    const { route } = this.props;
    let URL = `${api.getSubject}${route.dbid}`;
    fetch(URL)
      .then((response) => {
        if (response.ok) {
          return response.json()
        }
      })
      .then((responseData) => {
        this.setState({
          loaded: true,
          moviesubject: responseData
        })
        LayoutAnimation.spring();
      })
      .catch(() => {
        this.setState({
          loaded: false
        })
        ToastAndroid.show('网络有误~', ToastAndroid.SHORT);
      });
  }

  getMovieInfo() {
    const { route } = this.props;
    let URL = `${api.getMovies}${route.id}`;
    fetch(URL)
      .then((response) => {
        if (response.ok) {
          return response.json()
        }
      })
      .then((responseData) => {
        let Data = JSON.parse(responseData);
        this.setState({
          _loaded: true,
          movieinfo: Data
        })
        LayoutAnimation.spring();
      })
      .catch(() => {
        this.setState({
          _loaded: false
        })
        ToastAndroid.show('网络有误~', ToastAndroid.SHORT);
      });
  }

  render() {
    const { navigator, route } = this.props;
    let { movieinfo, moviesubject, _loaded, loaded, isSlide,sourceIndex } = this.state;
    let movieslist = movieinfo.MoviePlayUrls;
    return (
      <View style={styles.content}>
        <View style={styles.moviebg}>
          <Image style={styles.imgbg} source={{ uri: movieinfo.Cover }} />
          <View style={styles.moviebgmask}></View>
        </View>
        <AppBar style={{ paddingTop: $.STATUS_HEIGHT }} title={(route.isTv?'影视剧':'电影')+'详情' + route.id} navigator={navigator} />
        <ScrollView style={[styles.content, { backgroundColor: 'transparent' }]}>
          <View style={[styles.papercon, styles.flexDirectionR]}>
            <View style={styles.topcover}>
              <Image style={styles.topimg} source={{ uri: movieinfo.Cover }} />
            </View>
            <View style={styles.topinfo}>
              <Text style={styles.movietitle}>{movieinfo.Name || '加载中'}</Text>
              <View style={styles.moviescore}>
                <View style={styles.scorepro}><View style={[styles.scorebar, { flex: movieinfo.Score }]}></View><View style={{ flex: 10 - movieinfo.Score }}></View></View>
                <Text style={styles.scoretext}>{movieinfo.Score || 0}</Text>
              </View>
              <Text style={styles.movietext}>{'类型:' + (movieinfo.Tags || '...')}</Text>
              <Text style={styles.movietext}>{'导演:' + (loaded ? moviesubject.directors.map((el) => ' '+el.name) : '...')}</Text>
              <Text style={styles.movietext}>{'主演:' + (loaded ? moviesubject.casts.map((el) => ' '+el.name) : '...')}</Text>
              <Text style={styles.movietext}>{'上映: ' + (_loaded ? movieinfo.ReleaseDate.slice(0, 10) : '...')}</Text>
            </View>
          </View>
          <View style={styles.papercon}>
            <View style={styles.paperinner}>
              <Text style={styles.movietext}>{route.isTv ? '选集' : '资源'}{sourceIndex}</Text>
              <View style={styles.movieplaylist}>
                {
                  _loaded ? movieslist.map(
                    (el, i) => (
                      <TouchableOpacity
                        activeOpacity={.8}
                        key={i}
                        onPress = {()=>this.turnSource(i)}
                        style={styles.movieplayurl}
                        >
                        <Text style={styles.movieplaytext}>{movieslist[i].Name ? movieslist[i].Name : (route.isTv ? (i + 1) : '资源' + (i + 1))}</Text>
                        {
                          (i===sourceIndex)?<View style={styles.currentplay}></View>:null
                        }
                      </TouchableOpacity>
                    )
                  ) : <Loading size='small' />
                }
              </View>
            </View>
            <View style={styles.Lline}></View>
          </View>
          <View style={styles.papercon}>
            <View style={styles.paperinner}>
              <Text style={styles.movietext}>剧情简介</Text>
              {
                loaded ? <Text numberOfLines={isSlide ? 0 : 5} style={styles.movietext}>{(moviesubject.summary || '暂无简介')}</Text> : <Loading size='small' />
              }
              {
                moviesubject.summary ? <TouchableOpacity
                  activeOpacity={.8}
                  onPress={() => (
                    this.setState({
                      isSlide: !this.state.isSlide
                    }),
                    LayoutAnimation.spring()
                  )}
                  style={styles.slidebtn} ><Text style={styles.slidebtntxt}>{isSlide ? '收起简介' : '展开简介'}</Text></TouchableOpacity> : null
              }
            </View>
            <View style={styles.Lline}></View>
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
    height: 200,
    paddingTop: $.STATUS_HEIGHT,
    width: $.WIDTH,
    position: 'absolute',
    backgroundColor: $.THEME_COLOR,
  },
  moviebgmask: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    backgroundColor: $.THEME_COLOR,
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
    width: 100,
    height: 150
  },
  topimg: {
    flex: 1,
    borderRadius: 2,
    resizeMode: 'cover',
  },
  topinfo: {
    flex: 1,
    marginLeft: 20
  },
  movietitle: {
    paddingBottom: 5,
    fontSize: 18,
    color: $.THEME_COLOR
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
    backgroundColor: $.THEME_COLOR
  },
  scoretext: {
    width: 20,
    marginLeft: 10,
    fontSize: 14,
    color: $.THEME_COLOR
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
    backgroundColor: $.THEME_COLOR,
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
    color: $.THEME_COLOR,
  },
  movieplayurl: {
    height: 40,
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
  currentplay:{
    position: 'absolute',
    right: 4,
    top: 4,
    width:5,
    height:5,
    borderRadius:5,
    backgroundColor: $.THEME_COLOR,
  }
});

module.exports = Movie;
