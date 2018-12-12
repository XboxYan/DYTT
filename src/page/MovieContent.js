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
    LayoutAnimation,
    Text,
    StyleSheet,
    ScrollView,
    View,
} from 'react-native';
import { BorderlessButton } from 'react-native-gesture-handler';
import DrawerLayout from 'react-native-gesture-handler/DrawerLayout';
import Icon from 'react-native-vector-icons/Feather';
import Appbar from '../components/Appbar';

const { UIManager } = NativeModules;

const nowYear = new Date().getFullYear();

const CommonList = [
    {
        name:"地区",
        icon:'map-pin',
        cate:'Area',
        type:["大陆","美国","加拿大","香港","韩国","日本","台湾","泰国","西班牙","法国","印度","英国"]
    },
    {
        name:"年份",
        icon:'calendar',
        cate:'Year',
        type:[nowYear,nowYear-1,nowYear-2,nowYear-3,nowYear-4,nowYear-5,nowYear-6,nowYear-7,nowYear-8,nowYear-9,nowYear-10]
    }
]

const Categories = {
    movie:[
        {
            name:"分类",
            icon:'layers',
            cate:'Channel',
            type:["动作片","喜剧片","爱情片","科幻片","恐怖片","剧情片","战争片","伦理"]
        },
        {
            name:"剧情",
            icon:'compass',
            cate:'Plot',
            type:["惊悚","悬疑","魔幻","犯罪","灾难","动画","古装","歌舞"]
        }
    ],
    tv:[
        {
            name:"分类",
            icon:'layers',
            cate:'Channel',
            type:["韩剧","剧情","欧美剧","日剧","台剧","泰剧"]
        },
        {
            name:"剧情",
            icon:'compass',
            cate:'Plot',
            type:["言情","都市","家庭","偶像","喜剧","古装","武侠","刑侦","战争","神话","军旅","校园","悬疑"]
        }
    ],
    comic:[
        {
            name:"剧情",
            icon:'compass',
            cate:'Plot',
            type:["冒险","热血","搞笑","少女","推理"]
        }
    ],
    variety:[
        {
            name:"剧情",
            icon:'compass',
            cate:'Plot',
            type:["喜剧","家庭","家庭","运动","真人秀","脱口秀"]
        }
    ]
}

class DrawerContent extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            Channel:props.state.Channel,
            Plot:props.state.Plot,
            Area:props.state.Area,
            Year:props.state.Year
        }
    }

    setType = (cate,value) => {
        LayoutAnimation.easeInEaseOut();
        this.setState({
            [cate]:value
        })
    }

    componentDidMount() {
        //console.warn(this.props.drawer)
    }

    render(){
        const {themeColor,closeDrawer,type} = this.props;
        const typeList = [...Categories[type],...CommonList];
        return (
            <Fragment>
                <View style={[styles.appbar, { backgroundColor: themeColor }]}>
                    <BorderlessButton
                        activeOpacity={.8}
                        style={styles.btn}
                        onPress={closeDrawer}
                    >
                        <Icon name='x' size={22} color='#fff' />
                    </BorderlessButton>
                    <Text style={styles.apptitle} numberOfLines={1}>高级筛选</Text>
                </View>
                <ScrollView style={styles.content}>
                    {
                        typeList.map((d,i)=>(
                            <View key={i} style={styles.typewrap}>
                                <View style={styles.typetitle}>
                                    <Icon name={d.icon} size={16} color={themeColor}/>
                                    <Text style={[styles.typetitletxt,{color:themeColor}]}>{d.name}</Text>
                                </View>
                                <View style={styles.typecon}>
                                    <BorderlessButton disabled={this.state[d.cate]==''} onPress={()=>setType(d.cate,'')} style={styles.typeitem}><Text style={[styles.typeitemtxt,this.state[d.cate]==''&&{color:themeColor}]}>全部</Text></BorderlessButton>
                                    {
                                        d.type.map((el,j)=>(
                                            <BorderlessButton disabled={this.state[d.cate]===el} onPress={()=>this.setType(d.cate,el)} key={j} style={styles.typeitem}><Text style={[styles.typeitemtxt,el==this.state[d.cate]&&{color:themeColor}]}>{el}</Text></BorderlessButton>
                                        ))
                                    }
                                </View>
                            </View>
                        ))
                    }
                </ScrollView>
                <View style={styles.typeaction}>
                    <TouchableOpacity activeOpacity={.8} style={[styles.typebtn,{backgroundColor:themeColor,borderColor:themeColor}]}><Text style={styles.typebtns}>确定</Text></TouchableOpacity>
                    <TouchableOpacity activeOpacity={.8} style={[styles.typebtn,{borderColor:themeColor}]}><Text style={[styles.typebtns,{color:themeColor}]}>取消</Text></TouchableOpacity>
                </View>
            </Fragment>
        )
    }
}

