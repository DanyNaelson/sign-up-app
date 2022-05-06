import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import './index.less'
import './i18n'
import SignUp from './components/sign-up'

class App extends Component {
    render() {
        return (
            <div id='sign-up-container'>
                <SignUp />
            </div>
        )
    }
}

ReactDOM.render(React.createElement(App, {}, null),
    document.getElementById('sign-up-app')
);