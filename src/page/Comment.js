/*
*
Comment
*
*/

import React, { PureComponent } from 'react';
import {
    BackHandler,
    InteractionManager,
    StyleSheet,
    View,
} from 'react-native';

import { GetDoubanInterests } from '../../util/api';
import i18n from '../../util/i18n';
import AppTop from '../components/AppTop';
import CommentList from '../components/CommentList';


export default class Comment extends PureComponent {

    page = 1;

    pageSize = 50;

    state = {
        data: [],
        total: 0,
        isRender: false,
        isEnding: false
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.goBack);
        InteractionManager.runAfterInteractions(() => {
            this.getData();
        })
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.goBack);
    }

    goBack = () => {
        const { navigation } = this.props;
        navigation.goBack();
        return true;
    }

    getData = async () => {
        const { params: { DBID } } = this.props.navigation.state;
        const data = await GetDoubanInterests({ DBID, start: (this.page - 1) * this.pageSize, count: this.pageSize })
        this.setState({
            data: [...this.state.data, ...data.interests],
            isRender: true,
            total: data.total
        })
        if (data.interests.length == 0) {
            this.setState({
                isEnding: true
            })
        } else {
            this.page = this.page + 1;
        }
    }

    loadMore = () => {
        if (!this.state.isEnding) {
            this.getData();
        }
    }

    render() {
        const { navigation, screenProps: { themeColor } } = this.props;
        const { data, isRender, total, isEnding } = this.state;
        return (
            <View style={styles.content}>
                <AppTop navigation={navigation} themeColor={themeColor} isBack={true} title={`${i18n.t('ALL')} ${total} ${i18n.t('HOT_REVIEWS')}`} />
                <CommentList
                    style={styles.commentview}
                    themeColor={themeColor[0]}
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
    content: {
        flex: 1
    },
    commentview: {
        backgroundColor: '#f7f7f7',
    }
})