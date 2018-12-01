/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
import './util/global';
import React,{PureComponent} from 'react';
import { StatusBar } from 'react-native';
import { createStackNavigator, createAppContainer, createDrawerNavigator } from "react-navigation";
import StackViewStyleInterpolator from 'react-navigation-stack/dist/views/StackView/StackViewStyleInterpolator';
import { ThemeProvider,ThemeContext } from './util/theme-context';
import Home from './src';
import MovieDetail from './src/page/MovieDetail';
import Comment from './src/page/Comment';
import DrawerContent from './src/page/DrawerContent';
import History from './src/page/History';

const StackNavigatorConfig = {
	headerMode: 'none',
	mode: 'card',
	cardStyle:{
		backgroundColor:'red'
	},
	defaultNavigationOptions: {
		gesturesEnabled: true,
	},
	transitionConfig: () => ({
        screenInterpolator: StackViewStyleInterpolator.forHorizontal,
    })
}

const DrawerNavigatorConfig = {
	//drawerType :'back',
	contentComponent: DrawerContent,
}

const Drawer = createDrawerNavigator({
	Home: Home,
	History: History,
	Home3: Home,
},DrawerNavigatorConfig);

const App = createAppContainer(createStackNavigator({
	Drawer: Drawer,
	MovieDetail: MovieDetail,
	Comment: Comment,
}, StackNavigatorConfig));



export default () => (
	<ThemeProvider>
		<StatusBar translucent={true} backgroundColor="transparent" />
		<ThemeContext.Consumer>
			{
				({theme}) => <App screenProps={{themeColor:theme.themeColor}} />
			}
		</ThemeContext.Consumer>
	</ThemeProvider>
)
