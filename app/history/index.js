/**
 * VideoHistory
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Image,
  ToastAndroid,
  TouchableOpacity,
  ListView,
  UIManager,
  LayoutAnimation,
  InteractionManager
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Touchable from '../common/touchable';
import Loading from '../common/loading';
import AppBar from '../common/appbar';

const THEME_COLOR = ['#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3', '#304FFE', '#2962FF', '#009688', '#4CAF50', '#689F38', '#FDD835', '#FFB300', '#FF8F00', '#FF6F00', '#EF6C00', '#FF6D00', '#FF5722', '#F4511E', '#FF3D00', '#795548', '#607D8B', '#757575', '#212121']

class VideoHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      actions: false,
      dataSource: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2,
      }),
    }
    this.onChange = this.onChange.bind(this);
    this.onSet = this.onSet.bind(this);
    UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  onChange(el, i) {
    this.setState({
      theme_index: i,
      theme_color: el
    })
  }

  onSet() {
    $.THEME_COLOR = this.state.theme_color;
    $.THEME_INDEX = this.state.theme_index;
    storage.save({
      key: 'theme',  // 注意:请不要在key中使用_下划线符号!
      rawData: {
        color: this.state.theme_color,
        index: this.state.theme_index
      },
      expires: null
    });
    this.props.navigator.pop();
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        actions: true
      })
    })
  }
  render() {
    const { navigator } = this.props;
    let { theme_index, theme_color, actions } = this.state;
    return (
      <View style={styles.content}>
        <View style={[styles.header, { backgroundColor: $.THEME_COLOR }]}>
          <AppBar title='历史记录' navigator={navigator}>
            
          </AppBar>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: '#f1f1f1'
  },
  sublist: {
    flexWrap: 'wrap',
    padding: 5,
  },
  header: {
    paddingTop: $.STATUS_HEIGHT,
  },
  themeview:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  themecon:{
    borderWidth:2,
    borderColor:'#fff'
  },
  themeimg:{
    width:$.WIDTH/1.5,
    height:$.HEIGHT/1.5,
    resizeMode: 'cover',
  },
  colorlist: {
    height: 70,
    padding: 5,
    backgroundColor:'#fff'
  },
  coloritem: {
    width: 50,
    height: 50,
    borderRadius: 3,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btn: {
    height: 50,
    paddingHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btntext: {
    fontSize: 14,
    color: '#fff'
  }

});

module.exports = VideoHistory;
