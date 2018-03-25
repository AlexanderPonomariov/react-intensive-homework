// Core
import React, { Component } from 'react';
import Styles from './styles.scss';

// Components
import Checkbox from '../../theme/assets/Checkbox';
import Delete from '../../theme/assets/Delete';
import Edit from '../../theme/assets/Edit';
import Star from '../../theme/assets/Star';

export default class Task extends Component {
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

        if(event.keyCode === 27) {
            this.setState(({ isEdited }) => ({
                taskMessage: message,
                isEdited: !isEdited
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
        if (value.trim().length >= 46) {
            return false;
        }

        this.setState(() => ({
            taskMessage: value,
        }));
    };

    _saveEditedMessage = () => {
        const { taskMessage, completed, favorite } = this.state;
        const { id, editMessage, message } = this.props;

        console.log(taskMessage.trim().length);

        if (taskMessage.trim().length >= 46) {
            console.log(taskMessage.trim().length);

            return false;
        }

        editMessage(id, taskMessage.trim(), completed, favorite);
    };

    render () {
        const { isEdited, favorite, taskMessage, completed } = this.state;

        const taskClass = completed
            ? `${Styles.task} ${Styles.completed}`
            : Styles.task;

        return (
            <li className = { taskClass }>
                <Checkbox
                    color1 = { '#000' }
                    color2 = { '#fff' }
                    onClick = { this._changeMessageState }
                    checked = { completed }
                />
                <div>
                    {isEdited ? (
                        <form onSubmit = { this._editMessage }>
                            <input
                                defaultValue = { taskMessage }
                                type = 'text'
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
                        <Edit onClick = { this._editMessage } hover = { isEdited } />
                    ) : (
                        <Edit onClick = { this._isEditedMessage } />
                    )}

                    <Delete onClick = { this._deleteMessage } />
                </div>
            </li>
        );
    }
}
