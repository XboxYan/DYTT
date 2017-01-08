/**
 * Loading
 */

import React, { Component } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from 'react-native';

class Loading extends Component {

  render() {
    return (
      <View style={[styles.content,{height:this.props.height}]}>
        <ActivityIndicator color={$.THEME_COLOR} size={this.props.size||'large'} />
        <Text style={styles.loadtext}>正在加载...</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    flex:1,
    justifyContent:'center',
    alignItems: 'center',
  },
  loadtext:{
    fontSize:12,
    color:'#666',
    marginTop:10
  }

});

module.exports = Loading;
