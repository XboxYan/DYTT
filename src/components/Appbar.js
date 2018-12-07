/**
 * AppBar
 */

import React, { PureComponent } from 'react';
import {
	StyleSheet,
	TouchableOpacity,
	Text,
	View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

export default class AppBar extends PureComponent {
	goBack = () => {
		const { navigation,onPress } = this.props;
		onPress&&onPress();
		navigation.goBack();
	}
	render() {
		const { title,themeColor } = this.props;
		return (
			<View style={[styles.appbar, { backgroundColor: themeColor }]}>
				<TouchableOpacity
					activeOpacity={.8}
					style={styles.btn}
					onPress={this.goBack}
				>
					<Icon name='chevron-left' size={24} color='#fff' />
				</TouchableOpacity>
				<Text style={styles.apptitle} numberOfLines={1}>{title}</Text>
				{
					this.props.children || <View style={styles.btn}></View>
				}
			</View>
		);
	}
}

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
