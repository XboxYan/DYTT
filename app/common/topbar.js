/**
 * TopBar
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Touchable from './touchable';
import Search from '../search'

class TopBar extends Component {

  render() {
    const { navigator } = this.props;
    return (
      <View style={styles.topbar}>
        <Touchable
          style={styles.btn}
          onPress={this.props.openDrawer}
          >
          <Icon name='menu' size={24} color='#fff' />
        </Touchable>
        <Text style={styles.apptitle} numberOfLines={1}>{this.props.title || ''}</Text>
        <Touchable
          style={styles.btn}
          onPress={()=>navigator.push({name: Search})}
          >
          <Icon name='search' size={24} color='#fff' />
        </Touchable>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  topbar: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  btn: {
    width: 50,
    height: 50,
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  apptitle: {
    textAlign: 'left',
    flex: 1,
    fontSize: 16,
    color: '#fff'
  }

});

module.exports = TopBar;
