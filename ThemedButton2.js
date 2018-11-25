import React, {Component} from 'react';
import {Button} from 'react-native';
import {ThemeContext} from './util/theme-context';

class ThemedButton extends React.Component {
  render() {
    let {theme,setTheme} = this.context;
    return (
      <Button
        title="change theme light"
        onPress={()=>setTheme('light')}
        color={theme.background}
      />
    );
  }
}
ThemedButton.contextType = ThemeContext;

export default ThemedButton;