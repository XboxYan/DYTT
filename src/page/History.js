import React, { PureComponent } from 'react';
import { 
    StyleSheet,
    Text, 
    View, 
    Button 
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import AppTop from '../components/AppTop';

export default class extends PureComponent {

    static navigationOptions = {
        drawerLabel: '历史记录',
        drawerIcon: ({ tintColor }) => (
            <Icon name='clock' size={16} color={tintColor} />
        ),
    };

    componentDidMount() {
        //console.warn(this.props.navigation)
    }

    render() {
        const {navigation,screenProps:{themeColor}} = this.props;
        return (
            <View style={styles.container}>
                <AppTop title="历史记录" navigation={navigation} themeColor={themeColor} />
                <Text>这是历史记录页面</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f7f7f7'
    },
    btn: {
        width: 48,
        height: 48,
        zIndex: 1,
        backgroundColor: 'rgba(0,0,0,0)',
        justifyContent: 'center',
        alignItems: 'center',
    },
});