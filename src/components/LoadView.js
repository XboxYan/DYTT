import React, { PureComponent } from 'react';
import {
	StyleSheet,
	Text,
	View,
} from 'react-native';

import Loading from './Loading';

export default class extends PureComponent {
    render(){
        const {isEnding,themeColor} = this.props;
        return(
            <View style={styles.loadview}>
                {
                    isEnding?
                    <View style={styles.loadmore}>
                        <Text style={styles.loadtext}>ヾ(ｏ･ω･)ﾉ 再怎么找也没有啦</Text>
                    </View>
                    :
                    <Loading text="" size="small" themeColor={themeColor} />
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    loadview:{
		padding:20,
		alignItems: 'center',
	},
	loadtext:{
		color:'#999',
		fontSize:14,
		paddingHorizontal:5
	},
	loadmore:{
		flexDirection:'row',
		justifyContent: 'center',
	}
})