import React, { PureComponent } from 'react';
import {
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    InteractionManager,
    Platform,
    BackHandler,
    FlatList,
    Animated,
    Image,
    LayoutAnimation,
    View,
    NativeModules
} from 'react-native';
import Orientation from 'react-native-orientation';
import { BorderlessButton } from 'react-native-gesture-handler';
import Star from '../components/Star';
import Loading from '../components/Loading';
import CommentList from '../components/CommentList';
import MovieMoreBtn from '../components/MovieMoreBtn';
import Icon from 'react-native-vector-icons/Feather';
import IconE from 'react-native-vector-icons/Entypo';
import IconM from 'react-native-vector-icons/MaterialIcons';
import Video from '../components/Video';
import { GetVideoInfo,GetSameVideo,GetDoubanInterests } from '../../util/api';
import { Store } from '../../util/store';

const { UIManager } = NativeModules;

const Appbar = ({themeColor,isFull,scrollTop,name,hasFollow,isRender,setFollow,goBack}) => (
    <View pointerEvents={isFull?'none':'auto'} style={[styles.appbar,isFull&&{ opacity:0 }]}>
        <BorderlessButton
            activeOpacity={.8}
            style={styles.btn}
            onPress={goBack}
        >
            <Icon name='chevron-left' size={24} color='#fff' />
        </BorderlessButton>
        <View style={styles.apptitle}>
            <Text style={styles.apptitletext}>{name||'影视详情'}</Text>
        </View>
        <BorderlessButton activeOpacity={.8} style={styles.btn} onPress={isRender?setFollow:null} >
            <IconM name={hasFollow?'favorite':'favorite-border'} size={20} color='#fff' />
        </BorderlessButton>
        <Animated.View style={[styles.fullcon, { backgroundColor: themeColor }, {
            opacity: scrollTop.interpolate({
                inputRange: [$.STATUS_HEIGHT, $.STATUS_HEIGHT + 150],
                outputRange: [0, 1]
            })
        }]} />
    </View>
)

const MovieInfo = ({movieInfo,themeColor,isPlaying,onPlay,isRender}) => (
    <View style={styles.videosInfo}>
        <View style={styles.poster}>
            <Image source={{ uri: movieInfo.Cover }} style={[styles.fullcon, styles.borR]} />
            <TouchableOpacity disabled={!isRender} onPress={onPlay} activeOpacity={.8} style={[styles.playbtn, { backgroundColor: themeColor }]}>
                <IconE name='controller-play' style={{marginLeft:3}} size={24} color='#fff' />
            </TouchableOpacity>
        </View>
        <View style={[styles.postertext,isPlaying&&{height:($.WIDTH-40)*9/16}]}>
            <Text style={[styles.title, { color: themeColor }]}>{movieInfo.Name||'正在加载...'}</Text>
            <Star style={styles.score} score={movieInfo.Score} themeColor={themeColor} />
            {
                movieInfo.MovieTitle ? <Text style={styles.status}>{movieInfo.MovieTitle}</Text>:null
            }
            <Text style={styles.subtitle}>{movieInfo.Tags}</Text>
            <Text style={styles.subtitle}>{movieInfo.ReleaseDate} 上映</Text>
        </View>
    </View>
)

const SortTitle = (props) => (
    <View style={styles.view_hd}>
        <Icon name={props.icon} size={16} color={props.themeColor}/>
        <Text style={styles.view_title}>{props.title}</Text>
        {
            props.children || null
        }
    </View>
)

class MovieSummary extends PureComponent {
    state = {
        isMore:false
    }

    expand = () => {
        LayoutAnimation.spring();
        this.setState({isMore:!this.state.isMore})
    }

