import React, { PureComponent } from 'react';
import {
    Animated,
} from 'react-native';

export default class AnimatedView extends PureComponent {
    Anim = new Animated.Value(0)
    componentDidMount() {
        Animated.timing(
            this.Anim,
            {
                toValue: 1,
                useNativeDriver:true
            }
        ).start();
    }
    render() {
        return (
            <Animated.View
                style={[
                    this.props.style,
                    {
                        opacity: this.Anim,
                        transform:[{
                            translateY:this.Anim.interpolate({
                                inputRange:[0,1],
                                outputRange:[100,0]
                            })
                        }]
                    }
                ]}
            >
                {this.props.children}
            </Animated.View>
        );
    }
}