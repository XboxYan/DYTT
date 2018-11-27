import React, { PureComponent } from 'react';
import { View, StyleSheet,Button } from 'react-native';
import Scrollviewpager from './components/Scrollviewpager';
import Home from './page/home';
import Screen from './page/Screen';

const tablist = [
    {
        type:'movie',
        name:'电影'
    },
    {
        type:'tv',
        name:'电视剧'
    },
    {
        type:'comic',
        name:'动漫'
    },
    {
        type:'variety',
        name:'综艺'
    }
]

export default class TabNavigator extends PureComponent {
    render(){
        const {navigation} = this.props;
        return (
            <View style={styles.container}>
                <Scrollviewpager>
                    <Home tablabel="首页" navigation={navigation}/>
                    {
                        tablist.map(el=><Screen key={el.type} type={el.type} tablabel={el.name} navigation={navigation} />)
                    }
                </Scrollviewpager>
            </View>
        )
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'#f7f7f7'
    },
});