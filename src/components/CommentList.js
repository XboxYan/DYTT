import React, { PureComponent } from 'react';
import {
	StyleSheet,
	Text,
	ActivityIndicator,
	TouchableOpacity,
	Image,
	FlatList,
	View,
} from 'react-native';

import Loading from './Loading';
import LoadView from './LoadView';
import Star from './Star';

const CommentEmpty = () => (
	<View style={styles.flexcon}>
		<Text style={styles.empty}>╮(╯﹏╰）╭ 暂无评论</Text>
	</View>
)

const CommentItem = (props) => (
	<View style={styles.commentitem} onLayout={props.onLayout}>
		<Image 
			style={styles.commentimg}
			source={{uri:props.item.user.avatar}}
		/>
		<View style={styles.commenttext}>
			<Text style={styles.commentname}>{props.item.user.name}</Text>
			<Text style={styles.commenttime}>{props.item.create_time}</Text>
			<Text style={styles.commentpage}>{props.item.comment}</Text>
			<Star style={styles.star} score={props.item.rating?props.item.rating.value*2:0} isShowNum={false} themeColor={props.themeColor}/>
		</View>
	</View>
)

export default class extends PureComponent {

	columns = [];

	renderItem = ({ item, index }) => {
		return <CommentItem item={item} onLayout={this.onLayout(index)} themeColor={this.props.themeColor} />
	}

	onLayout = (index) => (ev) => {
        const {height} = ev.nativeEvent.layout;
        this.columns[index] = height;
    }

	renderFooter = () => {
		const { onEndReached,themeColor,isEnding=false } = this.props;
		if(onEndReached){
			return <LoadView isEnding={isEnding} themeColor={themeColor} />;
		}else{
			return null;
		}
	}

	getItemLayout = (data, rowIndex) => {
        let offset = 0;
        for (let ii = 0; ii < rowIndex; ii += 1) {
          offset += this.columns[ii]+10;
        }
        return { length: this.columns[rowIndex]+10, offset, index: rowIndex };
    };

	render() {
		const { data,style, isRender,onEndReached=()=>{},onLayout,themeColor } = this.props;
		if (!isRender) {
			return <Loading size='small' text='' themeColor={themeColor} />
		}
		if(data.length === 0){
			return <CommentEmpty />
		}
		return (
			<FlatList
				style={[styles.content,style]}
				onLayout={onLayout}
				numColumns={1}
				ItemSeparatorComponent={() => <View style={{height:10}} />}
				ListFooterComponent={this.renderFooter}
				removeClippedSubviews={true}
				getItemLayout={this.getItemLayout}
				data={data}
				onEndReached={onEndReached}
				onEndReachedThreshold={0.1}
				keyExtractor={(item, index) => index+item.id}
				renderItem={this.renderItem}
			/>
		)
	}
}

const styles = StyleSheet.create({
	content: {
		flex: 1,
		paddingTop:10,
	},
	commentitem: {
		//marginTop:10,
		marginHorizontal:10,
		padding:10,
		borderRadius:5,
		backgroundColor:'#fff',
		flexDirection:'row'
	},
	commentimg: {
		width: 40,
		height:40,
		borderRadius:20,
		backgroundColor:'#f1f1f1',
		resizeMode: 'cover'
	},
	commenttext: {
		marginLeft:15,
		flex:1
	},
	commentname: {
		fontSize: 15,
		color: '#333',
	},
	commentpage:{
		fontSize: 14,
		color: '#666',
		marginTop:10
	},
	commenttime:{
		marginTop:5,
		fontSize:14,
		color:'#999',
		fontStyle:'italic'
	},
	star:{
		position:'absolute',
		width:70,
		top:0,
		right:0,
	},
	label: {
		textAlign: 'center',
		fontSize: 10,
		marginTop: 3,
	},
	commentloadcontent: {
		flex: 1,
		paddingHorizontal: 5,
		flexDirection: 'row',
		flexWrap: 'wrap'
	},
	commentloadtext: {
		height: 10,
	},
	flexcon:{
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	empty:{
		flex:1,
		padding:10,
		textAlign:'center',
		fontSize: 14,
		color: '#666'
	}
});