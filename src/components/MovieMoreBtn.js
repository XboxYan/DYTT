import React, { PureComponent } from 'react';
import {
    StyleSheet,
    TouchableOpacity,
	Text,
} from 'react-native';

const Btn = (props) => {
    if(!props.show){
        return null
    }
    return(
        <TouchableOpacity style={[styles.btn,props.style]} activeOpacity={.8} onPress={props.onPress}>
            <Text style={[styles.text,{color:props.themeColor}]}>{props.text}</Text>
        </TouchableOpacity>
    )
}

export default Btn;

const styles = StyleSheet.create({
    btn:{
        margin:10,
        height:40,
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