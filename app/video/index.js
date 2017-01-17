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
import { Video } from 'react-native-media-kit';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Touchable from '../common/touchable';
import Orientation from 'react-native-orientation';
import RNIdle from 'react-native-idle'

global.$FULLSCREEN = false;

class VideoCon extends Component {
  constructor(props) {
    super(props);
    $FULLSCREEN = false;
    this.state = {
      uri: '',
      hideStadus: false,
      fullScreen: false,
    };
    this.setFullScreen = this.setFullScreen.bind(this);
    //处理安卓Back键
    const { navigator } = this.props;
    const routers = navigator.getCurrentRoutes();
    const top = routers[routers.length - 1];
    top.handleBack = this.handleBack.bind(this);
  }
  componentWillMount() {

  }

  componentDidMount() {
    RNIdle.disableIdleTimer();
  }

  componentWillUnmount() {
    RNIdle.enableIdleTimer();
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


  render() {
    let { route } = this.props;
    return (
      <TouchableOpacity onPress={() => { this.setState({ hideStadus: !this.state.hideStadus }) } } activeOpacity={1} delayPressIn={0} style={[styles.videocon, this.state.fullScreen && styles.fullvideocon]}>
        <StatusBar animated={true} hidden={this.state.fullScreen} />
        <View pointerEvents={(!this.state.fullScreen|| this.state.hideStadus)?'none':'auto'} style={[styles.appbar, (!this.state.fullScreen || this.state.hideStadus) && { opacity: 0 }]}>
          <Touchable
            style={styles.btn}
            onPress={this.setFullScreen}
            >
            <Icon name='keyboard-arrow-left' size={30} color='#fff' />
          </Touchable>
          <Text style={styles.apptitle} numberOfLines={1}>{route.title || ''}</Text>
          <View style={styles.btn}></View>
        </View>
        <Video
          style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
          src={route.playUrl}
          ref='video'
          autoplay={true}
          preload='auto'
          loop={false}
          controls={!this.state.hideStadus}
          muted={false}
          setFullScreen={this.setFullScreen}
          />
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  videocon: {
    width: $.WIDTH,
    left: 0,
    height: $.WIDTH * 9 / 16,
    backgroundColor: '#000',
    zIndex: 10
  },
  fullvideocon: {
    width: $.HEIGHT,
    height: $.WIDTH,
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
