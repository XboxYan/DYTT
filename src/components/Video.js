/**
 * Video
 */

import React, { PureComponent } from 'react';
import {
    ActivityIndicator,
    TouchableOpacity,
    StyleSheet,
    NativeModules,
    Slider,
    PanResponder,
    Text,
    LayoutAnimation,
    View,
} from 'react-native';

import Touchable from './Touchable';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/Feather';
import IconF from 'react-native-vector-icons/FontAwesome5';

const { UIManager } = NativeModules;

const timeFormat =(timeSec, containHours) => {
    function zeroPad(s) {
      if (s.length === 1) {
        return '0' + s;
      }
      return s;
    }
  
    let hours = Math.floor(timeSec / 60.0 / 60.0).toFixed(0);
    let minutes = Math.floor(timeSec / 60.0 % 60.0).toFixed(0);
    let seconds = Math.floor(timeSec % 60.0).toFixed(0);
  
    if(hours < 0) {
      hours = 0;
    }
    if (minutes < 0) {
      minutes = 0;
    }
    if(seconds < 0) {
      seconds = 0;
    }
  
    hours = zeroPad(hours);
    minutes = zeroPad(minutes);
    seconds = zeroPad(seconds);
  
    if (containHours) {
      return hours + ':' + minutes + ':' + seconds;
    }
    return minutes + ':' + seconds;
  }

const VideoBar = ({themeColor,toSeek,toPlay,playableDuration,currentTime,duration,isFull,paused,toFull,isShowBar}) => (
    <View style={[styles.videobar,!isShowBar&&{bottom:-40}]}>
        {
            /*
            <Touchable
                onPress={toPlay}
                style={styles.videobtn}
            >
                <Icon name={paused?'play':'pause'} size={20} color='#fff' />
                {
                    //<IconE name={paused?'controller-play':'controller-paus'} size={22} color='#fff' />
                }
            </Touchable>
            */
        }
        <Text style={styles.videotime}><Text style={{color:themeColor}}>{timeFormat(currentTime)}</Text>{' / '+timeFormat(duration)}</Text>
        <View style={styles.videoslider}>
            <Slider
                style={styles.videosliderbar}
                value={currentTime}
                onValueChange={(value)=>toSeek(value,false,true)}
                onSlidingComplete={(value)=>toSeek(value,true,true)}
                maximumValue={duration}
                maximumTrackTintColor="#fff"
                minimumTrackTintColor={themeColor}
                thumbTintColor={themeColor}
            />
            <View pointerEvents="none" style={[styles.videoslidercon,{backgroundColor:themeColor,flex:playableDuration}]}/>
            <View pointerEvents="none" style={[styles.videoslidercon,{flex:duration-playableDuration}]}/>
        </View>
        <Touchable
            onPress={toFull}
            style={styles.videobtn}
        >
            <Icon name={isFull?'minimize':'maximize'} size={20} color='#fff' />
        </Touchable>
        <View pointerEvents="none" style={[styles.progresscon,isShowBar&&{opacity:0}]}>
            <View style={[styles.progressbar,{backgroundColor:themeColor,flex:currentTime}]}/>
            <View style={[styles.progressbar,{backgroundColor:themeColor,opacity:.5,flex:playableDuration>currentTime?playableDuration-currentTime:0}]}/>
            <View style={[styles.progressbar,{flex:duration-currentTime}]}/>
        </View>
    </View>
)

