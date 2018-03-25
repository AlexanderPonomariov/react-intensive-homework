// Core
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { CSSTransition, TransitionGroup, Transition } from 'react-transition-group';

// Components
import Task from '../Task';
import Checkbox from '../../theme/assets/Checkbox';
import Styles from './styles.scss';

export default class Scheduler extends Component {

    static contextTypes = {
        checkboxBorderColor:     PropTypes.string,
        checkboxBackgroundColor: PropTypes.string,
        api:                     PropTypes.string.isRequired,
        token:                   PropTypes.string.isRequired,
    };

    state= {
        tasks:                [],
        taskMessage:          '',
        isAllTasksCompleated: false,
        filterString:         '',
    };

    componentDidMount () {
        this._getTasks();
    }

    _createTask = async (event) => {
        event.preventDefault();

        const { api, token } = this.context;

        const { tasks, taskMessage } = this.state;

        if (!taskMessage.trim() || taskMessage.trim().length >= 46) {
            return false;
        }

        try {

            const response = await fetch(api, {
                method:  'POST',
                headers: {
                    'Authorization': token,
                    'Content-Type':  'application/json',
                },
                body: JSON.stringify({ 'message': taskMessage.trim() }),
            });

            const responseResult = await response;
            const { data: messageObj } = await responseResult.json();

            if (responseResult.status !== 200) {
                throw new Error('Creating task failed');
            }

            this.setState(() => ({
                tasks:                [messageObj, ...tasks],
                taskMessage:          '',
                isAllTasksCompleated: false,
            }));

        } catch ({ message }) {
            console.error(message);
        }
    };

    _deleteMessage = (id) => {
        const { api, token } = this.context;
        const { tasks } = this.state;

        fetch(`${api}/${id}`, {
            method:  'DELETE',
            headers: {
                'Authorization': token,
                'Content-Type':  'application/json',
            },
        }).then((response) => {
            if (response.status !== 204) {
                throw new Error('Deleting of task failed');
            }

            this.setState(() => ({
                tasks: tasks.filter((task) => task.id !== id),
            }));
        });
    };

    _editMessage = async (id, message, completed, favorite) => {

        const { api, token } = this.context;
        const newMessage = { id, message, completed, favorite };

        try {

            const response = await fetch(`${api}`, {
                method:  'PUT',
                headers: {
                    'Authorization': token,
                    'Content-Type':  'application/json',
                },
                body: JSON.stringify([newMessage]),
            });

            // const { data: messageObj, status } = await response.json();
            const responseResult = await response;
            // const { data: messageObj } = await responseResult.json();

            if (responseResult.status !== 200) {
                throw new Error('Editing task failed');
            }

            this.setState(({ tasks }) => ({
                tasks: tasks.map((task) => task.id === id ? newMessage : task),
            }));

            if (!completed) {
                this.setState(() => ({
                    isAllTasksCompleated: false,
                }));
            }

        } catch ({ message }) {
            console.error(message);
        }
    };

    _getTaskMessage = ({ target: { value }}) => {
        if (value.length >= 46) {
            return false;
        }

        this.setState(() => ({
            taskMessage: value,
        }));
    };

    _getFilterString = ({ target: { value }}) => {
        // if (value.trim().length >= 46) {
        //     return false;
        // }

        this.setState(() => ({
            filterString: value,
        }));
    };


    _getTasks = async () => {
        const { api, token } = this.context;

        const response = await fetch(api, {
            method:  'GET',
            headers: {
                'Authorization': token,
                'Content-Type':  'application/json',
            },
        });

        if (response.status !== 200) {
            throw new Error('Getting task failed');
        }

        const { data: messageObj }  = await response.json();

        this.setState(({ tasks }) => ({
            tasks: [...messageObj, ...tasks],
        }));
    };

    _setAllTasksFinished = async () => {
        const { api, token } = this.context;
        const { tasks, isAllTasksCompleated } = this.state;

        if (isAllTasksCompleated) {
            return false;
        }

        const completedTasks = tasks.map((task) => {
            task.completed = true;

            return task;
        });

        console.log(completedTasks);

        try {

            const response = await fetch(`${api}`, {
                method:  'PUT',
                headers: {
                    'Authorization': token,
                    'Content-Type':  'application/json',
                },
                body: JSON.stringify(completedTasks),
            });

            // const { data: messageObj, status } = await response.json();
            const responseResult = await response;
            // const { data: messageObj } = await responseResult.json();

            if (responseResult.status !== 200) {
                throw new Error('Completing all tasks failed');
            }

            this.setState(() => ({
                tasks:                completedTasks,
                isAllTasksCompleated: true,
            }));

        } catch ({ message }) {
            console.error(message);
        }
    };

    render () {
        // const { checkboxBorderColor, checkboxBackgroundColor } = this.context;
        const { tasks: tasksArr, taskMessage, filterString, isAllTasksCompleated } = this.state;

        const tasksArrFiltered = tasksArr.filter((task) => task.message.indexOf(filterString)!==-1);

        const tasksArrFavorite = tasksArrFiltered.filter((task) => task.favorite && !task.completed).map((task) => (
            <Task
                key = { task.id }
                { ...task }
                deleteMessage = { this._deleteMessage }
                editMessage = { this._editMessage }
            />
        ));

        const tasksArrSimple = tasksArrFiltered.filter((task) => !task.favorite && !task.completed).map((task) => (
            <Task
                key = { task.id }
                { ...task }
                deleteMessage = { this._deleteMessage }
                editMessage = { this._editMessage }
            />
        ));
        const tasksArrCompleated = tasksArrFiltered.filter((task) => task.completed).map((task) => (
            <Task
                key = { task.id }
                { ...task }
                deleteMessage = { this._deleteMessage }
                editMessage = { this._editMessage }
            />
        ));

        // const tasks = [...tasksArrSimple, ...tasksArrFavorite].map((task) => (
        //     <Task
        //         key = { task.id }
        //         { ...task }
        //         deleteMessage = { this._deleteMessage }
        //         editMessage = { this._editMessage }
        //     />
        // ));

        return (
            <section className = { Styles.scheduler }>
                <main>
                    <header>
                        <h1>Планировщик задач</h1>
                        <input placeholder = { 'Поиск ' } type = 'text' onChange = { this._getFilterString } />
                    </header>
                    <section>
                        <form
                            onSubmit = { this._createTask }>
                            <input
                                placeholder = { 'Описание моей новой задачи' }
                                type = 'text'
                                value = { taskMessage }
                                onChange = { this._getTaskMessage }
                            />
                            <button>Добавить задачу</button>
                        </form>
                    </section>
                    <section>
                        { tasksArrFavorite }
                        { tasksArrSimple }
                        { tasksArrCompleated }
                    </section>
                    <footer>
                        <div className = { Styles.code }>
                            <Checkbox
                                checked = { isAllTasksCompleated }
                                color1 = { '#000' }
                                color2 = { '#f5f5f5' }
                                onClick = { this._setAllTasksFinished }
                            />
                            <span>Все задачи выполнены</span>
                        </div>
                    </footer>
                </main>
            </section>
        );
    }
}
