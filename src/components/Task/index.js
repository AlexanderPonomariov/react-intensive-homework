// Core
import React, { Component } from 'react';
import Styles from './styles.scss';
import PropTypes from 'prop-types';

// Components
import Checkbox from '../../theme/assets/Checkbox';
import Delete from '../../theme/assets/Delete';
import Edit from '../../theme/assets/Edit';
import Star from '../../theme/assets/Star';

export default class Task extends Component {
    static propTypes = {
        deleteMessage: PropTypes.func.isRequired,
        editMessage:   PropTypes.func.isRequired,
        id:            PropTypes.string.isRequired,
        message:       PropTypes.string.isRequired,
        completed:     PropTypes.bool,
        favorite:      PropTypes.bool,
    };

    static defaultProps = {
        completed: false,
        favorite:  false,
    };

    state = {
        isEdited:    false,
        taskMessage: this.props.message,
        completed:   this.props.completed,
        favorite:    this.props.favorite,
    };

    _changeMessageStatus = async () => {
        await this.setState(({ favorite }) => ({
            favorite: !favorite,
        }));

        await this._saveEditedMessage();
    };

    _changeMessageState = async () => {
        await this.setState(({ completed }) => ({
            completed: !completed,
        }));

        await this._saveEditedMessage();
    };

    _cancelChanges = (event) => {
        const { message } = this.props;

        if (event.keyCode === 27) {
            this.setState(({ isEdited }) => ({
                taskMessage: message,
                isEdited:    !isEdited,
            }));
        }
    };

    _deleteMessage = () => {
        const { id, deleteMessage } = this.props;

        deleteMessage(id);
    };

    _editMessage = (event) => {
        event.preventDefault();

        this._saveEditedMessage();

        this.setState(({ isEdited }) => ({
            isEdited: !isEdited,
        }));
    };

    _isEditedMessage = () => {
        const { completed } = this.state;

        if (!completed) {
            this.setState(({ isEdited }) => ({
                isEdited: !isEdited,
            }));
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

    _saveEditedMessage = () => {
        const { taskMessage, completed, favorite } = this.state;
        const { id, editMessage, message } = this.props;

        try {
            if (taskMessage.trim().length >= 46 || taskMessage.trim().length < 3) {
                this.setState(() => ({
                    taskMessage: message,
                }));

                throw new Error('Wrong message length');
            }

            editMessage(id, taskMessage.trim(), completed, favorite);

        } catch ({ message: errMessage }) {
            console.error(errMessage);
        }
    };

    render () {
        const { isEdited, favorite, taskMessage, completed } = this.state;

        const taskClass = completed
            ? `${Styles.task} ${Styles.completed}`
            : Styles.task;

        return (
            <li className = { taskClass }>
                <div>
                    <Checkbox
                        checked = { completed }
                        color1 = { '#000' }
                        color2 = { '#fff' }
                        onClick = { this._changeMessageState }
                    />
                    {isEdited ? (
                        <form onSubmit = { this._editMessage }>
                            <input
                                type = 'text'
                                value = { taskMessage }
                                onChange = { this._getTaskMessage }
                                onKeyDown = { this._cancelChanges }
                            />
                        </form>
                    ) : (
                        <span onClick = { this._isEditedMessage }>{taskMessage}</span>
                    )}
                </div>

                <div>
                    <Star checked = { favorite } onClick = { this._changeMessageStatus } />
                    {isEdited ? (
                        <Edit hover = { isEdited } onClick = { this._editMessage } />
                    ) : (
                        <Edit onClick = { this._isEditedMessage } />
                    )}

                    <Delete onClick = { this._deleteMessage } />
                </div>
            </li>
        );
    }
}
