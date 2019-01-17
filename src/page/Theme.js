import React, { PureComponent } from 'react';
import { 
    StyleSheet,
    Text, 
    View,
    TouchableOpacity,
    ScrollView 
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import AppTop from '../components/AppTop';

export const themes = [
    {
        color:['#db4437'],
        name:'姨妈红'
    },
    {
        color:['#0f9d58'],
        name:'酷安绿'
    },
    {
        color:['#fb7299'],
        name:'哔哩粉'
    },
    {
        color:['#3f51b5'],
        name:'颐堤蓝'
    },
    {
        color:['#009688'],
        name:'水鸭青'
    },
    {
        color:['#ff9800'],
        name:'伊藤橙'
    },
    {
        color:['#673ab7'],
        name:'基佬紫'
    },
    {
        color:['#2196f3'],
        name:'知乎蓝'
    },
    {
        color:['#795548'],
        name:'古铜棕'
    },
    {
        color:['#607d8b'],
        name:'低调灰'
    },
    {
        color:['#212121'],
        name:'暮夜黑'
    },
]

export const themesGradient = [
    {
        color:['#ff5858','#f09819']
    },
    {
        color:['#8fd3f4','#84fab0']
    },
    {
        color:['#f5576c','#f093fb']
    },
    {
        color:['#4facfe','#00f2fe']
    },
    {
        color:['#fa709a','#fee140']
    },
    {
        color:['#667eea','#764ba2']
    },
    {
        color:['#ff0844','#ffb199']
    },
    {
        color:['#b721ff','#21d4fd']
    },
    {
        color:['#09203f','#537895']
    },
    {
        color:['#16a085','#f4d03f']
    }
]

const ThemeItems = ({item:{color,name},themeColor,setTheme}) => (
    <TouchableOpacity style={styles.item} activeOpacity={.8} onPress={()=>setTheme(color)}>
        <LinearGradient colors={color.length>1?color:[...color,...color]} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.color} />
        <Icon name='feather' size={14} color={'#fff'} style={[styles.feather,{opacity:themeColor.toString()===color.toString()?1:0}]} />
    </TouchableOpacity>
)

export default class extends PureComponent {

    static navigationOptions = {
        drawerLabel: '主题颜色',
        drawerIcon: ({ tintColor }) => (
            <Icon name='feather' size={18} color={tintColor} />
        ),
    };

    componentDidMount() {
        //console.warn(this.props.navigation)
    }

    render() {
        const {navigation,screenProps:{themeColor,setTheme}} = this.props;
        return (
            <View style={styles.container}>
                <AppTop title="主题风格" navigation={navigation} themeColor={themeColor} />
                <ScrollView style={{flex:1}} contentContainerStyle={{paddingBottom:10}}>
                    <Text style={styles.title}>纯色主题</Text>
                    <View style={styles.item_wrap}>
                        {
                            themes.map((el,i)=><ThemeItems key={i} item={el} setTheme={setTheme} themeColor={themeColor} />)
                        }
                    </View>
                    <Text style={styles.title}>渐变主题</Text>
                    <View style={styles.item_wrap}>
                        {
                            themesGradient.map((el,i)=><ThemeItems key={i} item={el} setTheme={setTheme} themeColor={themeColor} />)
                        }
                    </View>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f7f7f7'
    },
    title: {
        fontSize:14,
        padding:10,
        paddingBottom:0,
        color:'#666',
    },
    item_wrap: {
        flexDirection:'row',
        margin:5,
        flexWrap:'wrap'
    },
    item: {
        margin:5,
        width:($.WIDTH-120)/4,
        height:($.WIDTH-120)/4,
        backgroundColor:'#fff',
        borderRadius:5,
        alignItems:'center',
        justifyContent: 'center',
    },
    feather:{
        position:'absolute'
    },
    color:{
        position:'absolute',
        width:34,
        height:34,
        borderRadius:20
    },
    text:{
        flex:1,
        fontSize:14,
        color:'#666',
        paddingHorizontal:10
    }
});