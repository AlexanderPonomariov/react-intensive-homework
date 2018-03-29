// Core
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Components
import Scheduler from '../../components/Scheduler';

const options = {
    api:   'https://lab.lectrum.io/hw/todo/api',
    token: '9r15ZegTf6cYYUqN',
};

export default class App extends Component {

    static childContextTypes = {
        api:   PropTypes.string.isRequired,
        token: PropTypes.string.isRequired,
    };

    getChildContext () {
        return options;
    }

    render () {
        return (
            <section>
                <Scheduler />
            </section>
        );
    }
}
