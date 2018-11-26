import React, { PureComponent } from 'react';
import { Text, View, Button } from 'react-native';
import fetchData from '../../util/fetchData';

const maps = [
    {
        listType:'solling',
        name:'轮播图'
    },
    {
        listType:'movie',
        name:'电影'
    },
    {
        listType:'tv',
        name:'电视剧'
    },
    {
        listType:'comic',
        name:'动漫'
    },
    {
        listType:'variety',
        name:'娱乐'
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

export default class extends PureComponent {
    static navigationOptions = {
        tabBarLabel:'首页'
    }

    GetHomeData = async () => {
        const _data = await fetchData(global.URI+'/GetHomeData');
        const data = mapto(_data,maps);
        console.warn(data)

    }

    componentDidMount() {
        this.GetHomeData();
    }

    render() {
        return (
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                <Text>33</Text>
                <Button title="跳转" onPress={() => this.props.navigation.navigate('Detail')} />
            </View>
        );
    }
}