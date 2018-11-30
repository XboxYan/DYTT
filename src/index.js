import React, { PureComponent } from 'react';
import { View,Text, StyleSheet } from 'react-native';
import Scrollviewpager from './components/Scrollviewpager';
import Touchable from './components/Touchable';
import Home from './page/Home';
import Screen from './page/Screen';
import Icon from 'react-native-vector-icons/Feather';
import {ThemeContext} from '../util/theme-context';

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
        const { navigation } = this.props;
        const { theme } = this.context;
        return (
            <View style={styles.container}>
                <View style={[styles.appbar, { backgroundColor: theme.themeColor }]}>
                    <Touchable
                        style={styles.btn}
                    >
                        <Icon name='menu' size={20} color='#fff' />
                    </Touchable>
                    <Text style={styles.apptitle} numberOfLines={1}>电影天堂</Text>
                    <Touchable
                        style={styles.btn}
                    >
                        <Icon name='clock' size={20} color='#fff' />
                    </Touchable>
                    <Touchable
                        style={styles.btn}
                    >
                        <Icon name='search' size={20} color='#fff' />
                    </Touchable>
                </View>
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

TabNavigator.contextType = ThemeContext;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'#f7f7f7'
    },
    appbar: {
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
	apptitle: {
		flex: 1,
		fontSize: 16,
		color: '#fff'
	}
});