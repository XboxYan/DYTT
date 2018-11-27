import React, {createContext, PureComponent} from 'react';

export const themes = {
    royalblue: {
      themeColor: 'royalblue',
    },
    dark: {
      themeColor: '#222222',
    },
};

export const ThemeContext = React.createContext(themes.royalblue);

export class ThemeProvider extends PureComponent {
    state = {
        theme:themes.royalblue
    }

    setTheme = (type) => {
        this.setState({theme:themes[type]})
    }

    render(){
        return(
            <ThemeContext.Provider value={{
                theme:this.state.theme,
                setTheme:this.setTheme
            }}>
                {this.props.children}
            </ThemeContext.Provider>
        )
    }
}