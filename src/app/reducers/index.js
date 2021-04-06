import { combineReducers } from 'redux';
import nodesReducer from './nodesReducer';
import questionsReducer from './questionsReducer';
// import errorReducer from './errorReducer';

const rootReducer = combineReducers({
  nodesReducer,
  questionsReducer,
  //   errorReducer,
});

export default rootReducer;