    render () {
        const {summary,isRender,themeColor} = this.props;
        const {isMore} = this.state;
        return (
            <View style={styles.viewcon}>
                <SortTitle title='剧情' icon="compass" themeColor={themeColor}>
                    {
                        isRender &&
                        <TouchableOpacity
                            onPress={this.expand}
                            style={styles.view_more}
                        >
                            <Text style={styles.view_moretext}>{isMore ? '收起' : '展开'}</Text>
                            <Icon name={isMore ? 'chevron-up' : 'chevron-down'} size={16} color={themeColor} />
                        </TouchableOpacity>
                    }
                </SortTitle>
                <View style={styles.con}>
                    {
                        isRender
                            ?
                            <Text numberOfLines={isMore ? 0 : 5} style={styles.text}>{summary}</Text>
                            :
                            <Loading size='small' text='' themeColor={themeColor} />
                    }
                </View>
            </View>
        )
    }
}

class MovieSource extends PureComponent {

    columns = [];

    constructor(props) {
        super(props);
        this.state = {
            source:props.source||[],
            dir:true
        }
    }

    onLayout = (index) => (ev) => {
        const {width} = ev.nativeEvent.layout;
        this.columns[index] = width;
    }

    changeDir = () => {
        this.setState({
            source:[...this.state.source.reverse()],
            dir:!this.state.dir
        })
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.isRender !== this.props.isRender) {
            this.setState({
                source:nextProps.source,
            },()=>{
                setTimeout(()=>{
                    const index = nextProps.source.findIndex(el=>el.ID==nextProps.sourceId);
                    this.flatlist.scrollToIndex({index,viewPosition:.5});
                },1000)
            })
        }
    }

    renderItem = ({ item, index }) => {
        const {sourceId,onPlay,themeColor} = this.props;
        const current = sourceId==item.ID;
        
        const play = () => {
            onPlay(item.ID,true);
        }
        return (
            <TouchableOpacity disabled={current} onLayout={this.onLayout(index)} style={styles.sourceitem} onPress={play} activeOpacity={.9}>
                <Text numberOfLines={2} style={styles.castname}>{item.Name || '资源'+(index+1)}</Text>
                <View style={[styles.sourcedot, { backgroundColor: themeColor }, current && { opacity: 1 }]} />
            </TouchableOpacity>
        )
    }

    getItemLayout = (data, rowIndex) => {
        let offset = 0;
        for (let ii = 0; ii < rowIndex; ii += 1) {
          offset += this.columns[ii]+10;
        }
        return { length: this.columns[rowIndex]+10, offset, index: rowIndex };
    };

    renderFooter = () => (
        <View style={{width:30,height:10}} />
    )

    render () {
        const {isRender,themeColor,sourceId} = this.props;
        const {source,dir} = this.state;
        return (
            <View style={styles.viewcon}>
                <SortTitle title={`选集(${source.length})`} icon="grid" themeColor={themeColor}>
                {
                    source.length>1&&
                    <TouchableOpacity
                        onPress={this.changeDir}
                        style={styles.view_more}
                    >
                        <Text style={styles.view_moretext}>{dir?'正常':'最新'}</Text>
                        <Icon name={dir ? 'chevron-right' : 'chevron-left'} size={16} color={themeColor} />
                    </TouchableOpacity>
                }
                </SortTitle>
                {
                    isRender
                        ?
                        <FlatList
                            ref={(ref) => this.flatlist = ref}
                            style={styles.sourcelist}
                            showsHorizontalScrollIndicator={false}
                            ListFooterComponent={this.renderFooter}
                            horizontal={true}
                            ItemSeparatorComponent={() => <View style={{width:10}} />}
                            //initialNumToRender={20}
                            getItemLayout={this.getItemLayout}
                            removeClippedSubviews={false}
                            data={source}
                            extraData={sourceId}
                            keyExtractor={(item, index) => item.ID.toString()}
                            renderItem={this.renderItem}
                        />
                        :
                        <Loading size='small' text='' themeColor={themeColor} />
                }
            </View>
        )
    }
}

class MovieSame extends PureComponent {
    state = {
        isFetch:false,
        sameVideo:[]
    }

    GetSameVideo = async (vName,movieId) => {
        const data = await GetSameVideo(vName,movieId)||[];
        this.setState({
            sameVideo:data,
            isFetch:true,
        })
        LayoutAnimation.easeInEaseOut();
    }

