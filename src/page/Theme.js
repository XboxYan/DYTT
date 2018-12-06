import React, { PureComponent } from 'react';
import { 
    StyleSheet,
    Text, 
    View,
    TouchableOpacity,
    ScrollView 
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import AppTop from '../components/AppTop';

export const themes = [
    {
        color:'#db4437',
        name:'姨妈红'
    },
    {
        color:'#0f9d58',
        name:'酷安绿'
    },
    {
        color:'#fb7299',
        name:'哔哩粉'
    },
    {
        color:'#3f51b5',
        name:'颐堤蓝'
    },
    {
        color:'#009688',
        name:'水鸭青'
    },
    {
        color:'#ff9800',
        name:'伊藤橙'
    },
    {
        color:'#673ab7',
        name:'基佬紫'
    },
    {
        color:'#2196f3',
        name:'知乎蓝'
    },
    {
        color:'#795548',
        name:'古铜棕'
    },
    {
        color:'#607d8b',
        name:'低调灰'
    },
    {
        color:'#212121',
        name:'暮夜黑'
    },
]

const ThemeItems = ({item:{color,name},themeColor,setTheme}) => (
    <TouchableOpacity style={styles.item} activeOpacity={.8} onPress={()=>setTheme(color)}>
        <View style={[styles.color,{backgroundColor:color}]} />
        <Text style={styles.text}>{name}</Text>
        <Icon name='feather' size={16} color={color} style={{opacity:themeColor===color?1:0}} />
    </TouchableOpacity>
)

export default class extends PureComponent {

    static navigationOptions = {
        drawerLabel: '主题风格',
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
                    {
                        themes.map((el,i)=><ThemeItems key={i} item={el} setTheme={setTheme} themeColor={themeColor} />)
                    }
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
    item: {
        margin:10,
        marginBottom:0,
        flexDirection:'row',
        height:60,
        backgroundColor:'#fff',
        borderRadius:5,
        alignItems:'center',
        paddingHorizontal:15
    },
    color:{
        width:20,
        height:20,
        borderRadius:10
    },
    text:{
        flex:1,
        fontSize:14,
        color:'#666',
        paddingHorizontal:10
    }
});