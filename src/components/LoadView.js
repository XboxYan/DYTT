import React, { PureComponent } from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

import Loading from './Loading';

import i18n from '../../util/i18n';

export default class extends PureComponent {
    render() {
        const { isEnding, themeColor } = this.props;
        return (
            <View style={styles.loadview}>
                {
                    isEnding ?
                        <View style={styles.loadmore}>
                            <Text style={styles.loadtext}>ヾ(ｏ･ω･)ﾉ {i18n.t('NO_MATER')}</Text>
                        </View>
                        :
                        <Loading text={`${i18n.t('LOADING_UPPER')}...`} style={{ flexDirection: 'row' }} size="small" themeColor={themeColor} />
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    loadview: {
        padding: 20,
        alignItems: 'center',
    },
    loadtext: {
        color: '#999',
        fontSize: 14,
        paddingHorizontal: 5
    },
    loadmore: {
        flexDirection: 'row',
        justifyContent: 'center',
    }
})