    renderItem = ({ item, index }) => {
        const {navigation} = this.props;

        return (
            <TouchableOpacity
                activeOpacity={.9}
                onPress={() => navigation.replace('MovieDetail',{movieId:item.ID})}
                style={styles.movieitem}>
                <Image 
                    style={styles.movieimg}
                    source={{uri:item.Cover||'http'}}
                />
                <View style={styles.movietext}>
                    <Text numberOfLines={1} style={styles.moviename}>{item.Name}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    renderFooter = () => (
        <View style={{width:20,height:100}} />
    )

    componentWillReceiveProps(nextProps) {
        // if (nextProps.isRender !== this.props.isRender) {
        //     const {Name,ID} = nextProps.movieInfo;
        //     this.GetSameVideo(Name,ID);
        // }
    }

    render () {
        const {isRender,themeColor,movieInfo:{RelateList}} = this.props;
        //const {isFetch,sameVideo} = this.state;
        return (
            <View style={styles.viewcon}>
                <SortTitle title='相关热播' icon="cast" themeColor={themeColor}/>
                {
                    isRender
                        ?
                        (
                            RelateList.length>0?
                            <View style={{height:180}}>
                                <FlatList
                                    style={{flex:1,paddingHorizontal:10}}
                                    showsHorizontalScrollIndicator={false}
                                    horizontal={true}
                                    removeClippedSubviews={true}
                                    ItemSeparatorComponent={() => <View style={{width:10}} />}
                                    ListFooterComponent={this.renderFooter}
                                    data={RelateList}
                                    getItemLayout={(data, index) => ( {length: 110, offset: 110 * index, index} )}
                                    keyExtractor={(item, index) => item.ID.toString()}
                                    renderItem={this.renderItem}
                                />
                            </View>
                            :
                            <Text style={styles.empty}>╮(╯﹏╰）╭ 暂无相关热播</Text>
                        )
                        :
                        <Loading size='small' text='' themeColor={themeColor} />
                }
            </View>
        )
    }
}

class MovieComments extends PureComponent {

    state = {
        isFetch:false,
        data:[],
        height:null
    }

    GetDoubanInterests = async (DBID) => {
        const data = await GetDoubanInterests({DBID});
        this.setState({
            data:data.interests||[],
            isFetch:true
        })
    }

    onLayout = (ev) => {
        const {height} = ev.nativeEvent.layout;
        if(height>0){
            this.setState({height});
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.isRender !== this.props.isRender) {
            const DBID = nextProps.DBID;
            this.GetDoubanInterests(DBID);
        }
    }

    render(){
        const {isRender,themeColor,navigation,DBID} = this.props;
        const {isFetch,data,height} = this.state;
        return(
            <View style={styles.viewcon}>
                <SortTitle title='豆瓣影评' icon='message-circle' themeColor={themeColor} />
                <View>
                    {
                        isRender&&isFetch
                            ?
                            <View style={{height:height,marginTop:-10}}><CommentList isRender={isFetch} data={data} onLayout={this.onLayout} themeColor={themeColor} /></View>
                            :
                            <Loading size='small' text='' themeColor={themeColor} />
                    }
                </View>
                <MovieMoreBtn show={data.length>=5} themeColor={themeColor} style={{backgroundColor:'#f1f1f1',marginBottom:0}} text='查看更多评论' onPress={()=>navigation.navigate('Comment',{DBID})} />
            </View>
        )
    }
}

export default class MovieDetail extends PureComponent {

    constructor(props) {
        super(props);
        UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
        this.state = {
            isRender:false,
            movieInfo:{},
            sourceId:null,
            sourceName:'',
            hasFollow:false,
            isPlaying:false,
            isFull:false,
            playUrl:null,
            seekTime:0
        }
    }

    scrollTop = new Animated.Value(0);

    scrollRotate = new Animated.Value(0);

    GetVideoInfo = async (movieId) => {
        const { findHistory,findFollow } = this.context;
        const data = await GetVideoInfo(movieId)||{};
        if(this.mounted){
            const historyItem = findHistory(movieId);
            const hasFollow = findFollow(movieId);
            let _sourceId = null;
            if(historyItem){
                this.lastPlayTime = historyItem.currentTime-3;
                _sourceId = historyItem.sourceId;
            }else{
                _sourceId = data.MoviePlayUrls[0].ID;
            }
            const item = data.MoviePlayUrls.find(el=>el.ID==_sourceId||el.Name==historyItem.sourceName);
            //this.PlayUrl = item.PlayUrl;
            this.setState({
                movieInfo:data,
                sourceName:item.Name,
                isRender:true,
                sourceId:item.ID,
                seekTime:this.lastPlayTime||0,
                playUrl:item.PlayUrl,
                hasFollow:hasFollow
            })
            LayoutAnimation.easeInEaseOut();
        }
    }

    setFollow = () => {
        const { setFollow } = this.context;
        const { movieInfo:{ID,Name,Cover} } = this.state;
        this.setState({hasFollow:!this.state.hasFollow});
        setFollow({
            id:ID,
            name:Name,
            img:Cover
        })
    }

    onplayRotate = (bool) => {
        Animated.timing(
            this.scrollRotate,
            {
                toValue: bool?1:0,
                duration: 500,
                //useNativeDriver: true
            }                              
        ).start();
        this.setState({isPlaying:bool})
        this.video.toPlay(bool);
        LayoutAnimation.easeInEaseOut();
    }

    onPlay = (ID,bool) => {
        if(bool){
            //跳转
            this.lastPlayTime = null;
            const {movieInfo} = this.state;
            const item = movieInfo.MoviePlayUrls.find(el=>el.ID==ID);
            this.setState({
                sourceId:item.ID,
                sourceName:item.Name,
                seekTime:0,
                playUrl:item.PlayUrl,
            })
        }
        this.hasPlay = true;
        this.onplayRotate(true);
    }

    onClose = () => {
        this.onplayRotate(false);
    }

    onfullChanged = (isFull) => {
        this.setState({isFull});
        if(isFull){
            this.scrollview.getNode().scrollTo({y:$.STATUS_HEIGHT + 48});
            Orientation.lockToLandscape();
        }else{
            this.scrollview.getNode().scrollTo({y:0});
            Orientation.lockToPortrait();
        }
    }
    
    onBackAndroid = () => {
        const { isPlaying,isFull } = this.state;
        if(isFull){
            this.video.toFull(false);
        }else{
            if(isPlaying){
                this.onClose();
                this.scrollview.getNode().scrollTo({y:0});
            }else{
                const { navigation } = this.props;
                navigation.goBack();
            }
        }
        return true;
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            const { params: { movieId } } = this.props.navigation.state;
            this.GetVideoInfo(movieId);
        })
    }

    componentWillMount() {
        this.mounted = true;
        if (Platform.OS === 'android') {
            BackHandler.addEventListener('handwareBackPress', this.onBackAndroid)
        }
    }


    componentWillUnmount() {
        this.mounted = false;
        if (Platform.OS === 'android') {
            BackHandler.removeEventListener('handwareBackPress', this.onBackAndroid)
        }
        const { addHistory } = this.context;
        const { movieInfo:{ID,Name,Cover},isRender,sourceName,sourceId } = this.state;
        if(isRender){
            const { currentTime,duration,isEnd } = this.video.state;
            if(this.hasPlay && (currentTime>=10||isEnd)){
                //大于10s才保存历史记录
                const now = new Date();
                addHistory({
                    currentTime,
                    duration,
                    isEnd,
                    id:ID,
                    img:Cover,
                    name:Name,
                    sourceName,
                    sourceId,
                    //date:new Date()
                    date:[now.getFullYear(),now.getMonth()+1,now.getDate(),now.getHours(),now.getMinutes()]
                })
            }
        }
    }

    render() {
        const {navigation,screenProps:{themeColor}} = this.props;
        const { movieInfo,isRender,isPlaying,sourceId,playUrl,hasFollow,seekTime,isFull } = this.state;
        return (
            <View style={styles.content}>
                <Animated.ScrollView
                    ref={(ref) => this.scrollview = ref}
                    showsVerticalScrollIndicator={false}
                    style={{flex:1}}
                    scrollEnabled={!isFull}
                    stickyHeaderIndices={[0]}
                    //scrollEventThrottle={1}
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { y: this.scrollTop } } }],
                        { useNativeDriver: true }
                    )}
                >
                    <Appbar themeColor={themeColor} isFull={isFull} hasFollow={hasFollow} name={movieInfo.Name} scrollTop={this.scrollTop} setFollow={this.setFollow} isRender={isRender} goBack={this.onBackAndroid} />
                    <Animated.Image
                        resizeMode='cover'
                        blurRadius={3.5}
                        source={{ uri: movieInfo.Cover||'http' }}
                        style={[styles.bg_place, {backgroundColor: themeColor,
                            transform: [{
                                scale: this.scrollTop.interpolate({
                                    inputRange: [0, $.STATUS_HEIGHT + 50],
                                    outputRange: [1, 1.3]
                                })
                            }]
                    }]} />
                    <Animated.View style={[styles.videobox,isFull&&{margin:0,height:$.WIDTH}, {
                        transform: [{ perspective: 850 }, {
                            rotateX: this.scrollRotate.interpolate({
                                inputRange: [0, 1],
                                outputRange: ['0deg','180deg']
                            })
                        }]
                    }]}>
                        <MovieInfo movieInfo={movieInfo} themeColor={themeColor} onPlay={this.onPlay} isPlaying={isPlaying} isRender={isRender} />
                        <Animated.View style={[styles.videoCon, {
                            zIndex: this.scrollRotate.interpolate({
                                inputRange: [0,.499,.501, 1],
                                outputRange: [-1,-1,1, 1]
                            }),
                            opacity: this.scrollRotate.interpolate({
                                inputRange: [0,.499,.501, 1],
                                outputRange: [0,0,1, 1]
                            })
                        },isFull&&styles.fullScreen]}>
                            <Video
                                ref={(ref) => this.video = ref}
                                uri={playUrl}
                                useTextureView={false}
                                style={styles.backgroundVideo}
                                seekTime={seekTime}
                                onfullChanged={this.onfullChanged}
                                themeColor={themeColor}
                            />
                            <TouchableOpacity style={[styles.closebtn,isFull&&{ opacity:0, top:-50 }]} onPress={this.onClose} >
                                <Icon name='x' size={20} color='#fff' />
                            </TouchableOpacity>
                        </Animated.View>
                    </Animated.View>
                    <MovieSource source={movieInfo.MoviePlayUrls} sourceId={sourceId} onPlay={this.onPlay} isRender={isRender} themeColor={themeColor} />
                    <MovieSummary summary={movieInfo.Introduction} isRender={isRender} themeColor={themeColor} />
                    <MovieSame movieInfo={movieInfo} isRender={isRender} themeColor={themeColor} navigation={navigation} />
                    <MovieComments DBID={movieInfo.DBID} isRender={isRender} themeColor={themeColor} navigation={navigation} />
                </Animated.ScrollView>
            </View>
        );
    }
}

