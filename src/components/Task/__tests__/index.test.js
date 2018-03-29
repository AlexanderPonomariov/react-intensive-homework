import React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Task from '../';
import Edit from '../../../theme/assets/Edit';

configure({ adapter: new Adapter() });

const state = {
    isEdited:    false,
    taskMessage: 'Task text',
    completed:   false,
    favorite:    false,
};

const mutatedState = {
    isEdited:    true,
    taskMessage: 'Task edited text',
    completed:   false,
    favorite:    false,
};

const props = {
    deleteMessage: jest.fn(),
    editMessage:   jest.fn(),
    id:            '1q2w3e4r',
    message:       'Task text',
    completed:     false,
    favorite:      false,
};

const taskMessage = 'Task edited text';
const taskMessageLong = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci consequuntur cupiditate debitis dolores, facilis iusto laboriosam nisi non omnis perferendis perspiciatis quas quasi quod reprehenderit rerum sapiente vel vitae voluptate?';

const result = mount(<Task
    completed = { props.completed }
    deleteMessage = { props.deleteMessage }
    editMessage = { props.editMessage }
    favorite = { props.favorite }
    id = { props.id }
    message = { props.message }
/>, {});

const editComponent = mount(<Edit onClick = { jest.fn() }/>, {});

window.fetch = () => Promise.resolve(() => ({
    status: 200,
    json:   () => Promise.resolve({
        data:    'some data',
        message: 'success',
    }),
}));

describe('Task: ', () => {
    test('Should have 1 li element', () => {
        expect(result.find('li')).toHaveLength(1);
    });

    test('Should have 1 Checkbox element', () => {
        expect(result.find('Checkbox')).toHaveLength(1);
    });

    test('Should have 1 input element if edited mode enabled', () => {
        result.setState(() => ({
            isEdited: mutatedState.isEdited,
        }));
        expect(result.find('input')).toHaveLength(1);
    });

    test('input and state value should respond to change event', () => {
        result.setState(() => ({
            isEdited: mutatedState.isEdited,
        }));

        result.find('input').simulate('change', {
            target: {
                value: taskMessage,
            },
        });

        expect(result.state()).toEqual(mutatedState);
        expect(result.find('input').props().value).toBe(taskMessage);

    });

    test('input and state value shouldn\'t respond to change event if message length more than 46 symbols', () => {
        result.setState(() => ({
            isEdited: mutatedState.isEdited,
        }));

        result.find('input').simulate('change', {
            target: {
                value: taskMessageLong,
            },
        });

        expect(result.state()).toEqual(mutatedState);
        expect(result.find('input').props().value).toBe(taskMessage);
    });

    test('edit state doesn\'t changes if compleated status is true', () => {
        result.setState(() => ({
            completed: true,
        }));

        result.find('Edit').simulate('click');

        expect(result.state().isEdited).toEqual(state.isEdited);
    });

});
