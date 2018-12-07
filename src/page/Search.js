/*
*
Search
*
*/

import React, { PureComponent } from 'react';
import {
    Text,
    InteractionManager,
    TextInput,
    ScrollView,
    NativeModules,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';

import Icon from 'react-native-vector-icons/Feather';
import Loading from '../components/Loading';

const { UIManager } = NativeModules;


const SearchHistory = ({isRender,themeColor,searchList,onSubmit}) => (
    <View style={styles.historycon}>
        {
            isRender?
            <ScrollView style={styles.content}>
                <View style={styles.view_hd}>
                    <Icon name="clock" size={16} color={themeColor} />
                    <Text style={styles.view_title}>搜索历史</Text>
                </View>
                {
                    searchList.length===0?
                    <Text style={styles.search_h_null}>╮(╯﹏╰）╭暂无历史记录~</Text>
                    :
                    <View style={styles.search_h_list}>
                    {
                        searchList.map((el,i)=>(
                            <TouchableOpacity
                                onPress={()=>onSubmit(el)}
                                key={i} 
                                style={styles.search_h_item}
                            >
                                <Text numberOfLines={1} style={styles.search_h_el}>{el}</Text>
                            </TouchableOpacity>
                        ))
                    }
                    </View>
                }   
            </ScrollView>
            :
            <Loading themeColor={themeColor} />
        }
    </View>
)

export default class Search extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            isSearch:false,
            isRender:false,
            searchList:['柯南','海贼王','火影忍者','西游记','复仇者联盟','大帅哥']
        };
        UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    }

    onSubmit = () => {

    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            //this.getData();
        })
    }

    render() {
        const {navigation,screenProps:{themeColor}} = this.props;
        const { isSearch,searchList,isRender } = this.state;
        return (
            <View style={[styles.content,styles.bg]}>
                <View style={[styles.top, { backgroundColor: themeColor }]}>
                    <TouchableOpacity
                        activeOpacity={.8}
                        style={styles.btn}
                        //onPress={this.onSubmit}
                    >
                        <Icon name='chevron-left' size={24} color={'#fff'} />
                    </TouchableOpacity>
                    <View style={styles.searchcon}>
                        <TextInput
                            style={styles.searchtext}
                            value={this.text}
                            selectionColor={themeColor}
                            underlineColorAndroid='transparent'
                            //onSubmitEditing={this.onSubmit}
                            //onChangeText={this.onEdit}
                            placeholder='搜索一下吧~'
                            returnKeyLabel='搜索'
                            placeholderTextColor='#909090'
                        />
                    </View>
                    <TouchableOpacity
                        activeOpacity={.8}
                        style={styles.btn}
                        //onPress={this.onSubmit}
                    >
                        <Icon name='search' size={20} color={'#fff'} />
                    </TouchableOpacity>
                </View>
                <View style={styles.content}>
                    <SearchHistory onSubmit={this.onSubmit} themeColor={themeColor} isRender={true} searchList={searchList} />
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    content:{
        flex:1,
    },
    bg:{
        backgroundColor:'#f7f7f7'
    },
	top: {
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
    searchcon:{
        flexDirection: 'row',
        borderRadius: 20,
        height: 34,
        flex: 1,
        marginVertical:7,
        //marginHorizontal:10,
        alignItems: 'center',
        backgroundColor:'#fff'
    },
    searchtext: {
        flex: 1,
        height: 34,
        //marginHorizontal: 5,
        paddingVertical: 0,
        fontSize: 14,
        paddingLeft: 10,
        alignItems: 'center',
        color:'#666',
        backgroundColor: 'transparent',
    },
    historycon:{
        top:0,
        bottom:0,
        left:0,
        right:0,
        position:'absolute',
    },
    view_hd: {
        height: 40,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    view_title: {
        marginLeft:5,
        fontSize: 14,
        color: '#666',
        flex: 1
    },
    search_h_list:{
        padding:10,
        flexDirection:'row',
        flexWrap:'wrap'
    },
    search_h_item:{
        backgroundColor: '#fff',
        height: 30,
        paddingHorizontal: 15,
        borderRadius: 15,
        justifyContent: 'center',
        marginRight: 10,
        marginBottom: 10
    },
    search_h_el:{
        maxWidth:120,
        fontSize:14,
        color: '#666'
    },
    search_h_null:{
        textAlign:'center',
        color:'#999',
        fontSize:14,
        padding:20,
    },
})