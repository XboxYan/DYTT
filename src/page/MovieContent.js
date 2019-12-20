/*
*
MovieContent
*
*/

import React, { PureComponent, Fragment } from 'react';
import {
    BackHandler,
    InteractionManager,
    NativeModules,
    TouchableOpacity,
    Platform,
    LayoutAnimation,
    Text,
    StyleSheet,
    ScrollView,
    View,
} from 'react-native';
import { BorderlessButton } from 'react-native-gesture-handler';
import DrawerLayout from 'react-native-gesture-handler/DrawerLayout';
import Icon from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import AppTop from '../components/AppTop';
import Loading from '../components/Loading';
import MovieList from '../components/MovieList';
import { GetPageList } from '../../util/api';
import  { CommonList,Categories } from '../../util/categories';
const { UIManager } = NativeModules;

class DrawerContent extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            Channel: props.state.Channel,
            Plot: props.state.Plot,
            Area: props.state.Area,
            Year: props.state.Year,
            isVisible:false
        }
    }

    setType = (cate, value) => {
        LayoutAnimation.easeInEaseOut();
        this.setState({
            [cate]: value
        })
    }

    setVisibel = () => {
        if(this.props.type==='movie'){
            this.setType('isVisible',true);
        }
    }

    onSubmit = () => {
        const { Channel, Plot, Area, Year } = this.state;
        const { setType, closeDrawer } = this.props;
        closeDrawer();
        setType({ Channel, Plot, Area, Year });
    }

    componentDidMount() {

    }

    render() {
        const { themeColor, closeDrawer, type } = this.props;
        const typeList = [...Categories[type], ...CommonList];
        const { isVisible } = this.state;
        return (
            <Fragment>
                <LinearGradient colors={themeColor.length>1?themeColor:[...themeColor,...themeColor]} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.appbar}>
                    <BorderlessButton
                        activeOpacity={.8}
                        style={styles.btn}
                        onPress={closeDrawer}
                    >
                        <Icon name='x' size={22} color='#fff' />
                    </BorderlessButton>
                    <Text style={styles.apptitle} numberOfLines={1} onLongPress={this.setVisibel}>高级筛选</Text>
                </LinearGradient>
                <ScrollView style={styles.content}>
                    {
                        typeList.map((d, i) => (
                            <View key={i} style={styles.typewrap}>
                                <View style={styles.typetitle}>
                                    <Icon name={d.icon} size={16} color={themeColor[0]} />
                                    <Text style={[styles.typetitletxt, { color: themeColor[0] }]}>{d.name}</Text>
                                </View>
                                <View style={styles.typecon}>
                                    <BorderlessButton disabled={this.state[d.cate] == ''} onPress={() => this.setType(d.cate, '')} style={styles.typeitem}><Text style={[styles.typeitemtxt, this.state[d.cate] == '' && { color: themeColor[0] }]}>全部</Text></BorderlessButton>
                                    {
                                        d.type.map((el, j) => (
                                            <BorderlessButton disabled={this.state[d.cate] === el} onPress={() => this.setType(d.cate, el)} key={j} style={styles.typeitem}><Text style={[styles.typeitemtxt, el == this.state[d.cate] && { color: themeColor[0] }]}>{el}</Text></BorderlessButton>
                                        ))
                                    }
                                    {
                                        d.cate==='Channel'&&isVisible&&
                                        <BorderlessButton disabled={this.state[d.cate] == '伦理'} onPress={() => this.setType(d.cate, '伦理')} style={styles.typeitem}><Text style={[styles.typeitemtxt, this.state[d.cate] == '伦理' && { color: themeColor[0] }]}>伦理</Text></BorderlessButton>
                                    }
                                </View>
                            </View>
                        ))
                    }
                </ScrollView>
                <View style={styles.typeaction}>
                    <TouchableOpacity activeOpacity={.8} onPress={this.onSubmit} style={{ flex: 1 }}>
                        <LinearGradient style={[styles.typebtn,{borderWidth:0}]} colors={themeColor.length>1?themeColor:[...themeColor,...themeColor]} start={{x: 0, y: 0}} end={{x: 1, y: 0}}>
                            <Text style={styles.typebtns}>确定</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={.8} onPress={closeDrawer} style={[styles.typebtn, { borderColor: themeColor[0] }]}><Text style={[styles.typebtns, { color: themeColor[0] }]}>取消</Text></TouchableOpacity>
                </View>
            </Fragment>
        )
    }
}

const CategoryTop = ({state,type,openDrawer,themeColor}) => (
    <View style={styles.typetop}>
        {
            [...Categories[type], ...CommonList].map((d, i) => (
                <BorderlessButton onPress={openDrawer} style={styles.typetopitem} key={i}>
                    <Icon name={d.icon} size={16} color={themeColor[0]} />
                    <Text style={[styles.typetoptxt, { color: themeColor[0] }]}>{state[d.cate] || d.name}</Text>
                </BorderlessButton>
            ))
        }
    </View>
)

export default class extends PureComponent {

    page = 1;

    pageSize = 50;

    constructor(props) {
        super(props);
        UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
        this.state = {
            data: [],
            isRender: false,
            isEnding: false,
            Channel: '',
            Plot: '',
            Area: '',
            Year: ''
        }
    }

