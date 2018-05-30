import React, { Component } from "react";
import Main from './components/main';

const styles = {
    app: {
        fontFamily: "Roboto, Sans-serif",
        border: "1px solid #eee",
        borderRadius: "5px",
        padding: "15px",
        textAlign: "center",
    }
}

export default class App extends Component {

    // Arrow function
    foo = () => {
        console.log("arrow functions!")
    }

    render() {
        this.foo();

        return (
            <div style={ styles.app }>
                <Main />
            </div>
        )
    }
}
