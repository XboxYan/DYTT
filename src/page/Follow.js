import React, { PureComponent } from 'react';
import {
    StyleSheet,
    Text,
    Image,
    Platform,
    FlatList,
    BackHandler,
    NativeModules,
    LayoutAnimation,
    TouchableOpacity,
    View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import AppTop from '../components/AppTop';
import LoadView from '../components/LoadView';
import Touchable from '../components/Touchable';
import MovieList from '../components/MovieList';
import Loading from '../components/Loading';
import Storage from '../../util/storage';
import { Store } from '../../util/store';

const { UIManager } = NativeModules;

const CheckBox = ({ themeColor, checked }) => (
    <Icon name={checked ? 'check-circle' : 'circle'} style={{ marginRight: 10 }} size={20} color={checked ? themeColor : '#eee'} />
)

const FollowEmpty = () => (
    <View style={styles.flexcon}>
        <Text style={styles.empty}>╮(╯﹏╰）╭ 暂无收藏影片</Text>
    </View>
)

const FollowItem = ({ item: { img, name }, themeColor, onPress, onLongPress, checked, isEdit }) => (
    <TouchableOpacity activeOpacity={.8} style={styles.movieitem} onPress={onPress} onLongPress={onLongPress}>
        <Image
            style={styles.movieimg}
            source={{ uri: img }}
        />
        <View style={styles.movietext}>
            {
                isEdit && <CheckBox themeColor={themeColor} checked={checked} />
            }
            <Text numberOfLines={1} style={styles.moviename}>{name}</Text>
        </View>
    </TouchableOpacity>
)

export default class Follow extends PureComponent {

    static navigationOptions = {
        drawerLabel: '收藏',
        drawerIcon: ({ tintColor }) => (
            <Icon name='heart' size={18} color={tintColor} />
        ),
    };

    constructor(props) {
        super(props);
        this.state = {
            selected: [],
            isEdit: false,
            isRender: false,
        };
        UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    }

    componentWillMount() {
        if (Platform.OS === 'android') {
            BackHandler.addEventListener('handwareBackPress', this.onBackAndroid)
        }
    }

    componentWillUnmount() {
        if (Platform.OS === 'android') {
            BackHandler.removeEventListener('handwareBackPress', this.onBackAndroid)
        }
    }

    onBackAndroid = () => {
        const { isEdit } = this.state;
        if (isEdit) {
            LayoutAnimation.easeInEaseOut();
            this.setState({
                isEdit: false,
                selected: [],
            })
            return true;
        }
    }

    onPress = (id) => () => {
        const { selected, isEdit } = this.state;
        if (isEdit) {
            const index = selected.findIndex(el => el === id);
            if (index >= 0) {
                this.setState({ selected: selected.filter(el => el !== id) });
            } else {
                this.setState({ selected: [...selected, id] });
            }
        } else {
            this.props.navigation.navigate('MovieDetail', { movieId: id })
        }
    }

    onLongPress = (id) => () => {
        LayoutAnimation.easeInEaseOut();
        this.setState({
            isEdit: true,
            selected: [id]
        });
    }

    onEdit = () => {
        LayoutAnimation.easeInEaseOut();
        const { isEdit } = this.state;
        if (isEdit) {
            this.setState({ selected: [] });
        }
        this.setState({ isEdit: !this.state.isEdit })
    }

    selectAll = () => {
        const { fllowList } = this.context;
        const { selected } = this.state;
        if (selected.length === fllowList.length) {
            this.setState({
                selected: []
            })
        } else {
            this.setState({
                selected: fllowList.map(el => el.id)
            })
        }
    }

    delSelect = () => {
        const { selected } = this.state;
        const { removeFollow } = this.context;
        this.setState({ selected: [] });
        removeFollow(selected);
    }

    renderItem = ({ item, index }) => {
        const { screenProps: { themeColor } } = this.props;
        const { selected, isEdit } = this.state;
        return <FollowItem item={item} onPress={this.onPress(item.id)} isEdit={isEdit} checked={selected.indexOf(item.id) >= 0} onLongPress={this.onLongPress(item.id)} themeColor={themeColor} />
    }

    renderFooter = () => {
        const { themeColor } = this.props;
        return <LoadView isEnding={true} themeColor={themeColor} />;
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (nextContext.fllowList.length !== this.context.fllowList.length) {
            LayoutAnimation.easeInEaseOut();
        }
    }

    async componentDidMount() {
        const { initFollow } = this.context;
        const data = await Storage.get('fllowList');
        if (data) {
            initFollow(data);
        }
        this.setState({ isRender: true });
    }

    render() {
        const { navigation, screenProps: { themeColor } } = this.props;
        const { fllowList } = this.context;
        const { selected, isEdit, isRender } = this.state;
        return (
            <View style={styles.container}>
                <AppTop title="收藏" navigation={navigation} themeColor={themeColor}>
                    {
                        fllowList.length > 0 &&
                        <TouchableOpacity onPress={this.onEdit} activeOpacity={.8} style={styles.btn}><Text style={styles.btntext}>{isEdit ? '取消' : '编辑'}</Text></TouchableOpacity>
                    }
                </AppTop>
                {
                    isRender ? (
                        fllowList.length === 0 ?
                            <FollowEmpty />
                            :
                            <FlatList
                                style={[styles.content, isEdit && { marginBottom: 48 }]}
                                numColumns={3}
                                ListFooterComponent={this.renderFooter}
                                removeClippedSubviews={true}
                                data={fllowList}
                                onEndReachedThreshold={0.1}
                                extraData={themeColor}
                                keyExtractor={(item) => item.id.toString()}
                                renderItem={this.renderItem}
                            />
                    )
                        :
                        <Loading themeColor={themeColor} />
                }
                <View style={[styles.footer, fllowList.length > 0 && isEdit && { bottom: 0 }]}>
                    <Touchable style={styles.vbtn} onPress={this.selectAll}>
                        <CheckBox themeColor={themeColor} checked={selected.length === fllowList.length} />
                        <Text style={styles.vbtntext}>全选</Text>
                    </Touchable>
                    <Touchable style={styles.vbtn} disabled={selected.length === 0} onPress={this.delSelect}>
                        <Icon name='trash-2' size={20} style={{ marginRight: 10 }} color={selected.length === 0 ? '#ccc' : themeColor} />
                        <Text style={styles.vbtntext}>取消收藏({selected.length})</Text>
                    </Touchable>
                </View>
            </View>
        );
    }
}

Follow.contextType = Store;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f7f7f7'
    },
    btn: {
        paddingHorizontal: 15,
        height: 48,
        zIndex: 1,
        backgroundColor: 'rgba(0,0,0,0)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    btntext: {
        color: '#fff'
    },
    flexcon: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    empty: {
        padding: 10,
        textAlign: 'center',
        fontSize: 14,
        color: '#666'
    },
    content: {
        flex: 1,
        //paddingTop: 10,
        paddingHorizontal: 5,
    },
    footer: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: -48,
        height: 48,
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center'
    },
    vbtn: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%'
    },
    vbtntext: {
        fontSize: 16,
    },
    movieitem: {
        width: ($.WIDTH - 40) / 3,
        marginHorizontal: 5,
        borderRadius: 3,
        overflow: 'hidden',
        backgroundColor: '#fff',
        marginTop: 10,
    },
    movieimg: {
        width: '100%',
        height: ($.WIDTH - 40) / 2,
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
        textAlign: 'left',
        flex: 1
    },
    flexcon: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    chcekbox: {
        position: 'absolute',
        backgroundColor: '#fff',
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomLeftRadius: 30,
        right: -30,
        top: -30,
        opacity: 0,
        zIndex: 5
    }
});