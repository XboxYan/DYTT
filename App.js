/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
import './util/global';
import React from 'react';
import { StatusBar } from 'react-native';
import { createStackNavigator, createAppContainer } from "react-navigation";
import StackViewStyleInterpolator from 'react-navigation-stack/dist/views/StackView/StackViewStyleInterpolator';
import { ThemeProvider } from './util/theme-context';
import Home from './src';
import MovieDetail from './src/page/MovieDetail';

const StackNavigatorConfig = {
	headerMode: 'none',
	mode: 'card',
	cardStyle:{
		backgroundColor:'red'
	},
	transitionConfig: () => ({
        screenInterpolator: StackViewStyleInterpolator.forHorizontal,
    })
}

const App = createAppContainer(createStackNavigator({
	Home: Home,
	MovieDetail: MovieDetail,
}, StackNavigatorConfig));

export default () => (
	<ThemeProvider>
		<StatusBar translucent={true} backgroundColor="transparent" />
		<App screenProps={{themeColor:'red'}} />
	</ThemeProvider>
)