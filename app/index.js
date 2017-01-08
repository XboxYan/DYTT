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
import Touchable from './common/touchable';
import TopBar from './common/topbar';
import Home from './home';
//import Orientation from 'react-native-orientation';


class Index extends Component {
  constructor(props) {
    super(props);
    this.openDrawer = this.openDrawer.bind(this);
    this.onBackAndroid = this.onBackAndroid.bind(this);
    this.state = {
      //selectedTab: Home,
    }
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

    //Orientation.lockToPortrait();
    storage.load({
      key: 'user',
    }).then(ret => {
      // 如果找到数据，则在then方法中返回
      //ToastAndroid.show('用户登录成功~', ToastAndroid.SHORT);
    }).catch(err => {
      // 如果没有找到数据且没有同步方法，
      // 或者有其他异常，则在catch中返回
      //ToastAndroid.show('用户未登录~', ToastAndroid.SHORT);
    })
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

  render() {
    const { navigator } = this.props;
    var navigationView = (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <Text style={{margin: 10, fontSize: 15, textAlign: 'left'}}>I'm in the Drawer!</Text>
    </View>
  );
    return (
      <DrawerLayoutAndroid
        drawerWidth={250}
        ref={(drawer) => { this.drawer = drawer; }}
        drawerPosition={DrawerLayoutAndroid.positions.Left}
        renderNavigationView={() => navigationView}>
        <View style={styles.content}>
            <View style={styles.header}>
                <TopBar title='首页' openDrawer={this.openDrawer} />
            </View>
            <Home navigator={navigator} />
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
    backgroundColor: $.THEME_COLOR,
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
});

module.exports = Index;
