/**
 * index
 */

import React, { Component } from 'react';
import {
  TouchableNativeFeedback,
  View,
} from 'react-native';

class Touchable extends Component {

  render() {
    return (
      <TouchableNativeFeedback 
          delayPressIn={50}
          disabled={this.props.disabled}
          onPress={this.props.onPress}
          background={TouchableNativeFeedback.SelectableBackground() } >
          <View style={this.props.style}>{this.props.children}</View>
      </TouchableNativeFeedback>
    );
  }
}

module.exports = Touchable;
