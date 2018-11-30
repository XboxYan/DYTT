import React, { PureComponent } from 'react';
import {
	StyleSheet,
	Text,
	View,
} from 'react-native';

import Loading from './Loading';

export default class extends PureComponent {
    render(){
        const {isEnding} = this.props;
        return(
            <View style={styles.loadview}>
                {
                    isEnding?
                    <View style={styles.loadmore}>
                        <Text style={styles.loadtext}>-E-N-D-</Text>
                    </View>
                    :
                    <Loading text="" size="small" />
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