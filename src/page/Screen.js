import React, { PureComponent } from 'react';
import { Text, View, Button } from 'react-native';

export default class extends PureComponent {
    static navigationOptions = ({ navigation }) => {
        return {
            tabBarLabel: navigation.getParam('title'),
        };
    };

    componentDidMount() {
        const { type, title } = this.props.navigation.state.params;
        //console.warn(this.props.navigation)
        //this.props.navigation
        this.props.navigation.setParams({
            title: title,
        });
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