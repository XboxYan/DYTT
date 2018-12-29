/**
 * DYTT 电影天堂
 * https://github.com/XboxYan/DYTT
 *
 * @XboxYan
 * @yanwenbin1991@live.com
 */
import './util/global';
import React,{ PureComponent } from 'react';
import { StatusBar, BackHandler, Platform, ToastAndroid } from 'react-native';
import { createStackNavigator, createAppContainer, createDrawerNavigator } from "react-navigation";
import StackViewStyleInterpolator from 'react-navigation-stack/dist/views/StackView/StackViewStyleInterpolator';
import SplashScreen from 'react-native-splash-screen';
import Index from './src';
import MovieDetail from './src/page/MovieDetail';
import MovieContent from './src/page/MovieContent';
import Comment from './src/page/Comment';
import DrawerContent from './src/page/DrawerContent';
import History from './src/page/History';
import Theme,{themes} from './src/page/Theme';
import Follow from './src/page/Follow';
import Search from './src/page/Search';
import Setting from './src/page/Setting.js';
import { StoreProvider } from './util/store';
import Storage from './util/storage';

const StackNavigatorConfig = {
	headerMode: 'none',
	mode: 'card',
	cardStyle:{
		//backgroundColor:'red'
	},
	defaultNavigationOptions: {
		gesturesEnabled: false,
	},
	transitionConfig: () => ({
		screenInterpolator: StackViewStyleInterpolator.forHorizontal,
		// screenInterpolator: (sceneProps) => {
		// 	const { scene } = sceneProps;
		// 	const { route } = scene;
		// 	const params = route.params || {};
		// 	const isModal = params.isModal;
		// 	if (isModal){
		// 	  //当为`true`时，采用`modal`效果
		// 	  return StackViewStyleInterpolator.forVertical(sceneProps);
		// 	}else {
		// 	  return StackViewStyleInterpolator.forHorizontal(sceneProps);
		// 	}
		//   },
    })
}

const DrawerNavigatorConfig = {
	edgeWidth: 50,
	drawerType :'back',
	drawerWidth : $.WIDTH*.7,
	contentComponent: DrawerContent,
}

const Drawer = createDrawerNavigator({
	Index: Index,
	History: History,
	Follow: Follow,
	Theme: Theme,
	Setting: Setting,
},DrawerNavigatorConfig);

const App = createAppContainer(createStackNavigator({
	Drawer: Drawer,
	Search: Search,
	MovieContent: MovieContent,
	MovieDetail: MovieDetail,
	Comment: Comment,
}, StackNavigatorConfig));

export default class extends PureComponent {

	state = {
		themeColor:themes[0].color
	}

	setTheme = (themeColor) => {
		this.setState({themeColor});
		Storage.save('themeColor',{
			themeColor:themeColor
		});
	}

	async componentDidMount() {
		const data = await Storage.get('themeColor');
		if(data){
			this.setState({themeColor:data.themeColor});
		}
		setTimeout(() => {
			SplashScreen.hide();
		}, 500);
	}

	componentWillMount() {
        if (Platform.OS === 'android') {
            BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid);
        }
    }
    componentWillUnmount() {
        if (Platform.OS === 'android') {
            BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid);
        }
    }
    onBackAndroid = () => {
        if (this.lastBackPressed && this.lastBackPressed + 2000 >= Date.now()) {
            //最近2秒内按过back键，可以退出应用。
            //BackHandler.exitApp();
            return false
        }
        this.lastBackPressed = Date.now();
        ToastAndroid && ToastAndroid.show('(；′⌒`)再按就拜拜了', ToastAndroid.SHORT);
        return true;
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