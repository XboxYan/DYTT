import React, { PureComponent } from 'react';
import { View, StyleSheet } from 'react-native';
import { BorderlessButton } from 'react-native-gesture-handler';
import Scrollviewpager from './components/Scrollviewpager';
import AppTop from './components/AppTop';
import Home from './page/Home';
import Screen from './page/Screen';
import Icon from 'react-native-vector-icons/Feather';

import i18n from '../util/i18n';

export default class TabNavigator extends PureComponent {

    constructor(props) {
        super(props);

        this.tablist = [
            {
                type: 'movie',
                name: i18n.t('FILMS')
            },
            {
                type: 'tv',
                name: i18n.t('TV_SERIES')
            },
            {
                type: 'comic',
                name: i18n.t('ANIME')
            },
            {
                type: 'variety',
                name: i18n.t('VARIETY')
            }
        ]
    }

    render() {
        const { navigation, screenProps: { themeColor } } = this.props;
        return (
            <View style={styles.container}>
                <AppTop title={i18n.t('MOVIE_HEAVEN')} navigation={navigation} themeColor={themeColor}>
                    {
                        /*
                        <Touchable
                            style={styles.btn}
                            onPress={()=>navigation.navigate('History')}
                        >
                            <Icon name='clock' size={20} color='#fff' />
                        </Touchable>
                        */
                    }
                    <BorderlessButton activeOpacity={.8} style={styles.btn} onPress={() => navigation.navigate('Search')} >
                        <Icon name='search' size={20} color='#fff' />
                    </BorderlessButton>
                </AppTop>
                <Scrollviewpager themeColor={themeColor[0]}>
                    <Home tablabel={i18n.t('HOME')} {...this.props} />
                    {
                        this.tablist.map(el => <Screen key={el.type} type={el.type} tablabel={el.name} {...this.props} />)
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