import React, { PureComponent } from 'react';
import { Text, View, Button } from 'react-native';

export default class extends React.Component {
    componentDidMount() {
        const { type } = this.props.navigation.state.params;
        //console.warn(this.props.navigation)
        //this.props.navigation
        this.props.navigation.setParams({
            navigationBackGroundColor:'blue',
        });
    }

    render() {
        return (
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                <Text>33</Text>
                <Button title="跳转" onPress={()=>this.props.navigation.navigate('Detail')} />
            </View>
        );
    }
}