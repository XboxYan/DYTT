/**
 * AppBar
 */

import React, { PureComponent } from 'react';
import { DrawerItems } from 'react-navigation';
import {
	StyleSheet,
    Text,
    ScrollView,
    Image,
	View,
} from 'react-native';

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
		const { themeColor } = this.props.screenProps;
		return (
            <ScrollView style={{flex:1}}>
                <View style={[styles.top,{backgroundColor:themeColor}]}>
                    <Image source={require('../img/photo.png')} style={styles.photo} />
                </View>
                <DrawerItems {...this.props} {...contentOptions} inactiveTintColor="#333" activeTintColor={themeColor} />
            </ScrollView>
			
		);
	}
}

const styles = StyleSheet.create({
	top: {
        height:$.WIDTH*.7,
		flexDirection: 'row',
		alignItems: 'center',
    },
    photo:{
        position:'absolute',
        left:0,
        top:0,
        width:'100%',
        height:'100%'
    }
});
