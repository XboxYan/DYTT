import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import Scrollviewpager from './components/Scrollviewpager';
import Touchable from './components/Touchable';
import AppTop from './components/AppTop';
import Home from './page/Home';
import Screen from './page/Screen';
import Icon from 'react-native-vector-icons/Feather';

const tablist = [
    {
        type: 'movie',
        name: '电影'
    },
    {
        type: 'tv',
        name: '电视剧'
    },
    {
        type: 'comic',
        name: '动漫'
    },
    {
        type: 'variety',
        name: '综艺'
    }
]

export default class TabNavigator extends PureComponent {
    static navigationOptions = {
        drawerLabel: '首页',
        drawerIcon: ({ tintColor }) => (
            <Icon name='home' size={16} color={tintColor} />
        ),
    };
    render() {
        const { navigation } = this.props;
        return (
            <View style={styles.container}>
                <AppTop title="电影天堂" navigation={navigation}>
                    <Touchable
                        style={styles.btn}
                        onPress={()=>navigation.navigate('History')}
                    >
                        <Icon name='clock' size={20} color='#fff' />
                    </Touchable>
                    <Touchable
                        style={styles.btn}
                    >
                        <Icon name='search' size={20} color='#fff' />
                    </Touchable>
                </AppTop>
                <Scrollviewpager>
                    <Home tablabel="首页" navigation={navigation} />
                    {
                        tablist.map(el => <Screen key={el.type} type={el.type} tablabel={el.name} navigation={navigation} />)
                    }
                </Scrollviewpager>
            </View>
        )
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f7f7f7'
    },
    btn: {
        width: 48,
        height: 48,
        zIndex: 1,
        backgroundColor: 'rgba(0,0,0,0)',
        justifyContent: 'center',
        alignItems: 'center',
    },
});