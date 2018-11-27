/**
 * MovieTitle
 */

import React, { PureComponent } from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    Text,
    View,
} from 'react-native';

import Icon from 'react-native-vector-icons/Feather';
import { ThemeContext } from '../../util/theme-context';

export default class MovieTitle extends PureComponent {

    render() {
        const { theme } = this.context;
        const { icon, title } = this.props;
        return (
            <View style={styles.view_hd}>
                <Icon name={icon} size={16} color={theme.themeColor} />
                <Text style={styles.view_title}>{title}</Text>
            </View>
        )
    }
}

MovieTitle.contextType = ThemeContext;

const styles = StyleSheet.create({
    view_hd: {
        height: 40,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        //backgroundColor:'#fff'
    },
    line:{
        width:3,
        borderRadius:2,
        height:16
    },
    view_title: {
        marginLeft:5,
        fontSize: 16,
        color: '#333',
        flex: 1
    },
    view_more: {
        flexDirection: 'row',
        alignSelf: 'stretch',
        alignItems: 'center',
    },
    view_moretext: {
        fontSize: 13,
        color: '#999'
    },
});
