import { FETCH_NODES, FETCH_NODES_ERROR } from '../actions/types';

export default (state = {}, action) => {
  switch (action.type) {
    case FETCH_NODES:
      return { ...state, data: action.payload.data, tags: action.payload.tags };
    case FETCH_NODES_ERROR:
      return { ...state, data: action.payload.data, tags: action.payload.tags };
    default:
      return state;
  }
};
