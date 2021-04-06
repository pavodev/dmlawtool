import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import nodesReducer from './reducers/nodesReducer';
import questionsReducer from './reducers/questionsReducer';
import tagsReducer from './reducers/tagsReducer';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    nodes: nodesReducer,
    questions: questionsReducer,
    tags: tagsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
