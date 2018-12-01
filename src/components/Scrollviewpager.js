/**
 * Scrollviewpager
 */

import React from 'react';

import Scrollviewpager from 'react-native-scrollviewpager';

const tabBarOptions = (themeColor) => ({
    style:{
        paddingHorizontal:10,
        height:40,
        backgroundColor:'#fff'
    },
    labelStyle:{
        color:'#666'
    },
    activeTintColor:themeColor,
    indicatorStyle:{
        width:20,
        borderRadius:4,
        height:3,
        backgroundColor:themeColor,
        bottom:2
    }
})

export default ({themeColor,children}) => (
    <Scrollviewpager tabBarOptions={tabBarOptions(themeColor)} >
        {children}
    </Scrollviewpager> 
)
