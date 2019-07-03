import React, { PureComponent } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Switch,
    ScrollView
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import AppTop from '../components/AppTop';
import Storage from '../../util/storage';
import { Store } from '../../util/store';
import i18n, { configure } from '../../util/i18n';

const SettingItem = ({ title, subtitle, themeColor, value, setSettings, disabled = false }) => (
    <View style={[styles.item, disabled && { opacity: .6 }]}>
        <View style={styles.itemtext}>
            <Text style={styles.itemtitle}>{title}</Text>
            {
                !!subtitle && <Text style={styles.itemsubtitle}>{subtitle}</Text>
            }
        </View>
        <Switch
            disabled={disabled}
            value={value}
            trackColor={{ false: '#ccc', true: themeColor + '80' }}  //开关打开关闭时的背景颜色
            thumbColor={value ? themeColor : '#f1f1f1'} //开关上原形按钮的颜色
            onValueChange={setSettings}
        />
    </View>
)

export default class Setting extends PureComponent {

    setSettings = (type) => (value) => {
        const { setSettings } = this.context;
        setSettings(type, value, async (newSettings) => {
            console.log(newSettings)

            if (type === 'enableEng') {
                await configure();

                // Calling set state for rerender page
                // Param 'foo' used for rerender
                this.setState({ foo: Date.now() })
            }
        });
    }

    async componentDidMount() {
        const { initSettings } = this.context;
        const data = await Storage.get('settings');

        if (data) {
            initSettings(data);
        }
    }

    render() {
        const { navigation, screenProps: { themeColor } } = this.props;
        const { settings: { allowMoblieNetwork, preLoad, autoPlayNext, enableEng } } = this.context;
        return (
            <View style={styles.container}>
                <AppTop title={i18n.t('SETTINGS')} navigation={navigation} themeColor={themeColor} />
                <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 10 }}>
                    <Text style={styles.title}>{i18n.t('INTERNET')}</Text>
                    <View style={styles.wrap}>
                        <SettingItem title={i18n.t('MOBILE_NETWORK_PLAY_VIDEO')} subtitle={i18n.t('LOCAL_TYRANTS_CAN_TURN_OFF_THIS_REMINDER')} themeColor={themeColor[0]} value={allowMoblieNetwork} setSettings={this.setSettings('allowMoblieNetwork')} />
                    </View>
                    <Text style={styles.title}>{i18n.t('PLAY')}</Text>
                    <View style={styles.wrap}>
                        <SettingItem title={i18n.t('VIDEO_PRELOAD')} subtitle={i18n.t('VALID_UNDER_WIFI_STATUS')} themeColor={themeColor[0]} value={preLoad} setSettings={this.setSettings('preLoad')} />
                        <SettingItem title={i18n.t('PLAY_NEXT_AUTO')} subtitle={i18n.t('PLAY_AFTER_PLAYBACK')} themeColor={themeColor[0]} value={autoPlayNext} setSettings={this.setSettings('autoPlayNext')} />
                    </View>
                    <Text style={styles.title}>{i18n.t('LANGUAGE')}</Text>
                    <View style={styles.wrap}>
                        <SettingItem title={i18n.t('ENABLE_ENGLISH')} subtitle={i18n.t('ENABLE_ENGLISH_DESCRIPTION')} themeColor={themeColor[0]} value={enableEng} setSettings={this.setSettings('enableEng')} />
                    </View>
                </ScrollView>
            </View>
        );
    }
}

Setting.contextType = Store;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f7f7f7'
    },
    title: {
        fontSize: 14,
        padding: 10,
        color: '#666',
    },
    wrap: {
        backgroundColor: '#fff',
        borderRadius: 5,
        marginHorizontal: 10,
        padding: 5,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
    },
    itemtext: {
        flex: 1
    },
    itemtitle: {
        fontSize: 16
    },
    itemsubtitle: {
        fontSize: 12,
        marginTop: 5,
        color: '#999'
    }
});