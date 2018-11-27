/**
 * Scrollviewpager
 */

import React, { PureComponent } from 'react';

import Scrollviewpager from 'react-native-scrollviewpager';

import {ThemeContext} from '../../util/theme-context';

const tabBarOptions = (theme) => ({
    style:{
        paddingHorizontal:10,
        height:40,
        backgroundColor:'#fff'
    },
    labelStyle:{
        color:'#666'
    },
    activeTintColor:theme.themeColor,
    indicatorStyle:{
        width:20,
        borderRadius:4,
        height:3,
        backgroundColor:theme.themeColor
    }
})

class TabNavigator extends React.Component {
    render(){
        const {theme} = this.context;
        return (
            <Scrollviewpager tabBarOptions={tabBarOptions(theme)} >
                {this.props.children}
            </Scrollviewpager>
        )
    }
};

TabNavigator.contextType = ThemeContext;

export default TabNavigator
