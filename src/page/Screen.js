import React, { PureComponent } from 'react';
import {
    View,
    InteractionManager,
    LayoutAnimation,
    StyleSheet,
    NativeModules
} from 'react-native';

import Loading from '../components/Loading';
import MovieList from '../components/MovieList';
import MovieMoreBtn from '../components/MovieMoreBtn';
import { GetPageList } from '../../util/api';
import i18n from '../../util/i18n';

const { UIManager } = NativeModules;

export default class extends PureComponent {

    constructor(props) {
        super(props);
        UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
        this.state = {
            data: [],
            isRender: false,
        }
    }

    getData = async () => {
        const data = await GetPageList({ pageIndex: 1, pageSize: 30, Type: this.type });
        if (this.mounted) {
            LayoutAnimation.easeInEaseOut();
            this.setState({
                data: data,
                isRender: true,
            })
        }
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.mounted = true;
            const { type } = this.props;
            this.type = type;
            this.getData();
        })
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    ListFooterComponent = () => {
        const { navigation, type, tablabel } = this.props;
        return (
            <View style={{ paddingBottom: 10 }}>
                <MovieMoreBtn text={i18n.t('SEE_MORE')} show={true} style={{ marginHorizontal: 5 }} onPress={() => navigation.navigate('MovieContent', { type: type, title: tablabel })} />
            </View>
        );
    }

    render() {
        const { isRender, data } = this.state;
        const { navigation, screenProps: { themeColor } } = this.props;
        return (
            <View style={styles.container}>
                {
                    isRender ?
                        <MovieList style={{ paddingHorizontal: 5 }} isRender={true} ListFooterComponent={this.ListFooterComponent} data={data} navigation={navigation} themeColor={themeColor[0]} onEndReached={this.loadMore} />
                        :
                        <Loading size='small' text={`${i18n.t('TRY_LOADING')}...`} themeColor={themeColor[0]} />
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f7f7f7'
    },
});