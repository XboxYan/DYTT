/**
 * AppBar
 */

import React, { PureComponent } from 'react';
import {
	StyleSheet,
	Text,
	Platform,
	View,
	PixelRatio,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Touchable from './Touchable';
import {ThemeContext} from '../../util/theme-context';

export default class AppTop extends PureComponent {
	render() {
		const { theme } = this.context;
		const { title,navigation } = this.props;
		return (
			<View style={[styles.appbar, { backgroundColor: theme.themeColor }]}>
				<Touchable
					style={styles.btn}
					onPress={navigation.openDrawer}
				>
					<Icon name='menu' size={20} color='#fff' />
				</Touchable>
				<Text style={styles.apptitle} numberOfLines={1}>{title}</Text>
				{ this.props.children || null }
			</View>
		);
	}
}

AppTop.contextType = ThemeContext;

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
