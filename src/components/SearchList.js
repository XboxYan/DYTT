import React, { PureComponent } from 'react';
import {
	StyleSheet,
	Text,
	NativeModules,
	TouchableOpacity,
	LayoutAnimation,
	Image,
	FlatList,
	View,
} from 'react-native';

import Loading from './Loading';
import LoadView from './LoadView';

import i18n from '../../util/i18n';

const { UIManager } = NativeModules;

const MovieEmpty = () => (
	<View style={styles.flexcon}>
		<Text style={styles.empty}>╮(╯﹏╰）╭ {i18n.t('NOTHING_FOUND')}</Text>
	</View>
)

const MovieItem = (props) => (
	<TouchableOpacity
		activeOpacity={.9}
		onPress={() => props.navigation.navigate('MovieDetail', { movieId: props.item.ID })}
		style={styles.movieitem}>
		<Image
			style={styles.movieimg}
			source={{ uri: props.item.Cover || 'http' }}
		/>
		<View style={styles.movietext}>
			<Text style={[styles.moviename, { color: props.themeColor }]}>{props.item.Name}</Text>
			<Text numberOfLines={1} style={styles.movietxt1}>类型：{props.item.Info.Type}</Text>
			<Text numberOfLines={1} style={styles.movietxt2}>主演：{props.item.Info.Art}</Text>
			{
				//<Text numberOfLines={1} style={styles.movietxt2}>{props.item.Info.Status}</Text>
			}
			<Text numberOfLines={1} style={styles.movietxt2}>{props.item.Info.Time}</Text>
		</View>
	</TouchableOpacity>
)

export default class extends PureComponent {

	constructor(props) {
		super(props);
		UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
	}

	renderItem = ({ item, index }) => {
		return <MovieItem item={item} navigation={this.props.navigation} themeColor={this.props.themeColor} />
	}
	componentDidUpdate(nextProps, nextState) {
		//LayoutAnimation.easeInEaseOut();
	}

	renderFooter = () => {
		const { data } = this.props;
		const { onEndReached, themeColor, isEnding = false, ListFooterComponent } = this.props;
		if (ListFooterComponent) {
			return <ListFooterComponent />;
		}
		if (onEndReached) {
			return <LoadView isEnding={isEnding} themeColor={themeColor} />;
		} else {
			return null;
		}
	}

	render() {
		const { data, isRender, themeColor, style, onEndReached = () => { } } = this.props;
		const height = 150;
		if (!isRender) {
			return <Loading style={{ height: 100 }} size='small' text='' themeColor={themeColor} />
		}
		if (data.length == 0) {
			return <MovieEmpty />;
		}
		return (
			<FlatList
				style={[styles.content, style]}
				numColumns={1}
				ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
				ListFooterComponent={this.renderFooter}
				data={data}
				getItemLayout={(data, index) => ({ length: height, offset: height * index, index })}
				onEndReached={onEndReached}
				onEndReachedThreshold={0.1}
				keyExtractor={(item, index) => index + item.ID.toString()}
				renderItem={this.renderItem}
			/>
		)
	}
}

const styles = StyleSheet.create({
	content: {
		flex: 1,
		paddingVertical: 10,
	},
	movieitem: {
		marginHorizontal: 10,
		padding: 10,
		borderRadius: 5,
		overflow: 'hidden',
		backgroundColor: '#fff',
		flexDirection: 'row'
	},
	movieimg: {
		width: 90,
		height: 120,
		borderRadius: 3,
		backgroundColor: '#f1f1f1',
		resizeMode: 'cover'
	},
	movietext: {
		flex: 1,
		paddingHorizontal: 10,
	},
	moviename: {
		fontSize: 16,
	},
	movietxt1: {
		marginTop: 10,
		fontSize: 14,
		color: '#666',
	},
	movietxt2: {
		marginTop: 5,
		fontSize: 14,
		color: '#666',
	},
	flexcon: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	empty: {
		textAlign: 'center',
		fontSize: 14,
		color: '#666'
	}
});