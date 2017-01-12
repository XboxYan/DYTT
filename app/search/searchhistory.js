/**
 * SearchMain
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  LayoutAnimation
} from 'react-native';
import EmptyContent from '../common/emptycontent';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Touchable from '../common/touchable';

class Searchitem extends Component {
  componentWillUnmount() {
    LayoutAnimation.easeInEaseOut();
  }
  render() {
    const { text, index, onSearch, onClear } = this.props;
    return (
      <View style={styles.searchitem}>
        <Touchable style={styles.searchtext} onPress={() => onSearch(text)}>
          <View style={styles.searchicon}><Icon name='history' size={24} color='#999' /></View>
          <Text style={styles.searchtitle}>{text}</Text>
        </Touchable>
        <TouchableOpacity activeOpacity={.9} onPress={() => onClear(index)} style={styles.searchicon}>
          <Icon name='clear' size={24} color='#999' />
        </TouchableOpacity>
      </View>
    )
  }
}

class SearchHistory extends Component {

  render() {
    const { onSearch, history, onClear, onClearall} = this.props;
    return (
      <View style={styles.content}>
        <View style={styles.clearall}>
          <Text>历史记录 ({history.length})</Text>
          <TouchableOpacity style={styles.clearallbtn} onPress={onClearall}>
            <View><Icon name='clear-all' size={24} color='#999' /></View>
            <Text>全部清空</Text>
          </TouchableOpacity>
        </View>
        {
          history.length ?
            <ScrollView style={styles.content}>
              <View style={styles.searchhistory}>
                {
                  history.map((item, key) => (
                    <Searchitem key={'search' + key} index={key} text={item} onSearch={onSearch} onClear={onClear} />
                  ))
                }
              </View>
            </ScrollView>
            : <EmptyContent text='暂无历史记录~' />
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: '#f1f1f1'
  },
  searchhistory: {
    backgroundColor: '#fff',
    flexDirection: 'column-reverse',
  },
  searchitem: {
    marginTop: -1 / $.PixelRatio,
    borderTopWidth: 1 / $.PixelRatio,
    borderTopColor: '#cecece',
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchtext: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
  },
  searchicon: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchtitle: {
    fontSize: 15,
    color: '#333'
  },
  clearall: {
    height: 44,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  clearallbtn: {
    flexDirection: 'row',
    alignItems: 'center',
  }
});

module.exports = SearchHistory;