export default class extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            duration: 0,
            playableDuration: 0,
            currentTime: 0,
            $currentTime: 0,
            paused: true,
            isBuffering:true,
            isFull:false,
            isError:false,
            isShowBar:false,
            isEnd:false
        };
        UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    }

    /*
    * to + 方法名  
    * 主动调用方法
    */
    toFull = () => {
        this.setState({isFull: !this.state.isFull})
        this.video.presentFullscreenPlayer()
    }

    toPlay = () => {
        if(this.state.isReady){
            this.toShowBar(this.state.paused);
            this.setState({ 
                paused: !this.state.paused,
                isEnd:false
            });
        }
    }

    toPause = () => {
        this.setState({ paused: true });
    }

    toSeek = (value,bool,show) => {
        LayoutAnimation.easeInEaseOut();
        this.setState({
            currentTime: value,
        });
        if(bool){
            this.video.seek(value);
        }else{
            this.isSeeking = true;
        }
        if(show){
            this.toShowBar(true);
        }
    }

    toHideBar = () => {
        this.timer&&clearTimeout(this.timer);
        LayoutAnimation.easeInEaseOut();
        this.setState({
            isShowBar:false
        })
    }

    toShowBar = (bool) => {
        this.timer&&clearTimeout(this.timer);
        LayoutAnimation.easeInEaseOut();
        this.setState({
            isShowBar:true
        })
        if(bool){
            this.timer = setTimeout(()=>{
                this.toHideBar()
            },5000)
        }
    }

    /*
    * on + 方法名  
    * 回调方法
    */

    onFullscreenPlayerDidPresent = () => {
        //console.warn('onFullscreenPlayerDidPresent')
    }

    onLoad = (data) => {
        this.setState({
            isReady: true,
            duration: data.duration,
            paused:false
        });
        //this.toShowBar(true);
    }

    onEnd = () => {
        this.toSeek(0,true);
        this.timer&&clearTimeout(this.timer);
        LayoutAnimation.easeInEaseOut();
        this.setState({
            paused:true,
            isEnd:true
        })
    }

    onBuffer = (event) => {
        this.setState({
            isBuffering:event.isBuffering
        })
    }

    onError = (event) => {
        this.setState({
            isError:true,
            isBuffering:false
        })
    }

    onProgress = (data) => {
        if(!this.isSeeking){
            LayoutAnimation.easeInEaseOut();
            this.setState({ 
                currentTime: data.currentTime,
                playableDuration: data.playableDuration
            });
        }
    };

    onSeek = (data) => {
        this.isSeeking = false;
        this.setState({ 
            currentTime: data.seekTime,
        });
    }

    onTimedMetadata = (data) => {
        //console.warn(data)
    }

    //手势
    onPanResponderGrant = () => {
        this.$currentTime = this.state.currentTime;
        this.$duration = this.state.duration;
        this.$isMoved = false;
    }

    onPanResponderMove = (evt, gestureState) => {

        if(Math.abs(gestureState.dx)>20||Math.abs(gestureState.dy)>20){
            if(!this.$isMoved){
                this.$isMoved = true;
                this.setState({$isMove:true})
            }
        }
        
        if(Math.abs(gestureState.dx)>20){
            
            this._isSet = true;
        }

        //进度
        if(this._isSet&&Math.abs(gestureState.dy)<30){
            let current = this.$currentTime+gestureState.dx*.2;
            if(current < 0){
                current = 0;
            }
            if(current > this.$duration){
                current = this.$duration;
            }
            this._currentTime = current;
            this.setState({$currentTime:current});
        }else{
            this.setState({$isMove:false})
            this._isSet = false;
        }

    }

    onPanResponderRelease = (evt, gestureState) => {
        if(this._isSet){
            this._isSet = false;
            this.setState({
                $isMove:false,
            });
            this.toSeek(this._currentTime, true);
            // this.video.seek(_currentTime);
        }
        if(!this.$isMoved){
            const {isShowBar} = this.state;
            if(isShowBar){
                this.toHideBar();
            }else{
                this.toShowBar(true);
            }
        }
    }

    componentWillMount() {
        this._panResponder = PanResponder.create({
            // 要求成为响应者：
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
            onMoveShouldSetPanResponder: (evt, gestureState) => true,
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

            onPanResponderGrant: this.onPanResponderGrant,
            onPanResponderMove: this.onPanResponderMove,
            onPanResponderTerminationRequest: (evt, gestureState) => true,
            onPanResponderRelease: this.onPanResponderRelease,
            onPanResponderTerminate: (evt, gestureState) => {
                // 另一个组件已经成为了新的响应者，所以当前手势将被取消。
            },
            onShouldBlockNativeResponder: (evt, gestureState) => {
                // 返回一个布尔值，决定当前组件是否应该阻止原生组件成为JS响应者
                // 默认返回true。目前暂时只支持android。
                return false;
            },
        });
    }

    componentWillUnmount(){
        this.timer&&clearTimeout(this.timer);
    }

    render(){
        const {style,uri,themeColor} = this.props;
        const {paused,isReady,currentTime,duration,playableDuration,isBuffering,isFull,isError,isEnd,isShowBar,$isMove,$currentTime} = this.state;
        return (
            <View style={[styles.container,style]}>
                <Video
                    ref={(ref) => this.video = ref}
                    style={styles.fullScreen}
                    useTextureView={false}
                    progressUpdateInterval={1000}
                    source={{uri:uri}}
                    paused={paused}
                    resizeMode="contain"
                    onFullscreenPlayerDidPresent={this.onFullscreenPlayerDidPresent}
                    onLoad={this.onLoad}
                    onProgress={this.onProgress}
                    onSeek={this.onSeek}
                    onBuffer={this.onBuffer}
                    onEnd={this.onEnd}
                    onError={this.onError}
                    onTimedMetadata={this.onTimedMetadata}
                    bufferConfig={{
                        minBufferMs: 500000,
                        maxBufferMs: 1500000,
                        bufferForPlaybackMs: 50000,
                        bufferForPlaybackAfterRebufferMs: 100000
                    }}
                    repeat={false}
                />
                <ActivityIndicator pointerEvents="none" color='#fff' size='small' style={!isBuffering&&{opacity:0}} />
                <Text pointerEvents="none" style={[styles.tips,!isError&&{opacity:0}]}>╮(╯﹏╰）╭ 抱歉，视频播放失败</Text>
                <Text pointerEvents="none" style={[styles.tips,(!(isEnd&&!currentTime))&&{opacity:0}]}>播放完成</Text>
                <Text pointerEvents="none" style={[styles.showTime,!$isMove&&{opacity:0}]}>
                    <Text style={{color:themeColor}}>{timeFormat($currentTime)}</Text>
                     /{timeFormat(duration)}
                </Text>
                <View pointerEvents={(isShowBar||paused)?"auto":"none"} style={[styles.playbtnWrap,(!isShowBar&&!paused||!isReady)&&{opacity:0}]} ><TouchableOpacity style={styles.playbtn} activeOpacity={.8} onPress={this.toPlay}><IconF name={paused?'play':'pause'} size={20} color={'#fff'} /></TouchableOpacity></View>
                <View {...this._panResponder.panHandlers} style={[styles.fullScreen,{zIndex:5}]}></View>
                <VideoBar
                    paused={paused}
                    isShowBar={isShowBar}
                    themeColor={themeColor}
                    currentTime={currentTime}
                    playableDuration={playableDuration}
                    duration={duration}
                    isFull={isFull}
                    toSeek={this.toSeek}
                    toPlay={this.toPlay}
                    //onSection={onSection}
                    //actionBar={actionBar}
                    toFull={this.toFull}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
        zIndex:10,
        overflow: 'hidden',
    },
    fullScreen: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
    videobar:{
        position: 'absolute',
        zIndex:10,
        left: 0,
        bottom: 0,
        right: 0,
        flexDirection:'row',
        alignItems: 'center',
        backgroundColor:'rgba(0,0,0,.7)'
    },
    videobtn:{
        width:40,
        height:40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    videoslider:{
        flex:1,
        flexDirection:'row',
        alignItems: 'center',
    },
    videosliderbar:{
        position:'absolute',
        left:-16,
        right:-16,
    },
    videoslidercon:{
        height:2,
        opacity:.5
    },
    videotime:{
        fontSize:12,
        color:'#fff',
        paddingHorizontal:10,
    },
    showTime:{
        position: 'absolute',
        zIndex:20,
        backgroundColor:'rgba(0,0,0,.7)',
        color:'#fff',
        top:'10%',
        fontSize:18,
        paddingHorizontal:10,
        paddingVertical:5,
        borderRadius:5
    },
    tips:{
        color:'#fff',
        position:'absolute'
    },
    progresscon:{
        position:'absolute',
        top:-2,
        left:0,
        right:0,
        height:2,
        flexDirection:'row'
    },
    progressbar:{
        height:2,
        backgroundColor:'rgba(255,255,255,.7)'
    },
    playbtnWrap:{
        position:'absolute',
        zIndex:15
    },
    playbtn:{
        width:50,
        height:50,
        borderRadius:100,
        backgroundColor:'rgba(0,0,0,.7)',
        justifyContent: 'center',
        alignItems: 'center',
    }
});