    openDrawer = () => {
        const { Channel, Plot, Area, Year } = this.state;
        this.drawer.openDrawer();
        this.drawerContent.setState({ Channel, Plot, Area, Year });
    }

    closeDrawer = () => {
        this.drawer.closeDrawer();
    }

    setType = (options) => {
        LayoutAnimation.easeInEaseOut();
        this.setState(options,this.regetData);
    }

    regetData = () => {
        this.page = 1;
        this.setState({
            isRender: false,
            isEnding: false,
            data: []
        }, this.getData)
    }

    getData = async () => {
        const { Channel, Plot, Area, Year } = this.state;
        const data = await GetPageList({ pageIndex: this.page, pageSize: this.pageSize, Type:this.type, Channel, Area, Plot, Year,orderBy:'new' });
        if(this.mounted){
            LayoutAnimation.easeInEaseOut();
            this.setState({
                data: [...this.state.data, ...data],
                isRender: true,
            })
            if (data.length == 0) {
                this.setState({
                    isEnding: true
                })
            } else {
                this.page = this.page + 1;
            }
        }
    }

    loadMore = () => {
        if (!this.state.isEnding) {
            this.getData();
        }
    }

    onDrawerOpen = () => {
        this.open = true;
    }

    onDrawerClose = () => {
        this.open = false;
    }

    onBackAndroid = () => {
        if(this.open){
            this.closeDrawer();
            return true;
        }
    }

    componentWillMount() {
        this.mounted = true;
        if (Platform.OS === 'android') {
            BackHandler.addEventListener('handwareBackPress', this.onBackAndroid)
        }
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            const { type } = this.props.navigation.state.params;
            this.type = type;
            this.getData();
        })
    }

    componentWillUnmount() {
        this.mounted = false;
        if (Platform.OS === 'android') {
            BackHandler.removeEventListener('handwareBackPress', this.onBackAndroid)
        }
    }

    render() {
        const { navigation, screenProps: { themeColor } } = this.props;
        const { title, type } = navigation.state.params;
        const { Channel, Plot, Area, Year, isRender, data, isEnding } = this.state;
        return (
            <DrawerLayout
                drawerPosition={DrawerLayout.positions.Right}
                ref={drawer => this.drawer = drawer}
                drawerBackgroundColor="#fff"
                edgeWidth={50}
                onDrawerOpen={this.onDrawerOpen}
                onDrawerClose={this.onDrawerClose}
                drawerWidth={$.WIDTH * .8}
                renderNavigationView={() => <DrawerContent ref={drawer => this.drawerContent = drawer} themeColor={themeColor} closeDrawer={this.closeDrawer} type={type} state={{ Channel, Plot, Area, Year }} setType={this.setType} />}
            >
                <View style={[styles.content, styles.bg]}>
                    <AppTop navigation={navigation} themeColor={themeColor} title={title} isBack={true} >
                        <BorderlessButton activeOpacity={.8} style={styles.btn} onPress={this.openDrawer} >
                            <Icon name='filter' size={18} color='#fff' />
                        </BorderlessButton>
                    </AppTop>
                    <CategoryTop openDrawer={this.openDrawer} type={type} state={{ Channel, Plot, Area, Year }} themeColor={themeColor} />
                    {
                        isRender ?
                            <MovieList style={{paddingHorizontal:5}} isRender={true} isEnding={isEnding} data={data} navigation={navigation} themeColor={themeColor[0]} onEndReached={this.loadMore} />
                            :
                            <Loading size='small' text='正在努力加载中...' themeColor={themeColor[0]} />
                    }
                </View>
            </DrawerLayout>
        )
    }
}

const styles = StyleSheet.create({
    content: {
        flex: 1
    },
    bg: {
        backgroundColor: '#f7f7f7',
    },
    appbar: {
        paddingTop: $.STATUS_HEIGHT,
        flexDirection: 'row',
        alignItems: 'center',
    },
    btn: {
        width: 48,
        height: 48,
        zIndex: 1,
        backgroundColor: 'rgba(0,0,0,0)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    apptitle: {
        flex: 1,
        fontSize: 16,
        color: '#fff'
    },
    typewrap: {
        padding: 10,
        paddingBottom: 0
    },
    typetitle: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        height: 40
    },
    typetitletxt: {
        fontSize: 15,
        paddingLeft: 10,
        color: '#333',
    },
    typecon: {
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    typeitem: {
        paddingHorizontal: 10,
        marginRight: 5,
        marginBottom: 5,
        height: 30,
        justifyContent: 'center'
    },
    typeitemtxt: {
        fontSize: 14,
        color: '#666'
    },
    typetop: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        height: 40,
        alignItems: 'center',
        paddingHorizontal: 10
    },
    typetopitem: {
        flexDirection: 'row',
        paddingHorizontal: 10
    },
    typetoptxt: {
        fontSize: 14,
        paddingLeft: 5,
    },
    typeaction: {
        paddingHorizontal: 5,
        paddingVertical: 10,
        flexDirection: 'row',
    },
    typebtn: {
        flex: 1,
        marginHorizontal: 5,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        height: 40,
        borderWidth: 1,
        borderColor: 'transparent'
    },
    typebtns: {
        fontSize: 14,
        color: '#fff'
    }
})