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
import Movie from '../movie';
import EmptyContent from '../common/emptycontent';

class Item extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSelect: false,
    }
    UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    //this.onHandle = this.onHandle.bind(this);
  }

  formatProgress = (timeSec) => {
    function zeroPad(s) {
      if (s.length === 1) {
        return '0' + s;
      }
      return s;
    }

    let hours = Math.floor(timeSec / 60.0 / 60.0).toFixed(0);
    let minutes = Math.floor(timeSec / 60.0 % 60.0).toFixed(0);
    let seconds = Math.floor(timeSec % 60.0).toFixed(0);

    if (hours < 0) {
      hours = 0;
    }
    if (minutes < 0) {
      minutes = 0;
    }
    if (seconds < 0) {
      seconds = 0;
    }

    hours = zeroPad(hours);
    minutes = zeroPad(minutes);
    seconds = zeroPad(seconds);

    return hours + ':' + minutes + ':' + seconds;
  }

  componentWillUpdate() {
    //LayoutAnimation.spring();
  }

  render() {
    let { isEdit, data } = this.props;
    let { isSelect } = this.state;
    return (
      <Touchable
        onPress={isEdit ? (() => this.setState({ isSelect: !isSelect })) : this.props.onPress}
        onLongPress={this.props.onLongPress}
        style={styles.item}>
        <Image style={styles.itemimg} source={{ uri: data.img }} />
        <View style={styles.itemtext}>
          <Text style={styles.itemname}>{data.name}</Text>
          <Text style={styles.itemtime}>上次观看/ [{data.isTv ? ('第' + (data.sourceIndex + 1) + '集') : ('资源' + (data.sourceIndex + 1))}] {this.formatProgress(data.current / 1000)}</Text>
        </View>
        {
          isEdit ? <Icon name={isSelect ? 'check-circle' : 'radio-button-unchecked'} size={24} color={isSelect ? $.THEME_COLOR : '#ccc'} /> : null
        }
      </Touchable>
    )
  }
}

class VideoHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      actions: false,
      isEdit: false,
      history: []
    }
    this.onHandle = this.onHandle.bind(this);
    //处理安卓Back键
    const { navigator } = this.props;
    const routers = navigator.getCurrentRoutes();
    const top = routers[routers.length - 1];
    this.handleBack = top.handleBack = this.handleBack.bind(this);
    UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  handleBack() {
    if (this.state.isEdit) {
      this.setState({
        isEdit: false,
      })
    } else {
      storage.save({
        key: 'history',  // 注意:请不要在key中使用_下划线符号!
        rawData: this.state.history,
        expires: null
      });
      this.props.navigator.pop();
    }
  }

  onHandle(id, dbid, isTv, current, sourceIndex) {
    this.props.navigator.push({ name: Movie, id: id, dbid: dbid, isTv: isTv, current: current, sourceIndex: sourceIndex })
  }

  onClear = () => {
    this.setState({
      history: [],
    })
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        actions: true,
        history: $HISTORY
      })
    })
  }
  render() {
    const { navigator } = this.props;
    let { history, actions, isEdit } = this.state;
    return (
      <View style={styles.content}>
        <View style={[styles.header, { backgroundColor: $.THEME_COLOR }]}>
          <AppBar title='历史记录' onPress={this.handleBack}>
            <Touchable onPress={this.onClear} style={styles.btn}><Text style={styles.btntext}>清空</Text></Touchable>
          </AppBar>
        </View>
        {
          actions ? (
            history.length ?
              <ScrollView style={styles.sublist}>
                <View style={styles.historylist}>
                  {
                    history.map((el, i) => (
                      <Item
                        onLongPress={() => (this.setState({ isEdit: true }))}
                        onPress={() => this.onHandle(el.id, el.dbid, el.isTv, el.current, el.sourceIndex)}
                        isEdit={isEdit}
                        data={el}
                        key={i} />
                    ))
                  }
                </View>
              </ScrollView> : <EmptyContent text='暂无历史记录~' />) : <Loading />
        }
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
    flex: 1,
    padding: 10,
  },
  historylist: {
    flexDirection: 'column-reverse'
  },
  header: {
    paddingTop: $.STATUS_HEIGHT,
  },
  item: {
    padding: 8,
    marginBottom: 8,
    backgroundColor: '#fff',
    borderRadius: 2,
    flexDirection: 'row',
    alignItems: 'center'
  },
  itemimg: {
    width: 100,
    height: 60,
    resizeMode: 'cover',
    borderRadius: 2,
    marginRight: 10,
    alignSelf: 'flex-start'
  },
  itemtext: {
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  itemname: {
    fontSize: 16,
    paddingBottom: 8,
    color: '#333'
  },
  itemtime: {
    fontSize: 14,
    color: '#999'
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
