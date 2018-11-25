import React, { PureComponent } from 'react';
import { Text, View, } from 'react-native';
import { createMaterialTopTabNavigator } from "react-navigation";
import Screen from './Screen'

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
        indicatorStyle: {
            backgroundColor: '#fff',
            borderRadius: 4,
        },
        style: {
            backgroundColor: 'red'
        },
        tabStyle: {
            height: 40,
            //backgroundColor:'red'
        }
    }
}

const TabNavigator = createMaterialTopTabNavigator({
    //Home:Home,
    Movie: {
        screen: Screen,
        params: {
            type: 'movie'
        }
    },
    TV: {
        screen: Screen,
        params: {
            type: 'tv'
        }
    },
    Comic: {
        screen: Screen,
        params: {
            type: 'comic'
        }
    },
},TabNavigatorConfig)

// TabNavigator.navigationOptions = (a) => {
//     console.warn(a.screenProps)
//     return TabNavigatorConfig(a)
// }

export default TabNavigator;