/**
 * NoImg
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  Image,
  View,
} from 'react-native';

class NoImg extends Component {
  render() {
    return (
      <View style={[styles.content,this.props.style]} >
        <Image style={[styles.img,this.props.img]} source={require('../../source/img/imgplaceholder.png')} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    justifyContent:'center',
    alignItems: 'center',
    backgroundColor:'#eee',
  },
  img:{
    width:50,
    height:50,
    resizeMode:'contain'
  }

});

module.exports = NoImg;
