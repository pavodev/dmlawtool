import { FETCH_TAGS, FETCH_TAGS_ERROR } from '../actions/types';

export default (state = {}, action) => {
  switch (action.type) {
    case FETCH_TAGS:
      return { ...state, data: action.payload.data };
    case FETCH_TAGS_ERROR:
      return { ...state, data: action.payload.data };
    default:
      return state;
  }
};
