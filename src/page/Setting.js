import React, { PureComponent } from 'react';
import { 
    StyleSheet,
    Text, 
    View,
    TouchableOpacity,
    Switch,
    ScrollView 
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import AppTop from '../components/AppTop';
import Storage from '../../util/storage';
import { Store } from '../../util/store';


const  SettingItem = ({ title,subtitle,themeColor,value,setSettings,disabled=false }) => (
    <View style={[styles.item,disabled&&{opacity:.6}]}>
        <View style={styles.itemtext}>
            <Text style={styles.itemtitle}>{title}</Text>
            {
                !!subtitle&&<Text style={styles.itemsubtitle}>{subtitle}</Text>
            }
        </View>
        <Switch
            disabled={disabled}
            value={value}
            trackColor={{false: '#ccc', true: themeColor+'80'}}  //开关打开关闭时的背景颜色
            thumbColor={value?themeColor:'#f1f1f1'} //开关上原形按钮的颜色
            onValueChange={setSettings}
        />
    </View>
)

export default class Setting extends PureComponent {

    static navigationOptions = {
        drawerLabel: '设置',
        drawerIcon: ({ tintColor }) => (
            <Icon name='settings' size={18} color={tintColor} />
        ),
    };

    setSettings = (type) => (value) => {
        const { setSettings } = this.context;
        setSettings(type,value);
    }

    async componentDidMount() {
        const { initSettings } = this.context;
        const data = await Storage.get('settings');
        if (data) {
            initSettings(data);
        }
    }

    render() {
        const {navigation,screenProps:{themeColor}} = this.props;
        const {settings:{allowMoblieNetwork,preLoad,autoPlayNext}} = this.context;
        return (
            <View style={styles.container}>
                <AppTop title="设置" navigation={navigation} themeColor={themeColor} />
                <ScrollView style={{flex:1}} contentContainerStyle={{paddingBottom:10}}>
                    <Text style={styles.title}>网络</Text>
                    <View style={styles.wrap}>
                        <SettingItem title="移动网络播放视频提示" subtitle="土豪可以关闭此提醒" themeColor={themeColor} value={allowMoblieNetwork} setSettings={this.setSettings('allowMoblieNetwork')} />
                    </View>
                    <Text style={styles.title}>播放</Text>
                    <View style={styles.wrap}>
                        <SettingItem title="视频预加载" subtitle="Wifi状态和移动网络关闭提示下有效" themeColor={themeColor} value={preLoad} setSettings={this.setSettings('preLoad')} />
                        <SettingItem title="自动播放下一集" subtitle="有多个资源时播放完成后自动播放下一资源" themeColor={themeColor} value={autoPlayNext} setSettings={this.setSettings('autoPlayNext')} />
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
    title:{
        fontSize:14,
        padding:10,
        color:'#666',
    },
    wrap:{
        backgroundColor:'#fff',
        borderRadius:5,
        marginHorizontal:10,
        padding:5,
    },
    item:{
        flexDirection:'row',
        alignItems: 'center',
        padding:10,
    },
    itemtext:{
        flex:1
    },
    itemtitle:{
        fontSize:16
    },
    itemsubtitle:{
        fontSize:12,
        marginTop:5,
        color:'#999'
    }
});