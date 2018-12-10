/*
*
MovieContent
*
*/

import React, { PureComponent } from 'react';
import {
    BackHandler,
    InteractionManager,
    TouchableOpacity,
    Text,
    StyleSheet,
    View,
} from 'react-native';

import Icon from 'react-native-vector-icons/Feather';
import DrawerLayout from 'react-native-gesture-handler/DrawerLayout';
import Appbar from '../components/Appbar';


export default class extends PureComponent {

    renderDrawer = () => {
        return (
            <View>
              <Text>I am in the drawer!</Text>
            </View>
          );
    }

    componentDidMount() {
        
    }

    componentWillUnmount() {

    }


    render() {
        const {navigation,screenProps:{themeColor}} = this.props;
 
        return (
            <DrawerLayout 
                drawerPosition={DrawerLayout.positions.Right}
                drawerBackgroundColor="#fff"
                renderNavigationView={this.renderDrawer}
            >
                <View style={styles.content}>
                    <Appbar navigation={navigation} themeColor={themeColor} title={navigation.state.params.title} >
                        <TouchableOpacity activeOpacity={.8} style={styles.btn} >
                            <Icon name='filter' size={18} color='#fff' />
                        </TouchableOpacity>
                    </Appbar>
                    
                </View>
            </DrawerLayout>
        )
    }
}

const styles = StyleSheet.create({
    content:{
        flex:1
    },
	commentview:{
		backgroundColor:'#f7f7f7',
    },
    btn: {
        width: 48,
        height: 48,
        zIndex: 1,
        backgroundColor: 'rgba(0,0,0,0)',
        justifyContent: 'center',
        alignItems: 'center',
    },
})