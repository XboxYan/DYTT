/**
 * Home
 */
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Animated,
  Image, 
  ViewPagerAndroid,
  LayoutAnimation,
  UIManager,
  ToastAndroid
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Touchable from '../common/touchable';
import MovieList from '../common/movielist';


class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      xoffset: 0,
      tabbar: [
        { text: '最新增加', sort: 'orderBy=ID' },
        { text: '最新上映', sort: 'orderBy=ReleaseDate' },
        { text: '最新更新', sort: 'orderBy=UpdateTime' },
        { text: '最高评分', sort: 'orderBy=Score' },
        { text: '电视剧', sort: 'type=tv' },
      ],
      index: 0
    }
    this.onPageScroll = this.onPageScroll.bind(this);
    this.onSetPage = this.onSetPage.bind(this);
    UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  onPageScroll(e) {
    let index = e.nativeEvent.position;
    this.setState({ index: index });
    this.xoffset(index);
    LayoutAnimation.configureNext({
      duration: 200,
      update: {
        type: 'easeInEaseOut'
      }
    });
  }

  onSetPage(index) {
    this.xoffset(index);
    this.refs.viewpager.setPage(index);
    LayoutAnimation.spring();
    this.setState({
      index: index
    })
  }

  xoffset(key){
    let { tabbar,index } = this.state;
    let s = 0;
    for(var i=0;i<key;i++){
      s+=tabbar[i].text.length*14+30
    }
    this.setState({
      xoffset:s
    })
    if(key>index){
      if(key>=3){
        this.refs.tabbar.scrollTo({x: 100, y: 0, animated: true})
      }
    }else{
      if(key<=1){
        this.refs.tabbar.scrollTo({x: 0, y: 0, animated: true})
      }
    }
  }

  render() {
    let { tabbar, index } = this.state;
    const { navigator } = this.props;
    let tabwidth = tabbar[index].text.length*14+30;
    return (
      <View style={styles.content}>
        <View style={[styles.tabbar,{backgroundColor: $.THEME_COLOR}]}>
          <ScrollView ref='tabbar' showsHorizontalScrollIndicator={false} horizontal={true}>
            {
              tabbar.map((el, i) => (
                <Touchable
                  onPress={() => this.onSetPage(i)}
                  style={styles.tabbaritem}
                  key={'tabbar' + i}
                  ><Text style={[styles.tabbartext,index===i&&{opacity:1}]}>{el.text}</Text></Touchable>
              ))
            }
            <View style={[styles.tabline,{width:tabwidth,left:this.state.xoffset}]}></View>
          </ScrollView>
        </View>
        <ViewPagerAndroid
          ref='viewpager'
          initialPage={index}
          onPageSelected={this.onPageScroll}
          style={styles.content}>
          {
            tabbar.map((el, i) => (
              <View key={'movielist' + i} style={styles.content}><MovieList type={0} sort={el.sort}  navigator={navigator} lazyload={i===index} /></View>
            ))
          }
        </ViewPagerAndroid>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  tabbar: {
    height: 40,
  },
  tabbaritem: {
    paddingHorizontal: 15,
    justifyContent: 'center',
  },
  tabline: {
    height: 3,
    borderRadius:2,
    width: 80,
    position:'absolute',
    bottom:1,
    backgroundColor: '#fff',
  },
  tabbartext: {
    fontSize: 14,
    opacity:.8,
    color: '#fff'
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabText: {
    fontSize: 10,
    color: '#666'
  },
});

module.exports = Home;
