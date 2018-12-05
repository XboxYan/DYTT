/**
 * DYTT 电影天堂
 * https://github.com/XboxYan/DYTT
 *
 * @XboxYan
 * @yanwenbin1991@live.com
 */
import './util/global';
import React,{ PureComponent } from 'react';
import { StatusBar } from 'react-native';
import { createStackNavigator, createAppContainer, createDrawerNavigator } from "react-navigation";
import StackViewStyleInterpolator from 'react-navigation-stack/dist/views/StackView/StackViewStyleInterpolator';
import Index from './src';
import MovieDetail from './src/page/MovieDetail';
import Comment from './src/page/Comment';
import DrawerContent from './src/page/DrawerContent';
import History from './src/page/History';
import Theme from './src/page/Theme';
import Follow from './src/page/Follow';
import { StoreProvider } from './util/store';

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
	History: History,
	Index: Index,
	Theme: Theme,
	Follow: Follow,
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
			<StoreProvider>
				<StatusBar translucent={true} backgroundColor="transparent" />
				<App screenProps={{themeColor:themeColor, setTheme:this.setTheme}} />
			</StoreProvider>
		)
	}
}