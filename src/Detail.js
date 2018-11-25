import React, { PureComponent } from 'react';
import { Text, View, } from 'react-native';

export default class extends PureComponent {

    render() {
        return (
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center", }}>
                <Text>这是详情页</Text>
            </View>
        );
    }
}