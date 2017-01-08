/**
 * Video
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  ToastAndroid,
  StatusBar,
  Platform,
  TouchableOpacity,
  Dimensions,
  View,
} from 'react-native';
import Login from '../login';
import { Video } from 'react-native-media-kit';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Touchable from './touchable';
import Slider from 'react-native-slider';
import Orientation from 'react-native-orientation';
import RNIdle from 'react-native-idle'

global.$FULLSCREEN = false;

const {width, height} = Dimensions.get('window');

const STATUS_HEIGHT = (Platform.Version && Platform.Version >= 19) ? StatusBar.currentHeight : 0;

const VIDEO_URI = 'http://ottserver.hrtn.net:8080/msis/getPlayURL?resolution=800*600&subID=99999999&terminalType=4&version=V001&resourceCode=';

class VideoCon extends Component {
  constructor(props) {
    super(props);
    $FULLSCREEN = false;
    this.state = {
      uri: '',
      hideStadus: false,
      fullScreen: false,
      uriIsReady: false
    };
    this.getUri = this.getUri.bind(this);
    this.setFullScreen = this.setFullScreen.bind(this);
    this.toLogin = this.toLogin.bind(this);
    this.jsStrtoTime = this.jsStrtoTime.bind(this);
    //处理安卓Back键
    const { navigator } = this.props;
    const routers = navigator.getCurrentRoutes();
    const top = routers[routers.length - 1];
    top.handleBack = this.handleBack.bind(this);
  }
  componentWillMount() {
    if ($USER_INFO.loginState) {
      this.getUri();
    } else {
      ToastAndroid.show('请先登录~', ToastAndroid.SHORT);
    }
  }

  componentDidMount() {
    RNIdle.disableIdleTimer();
  }

  componentWillUnmount() {
    RNIdle.enableIdleTimer();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.id != this.props.id || prevProps.time != this.props.time || prevProps.playType!= this.props.playType) {
      this.getUri();
    }
  }

  toLogin(callback) {
    if ($USER_INFO.loginState) {
      if (this.state.uriIsReady) {
        callback();
      } else {
        this.getUri(callback);
      }
    } else {
      this.props.navigator.push({ name: Login });
    }
  }
  setFullScreen() {
    if ($FULLSCREEN) {
      Orientation.lockToPortrait();
    } else {
      Orientation.lockToLandscape();
    }
    $FULLSCREEN = !$FULLSCREEN;
    this.setState({
      fullScreen: !this.state.fullScreen,
      hideStadus: false
    })
  }
  handleBack() {
    if (this.state.fullScreen) {
      this.setFullScreen();
    } else {
      this.refs.video.pause();
      //记录播放进度
      this.props.navigator.pop();
    }
  }

  jsStrtoTime(str_time) {
    var new_str = str_time.replace(/:/g, "-");
    new_str = new_str.replace(/ /g, "-");
    var arr = new_str.split("-");
    var datum = new Date(Date.UTC(arr[0], arr[1] - 1, arr[2], arr[3] - 8, arr[4], arr[5]));
    return strtotime = datum.getTime() / 1000;
  }

  getUri(callback) {
    const { id, playType, time } = this.props;
    let URL = `${VIDEO_URI}${id}&playType=${playType}&productCode=coship&userCode=${$USER_INFO.userName}&userName=${$USER_INFO.userName}&shifttime=${playType === 3 ? this.jsStrtoTime(time[0]) : ''}&shiftend=${playType === 3 ? this.jsStrtoTime(time[1]) : ''}`;
    fetch(URL)
      .then((response) => {
        if (response.ok) {
          return response.json()
        }
      })
      .then((responseData) => {
        if (responseData.palyURL) {
          this.setState({
            uri: responseData.palyURL,
            uriIsReady: true
          })
          this.refs.video.play();
          ToastAndroid.show('获取播放串成功~', ToastAndroid.SHORT);
          callback && callback();
        }
      })
      .catch(() => {
        ToastAndroid.show('网络有误~', ToastAndroid.SHORT);
        this.refs.video.pause();
      });
  }

  render() {

    return (
      <TouchableOpacity onPress={() => { this.setState({ hideStadus: !this.state.hideStadus }) } } activeOpacity={1} delayPressIn={0} style={[styles.videocon, this.state.fullScreen && styles.fullvideocon]}>
        <StatusBar animated={true} hidden={this.state.fullScreen} />
        <View pointerEvents={(!this.state.fullScreen|| this.state.hideStadus)?'none':'auto'} style={[styles.appbar, (!this.state.fullScreen || this.state.hideStadus) && { opacity: 0 }]}>
          <Touchable
            style={styles.btn}
            onPress={this.setFullScreen}
            >
            <Icon name='arrow-back' size={24} color='#fff' />
          </Touchable>
          <Text style={styles.apptitle} numberOfLines={1}>{this.props.title || ''}</Text>
          <View style={styles.btn}></View>
        </View>
        <Video
          style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
          src={this.state.uri}
          ref='video'
          autoplay={false}
          preload={'none'}
          loop={false}
          controls={!this.state.hideStadus}
          muted={false}
          setFullScreen={this.setFullScreen}
          toLogin={this.toLogin}
          />
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  videocon: {
    position: 'absolute',
    width: width,
    top: STATUS_HEIGHT + 50,
    left: 0,
    height: width * 9 / 16,
    backgroundColor: '#000',
    zIndex: 10
  },
  fullvideocon: {
    top: 0,
    left: 0,
    width: height,
    height: width,
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
  progress: {
    flex: 1,
    marginLeft: 10,
    marginRight: 10,
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  track: {
    height: 2,
    borderRadius: 0
  },
  thumb: {
    width: 14,
    height: 14,
    borderRadius: 20
  },
  innerProgressCompleted: {
    height: 3
  },
  innerProgressRemaining: {
    height: 3,
    backgroundColor: '#ccc',
  },
  actionbtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center'
  },
  timetext: {
    fontSize: 12,
    color: '#666'
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
  }
});

module.exports = VideoCon;
