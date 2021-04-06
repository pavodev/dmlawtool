import { FETCH_QUESTIONS, FETCH_QUESTIONS_ERROR } from '../actions/types';

export default (state = {}, action) => {
  switch (action.type) {
    case FETCH_QUESTIONS:
      return { ...state, data: action.payload.data };
    case FETCH_QUESTIONS_ERROR:
      return { ...state, data: action.payload.data };
    default:
      return state;
  }
};
