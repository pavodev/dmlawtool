import {
  FETCH_NODES,
  FETCH_NODES_ERROR,
  FETCH_QUESTIONS,
  FETCH_QUESTIONS_ERROR,
  SET_ERROR,
  HIDE_ERROR,
} from './types';

/**
 * Fetch the nodes that will be used in the tree graph that is generated with d3.js.
 * Since the d3.js library needs a tree data structure, we use the unflatten method to accomplish that.
 */
export const fetchNodes = () => async (dispatch) => {
  await fetch(`https://dmlawtool-admin.ccdigitallaw.ch/wp-json/wp/v2/nodes?per_page=100`)
    .then((response) => response.json())
    .then((jsonData) => {
      // search for the parent
      let parent = jsonData.find((node) => node.parent_node === false);

      let tree = unflatten(jsonData, parent);
      parent['children'] = tree;

      let tags = [];

      jsonData.forEach((node) => {
        if (node.tags && node.tags.length > 0) tags = [...tags, ...node.tags];
      });

      let uniqueTags = getDistinctObjects(tags);

      dispatch({
        type: FETCH_NODES,
        error: false,
        payload: { data: parent, tags: uniqueTags },
      });
    })
    .catch((error) => {
      dispatch({
        type: FETCH_NODES_ERROR,
        error: true,
        payload: { data: null, tags: null },
      });
      setError("Couldn't fetch nodes data from the server");
    });
};

/**
 * Fetch the questions that will be used inside the chatbot.
 * Once the questions are fetched they must be arranged into a tree structure using the unflatten method.
 */
export const fetchQuestions = () => async (dispatch) => {
  await fetch(`https://dmlawtool-admin.ccdigitallaw.ch/wp-json/wp/v2/questions?per_page=100`)
    .then((response) => response.json())
    .then((jsonData) => {
      // search for the parent
      let parent = jsonData.find((node) => node.parent_node === false);

      let tree = unflatten(jsonData, parent);
      parent['children'] = tree;

      dispatch({
        type: FETCH_QUESTIONS,
        error: false,
        payload: { data: parent },
      });
    })
    .catch((error) => {
      dispatch({
        type: FETCH_QUESTIONS_ERROR,
        error: true,
        payload: { data: null },
      });
      setError("Couldn't fetch questions data from the server");
    });
};

/**
 * This method loops through the array of objects passed as parameter and returns a set of objects with unique ids.
 */
function getDistinctObjects(array = []) {
  const result = [];
  const map = new Map();
  for (const item of array) {
    if (!map.has(item.id)) {
      map.set(item.id, true); // set any value to Map
      result.push(item);
    }
  }

  return result;
}

/**
 * Loop through an array of objects and generate a tree structure.
 * Each object has a reference to its parent object. The root object ha no reference to its parent (null).
 */
function unflatten(array, parent, tree) {
  tree = typeof tree !== 'undefined' ? tree : [];
  parent = typeof parent !== 'undefined' ? parent : { id: 0 };

  var children = array.filter(function (child) {
    if (child.parent_node || child.parent_node.length) {
      return child.parent_node[0].id === parent.id;
    } else {
      return false;
    }
  });

  if (children.length > 0) {
    if (!parent.parent_node) {
      tree = children;
    } else {
      parent['children'] = children;
    }
    children.sort((a, b) => parseInt(a.position) - parseInt(b.position));
    children.forEach(function (child) {
      unflatten(array, child);
    });
  }

  return tree;
}

export function setError(error) {
  return {
    type: SET_ERROR,
    error: error,
  };
}

export function hideError() {
  return {
    type: HIDE_ERROR,
  };
}
