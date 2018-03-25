// Core
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Components
import Scheduler from '../../components/Scheduler';

const options = {
    checkboxBorderColor:     '#000',
    checkboxBackgroundColor: '#ffffff',
    api:                     'https://lab.lectrum.io/hw/todo/api',
    token:                   '9r15ZegTf6cYYUqN',

};

export default class App extends Component {

    static childContextTypes = {
        checkboxBorderColor:     PropTypes.string,
        checkboxBackgroundColor: PropTypes.string,
        api:                     PropTypes.string.isRequired,
        token:                   PropTypes.string.isRequired,
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
