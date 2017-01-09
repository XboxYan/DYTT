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
import Icon from 'react-native-vector-icons/MaterialIcons';
//import Orientation from 'react-native-orientation';


class Movie extends Component {
  constructor(props) {
    super(props);
    this.state = {
      actions: false,
      loaded: false,
      _loaded: false,
      isSlide: false,
      isMore:false,
      sourceIndex: 0,
      movieinfo: {},
      moviesubject: {}
    }
    this.turnSource = this.turnSource.bind(this);
    this.onLayout = this.onLayout.bind(this);
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

  turnSource(index) {
    this.setState({
      sourceIndex: index
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

  onLayout(e){
    if(e.nativeEvent.layout.height>110){
      this.setState({
        isMore:true
      })
    }
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
    let { movieinfo, moviesubject, _loaded, loaded, isSlide, sourceIndex,isMore } = this.state;
    let movieslist = movieinfo.MoviePlayUrls;
    return (
      <View style={styles.content}>
        <View style={styles.moviebg}>
          <Image style={styles.imgbg} source={{ uri: movieinfo.Cover }} />
          <View style={styles.moviebgmask}></View>
        </View>
        <AppBar style={{ paddingTop: $.STATUS_HEIGHT }} title={ (movieinfo.Name || '加载中') + route.id} navigator={navigator} />
        {
          //<View style={{height:$.WIDTH*9/16,backgroundColor:'#000'}}></View>
        }
        <ScrollView showsVerticalScrollIndicator={false} style={[styles.content, { backgroundColor: 'transparent' }]}>
          <View style={[styles.papercon, styles.flexDirectionR]}>
            <View style={styles.topcover}>
              <Image style={styles.topimg} source={{ uri: movieinfo.Cover }} />
              {
                <View style={styles.playbtnwrap}><TouchableOpacity activeOpacity={.8}><View style={styles.playbtn}><Icon name='play-arrow' color='#fff' size={30} /></View></TouchableOpacity></View>
              }
            </View>
            <View style={styles.topinfo}>
              <Text style={styles.movietitle}>{movieinfo.Name || '加载中'}</Text>
              <View style={styles.moviescore}>
                <View style={styles.scorepro}>
                  {
                    loaded ? (<View style={styles.scorepro}><View style={[styles.scorebar, { flex: moviesubject.rating.average }]}></View><View style={{ flex: 10 - moviesubject.rating.average }}></View></View>) : null
                  }
                </View>
                <Text style={styles.scoretext}>{'豆瓣'+ (loaded ? moviesubject.rating.average : '0.0')}</Text>
              </View>
              <Text style={[styles.movietext,{fontStyle:'italic'}]}>{_loaded && movieinfo.ReleaseDate.slice(0, 10)}</Text>
              <Text style={styles.movietext}>{'导演/' + (loaded ? moviesubject.directors.map((el) => ' ' + el.name) : ' ...')}</Text>
              <Text style={styles.movietext}>{'主演/' + (loaded ? moviesubject.casts.map((el) => ' ' + el.name) : ' ...')}</Text>
              <View style={styles.movieplaylist}>
                {
                  loaded ? moviesubject.countries.map((el, i) => (
                    <TouchableOpacity
                      activeOpacity={.8}
                      style={styles.moviegenres}
                      key={i}
                      ><Text style={styles.movieplaytext}>{el}</Text></TouchableOpacity>
                  )) : null
                }
              </View>
              <View style={styles.movieplaylist}>
                {
                  loaded ? moviesubject.genres.map((el, i) => (
                    <TouchableOpacity
                      activeOpacity={.8}
                      style={styles.moviegenres}
                      key={i}
                      ><Text style={styles.movieplaytext}>{el}</Text></TouchableOpacity>
                  )) : null
                }
              </View>
            </View>
          </View>
          <View style={styles.papercon}>
            <View style={styles.paperinner}>
              <Text style={styles.movietext}>{route.isTv ? '选集' : '资源'}</Text>
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
                          (i === sourceIndex) ? <View style={styles.currentplay}></View> : null
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
            <View style={styles.paperinner} onLayout={this.onLayout} >
              <Text style={styles.movietext}>剧情简介</Text>
              {
                loaded ? <Text numberOfLines={isSlide ? 0 : 5} style={styles.movietext}>{(moviesubject.summary || '暂无简介')}</Text> : <Loading size='small' />
              }
              {
                isMore ? <TouchableOpacity
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
    height: $.WIDTH*9/16,
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
    width: 110,
    height: 160
  },
  topimg: {
    flex: 1,
    borderRadius: 2,
    resizeMode: 'cover',
  },
  topinfo: {
    flex: 1,
    marginLeft: 15
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
    marginTop: 10,
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
    backgroundColor: $.THEME_COLOR,
  },
  moviegenres: {
    height: 26,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 13,
    borderRadius: 13,
    marginRight: 5,
    backgroundColor: '#eee'
  },
  playbtnwrap:{
    position:'absolute',
    left:0,
    top:0,
    right:0,
    bottom:0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playbtn:{
    width:40,
    height:40,
    backgroundColor:$.THEME_COLOR,
    opacity:.9,
    borderRadius:20,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

module.exports = Movie;
