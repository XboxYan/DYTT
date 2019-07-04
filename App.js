/**
 * DYTT 电影天堂
 * https://github.com/XboxYan/DYTT
 *
 * @XboxYan
 * @yanwenbin1991@live.com
 */
import './util/global';
import React, { PureComponent } from 'react';
import { StatusBar, BackHandler, Platform, ToastAndroid, View } from 'react-native';
import { createStackNavigator, createAppContainer, createDrawerNavigator } from "react-navigation";
import StackViewStyleInterpolator from 'react-navigation-stack/dist/views/StackView/StackViewStyleInterpolator';
import SplashScreen from 'react-native-splash-screen';
import Index from './src';
import MovieDetail from './src/page/MovieDetail';
import MovieContent from './src/page/MovieContent';
import Comment from './src/page/Comment';
import DrawerContent from './src/page/DrawerContent';
import History from './src/page/History';
import Theme, { themes, themesGradient } from './src/page/Theme';
import Follow from './src/page/Follow';
import Search from './src/page/Search';
import Setting from './src/page/Setting';
import UpdateModal from './src/components/UpdateModal';
import { StoreProvider } from './util/store';
import Storage from './util/storage';
import CodePush from "react-native-code-push";
import i18n, * as I18N from "./util/i18n";
import Icon from 'react-native-vector-icons/Feather';
const CODE_PUSH_PRODUCTION_KEY = 'iP5vE4FFzkilVLeIfVDZ5LwjUvdg67842615-88ee-487c-ab21-9908f18597db';

const StackNavigatorConfig = {
	headerMode: 'none',
	mode: 'card',
	cardStyle: {
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
	drawerType: 'back',
	drawerWidth: $.WIDTH * .7,
	contentComponent: DrawerContent,
}

const Drawer = createDrawerNavigator({
	Index: {
		screen: Index,
		navigationOptions: () => ({
			drawerLabel: i18n.t('HOME'),
			drawerIcon: ({ tintColor }) => (
				<Icon name='home' size={18} color={tintColor} />
			)
		})
	},
	History: {
		screen: History,
		navigationOptions: () => ({
			drawerLabel: i18n.t('HISTORY'),
			drawerIcon: ({ tintColor }) => (
				<Icon name='clock' size={18} color={tintColor} />
			)
		})
	},
	Follow: {
		screen: Follow,
		navigationOptions: () => ({
			drawerLabel: i18n.t('COLLECTION'),
			drawerIcon: ({ tintColor }) => (
				<Icon name='heart' size={18} color={tintColor} />
			),
		})
	},
	Theme: {
		screen: Theme,
		navigationOptions: () => ({
			drawerLabel: i18n.t('THEME_COLOR'),
			drawerIcon: ({ tintColor }) => (
				<Icon name='feather' size={18} color={tintColor} />
			),
		})
	},
	Setting: {
		screen: Setting,
		navigationOptions: () => ({
			drawerLabel: i18n.t('SETTINGS'),
			drawerIcon: ({ tintColor }) => (
				<Icon name='settings' size={18} color={tintColor} />
			),
		})
	},
}, DrawerNavigatorConfig);

const App = createAppContainer(createStackNavigator({
	Drawer: Drawer,
	Search: Search,
	MovieContent: MovieContent,
	MovieDetail: MovieDetail,
	Comment: Comment,
}, StackNavigatorConfig));

export default class extends PureComponent {

	constructor(props) {
		super(props);

		this.state = {
			themeColor: themesGradient[0].color,
			configutating: true,
		}

		this.configureApplication();
	}

	configureApplication = async () => {
		await I18N.configure();
		this.setState({
			configutating: false,
		})
	}

	setTheme = (themeColor) => {
		this.setState({ themeColor });
		Storage.save('themeColor', {
			themeColor: themeColor
		});
	}

	//如果有更新的提示
	syncImmediate = async () => {
		const RemotePackage = await CodePush.checkForUpdate();
		if (RemotePackage) {
			this.modal.init(RemotePackage);
		}
	}

	async componentDidMount() {
		CodePush.allowRestart();//在加载完了，允许重启
		const data = await Storage.get('themeColor');
		if (data) {
			this.setState({ themeColor: data.themeColor });
		}
		setTimeout(() => {
			SplashScreen.hide();
			this.syncImmediate(); //开始检查更新
		}, 500);
	}

	componentWillMount() {
		if (Platform.OS === 'android') {
			BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid);
		}
	}
	componentWillUnmount() {
		CodePush.disallowRestart();//禁止重启
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
		ToastAndroid && ToastAndroid.show('(；′⌒`) ' + i18n.t('BYE'), ToastAndroid.SHORT);
		return true;
	}

	render() {
		const { themeColor } = this.state;
		// TODO: Add loader or something else
		if (this.state.configutating) {
			return (
				<View></View>
			)
		}

		return (
			<StoreProvider>
				<StatusBar translucent={true} backgroundColor="transparent" />
				<App screenProps={{ themeColor: themeColor, setTheme: this.setTheme }} />
				<UpdateModal themeColor={themeColor} ref={node => this.modal = node} />
			</StoreProvider>
		)
	}
}