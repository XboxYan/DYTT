import React, { PureComponent } from 'react';
import {
    StyleSheet,
    Text,
    Animated,
    Image,
    View,
} from 'react-native';

class StarCurrent extends PureComponent {
    width = new Animated.Value(0);
    componentWillUpdate(nextProps, nextState) {
        if (this.props.score != nextProps.score) {
            Animated.timing(
                this.width,
                {
                    toValue: nextProps.score * 7,
                    //duration: 500,
                    //useNativeDriver: true
                }
            ).start();
        }

    }
    componentDidMount() {
        if (this.props.score) {
            Animated.timing(
                this.width,
                {
                    toValue: this.props.score * 7,
                    //duration: 500,
                    //useNativeDriver: true
                }
            ).start();
        }
    }

    render() {
        return (
            <Animated.View style={[styles.star, { width: this.width }]}>
                <Image source={require('../img/star.png')} tintColor={this.props.themeColor} style={styles.star} />
            </Animated.View>
        )
    }
}

export default ({ score, style, themeColor, isShowNum = true }) => (
    <View style={[styles.starcon, style]}>
        <Image source={require('../img/star.png')} style={styles.star} />
        <StarCurrent score={score} themeColor={themeColor} />
        {
            isShowNum && <Text style={[styles.score, { color: themeColor }]}>{score || '0.0'}</Text>
        }
    </View>
)

const styles = StyleSheet.create({
    starcon: {
        flexDirection: 'row',
        height: 20,
        alignItems: 'center'
    },
    star: {
        flexDirection: 'row',
        position: 'absolute',
        width: 70,
        height: 14,
        zIndex: 10,
        overflow: 'hidden'
    },
    score: {
        marginLeft: 75,
        fontSize: 13,
        paddingRight: 10
    }
});