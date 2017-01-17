/**
 * MovieList
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  Image,
  ListView,
  View,
  LayoutAnimation,
  UIManager,
  RefreshControl,
  ToastAndroid,
} from 'react-native';

import Touchable from '../common/touchable';
import Loading from '../common/loading';
import EmptyContent from '../common/emptycontent';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Movie from '../movie';

//const { width, height} = Dimensions.get('window');

class LazyImg extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: true,
    }
    this.onlayout = this.onlayout.bind(this);
  }
  onlayout(){
    this.setState({
      loaded: false,
    })
  }
  render (){
    return (
      this.state.loaded?<Image onLayout={this.onlayout} style={this.props.style} source={this.props.source} ></Image>:<Text>正在加载</Text>
    )
  }
}

class MovieList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      isRefreshing: false,
      isAdd: true,
      isEmpty:false,
      pageIndex: 1,
      dataSource: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2,
      }),
      _dataSource: []
    }
    this.reload = this.reload.bind(this);
    this.getMovies = this.getMovies.bind(this);
    this.renderMovies = this.renderMovies.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
    this.loadMore = this.loadMore.bind(this);
    UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  getMovies(pageIndex, Bmore) {
    let URL = '';
    switch (this.props.type) {
      case 0:
        //首页列表
        URL = `${api.getMovies}?pageSize=50&pageIndex=${pageIndex}&${this.props.sort}`;
        break;
      case 1:
        //搜索列表
        URL = `${api.getMovies}?pageSize=50&pageIndex=${pageIndex}&searchKey=${this.props.keywords}`;
        break;
    }
    fetch(URL)
      .then((response) => {
        if (response.ok) {
          return response.json()
        }
      })
      .then((responseData) => {
        if (Bmore) {
          let dataSource = this.state._dataSource.concat(responseData);
          this.setState({
            pageIndex: pageIndex,
            isAdd: true,
            _dataSource: dataSource,
            dataSource: this.state.dataSource.cloneWithRows(dataSource),
          })
        } else {
          if(responseData.length == 0){
            this.setState({
              isEmpty: true,
              loaded: true
            })
            return
          }
          this.setState({
            loaded: true,
            dataSource: this.state.dataSource.cloneWithRows(responseData),
            _dataSource: responseData,
            isRefreshing: false,
          })
        }
        if (responseData.length < 50) {
          this.setState({
            isAdd: false
          })
          ToastAndroid.show('已经全部加载完了~', ToastAndroid.SHORT);
        }
        LayoutAnimation.easeInEaseOut();
      })
      .catch(() => {
        this.setState({
          loaded: false
        })
        ToastAndroid.show('网络有误~', ToastAndroid.SHORT);
      });
  }

  componentWillUpdate(prevProps, prevState) {
    if ((prevProps.lazyload != this.props.lazyload) && !this.state.loaded) {
      this.getMovies(1);
    }
    if (prevProps.keywords != this.props.keywords) {
      this.reload();
    }
  }

  onRefresh() {
    this.setState({
      isRefreshing: true,
      pageIndex: 1
    });
    this.getMovies(1)
  }

  loadMore() {
    if (this.state.isAdd) {
      ToastAndroid.show('正在加载~', ToastAndroid.SHORT);
      let pageIndex = this.state.pageIndex;
      pageIndex++;
      this.setState({
        isAdd: false
      });
      this.getMovies(pageIndex, true);
    }
  }

  reload() {
    this.setState({
      loaded: false,
      pageIndex: 1
    });
    this.getMovies(1)
  }

  componentWillMount() {
    if (this.props.lazyload && !this.state.loaded) {
      this.getMovies(1);
    }
  }

  // renderFooter() {
  //   if (!this.state.loaded) {
  //     return <Loading height={height - 150} />
  //   } else if (this.state.isempty) {
  //     return (
  //       <EmptyContent height={height - 150} />
  //     )
  //   }
  // }

  // renderEnd() {
  //   if (!this.state.isended && !this.state.isempty) {
  //     ToastAndroid.show('已经没有更多数据了~', ToastAndroid.SHORT);
  //     this.setState({
  //       isended: true
  //     })
  //   }
  // }

  renderMovies(rowDate, i, j) {
    return (
      <Touchable style={styles.listview} onPress={() => this.props.navigator.push({ name: Movie, id: rowDate.ID, dbid: rowDate.DBID, isTv: rowDate.Type === 'tv' })}>
        <View style={styles.score}><Text style={styles.scoretext}>{rowDate.Score}分</Text></View>
        <Image style={styles.listimg} source={{ uri: rowDate.Cover }} />
        <View style={styles.listtextwrap}><Text numberOfLines={1} style={styles.listtext}>{rowDate.Name}</Text></View>
        {
          (rowDate.Type === 'tv') ? <View style={styles.tvsign} ><Icon name='live-tv' size={16} color='#fff' /></View> : null
        }
      </Touchable>
    )
  }
  render() {
    if (!this.state.loaded) {
      return <View style={styles.content}><Loading /></View>
    }
    if(this.state.isEmpty){
      return <View style={styles.content}><EmptyContent /></View>
    }
    return (
      <View style={styles.content}>
        <ListView contentContainerStyle={styles.sublist}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isRefreshing}
              onRefresh={this.onRefresh}
              tintColor={$.THEME_COLOR}
              title="Loading..."
              titleColor="#666"
              colors={[$.THEME_COLOR]}
              progressBackgroundColor="#fff"
              />}
          intialListSize={1}
          pageSize={1}
          enableEmptySections={true}
          dataSource={this.state.dataSource}
          renderRow={this.renderMovies}
          onEndReached={this.loadMore}
          onEndReachedThreshold={50}
          />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  content: {
    backgroundColor: '#f1f1f1',
    flex: 1
  },
  sublist: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    padding: 5,
  },
  listview: {
    width: ($.WIDTH - 28) / 3,
    margin: 3,
    height: ($.WIDTH - 28) * 432 / 900 + 30,
    backgroundColor: '#fff',
    borderRadius: 2,
  },
  listtextwrap: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    height: 30,
  },
  score: {
    position: 'absolute',
    zIndex: 10,
    left: 0,
    bottom: 30,
    borderTopRightRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
    height: 20,
    backgroundColor: 'rgba(0,0,0,.5)'
  },
  scoretext: {
    fontSize: 12,
    color: '#fff'
  },
  listtext: {
    fontSize: 14,
    color: '#666'
  },
  listimg: {
    borderTopRightRadius: 2,
    borderTopLeftRadius: 2,
    flex: 1,
    resizeMode: 'cover'
  },
  tvsign: {
    position: 'absolute',
    right: 5,
    top: 5
  }
});

module.exports = MovieList;
