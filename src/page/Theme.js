import React, { PureComponent } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ScrollView
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import AppTop from '../components/AppTop';

import i18n from '../../util/i18n';

export const themes = [
    {
        color: ['#db4437'],
        name: i18n.t('AUNT_RED')
    },
    {
        color: ['#0f9d58'],
        name: i18n.t('COOL_GREEN')
    },
    {
        color: ['#fb7299'],
        name: i18n.t('POWDER')
    },
    {
        color: ['#3f51b5'],
        name: i18n.t('DYKE_BLUE')
    },
    {
        color: ['#009688'],
        name: i18n.t('WATER_DUCK_GREEN')
    },
    {
        color: ['#ff9800'],
        name: i18n.t('ITO_ORANGE')
    },
    {
        color: ['#673ab7'],
        name: i18n.t('BASE_PURPLE')
    },
    {
        color: ['#2196f3'],
        name: i18n.t('KNOW_BLUE')
    },
    {
        color: ['#795548'],
        name: i18n.t('BRONZE_BROWN')
    },
    {
        color: ['#607d8b'],
        name: i18n.t('LOW-KEY_GRAY')
    },
    {
        color: ['#212121'],
        name: i18n.t('STAY_UP_LATE')
    },
]

export const themesGradient = [
    {
        color: ['#ff5858', '#f09819']
    },
    {
        color: ['#8fd3f4', '#84fab0']
    },
    {
        color: ['#f5576c', '#f093fb']
    },
    {
        color: ['#4facfe', '#00f2fe']
    },
    {
        color: ['#fa709a', '#fee140']
    },
    {
        color: ['#667eea', '#764ba2']
    },
    {
        color: ['#ff0844', '#ffb199']
    },
    {
        color: ['#b721ff', '#21d4fd']
    },
    {
        color: ['#09203f', '#537895']
    },
    {
        color: ['#16a085', '#f4d03f']
    }
]

const ThemeItems = ({ item: { color, name }, themeColor, setTheme }) => (
    <TouchableOpacity style={styles.item} activeOpacity={.8} onPress={() => setTheme(color)}>
        <LinearGradient colors={color.length > 1 ? color : [...color, ...color]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.color} />
        <Icon name='feather' size={14} color={'#fff'} style={[styles.feather, { opacity: themeColor.toString() === color.toString() ? 1 : 0 }]} />
    </TouchableOpacity>
)

export default class extends PureComponent {

    render() {
        const { navigation, screenProps: { themeColor, setTheme } } = this.props;
        return (
            <View style={styles.container}>
                <AppTop title={i18n.t('THEME_STYLE')} navigation={navigation} themeColor={themeColor} />
                <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 10 }}>
                    <Text style={styles.title}>{i18n.t('SOLID_COLOR_THEME')}</Text>
                    <View style={styles.item_wrap}>
                        {
                            themes.map((el, i) => <ThemeItems key={i} item={el} setTheme={setTheme} themeColor={themeColor} />)
                        }
                    </View>
                    <Text style={styles.title}>{i18n.t('GRADIENT_COLOR_THEME')}</Text>
                    <View style={styles.item_wrap}>
                        {
                            themesGradient.map((el, i) => <ThemeItems key={i} item={el} setTheme={setTheme} themeColor={themeColor} />)
                        }
                    </View>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f7f7f7'
    },
    title: {
        fontSize: 14,
        padding: 10,
        paddingBottom: 0,
        color: '#666',
    },
    item_wrap: {
        flexDirection: 'row',
        margin: 5,
        flexWrap: 'wrap'
    },
    item: {
        margin: 5,
        width: ($.WIDTH - 120) / 4,
        height: ($.WIDTH - 120) / 4,
        backgroundColor: '#fff',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    feather: {
        position: 'absolute'
    },
    color: {
        position: 'absolute',
        width: 34,
        height: 34,
        borderRadius: 20
    },
    text: {
        flex: 1,
        fontSize: 14,
        color: '#666',
        paddingHorizontal: 10
    }
});