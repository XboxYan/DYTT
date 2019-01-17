import React, { PureComponent } from 'react';
import {
    StyleSheet,
    Text,
    Image,
    Platform,
    FlatList,
    NativeModules,
    LayoutAnimation,
    TouchableOpacity,
    BackHandler,
    View,
} from 'react-native';
import { BorderlessButton } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Feather';
import AppTop from '../components/AppTop';
import LoadView from '../components/LoadView';
import Touchable from '../components/Touchable';
import Storage from '../../util/storage';
import { Store } from '../../util/store';
import { timeFormat } from '../../util/timeformat';

const { UIManager } = NativeModules;

const CheckBox = ({ themeColor, checked }) => (
    <Icon style={{ marginRight: 10 }} name={checked ? 'check-circle' : 'circle'} size={20} color={checked ? themeColor : '#eee'} />
)

const HistoryEmpty = () => (
    <View style={styles.flexcon}>
        <Text style={styles.empty}>╮(╯﹏╰）╭ 暂无历史记录</Text>
    </View>
)

const HistoryItem = ({ item: { img, currentTime, duration, isEnd, name, sourceName, date }, themeColor, onPress, onLongPress, checked, isEdit }) => (
    <TouchableOpacity activeOpacity={.8} style={styles.item} onPress={onPress} onLongPress={onLongPress}>
        {
            isEdit && <CheckBox themeColor={themeColor} checked={checked} />
        }
        <View style={styles.itemleft}>
            <Image
                style={styles.itemimg}
                resizeMode="cover"
                source={{ uri: img }}
            />
            <View style={styles.progresscon}>
                <View style={[styles.progressbar, { backgroundColor: themeColor, flex: isEnd ? duration : currentTime }]} />
                <View style={[styles.progressbar, { flex: isEnd ? 0 : duration - currentTime }]} />
            </View>
            <Text style={styles.tips}>{timeFormat(isEnd ? duration : currentTime) + ' / ' + timeFormat(duration)}</Text>
        </View>
        <View style={styles.textcon}>
            <Text style={styles.textname}>{name}</Text>
            <Text style={styles.textsource}>上次观看{sourceName}<Text style={{ color: themeColor }}>{isEnd ? 100 : parseInt(currentTime / duration * 100)}%</Text></Text>
            <Text style={styles.textdate}>{date}</Text>
        </View>
    </TouchableOpacity>
)

export default class History extends PureComponent {

    static navigationOptions = {
        drawerLabel: '历史记录',
        drawerIcon: ({ tintColor }) => (
            <Icon name='clock' size={18} color={tintColor} />
        ),
    };

    constructor(props) {
        super(props);
        this.state = {
            selected: [],
            isEdit: false,
            isRender: false
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
        const { historyList } = this.context;
        const { selected } = this.state;
        if (selected.length === historyList.length) {
            this.setState({
                selected: []
            })
        } else {
            this.setState({
                selected: historyList.map(el => el.id)
            })
        }
    }

    delSelect = () => {
        const { selected } = this.state;
        const { removeHistory } = this.context;
        this.setState({ selected: [], isEdit:false });
        removeHistory(selected);
    }

    renderItem = ({ item, index }) => {
        const { screenProps: { themeColor } } = this.props;
        const { selected, isEdit } = this.state;
        return <HistoryItem item={item} onPress={this.onPress(item.id)} isEdit={isEdit} checked={selected.indexOf(item.id) >= 0} onLongPress={this.onLongPress(item.id)} themeColor={themeColor[0]} />
    }

    renderFooter = () => {
        const { themeColor } = this.props;
        return <LoadView isEnding={true} themeColor={themeColor} />;
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (nextContext.historyList.length !== this.context.historyList.length) {
            LayoutAnimation.easeInEaseOut();
        }
    }

    async componentDidMount() {
        // const { initHistory } = this.context;
        // const data = await Storage.get('historyList');
        // if (data) {
        //     initHistory(data);
        // }
        // this.setState({ isRender: true });
    }

    render() {
        const { navigation, screenProps: { themeColor } } = this.props;
        const { historyList } = this.context;
        const { selected, isEdit, isRender } = this.state;
        return (
            <View style={styles.container}>
                <AppTop title="历史记录" navigation={navigation} themeColor={themeColor}>
                    {
                        historyList.length > 0 &&
                        <BorderlessButton onPress={this.onEdit} activeOpacity={.8} style={styles.btn}><Text style={styles.btntext}>{isEdit ? '取消' : '编辑'}</Text></BorderlessButton>
                    }
                </AppTop>
                {
                    historyList.length === 0 ?
                    <HistoryEmpty />
                    :
                    <FlatList
                        style={[styles.content, isEdit && { marginBottom: 48 }]}
                        numColumns={1}
                        ListFooterComponent={this.renderFooter}
                        //removeClippedSubviews={true}
                        data={historyList}
                        onEndReachedThreshold={0.1}
                        extraData={themeColor||isEdit}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={this.renderItem}
                    />
                }
                <View style={[styles.footer, historyList.length > 0 && isEdit && { bottom: 0 }]}>
                    <Touchable style={styles.vbtn} onPress={this.selectAll}>
                        <CheckBox themeColor={themeColor[0]} checked={selected.length === historyList.length} />
                        <Text style={styles.vbtntext}>全选</Text>
                    </Touchable>
                    <Touchable style={styles.vbtn} disabled={selected.length === 0} onPress={this.delSelect}>
                        <Icon name='trash-2' size={20} style={{ marginRight: 10 }} color={selected.length === 0 ? '#ccc' : themeColor[0]} />
                        <Text style={styles.vbtntext}>删除({selected.length})</Text>
                    </Touchable>
                </View>
            </View>
        );
    }
}

History.contextType = Store;

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
    },
    item: {
        marginTop: 10,
        marginHorizontal: 10,
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#fff',
        alignItems: 'center',
        flexDirection: 'row'
    },
    itemleft: {
        width: 120,
        height: 80,
        alignSelf:'flex-start',
        borderRadius: 3,
        overflow: 'hidden',
        zIndex: 1
    },
    itemimg: {
        width: '100%',
        height: '100%'
    },
    textcon: {
        height: '100%',
        marginHorizontal: 10,
        flex: 1,
        zIndex: 1,
    },
    progresscon: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 2,
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,.7)'
    },
    progressbar: {
        height: 3,
    },
    tips: {
        position: 'absolute',
        right: 5,
        bottom: 5,
        fontSize: 10,
        borderRadius: 3,
        paddingHorizontal: 5,
        paddingVertical: 2,
        color: '#fff',
        backgroundColor: 'rgba(0,0,0,.7)'
    },
    textname: {
        fontSize: 15,
    },
    textsource: {
        fontSize: 12,
        color: '#666',
        paddingVertical: 5
    },
    textdate: {
        fontSize: 12,
        color: '#999'
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
    }
});