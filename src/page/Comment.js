/*
*
HomeMore
*
*/

import React, { PureComponent } from 'react';
import {
    Text,
    InteractionManager,
    StyleSheet,
    View,
} from 'react-native';

import { GetDoubanInterests } from '../../util/api';
import Appbar from '../components/Appbar';
import CommentList from '../components/CommentList';


export default class Comment extends PureComponent {

    page = 1;

    pageSize = 30;

    state = {
        data : [],
        total: 0,
        isRender: false,
        isEnding:false
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.getData();
        })
    }

    getData = async () => {
        const { params:{DBID} } = this.props.navigation.state;
        const data = await GetDoubanInterests({DBID,start:(this.page-1)*this.pageSize,count:this.pageSize})
        this.setState({
            data : [...this.state.data,...data.interests],
            isRender: true,
            total:data.total
        })
        if(data.interests.length<this.pageSize){
            this.setState({
                isEnding:true
            })
        }else{
            this.page = this.page+1;
        }
    }

    loadMore = () => {
        if(!this.state.isEnding){
            this.getData();
        }
    }

    render() {
        const {navigation,screenProps:{themeColor}} = this.props;
        const { data,isRender,total,isEnding } = this.state;
        return (
            <View style={styles.content}>
                <Appbar navigation={navigation} themeColor={themeColor} title={`全部${total}条热评`} />
                <CommentList 
                    style={styles.commentview}
                    themeColor={themeColor}
                    isRender={isRender} 
                    data={data} 
                    navigation={navigation} 
                    isEnding={isEnding}
                    onEndReached={this.loadMore}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    content:{
        flex:1
    },
	commentview:{
		backgroundColor:'#f7f7f7',
	}
})