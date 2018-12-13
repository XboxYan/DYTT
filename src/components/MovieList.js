import React, { Component } from 'react';
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

const {UIManager} = NativeModules;

const MovieEmpty = () => (
	<View style={styles.flexcon}>
		<Text style={styles.empty}>╮(╯﹏╰）╭什么也没找到</Text>
	</View>
)

const MovieItem = (props) => (
	<TouchableOpacity
		activeOpacity={.9}
		onPress={() => props.navigation.navigate('MovieDetail',{movieId:props.item.ID})}
		style={styles.movieitem}>
		<Image 
			style={styles.movieimg}
			source={{uri:props.item.Cover||'http'}}
		/>
		<View style={styles.movietext}>
			<Text numberOfLines={1} style={styles.moviename}>{props.item.Name}</Text>
		</View>
	</TouchableOpacity>
)

export default class extends Component {

	constructor(props) {
		super(props);
		UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
	}

	renderItem = ({ item, index }) => {
		return <MovieItem item={item} navigation={this.props.navigation} />
	}
	componentDidUpdate(nextProps, nextState) {
		LayoutAnimation.easeInEaseOut();
	}

	renderFooter = () => {
		const { data } = this.props;
		const { onEndReached,themeColor,isEnding=false } = this.props;
		if(onEndReached){
			return <LoadView isEnding={isEnding} themeColor={themeColor} />;
		}else{
			return null;
		}
	}

	shouldComponentUpdate(nextProps,nextState){
        return (this.props.data.length != nextProps.data.length || this.props.isRender != nextProps.isRender || this.props.isEnding != nextProps.isEnding);
    }

	render() {
		const { data, isRender,themeColor,style,onEndReached=()=>{} } = this.props;
		const height = ($.WIDTH - 40) / 2+40;
		if (!isRender) {
			return <Loading style={{height:100}} size='small' text='' themeColor={themeColor} />
		}
		if(data.length==0){
			return <MovieEmpty />;
		}
		return (
			<FlatList
				style={[styles.content,style]}
				numColumns={3}
				ItemSeparatorComponent={() => <View style={{height:10}} />}
				ListFooterComponent={this.renderFooter}
				data={data}
				getItemLayout={(data, index) => ( {length: height, offset: height * index, index} )}
				onEndReached={onEndReached}
				onEndReachedThreshold={0.1}
				keyExtractor={(item, index) => item.ID.toString()}
				renderItem={this.renderItem}
			/>
		)
	}
}

const styles = StyleSheet.create({
	content: {
		flex: 1,
		paddingHorizontal: 5,
		paddingTop:10,
	},
	movieitem: {
		width: ($.WIDTH - 40) / 3,
		marginHorizontal: 5,
		borderRadius:3,
		overflow:'hidden',
		backgroundColor:'#fff',
		//marginTop:10,
	},
	movieimg: {
		width: '100%',
		height:($.WIDTH - 40) / 2,
		flex: 1,
		resizeMode: 'cover'
	},
	movietext: {
		alignItems: 'center',
		height: 30,
		paddingHorizontal: 5,
		flexDirection: 'row'
	},
	moviename: {
		fontSize: 14,
		color: '#333',
		textAlign: 'center',
		flex: 1
	},
	flexcon:{
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