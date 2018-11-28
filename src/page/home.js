import React, { PureComponent,Fragment } from 'react';
import { StyleSheet, ScrollView, Text, View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Swiper from '../components/Swiper';
import Loading from '../components/Loading';
import MovieTitle from '../components/MovieTitle';
import MovieList from '../components/MovieList';
import MovieMoreBtn from '../components/MovieMoreBtn'
import {GetHomeData} from '../../util/api';
import {ThemeContext} from '../../util/theme-context';

const maps = [
    {
        listType:'solling',
        name:'轮播图',
        isRender:true
    },
    {
        listType:'movie',
        name:'电影',
        icon:'film'
    },
    {
        listType:'tv',
        name:'电视剧',
        icon:'tv'
    },
    {
        listType:'comic',
        name:'动漫',
        icon:'gitlab'
    },
    {
        listType:'variety',
        name:'娱乐',
        icon:'anchor'
    },
]

const mapto = (list,maps) => {
    const data = {};
    list.forEach(d=>{
        maps.forEach(el=>{
            !data[el.listType]&&(data[el.listType]={
                name:'',
                list:[]
            });
            if(el.listType===d.listType){
                !data[el.listType].name&&(data[el.listType].name = el.name);
                data[el.listType].list.push(d);
            }
        })
    })
    return data;
}

export default class Home extends PureComponent {

    state = {
        loading:true,
        data:{}
    }

    GetHomeData = async () => {
        const _data = await GetHomeData();
        const data = mapto(_data,maps);
        this.setState({
            data,
            loading:false
        })
    }

    componentDidMount() {
        this.GetHomeData();
    }

    render() {
        const {loading,data={}} = this.state;
        const {navigation} = this.props;
        const {theme} = this.context;
        return (
            <ScrollView style={styles.content}>
                <Swiper loading={loading} data={data.solling&&data.solling.list} navigation={navigation} />
                <View style={styles.links}>
                    {
                        maps.filter(el=>!el.isRender).map((d,i)=>(
                            <TouchableOpacity key={i} style={styles.linkitem} activeOpacity={.9} ><View style={[styles.linkicon,{backgroundColor:theme.themeColor}]}><Icon name={d.icon} color={'#fff'} size={16} /></View><Text style={styles.linktext}>{d.name}</Text></TouchableOpacity>
                        ))
                    }
                </View>
                {
                    maps.filter(el=>!el.isRender).map((d,i)=>(
                        <Fragment key={i}>
                            <MovieTitle title={d.name} icon={d.icon} />
                            <MovieList isRender={!loading} data={data[d.listType]?data[d.listType]['list']:[]} navigation={navigation} />
                            <MovieMoreBtn show={!loading} text={"查看更多"+d.name} />
                        </Fragment>
                    ))
                }
            </ScrollView>
        );
    }
}

Home.contextType = ThemeContext;

const styles = StyleSheet.create({
	content: {
        flex: 1,
    },
    links:{
        borderRadius:5,
        backgroundColor:'#fff',
        overflow:'hidden',
        marginHorizontal:10,
        padding:10,
        marginTop:-25,
        flexDirection:'row'
    },
    linkitem:{
        flex:1,
        alignItems:'center'
    },
    linkicon:{
        width:40,
        height:40,
        borderRadius:40,
        backgroundColor:'#fff',
        justifyContent: 'center',
		alignItems: 'center',
    },
    linktext:{
        marginTop:5,
        fontSize:12,
    },
    links2:{
        borderRadius:5,
        backgroundColor:'#fff',
        overflow:'hidden',
        margin:10,
        padding:10,
        marginTop:-20
    }
});