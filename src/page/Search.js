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
    LayoutAnimation,
    BackHandler,
    ScrollView,
    FlatList,
    Image,
    NativeModules,
    StyleSheet,
    TouchableOpacity,
    ToastAndroid,
    View,
} from 'react-native';

import Icon from 'react-native-vector-icons/Feather';
import Loading from '../components/Loading';
import MovieList from '../components/MovieList';
import AnimatedView from '../components/AnimatedView';
import Storage from '../../util/storage';
import { GetSearch } from '../../util/api';

const { UIManager } = NativeModules;

class SearchResult extends PureComponent {

    page = 1;

    pageSize = 30;

    state = {
        data: [],
        isRender: false,
        isEnding: false
    }

    reSearch = (keywords) => {
        this.keywords = keywords;
        this.page = 1;
        this.setState({
            isRender: false,
            isEnding: false,
            data: []
        }, this.getData)
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            const { keywords } = this.props;
            this.keywords = keywords;
            this.getData();
        })
    }

    getData = async () => {
        const data = await GetSearch({ SearchKey: this.keywords, pageIndex: this.page, pageSize: this.pageSize });
        this.setState({
            data: [...this.state.data, ...data],
            isRender: true,
        })
        if (data.length < this.pageSize) {
            this.setState({
                isEnding: true
            })
        } else {
            this.page = this.page + 1;
        }
    }

    loadMore = () => {
        if (!this.state.isEnding) {
            this.getData();
        }
    }

    render() {
        const { themeColor,navigation } = this.props;
        const { isRender, data, isEnding } = this.state;
        return (
            <AnimatedView style={[styles.content, styles.bg, styles.full]}>
                {
                    isRender ?
                        <MovieList style={{paddingHorizontal:5}} isRender={true} isEnding={isEnding} data={data} navigation={navigation} themeColor={themeColor} onEndReached={this.loadMore} />
                        :
                        <Loading size='small' text='正在努力搜索中...' themeColor={themeColor} />
                }
            </AnimatedView>
        )
    }
}

class SearchHistory extends PureComponent {

    state = {
        isEdit: false
    }
    
    onEdit = () => {
        LayoutAnimation.easeInEaseOut();
        this.setState({isEdit:!this.state.isEdit})
    }

    onPress = (name) => () => {
        const { isEdit } = this.state;
        if(isEdit){
            this.props.removeHistory(name);
        }else{
            this.props.onSubmit(name, true);
        }
    }

    onLongPress = () => {
        LayoutAnimation.easeInEaseOut();
        this.setState({isEdit: true});
    }