export default class extends PureComponent {

    constructor(props) {
        super(props);
        UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
        this.state = {
            Channel:'',
            Plot:'',
            Area:'',
            Year:''
        }
    }

    openDrawer = () => {
        const {Channel,Plot,Area,Year} = this.state;
        this.drawer.openDrawer();
        this.drawerContent.setState({Channel,Plot,Area,Year});
    }
    
    closeDrawer = () => {
        this.drawer.closeDrawer();
    }

    setType = (options) => {
        LayoutAnimation.easeInEaseOut();
        this.setState(options);
    }
    
    componentDidMount() {
        
    }

    componentWillUnmount() {

    }

    render() {
        const {navigation,screenProps:{themeColor}} = this.props;
        const {title,type} = navigation.state.params;
        const {Channel,Plot,Area,Year} = this.state;
        return (
            <DrawerLayout 
                drawerPosition={DrawerLayout.positions.Right}
                ref={drawer => this.drawer = drawer }
                drawerBackgroundColor="#fff"
                edgeWidth={50}
                drawerWidth={$.WIDTH*.8}
                renderNavigationView={()=><DrawerContent ref={drawer => this.drawerContent = drawer} themeColor={themeColor} closeDrawer={this.closeDrawer} type={type} state={{Channel,Plot,Area,Year}} setType={this.setType} />}
            >
                <View style={[styles.content,styles.bg]}>
                    <Appbar navigation={navigation} themeColor={themeColor} title={title} >
                        <BorderlessButton activeOpacity={.8} style={styles.btn} onPress={this.openDrawer} >
                            <Icon name='filter' size={18} color='#fff' />
                        </BorderlessButton>
                    </Appbar>
                    <View style={styles.typetop}>
                        {
                            [...Categories[type],...CommonList].map((d,i)=>(
                                <BorderlessButton onPress={this.openDrawer} style={styles.typetopitem} key={i}>
                                    <Icon name={d.icon} size={16} color={themeColor}/>
                                    <Text style={[styles.typetoptxt,{color:themeColor}]}>{this.state[d.cate]||d.name}</Text>
                                </BorderlessButton>
                            ))
                        }
                    </View>
                </View>
            </DrawerLayout>
        )
    }
}

const styles = StyleSheet.create({
    content:{
        flex:1
    },
	bg:{
		backgroundColor:'#f7f7f7',
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
    typewrap:{
        padding:10,
        paddingBottom:0
    },
    typetitle:{
        flexDirection:'row',
        alignItems:'center',
        paddingHorizontal:10,
        height:40
    },
    typetitletxt:{
        fontSize:15,
        paddingLeft:10,
        color: '#333',
    },
    typecon:{
        flexDirection:'row',
        flexWrap: 'wrap'
    },
    typeitem:{
        paddingHorizontal:10,
        marginRight:5,
        marginBottom:5,
        height:30,
        justifyContent:'center'
    },
    typeitemtxt:{
        fontSize:14,
        color:'#666'
    },
    typetop:{
        backgroundColor:'#fff',
        flexDirection:'row',
        height:40,
        alignItems:'center',
        paddingHorizontal:10
    },
    typetopitem:{
        flexDirection:'row',
        paddingHorizontal:10
    },
    typetoptxt:{
        fontSize:15,
        paddingLeft:5,
    },
    typeaction:{
        paddingHorizontal:5,
        paddingVertical:10,
        flexDirection:'row',
    },
    typebtn:{
        flex:1,
        marginHorizontal:5,
        borderRadius:5,
        justifyContent: 'center',
        alignItems: 'center',
        height:40,
        borderWidth:1,
        borderColor:'transparent'
    },
    typebtns:{
        fontSize:14,
        color:'#fff'
    }
})