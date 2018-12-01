/**
 * AppBar
 */

import React, { PureComponent } from 'react';
import { DrawerItems } from 'react-navigation';
import {
	StyleSheet,
    Text,
    ScrollView,
	View,
} from 'react-native';
//import Icon from 'react-native-vector-icons/Feather';
//import Touchable from '../components/Touchable';
import {ThemeContext} from '../../util/theme-context';

const contentOptions = {
    itemsContainerStyle :{
        paddingVertical:0
    },
    labelStyle:{
        marginLeft:0,
        fontSize:16,
        fontWeight:'normal'
    },
    itemStyle:{

    }
}

export default class DrawerContent extends PureComponent {

    componentDidMount() {
        //console.warn(this.props)
    }
	render() {
		const { theme } = this.context;
		return (
            <ScrollView style={{flex:1}}>
                <View style={[styles.top,{backgroundColor:theme.themeColor}]}></View>
                <DrawerItems {...this.props} {...contentOptions} inactiveTintColor="#333" activeTintColor={theme.themeColor} />
            </ScrollView>
			
		);
	}
}

DrawerContent.contextType = ThemeContext;

const styles = StyleSheet.create({
	top: {
        paddingTop: $.STATUS_HEIGHT,
        height:200,
		flexDirection: 'row',
		alignItems: 'center',
    },

});