    render() {
        const { isRender, themeColor, searchList } = this.props;
        const { isEdit } = this.state;
        return (
            <View style={styles.full}>
                {
                    isRender ?
                        <ScrollView style={styles.content}>
                            <View style={styles.view_hd}>
                                <Icon name="clock" size={16} color={themeColor} />
                                <Text style={styles.view_title}>搜索历史</Text>
                                {
                                    searchList.length>0&&
                                    <TouchableOpacity style={styles.editbtn} onPress={this.onEdit} activeOpacity={.8}><Text style={{color:'#666',fontSize: 14}}>{isEdit?'取消':'编辑'}</Text></TouchableOpacity>
                                }
                            </View>
                            {
                                searchList.length === 0 ?
                                    <Text style={styles.search_h_null}>╮(╯﹏╰）╭还没有搜索过~</Text>
                                    :
                                    <View style={styles.search_h_list}>
                                        {
                                            searchList.map((el, i) => (
                                                <TouchableOpacity
                                                    onPress={this.onPress(el)}
                                                    onLongPress={this.onLongPress}
                                                    key={i}
                                                    style={styles.search_h_item}
                                                >
                                                    <Text numberOfLines={1} style={styles.search_h_el}>{el}</Text>
                                                    {
                                                        isEdit&&
                                                        <Icon name="x" size={16} style={{marginLeft:5,marginRight:-5}} color="#ccc" />
                                                    }
                                                </TouchableOpacity>
                                            ))
                                        }
                                    </View>
                            }
                        </ScrollView>
                        :
                        <Loading themeColor={themeColor} size="small" />
                }
            </View>
        )
    }
}


export default class Search extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            isSearch: false,
            isRender: false,
            keywords: '',
            searchList: []
        };
        UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    }

    addHistory = (keywords) => {
        const { searchList } = this.state;
        const index = searchList.findIndex(el => el == keywords);
        if (index >= 0) {
            searchList.splice(index, 1);
        }
        this.setState({ searchList: [keywords, ...searchList] });
    }

    removeHistory = (keywords) => {
        const { searchList } = this.state;
        const _searchList = searchList.filter(el => el !== keywords);
        this.setState({ searchList: _searchList });
    }

    onSubmit = (value, bool) => {
        const keywords = bool ? value : this.state.keywords;
        if (keywords) {
            this.setState({
                keywords: keywords,
                isSearch: true
            });
            this.addHistory(keywords);
            this.searchcon && this.searchcon.reSearch(keywords);
        } else {
            ToastAndroid.show('请输入内容!', ToastAndroid.SHORT);
        }
    }

    onChange = (text) => {
        this.setState({ keywords: text });
        if (!text) {
            this.setState({ isSearch: false });
        }
    }

    onBack = () => {
        if (this.state.keywords) {
            this.setState({
                isSearch: false,
                keywords: ''
            })
            return true;
        }
    }

    goBack = () => {
        const { navigation } = this.props;
        navigation.goBack();
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.onBack);
        InteractionManager.runAfterInteractions(async () => {
            const data_search = await Storage.get('searchList') || [];
            this.setState({
                isRender: true,
                searchList: data_search
            })
        })
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.onBack);
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.searchList !== this.state.searchList) {
            LayoutAnimation.easeInEaseOut();
            Storage.save('searchList', this.state.searchList);
        }
    }

    render() {
        const { navigation, screenProps: { themeColor } } = this.props;
        const { isSearch, searchList, isRender, keywords } = this.state;
        return (
            <View style={[styles.content, styles.bg]}>
                <View style={[styles.top, { backgroundColor: themeColor }]}>
                    <TouchableOpacity
                        activeOpacity={.8}
                        style={styles.btn}
                        onPress={this.goBack}
                    >
                        <Icon name='chevron-left' size={24} color={'#fff'} />
                    </TouchableOpacity>
                    <View style={styles.searchcon}>
                        <TextInput
                            style={styles.searchtext}
                            value={keywords}
                            selectionColor={themeColor}
                            underlineColorAndroid='transparent'
                            onSubmitEditing={this.onSubmit}
                            onChangeText={this.onChange}
                            placeholder='搜索一下吧~'
                            returnKeyLabel='搜索'
                            placeholderTextColor='#909090'
                        />
                    </View>
                    <TouchableOpacity
                        activeOpacity={.8}
                        style={styles.btn}
                        onPress={this.onSubmit}
                    >
                        <Icon name='search' size={20} color={'#fff'} />
                    </TouchableOpacity>
                </View>
                <View style={styles.content}>
                    <SearchHistory onSubmit={this.onSubmit} themeColor={themeColor} isRender={isRender} searchList={searchList} removeHistory={this.removeHistory} />
                    {
                        isSearch &&
                        <SearchResult ref={node => this.searchcon = node} keywords={keywords} navigation={navigation} themeColor={themeColor} />
                    }
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    content: {
        flex: 1,
    },
    bg: {
        backgroundColor: '#f7f7f7'
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
    editbtn:{
        height:'100%',
        paddingHorizontal:5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchcon: {
        flexDirection: 'row',
        borderRadius: 20,
        height: 34,
        flex: 1,
        marginVertical: 7,
        //marginHorizontal:10,
        alignItems: 'center',
        backgroundColor: '#fff'
    },
    searchtext: {
        flex: 1,
        height: 34,
        //marginHorizontal: 5,
        paddingVertical: 0,
        fontSize: 14,
        paddingLeft: 10,
        alignItems: 'center',
        color: '#666',
        backgroundColor: 'transparent',
    },
    full: {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        position: 'absolute',
    },
    view_hd: {
        height: 40,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    view_title: {
        marginLeft: 5,
        fontSize: 14,
        color: '#666',
        flex: 1
    },
    search_h_list: {
        padding: 10,
        paddingTop: 0,
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    search_h_item: {
        backgroundColor: '#fff',
        height: 30,
        paddingHorizontal: 15,
        borderRadius: 15,
        justifyContent: 'center',
        flexDirection:'row',
        alignItems:'center',
        marginRight: 10,
        marginBottom: 10
    },
    search_h_el: {
        maxWidth: 120,
        fontSize: 14,
        color: '#666'
    },
    search_h_null: {
        textAlign: 'center',
        color: '#999',
        fontSize: 14,
        padding: 20,
    },
    flexcon: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    empty: {
        textAlign: 'center',
        fontSize: 14,
        color: '#666'
    }
})