MovieDetail.contextType = Store;

const styles = StyleSheet.create({
    content: {
        backgroundColor:'#f7f7f7',
        flex:1
    },
    bg_place: {
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        resizeMode: 'cover',
        height: $.WIDTH * 9 / 16
    },
    video_place: {
        height: $.WIDTH * 9 / 16,
        backgroundColor: '#000',
    },
    movieTitle: {
        fontSize: 16,
        color: '#333',
        padding: 15,
        backgroundColor: '#fff'
    },
    viewcon: {
        marginBottom: 10,
        backgroundColor: '#fff',
        paddingBottom: 10,
        paddingTop:5,
        borderRadius: 5,
        marginHorizontal: 10,
    },
    row: {
        flexDirection: 'row'
    },
    view_hd: {
        height: 15,
        paddingHorizontal: 10,
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },
    view_title: {
        fontSize: 15,
        color: '#333',
        marginLeft:5,
        flex: 1
    },
    con: {
        paddingHorizontal: 15,
        flexWrap: 'wrap',
    },
    text: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20
    },
    fullScreen: {
        position: 'absolute',
        zIndex: 10,
        top: 0,
        left: 0,
        right: 0,
        bottom:0
    },
    appbar: {
        paddingTop: $.STATUS_HEIGHT,
        flexDirection: 'row',
        alignItems: 'center',
        zIndex: 10
    },
    fullcon: {
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        zIndex: 0
    },
    borR: {
        borderRadius: 3,
    },
    btn: {
        width: 48,
        height: 48,
        zIndex: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    apptitle: {
        flex: 1,
        justifyContent: 'center',
        alignSelf: 'stretch',
        zIndex: 1
    },
    apptitletext: {
        position: 'absolute',
        fontSize: 16,
        color: '#fff',
    },
    poster: {
        padding: 10,
        borderRadius: 3,
        backgroundColor: '#f1f1f1',
        width: 100,
        height: 150,
        marginHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    postertext: {
        flex: 1,
        marginRight: 10,
        marginLeft: 5,
    },
    title: {
        fontSize: 18,
        color: '#333',
        paddingBottom:2
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        paddingTop: 5
    },
    sptext: {
        fontStyle: 'italic',
        color: '#666'
    },
    playbtn: {
        position: 'absolute',
        zIndex: 10,
        height: 34,
        width: 34,
        borderRadius: 17,
        justifyContent: 'center',
        alignItems: 'center',
        opacity: .9
    },
    playtext: {
        fontSize: 14,
        color: '#fff'
    },
    star: {
        marginVertical: 5
    },
    status: {
        fontSize: 10,
        paddingHorizontal: 5,
        marginVertical: 5,
        paddingVertical: 2,
        borderRadius: 2,
        alignSelf: 'flex-start',
        color: '#fff',
        backgroundColor: 'rgba(0,0,0,.5)'
    },
    commentbtn: {
        marginHorizontal: 10,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center'
    },
    view_more: {
        flexDirection: 'row',
        alignSelf: 'stretch',
        alignItems: 'center',
    },
    view_moretext: {
        fontSize: 13,
        color: '#999'
    },
    sourcelist: {
        paddingHorizontal: 15
    },
    sourceitem: {
        backgroundColor: '#f1f1f1',
        minWidth: 50,
        maxWidth: 150,
        borderBottomRightRadius: 10,
        borderTopLeftRadius: 10,
        justifyContent: 'center',
        marginVertical: 5,
        //marginRight: 10,
        padding: 10,
        overflow: 'hidden',
        alignItems: 'center',
    },
    backgroundVideo: {
        flex: 1,
        backgroundColor: '#000',
    },
    sourcedot: {
        position: 'absolute',
        right: 4,
        top: 4,
        width: 5,
        height: 5,
        borderRadius: 5,
        opacity: 0
    },
    videoCon: {
        position: 'absolute',
        left: 10,
        top: 10,
        right: 10,
        bottom: 10,
        //backgroundColor: '#000',
        transform: [{ rotateX: '180deg' }]
    },
    closebtn: {
        position: 'absolute',
        right: 0,
        top: 0,
        padding: 10,
        zIndex:30
    },
    videobox: {
        margin: 10,
    },
    videosInfo: {
        paddingVertical: 10,
        backgroundColor: '#fff',
        borderRadius: 5,
        flexDirection: 'row'
    },
    movieitem: {
		width: 100,
		overflow:'hidden',
	},
	movieimg: {
		width: 100,
        height:150,
        backgroundColor:'#f1f1f1',
        borderRadius:3,
		flex: 1,
		resizeMode: 'cover'
	},
	movietext: {
		alignItems: 'center',
		height: 30,
		paddingHorizontal: 5,
		flexDirection: 'row'
	},
	moviename: {
		fontSize: 14,
		color: '#333',
		textAlign: 'center',
		flex: 1
    },
    empty:{
		flex:1,
		padding:10,
		textAlign:'center',
		fontSize: 14,
		color: '#666'
	}
})