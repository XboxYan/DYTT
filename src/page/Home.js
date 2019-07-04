import React, { PureComponent, Fragment } from 'react';
import { StyleSheet, ScrollView, Text, View, TouchableOpacity, LayoutAnimation, NativeModules } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import Swiper from '../components/Swiper';
import MovieTitle from '../components/MovieTitle';
import MovieList from '../components/MovieList';
import MovieMoreBtn from '../components/MovieMoreBtn'
import { GetHomeData } from '../../util/api';
import i18n from '../../util/i18n';

const { UIManager } = NativeModules;

const maps = [
    {
        listType: 'solling',
        name: '轮播图',
        isRender: true
    },
    {
        listType: 'movie',
        name: i18n.t('FILMS'),
        icon: 'film'
    },
    {
        listType: 'tv',
        name: i18n.t('TV_SERIES'),
        icon: 'tv'
    },
    {
        listType: 'comic',
        name: i18n.t('ANIME'),
        icon: 'gitlab'
    },
    {
        listType: 'variety',
        name: i18n.t('ENTERTAINMENT'),
        icon: 'anchor'
    },
]

const mapto = (list, maps) => {
    const data = {};
    list.forEach(d => {
        maps.forEach(el => {
            !data[el.listType] && (data[el.listType] = {
                name: '',
                list: []
            });
            if (el.listType === d.listType) {
                !data[el.listType].name && (data[el.listType].name = el.name);
                data[el.listType].list.push(d);
            }
        })
    })
    return data;
}

export default class Home extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            data: {}
        }
        UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    }

    GetHomeData = async () => {
        const data = await GetHomeData();
        //const data = mapto(_data,maps);
        if (this.mounted) {
            LayoutAnimation.easeInEaseOut();
            this.setState({
                data,
                loading: false
            })
        }
    }

    componentDidMount() {
        this.mounted = true;
        this.GetHomeData();
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    goDetail = (params) => () => {
        this.props.navigation.navigate('MovieContent', params);
    }

    render() {
        const { loading, data = {} } = this.state;
        const { navigation, screenProps: { themeColor } } = this.props;
        return (
            <ScrollView style={styles.content}>
                <Swiper loading={loading} data={data.solling && data.solling.list} navigation={navigation} themeColor={themeColor[0]} />
                <View style={styles.links}>
                    {
                        maps.filter(el => !el.isRender).map((d, i) => (
                            <TouchableOpacity key={i} style={styles.linkitem} activeOpacity={.9} onPress={this.goDetail({ type: d.listType, title: d.name })} >
                                <LinearGradient colors={themeColor.length > 1 ? themeColor : [...themeColor, ...themeColor]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.linkicon}><Icon name={d.icon} color={'#fff'} size={16} /></LinearGradient>
                                <Text style={styles.linktext}>{d.name}</Text>
                            </TouchableOpacity>
                        ))
                    }
                </View>
                {
                    maps.filter(el => !el.isRender).map((d, i) => (
                        <Fragment key={i}>
                            <MovieTitle title={d.name} icon={d.icon} themeColor={themeColor[0]} />
                            <MovieList isRender={!loading} style={{ marginTop: -10 }} data={data[d.listType] ? data[d.listType]['list'] : []} navigation={navigation} themeColor={themeColor[0]} />
                            <MovieMoreBtn show={!loading} text={i18n.t('SEE_MORE') + d.name} onPress={this.goDetail({ type: d.listType, title: d.name })} />
                        </Fragment>
                    ))
                }
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    content: {
        flex: 1,
    },
    links: {
        borderRadius: 5,
        backgroundColor: '#fff',
        overflow: 'hidden',
        marginHorizontal: 10,
        padding: 10,
        marginTop: -25,
        flexDirection: 'row'
    },
    linkitem: {
        flex: 1,
        alignItems: 'center'
    },
    linkicon: {
        width: 40,
        height: 40,
        borderRadius: 40,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    linktext: {
        marginTop: 5,
        fontSize: 12,
    },
    links2: {
        borderRadius: 5,
        backgroundColor: '#fff',
        overflow: 'hidden',
        margin: 10,
        padding: 10,
        marginTop: -20
    }
});
