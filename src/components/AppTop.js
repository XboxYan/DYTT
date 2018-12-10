/**
 * AppTop
 */

import React, { PureComponent } from 'react';
import {
	StyleSheet,
    Text,
    TouchableOpacity,
	View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { BorderlessButton } from 'react-native-gesture-handler';
import Touchable from './Touchable';

export default ({ title,navigation,themeColor,children }) => (
	<View style={[styles.appbar, { backgroundColor: themeColor }]}>
        <BorderlessButton
            activeOpacity={.8}
			style={styles.btn}
			onPress={navigation.openDrawer}
		>
			<Icon name='menu' size={20} color='#fff' />
		</BorderlessButton>
		<Text style={styles.apptitle} numberOfLines={1}>{title}</Text>
		{ children || null }
	</View>
)

const styles = StyleSheet.create({
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
