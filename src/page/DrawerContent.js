/**
 * AppBar
 */

import React, { PureComponent } from 'react';
import { DrawerItems } from 'react-navigation';
import {
    StyleSheet,
    ScrollView,
    ImageBackground,
} from 'react-native';
import { BorderlessButton } from 'react-native-gesture-handler';
import { Store } from '../../util/store';

const contentOptions = {
    itemsContainerStyle: {
        paddingVertical: 0
    },
    labelStyle: {
        marginLeft: 0,
        fontSize: 16,
        fontWeight: 'normal'
    },
    itemStyle: {

    }
}

export default class DrawerContent extends PureComponent {

    componentDidMount() {
        //console.warn(this.props)
    }

    render() {
        const { historyList: [LatestItem] } = this.context;
        const { themeColor } = this.props.screenProps;
        return (
            <ScrollView style={{ flex: 1 }}>
                <ImageBackground source={require('../img/photo.jpg')} style={[styles.top, { backgroundColor: themeColor[0] }]}>
                    {
                        LatestItem &&
                        <BorderlessButton style={styles.item} activeOpacity={.8} onPress={() => this.props.navigation.navigate('MovieDetail', { movieId: LatestItem.id })}>
                            {
                                //<Image resizeMode="cover" style={styles.cover} source={{uri:LatestItem.img}} />
                            }
                        </BorderlessButton>
                    }
                </ImageBackground>
                <DrawerItems {...this.props} {...contentOptions} inactiveTintColor="#333" activeTintColor={themeColor[0]} />
            </ScrollView>

        );
    }
}

DrawerContent.contextType = Store;

const styles = StyleSheet.create({
    top: {
        height: $.WIDTH * .7,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    item: {
        width: '100%',
        height: '100%',
    },
    cover: {
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        opacity: .5
    },
    name: {
        color: '#fff',
        fontSize: 16
    }
});
