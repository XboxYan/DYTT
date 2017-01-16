/**
 * Search
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  ToastAndroid,
  KeyboardAvoidingView,
  UIManager,
  LayoutAnimation,
  InteractionManager
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Touchable from '../common/touchable';
import Loading from '../common/loading';
import SearchHistory from './searchhistory';
import MovieList from '../common/movielist';

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      actions: false,
      text: '',
      keyworads: '',
      issearch: false,
      history: []
    }
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onSearchHistory = this.onSearchHistory.bind(this);
    this.onClear = this.onClear.bind(this);
    this.onClearall = this.onClearall.bind(this);
    //处理安卓Back键
    const { navigator } = this.props;
    const routers = navigator.getCurrentRoutes();
    const top = routers[routers.length - 1];
    top.handleBack = this.handleBack.bind(this);
    UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
  }
  handleBack() {
    storage.save({
      key: 'searchhistory',  // 注意:请不要在key中使用_下划线符号!
      rawData: this.state.history,
      expires: null
    });
    if (!this.state.issearch) {
      this.props.navigator.pop();
    } else {
      this.setState({
        text: '',
        issearch: false,
      })
    }
  }
  onSubmit(keys) {
    let text = keys.replace(/^ +| +$/g, '');
    if (!text) {
      ToastAndroid.show('请输入点内容~', ToastAndroid.SHORT);
      this.refs.searchbar.focus();
      this.setState({
        text: '',
        keyworads: ''
      })
    } else {
      this.setState({
        issearch: true,
        keyworads: keys
      })
      let _history = this.state.history;
      let index = _history.indexOf(text);
      if (index >= 0) {
        _history.splice(index, 1);
      }
      _history.push(text);
      //最多保留20条搜索历史记录
      if (_history.length > 20) {
        _history.reverse().pop();
        _history.reverse()
      }
      this.setState({
        history: _history
      })
      this.refs.searchbar.blur();
    }
  }
  onClear(index) {
    let _history = this.state.history;
    _history.splice(index, 1);
    this.setState({
      history: _history
    })
  }
  onClearall() {
    this.setState({
      history: []
    })
  }
  onChange(text) {
    this.setState({
      text: text,
    })
    if (!text) {
      this.setState({
        issearch: false
      })
    }
  }
  onSearchHistory(text) {
    this.onChange(text);
    this.onSubmit(text);
  }
  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      storage.load({
        key: 'searchhistory',
      }).then(ret => {
        this.setState({ 
          history: ret,
          actions: true
        })
      }).catch(err => {
        this.setState({ 
          history: [],
          actions: true
        })
      })
    })
  }
  render() {
    const { navigator } = this.props;
    let { issearch, actions, history, keyworads } = this.state;
    return (
      <KeyboardAvoidingView behavior="padding" style={styles.content}>
        <View style={[styles.searchhd,{backgroundColor: $.THEME_COLOR}]}>
          <Touchable
            style={styles.btn}
            onPress={() => this.props.navigator.pop()} >
            <Icon name='keyboard-arrow-left' size={30} color='#fff' />
          </Touchable>
          <TextInput
            ref="searchbar"
            onChangeText={this.onChange}
            onSubmitEditing={() => this.onSubmit(this.state.text)}
            value={this.state.text}
            style={styles.searchbar}
            placeholder="请输入关键词"
            placeholderTextColor="#999"
            autoFocus={false}
            returnKeyType="search"
            underlineColorAndroid='transparent' />
          <Touchable style={styles.btn} onPress={() => this.onSubmit(this.state.text)}>
            <Icon name='search' size={24} color='#fff' />
          </Touchable>
        </View>
        <View style={styles.searchbd}>
          {
            issearch ? <MovieList type={1} keywords={keyworads} navigator={navigator} lazyload={true} /> :
              (actions ? <SearchHistory history={history} onSearch={this.onSearchHistory} onClear={this.onClear} onClearall={this.onClearall} /> : <Loading />)
          }
        </View>
      </KeyboardAvoidingView>
    )
  }
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: '#f1f1f1'
  },
  searchhd: {
    paddingTop: $.STATUS_HEIGHT,
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
  searchbar: {
    flex: 1,
    height: 36,
    paddingHorizontal:6,
    paddingVertical:0,
    borderRadius:3,
    fontSize: 16,
    color: '#333',
    backgroundColor:'#fff'
  },
  searchbd: {
    flex: 1
  }

});

module.exports = Search;
