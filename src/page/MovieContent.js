/*
*
MovieContent
*
*/

import React, { PureComponent } from 'react';
import {
    BackHandler,
    InteractionManager,
    TouchableOpacity,
    Text,
    StyleSheet,
    View,
} from 'react-native';
import { BorderlessButton } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Feather';
import DrawerLayout from 'react-native-gesture-handler/DrawerLayout';
import Appbar from '../components/Appbar';

const Common = [
    {
        name:"地区",
        cate:'Area',
        type:["大陆","美国","加拿大","香港","韩国","日本","台湾","泰国","西班牙","法国","印度","英国"]
    },
    {
        name:"年份",
        cate:'Year',
        type:[]
    }
]

const Categories = {
    movie:[
        {
            name:"分类",
            cate:'Channel',
            type:["动作片","喜剧片","爱情片","科幻片","恐怖片","剧情片","战争片","伦理"]
        },
        {
            name:"剧情",
            cate:'Plot',
            type:["惊悚","悬疑","魔幻","犯罪","灾难","动画","古装","歌舞"]
        }
    ],
    tv:[
        {
            name:"分类",
            cate:'Channel',
            type:["韩剧","剧情","欧美剧","日剧","台剧","泰剧"]
        },
        {
            name:"剧情",
            cate:'Plot',
            type:["言情","都市","家庭","偶像","喜剧","古装","武侠","刑侦","战争","神话","军旅","校园","悬疑"]
        }
    ],
    comic:[
        {
            name:"剧情",
            cate:'Plot',
            type:["冒险","热血","搞笑","少女","推理"]
        }
    ],
    variety:[
        {
            name:"剧情",
            cate:'Plot',
            type:["喜剧","家庭","家庭","运动","真人秀","脱口秀"]
        }
    ]
}

export default class extends PureComponent {

    renderDrawer = () => {
        return (
            <View>
              <Text>I am in the drawer!</Text>
            </View>
          );
    }

    componentDidMount() {
        
    }

    componentWillUnmount() {

    }


    render() {
        const {navigation,screenProps:{themeColor}} = this.props;
 
        return (
            <DrawerLayout 
                drawerPosition={DrawerLayout.positions.Right}
                drawerBackgroundColor="#fff"
                edgeWidth={50}
                drawerWidth={$.WIDTH*.7}
                renderNavigationView={this.renderDrawer}
            >
                <View style={styles.content}>
                    <Appbar navigation={navigation} themeColor={themeColor} title={navigation.state.params.title} >
                        <BorderlessButton activeOpacity={.8} style={styles.btn} >
                            <Icon name='filter' size={18} color='#fff' />
                        </BorderlessButton>
                    </Appbar>
                    
                </View>
            </DrawerLayout>
        )
    }
}

const styles = StyleSheet.create({
    content:{
        flex:1
    },
	commentview:{
		backgroundColor:'#f7f7f7',
    },
    btn: {
        width: 48,
        height: 48,
        zIndex: 1,
        backgroundColor: 'rgba(0,0,0,0)',
        justifyContent: 'center',
        alignItems: 'center',
    },
})