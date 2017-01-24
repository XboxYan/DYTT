/**
 * index
 */
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Platform,
  DrawerLayoutAndroid,
  BackAndroid,
  ToastAndroid
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Orientation from 'react-native-orientation';
import Touchable from './common/touchable';
import TopBar from './common/topbar';
import Home from './home';
import Theme from './theme';
import History from './history';

class Item extends Component {
  render() {
    return (
      <Touchable style={styles.sideitem} onPress={this.props.onPress} >
        <Icon name={this.props.icon} size={20} color='#999' />
        <Text style={styles.itemtext}>{this.props.name}</Text>
      </Touchable>
    )
  }
}

class Index extends Component {
  constructor(props) {
    super(props);
    this.openDrawer = this.openDrawer.bind(this);
    this.onBackAndroid = this.onBackAndroid.bind(this);
    this.navigationView = this.navigationView.bind(this);
  }

  componentWillMount() {
    if (Platform.OS === 'android') {
      BackAndroid.addEventListener('hardwareBackPress', this.onBackAndroid)
    }
  }

  componentWillUnmount() {
    if (Platform.OS === 'android') {
      BackAndroid.removeEventListener('hardwareBackPress', this.onBackAndroid)
    }
  }

  componentDidMount() {
    Orientation.lockToPortrait(); 
  }

  onBackAndroid() {
    let navigator = this.props.navigator;
    const routers = navigator.getCurrentRoutes();
    if (routers.length > 1) {
      const top = routers[routers.length - 1];
      if (top.ignoreBack) {
        // 路由或组件上决定这个界面忽略back键
        return true;
      }
      const handleBack = top.handleBack;
      if (handleBack) {
        // 路由或组件上决定这个界面自行处理back键
        handleBack();
      } else {
        // 默认行为： 退出当前界面。
        navigator.pop();
      }
      return true;
    } else {
      if (this.lastBackPressed && this.lastBackPressed + 2000 >= Date.now()) {
        return false;
      }
      this.lastBackPressed = Date.now();
      ToastAndroid.show('再按一次退出应用', ToastAndroid.SHORT);
      return true;
    }
  }

  openDrawer() {
    this.drawer.openDrawer();
  }

  navigationView() {
    return (
      <View style={styles.sideView}>
        <View style={[styles.sideTop, { backgroundColor: $.THEME_COLOR }]}></View>
        <View style={styles.sideList}>
          <Item icon='sort' name='资源分类' />
          <View style={styles.line}></View>
          <Item icon='schedule' name='历史记录' onPress={() => this.props.navigator.push({ name: History })}  />
          <Item icon='favorite-border' name='喜欢' />
          <View style={styles.line}></View>
          <Item icon='colorize' name='主题颜色' onPress={() => this.props.navigator.push({ name: Theme })} />
          <Item icon='settings' name='设置' />
        </View>
      </View>
    )
  }

  render() {
    const { navigator } = this.props;
    return (
      <DrawerLayoutAndroid
        drawerWidth={250}
        ref={(drawer) => { this.drawer = drawer; } }
        drawerPosition={DrawerLayoutAndroid.positions.Left}
        renderNavigationView={this.navigationView}>
        <View style={styles.content}>
          <View style={[styles.header, { backgroundColor: $.THEME_COLOR }]}>
            <TopBar navigator={navigator} title='首页' openDrawer={this.openDrawer} />
          </View>
          <Home navigator={navigator} historyData={this.props.historyData} />
        </View>
      </DrawerLayoutAndroid>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: '#f1f1f1',
  },
  header: {
    paddingTop: $.STATUS_HEIGHT,
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
  sideView: {
    flex: 1,
    backgroundColor: '#fff'
  },
  sideTop: {
    height: 200
  },
  sideitem: {
    height: 50,
    paddingLeft: 20,
    flexDirection: 'row',
    alignItems: 'center'
  },
  itemtext: {
    flex: 1,
    paddingLeft: 10,
    fontSize: 16,
    color: '#666',
    alignItems: 'center'
  },
  sideList: {
    paddingTop: 10
  },
  line: {
    marginVertical: 10,
    backgroundColor: '#eee',
    height: 1 / $.PixelRatio
  }
});

module.exports = Index;