import React, { PureComponent } from 'react';
import {
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    FlatList,
    Animated,
    Image,
    LayoutAnimation,
    View,
} from 'react-native';

export default class extends PureComponent {

    componentDidMount() {
        //console.warn(this.props.navigation)
    }

    render() {
        const { params: { movieId } } = this.props.navigation.state;
        return (
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                <Text>{movieId}</Text>
            </View>
        );
    }
}