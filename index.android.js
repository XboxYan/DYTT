/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import './const/global';
import React, { Component } from 'react';
import {
  AppRegistry,
  AsyncStorage,
  StatusBar,
  View,
  Navigator
} from 'react-native';

import Storage from 'react-native-storage';
import Index from './app';
import SplashScreen from 'react-native-splash-screen';

let storage = new Storage({
  // 最大容量，默认值1000条数据循环存储
  size: 1000,

  // 存储引擎：对于RN使用AsyncStorage，对于web使用window.localStorage
  // 如果不指定则数据只会保存在内存中，重启后即丢失
  storageBackend: AsyncStorage,

  // 数据过期时间，默认一整天（1000 * 3600 * 24 毫秒），设为null则永不过期
  defaultExpires: 1000 * 3600 * 24,

  // 读写时在内存中缓存数据。默认启用。
  enableCache: true,

  // 如果storage中没有相应数据，或数$据已过期，
  // 则会调用相应的sync同步方法，无缝返回最新数据。
  sync: {
    // 同步方法的具体说明会在后文提到
  }
})

if (!__DEV__) {
  global.console = {
    info: () => {},
    log: () => {},
    warn: () => {},
    error: () => {},
  };
}

global.storage = storage;

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
    }
  }

  renderScene(route, navigator) {
    let Component = route.name;
    return (
      <Component {...route.prams} navigator={navigator} route={route} />
    );
  }

  componentWillMount() {

  }

  componentDidMount() {
    storage.load({
      key: 'theme',
    }).then(ret => {
      $.THEME_COLOR = ret.color;
      $.THEME_INDEX = ret.index;
      this.setState({
        loaded: true
      })
      SplashScreen.hide();
    }).catch(err => {
      this.setState({
        loaded: true
      })
      SplashScreen.hide();
    })

    storage.load({
      key: 'history',
    }).then(ret => {
      global.$HISTORY = ret;
    }).catch(err => {
      global.$HISTORY = [];
    })

  }

  render() {
    return (
      this.state.loaded && <View style={{ flex: 1 }}>
        <StatusBar translucent={true} backgroundColor='transparent' />
        <Navigator
          initialRoute={{ name: Index }}
          configureScene={(route) => Object.assign(Navigator.SceneConfigs.PushFromRight, { defaultTransitionVelocity: 10, gestures: null })}
          renderScene={this.renderScene}
          />
      </View>
    );
  }
}

AppRegistry.registerComponent('DYTT', () => App);
