import React, { PureComponent } from 'react';
import { Text, View, Button } from 'react-native';

export default class extends PureComponent {

    componentDidMount() {
        //console.warn(this.props.navigation)
    }

    render() {
        return (
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                <Text>33</Text>
                <Button title="跳转" onPress={() => this.props.navigation.navigate('Detail')} />
            </View>
        );
    }
}