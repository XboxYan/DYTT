/**
 * Loading
 */

import React, { PureComponent } from 'react';
import {
	ActivityIndicator,
	StyleSheet,
	Text,
	View,
} from 'react-native';

export default class Loading extends PureComponent {

	static defaultProps = {
		style:{},
		text: '正在努力加载中',
		textColor: '#666',
		size:'large'
	}

	render() {
		const { style, size, text, textColor, themeColor } = this.props;
		return (
			<View style={[styles.content, style]}>
				<ActivityIndicator color={themeColor} size={size} />
				<Text style={[styles.loadtext, { color: textColor }]}>{text}</Text>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	content: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	loadtext: {
		fontSize: 12,
		margin: 10
	}

});
