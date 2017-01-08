/**
 * index
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  WebView,
  InteractionManager
} from 'react-native';
import AppBar from './appbar';

class Web extends Component {
  constructor(props) {
    super(props);
    this.html = this.html.bind(this);
    this.state = {
      loaded: false,
      actions:false,
      dataSource: '',
    }
  }

  componentWillMount() {
    const id = this.props.route.id;
    let HTML_URL = 'http://news-at.zhihu.com/api/4/news/' + id;
    fetch(HTML_URL)
      .then((response) => {
        if (response.ok) {
          return response.json()
        } 
      })
      .then((responseData) => {
        this.setState({
          loaded: true,
          dataSource: this.html(responseData)
        })
      })
      .catch(() => {
        alert(alert('网络有误！'))
      });
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(()=>{
      this.setState({
        actions:true
      })
    })
  }

  html(dataSource) {
    return (
      '<head><link href=' + dataSource.css[0] + 'type="text/css" rel="stylesheet" ></head>' + dataSource.body
    )
  }

  render() {
    const { navigator } = this.props;
    let _this = this
    if (!this.state.loaded||!this.state.actions) {
      return (
        <View style={styles.content}>
          <Text style={{ marginTop: 10, textAlign: 'center' }}>正在加载...</Text>
        </View>
      )
    }
    return (
      <View style={styles.content}>
      {(!this.state.loaded||!this.state.actions)?<Text style={{ marginTop: 10, textAlign: 'center' }}>正在加载...</Text>:null}
      <WebView
        domStorage={true}
        onLoad={()=>this.setState({loaded: true})}
        source={{ html: this.state.dataSource }} />
        </View>
    );
  }
}

class Article extends Component {
  render() {
    const { navigator, route } = this.props;
    return (
      <View style={styles.content}>
        <AppBar navigator = {navigator} />
        <Web route = {route} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: '#fff'
  },
  listview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  subtitle: {
    fontSize: 18,
    padding: 10,
    color: '#1f8eff'
  },
  listtext: {
    fontSize: 16,
    lineHeight: 26,
    color: '#666',
    flex: 1
  },
  listimg: {
    marginLeft: 10,
    width: 80,
    height: 80,
  },
  toptext: {
    color: '#fff',
    fontSize: 16,
  },
  slideview: {
    height: 200
  }
});

module.exports = Article;
