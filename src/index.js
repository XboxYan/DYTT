import React, { PureComponent } from 'react';
import { Text, View, } from 'react-native';
import { createAppContainer,createMaterialTopTabNavigator,withNavigation } from "react-navigation";
import Home from './page/home';
import Screen from './page/Screen';

class TabItem extends PureComponent {
    componentDidMount() {
        console.warn(this.props)
    }

    render() {
        return (
            <Text>33</Text>
        );
    }
}

const TabNavigatorConfig = {
    lazy: true,
    tabBarOptions: {
        //scrollEnabled: true,
        indicatorStyle: {
            backgroundColor: 'royalblue',
            borderRadius: 4,
        },
        style: {
            backgroundColor: '#fff',
            elevation:0
        },
        tabStyle: {
            height: 40,
            //width:80
            //backgroundColor:'red'
        },
        labelStyle:{
            //color:'#666'
        },
        pressColor:'royalblue',
        inactiveTintColor: '#666',
        activeTintColor: 'royalblue',
    }
}

const TabNavigator = createMaterialTopTabNavigator({
    Home:Home,
    Movie: {
        screen: Screen,
        params: {
            type: 'movie',
            title:'电影'
        }
    },
    TV: {
        screen: Screen,
        params: {
            type: 'tv',
            title:'电视剧'
        }
    },
    Comic: {
        screen: Screen,
        params: {
            type: 'comic',
            title:'动漫'
        }
    },
    Variety: {
        screen: Screen,
        params: {
            type: 'variety',
            title:'综艺'
        }
    },
},TabNavigatorConfig)

// TabNavigator.navigationOptions = (a) => {
//     console.warn(a.screenProps)
//     return TabNavigatorConfig(a)
// }


export default TabNavigator;