/**
 * UpdateModal
 */

import React, { PureComponent } from 'react';
import {
	StyleSheet,
	Animated,
	Image,
	Text,
	LayoutAnimation,
	Platform,
	ScrollView,
	NativeModules,
	TouchableOpacity,
	ToastAndroid,
	BackHandler,
	View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import CodePush from "react-native-code-push";
import LinearGradient from 'react-native-linear-gradient';
const { UIManager } = NativeModules;

export default class UpdateModal extends PureComponent {

	constructor(props) {
        super(props);
        UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
        this.state = {
			label:'',
			description:'',
			packageSize:'',
			receivedBytes:0,
			status:0,
			show:false,
			isMandatory:false
        }
    }

	Anim = new Animated.Value(0);

	width = new Animated.Value(0);

	onBackAndroid = () => {
        const { isMandatory,show } = this.state;
        if (!isMandatory&&show) {
            this.setVisible(false);
            return true;
        }
    }

	componentWillMount() {
        if (Platform.OS === 'android') {
            BackHandler.addEventListener('handwareBackPress', this.onBackAndroid)
        }
    }

    componentWillUnmount() {
        if (Platform.OS === 'android') {
            BackHandler.removeEventListener('handwareBackPress', this.onBackAndroid)
        }
    }

	install = async () => {
		LayoutAnimation.easeInEaseOut();
		this.setState({status:1})//download
		const LocalPackage = await this.RemotePackage.download((progress)=>{
			this.setState({
				receivedBytes:progress.receivedBytes
			})
			Animated.timing(
                this.width,
                {
					toValue: parseFloat(progress.receivedBytes / progress.totalBytes).toFixed(2),
					duration: 150
                }
            ).start();
		})
		this.setState({status:2})//downloadComplete
		await LocalPackage.install(LocalPackage.isMandatory?CodePush.InstallMode.IMMEDIATE:CodePush.InstallMode.ON_NEXT_RESUME);
		if(!LocalPackage.isMandatory){
			this.setState({status:3})
			this.setVisible(false);
			ToastAndroid && ToastAndroid.show('下次启动完成更新', ToastAndroid.SHORT);
		}
	}


	init = (RemotePackage) => {
		const {label,description,packageSize,isMandatory} = RemotePackage;
		this.setState({label,description,packageSize,isMandatory});
		this.RemotePackage = RemotePackage;
		this.setVisible(true);
	}

	ignore = () => {
		this.setVisible(false);
	}

	setVisible = (bool) => {
		this.setState({show:bool})
		Animated.timing(
            this.Anim,
            {
				toValue: bool?1:0,
				duration: 300,
                //useNativeDriver:true
            }
        ).start();
	}

	render() {
		const { themeColor } = this.props;
		const { show,label,description,packageSize,status,receivedBytes,isMandatory } = this.state;
		const Size = parseInt(packageSize/1000);
		const receivedSize = parseInt(receivedBytes/1000);
		return (
			<Animated.View pointerEvents={show?'auto':'none'} style={[styles.content,{
				backgroundColor:this.Anim.interpolate({
					inputRange:[0,1],
					outputRange:['transparent','rgba(0,0,0,.5)']
				})
			}]} >
				<Animated.View style={[styles.update,{
					opacity:this.Anim.interpolate({
						inputRange:[0,1],
						outputRange:[0,1]
					}),
					transform:[{
						translateY:this.Anim.interpolate({
							inputRange:[0,1],
							outputRange:[100,0]
						})
					}]
				}]}>
					<LinearGradient colors={themeColor.length>1?themeColor:[...themeColor,...themeColor]} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.header}>
						<Icon name="rocket" color="#fff" size={30} />
						<Text style={styles.new}>发现新版本{label}</Text>
						<Image style={styles.header_bg} resizeMode="cover" source={require('../img/updata.png')} />
					</LinearGradient>
					{
						status===0&&
						<View style={styles.body} >
							<ScrollView >
								<Text style={[styles.packageSize,{color:themeColor[0]}]}>[更新大小: {Size}KB]</Text>
								<Text style={styles.description}>{description}</Text>
							</ScrollView>
						</View>
					}
					{
						status===0&&
						<View style={styles.footer}>
							{
								!isMandatory&&
								<TouchableOpacity onPress={this.ignore} activeOpacity={.8} style={[styles.btn_submit,{borderColor:themeColor[0]}]}><Text style={[styles.btn_text,{color:themeColor[0]}]}>下次</Text></TouchableOpacity>
							}
							<TouchableOpacity style={{flex: 1,margin:5,height:38}} onPress={this.install} activeOpacity={.8}>
								<LinearGradient style={[styles.btn_submit,{margin:0,borderWidth:0}]} colors={themeColor.length>1?themeColor:[...themeColor,...themeColor]} start={{x: 0, y: 0}} end={{x: 1, y: 0}}>
									<Text style={styles.btn_text}>更新</Text>
								</LinearGradient>
							</TouchableOpacity>
						</View>
					}
					{
						status>=1&&
						<View style={styles.download}>
							<View style={styles.progress}>
								<View style={styles.progresswrap}>
									<Animated.View style={[styles.progresscon,{backgroundColor:themeColor[0],flex:this.width}]}></Animated.View>
								</View>
								<Text style={styles.progresstext}>{receivedSize+'/'+Size+'KB'}</Text>
							</View>
							<Text style={styles.download_tip}>{status==1&&'正在努力更新中，请等待'||status==2&&'正在安装...'||status==3&&'下次启动完成更新'}</Text>
						</View>
					}
				</Animated.View>
			</Animated.View>
		)
	}
}

const styles = StyleSheet.create({
	content: {
		position:'absolute',
		left:0,
		top:0,
		right:0,
		bottom:0,
		justifyContent: 'center',
		alignItems: 'center',
		zIndex:-10
	},
	update: {
		width:300,
		opacity:0,
		borderRadius:5,
		backgroundColor:'#fff',
	},
	header:{
		height:120,
		flexDirection:'row',
		justifyContent: 'center',
		alignItems: 'center',
		paddingBottom:20,
		borderRadius:5,
	},
	header_bg:{
		position:'absolute',
		left:0,
		bottom:-1,
		width:300,
		height:62,
	},
	description:{
		fontSize:16,
		color:'#666',
		lineHeight:24
	},
	packageSize:{
		fontSize:14,
		paddingBottom:10
	},
	new:{
		color:'#fff',
		fontSize:20,
		marginLeft:15,
		fontWeight:'bold'
	},
	footer:{
		flexDirection:'row',
		padding:10,
	},
	body:{
		maxHeight:300,
		paddingHorizontal:15,
		marginTop:-10,
		zIndex:1
	},
	btn_submit:{
		borderRadius:3,
		height:38,
		borderWidth:1,
		margin:5,
		flex:1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	btn_text:{
		fontSize:14,
		color:'#fff'
	},
	progress:{
		flexDirection:'row',
		alignItems: 'center',
		paddingBottom:15
	},
	progresswrap:{
		flex:1,
		flexDirection:'row',
		alignItems: 'center',
		borderRadius:10,
		overflow:'hidden',
		backgroundColor:'#f1f1f1',
		borderWidth:2,
		borderColor:'#f1f1f1'
	},
	progresscon:{
		height:15,
		
		borderRadius:10,
	},
	progresstext:{
		marginLeft:10
	},
	download:{
		padding:15
	},
	download_tip:{
		textAlign:'center',
		color:'#999',
		paddingBottom:10
	}
});
