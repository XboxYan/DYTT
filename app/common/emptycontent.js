/**
 * EmptyContent
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';

class EmptyContent extends Component {

  render() {
    return (
      <View style={[styles.content,{height:this.props.height}]}>
        <Icon name='cloud-off' color='#666' size={16} />
        <Text style={styles.text}>{this.props.text||'找不到任何数据~'}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    flex:1,
    flexDirection:'row',
    justifyContent:'center',
    alignItems: 'center',
  },
  text:{
    fontSize:14,
    marginLeft:5,
    color:'#666'
  }

});

module.exports = EmptyContent;
