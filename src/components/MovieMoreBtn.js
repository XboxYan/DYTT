import React, { PureComponent } from 'react';
import {
	StyleSheet,
	Text,
} from 'react-native';

import Touchable from './Touchable';

const Btn = (props) => {
    if(!props.show){
        return null
    }
    return(
        <Touchable style={styles.btn}>
            <Text style={styles.text}>{props.text}</Text>
        </Touchable>
    )
}

export default Btn;

const styles = StyleSheet.create({
    btn:{
        margin:10,
        height:40,
        marginTop:0,
        backgroundColor:'#fff',
        justifyContent: "center",
        alignItems: 'center',
        borderRadius:3,
        overflow:'hidden'
    },
    text:{
        fontSize:14,
        color:'#666'
    }
})