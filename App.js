/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
import './util/global';
import React,{ PureComponent,Fragment } from 'react';
import { StatusBar } from 'react-native';
import { createStackNavigator, createAppContainer, createDrawerNavigator } from "react-navigation";
import StackViewStyleInterpolator from 'react-navigation-stack/dist/views/StackView/StackViewStyleInterpolator';
import Index from './src';
import MovieDetail from './src/page/MovieDetail';
import Comment from './src/page/Comment';
import DrawerContent from './src/page/DrawerContent';
import History from './src/page/History';
import Theme from './src/page/Theme';

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
	Index: Index,
	History: History,
	Theme: Theme,
},DrawerNavigatorConfig);

const App = createAppContainer(createStackNavigator({
	Drawer: Drawer,
	MovieDetail: MovieDetail,
	Comment: Comment,
}, StackNavigatorConfig));

export default class extends PureComponent {
	state = {
		themeColor:'#db4437'
	}

	setTheme = (themeColor) => {
		this.setState({themeColor})
	}

	render(){
		const { themeColor } = this.state;
		return(
			<Fragment>
				<StatusBar translucent={true} backgroundColor="transparent" />
				<App screenProps={{themeColor:themeColor, setTheme:this.setTheme}} />
			</Fragment>
		)
	}
}