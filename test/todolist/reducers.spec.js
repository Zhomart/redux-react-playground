'use strict';

const expect = require('expect');
const deepFreeze = require('deep-freeze');

const todos = require('./../../app/todolist/reducers.js').todos;


describe('Todolist', () => {

  describe('reducers.todos', () => {

    it('returns current state for unknown action', () => {
      const state = 'current-state'
      const action = {}

      expect(
        todos(state, action)
      ).toEqual(state)
    })

    it('returns default state', () => {
      const action = {}
      const defaultState = []

      expect(
        todos(undefined, action)
      ).toEqual(defaultState)
    })

    it('adds a todo', () => {
      const stateBefore = [];
      const action = {
        type: 'ADD_TODO',
        id: 0,
        text: 'Learn Redux'
      }
      const stateAfter = [{
        id: 0,
        text: 'Learn Redux',
        completed: false
      }]

      deepFreeze(stateBefore);
      deepFreeze(action);

      expect(
        todos(stateBefore, action)
      ).toEqual(stateAfter)
    })

    it('toggles todo', () => {
      const stateBefore = [
        {
          id: 0,
          text: 'Learn Redux',
          completed: false
        },
        {
          id: 1,
          text: 'Go Shopping',
          completed: false
        }
      ]
      const action = {
        type: 'TOGGLE_TODO',
        id: 1
      }
      const stateAfter = [
        {
          id: 0,
          text: 'Learn Redux',
          completed: false
        },
        {
          id: 1,
          text: 'Go Shopping',
          completed: true
        }
      ]

      deepFreeze(stateBefore);
      deepFreeze(action);

      expect(
        todos(stateBefore, action)
      ).toEqual(stateAfter)
    })


  }) // reducer todos


})
