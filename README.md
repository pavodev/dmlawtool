## DMLawTool

### About the DMLawTool

The DMLawTool is a decision-tree tool developed by the Università della Svizzera italiana in collaboration with the University of Neuchâtel within the P-5 program “Scientific Information” of swissuniversities. It is available under the CC-BY-SA 4.0 license as an open source software.
The tool guides researchers working mainly in the fields of humanities and social sciences through the most relevant legal issues related to data management. At the end of the process, the tool proposes different solution approaches on what can be done with research data and how it can be archived in a repository.

<a href="https://dmlawtool.ccdigitallaw.ch/">Take a look at the tool!</a>

### Disclaimer

This tool is a basic guide with the only purpose of giving a general understanding on the main legal aspects of Copyright and Data Protection according to Swiss legislations and to the European General Data Protection Regulation as of March 2021.
The tool is developed in a practical manner and it is written in a non-legal language. Its purpose is not to provide complete and tailored legal advice to the user’s case, but to help researchers identify legal issues, and highlight clues that users may consider or implement with the help of specialists when necessary.
If not indicated otherwise, the examples used are invented and have the only purpose of a better illustration of the information provided. All the information provided in this tool does not, and is not intended to, constitute legal or other professional advice.
The user of this tool acknowledges that each situation must be judged on a case-by-case basis and must seek legal advice from a competent attorney to resolve their specific case with respect to any particular legal matter.

### Copyright

All text in this tool, except third party contents (e.g. quotes), is published under the Creative Commons Attribution Share Alike 4.0 International License. To view a copy of this license, visit [this page](https://creativecommons.org/licenses/by-sa/4.0/).

## API JSON Structure

Below you will find an example of the the data structure that is used by the DMLawTool.

### Node data structure

As the DMLawTool displays data inside a tree graph, a tree data structure is needed.
In order to ease developers and users, the DMLawTool accepts a simple array of nodes in which each node must respect the following conditions:
- Each node must have a unique id.
- Each node must have a reference to its parent node (parent_node)
- The root node has no parent node (parent_node: null)

Given the above informations, the DMLawTool is then able to compute a tree structure which is then provided to the D3.js library that draws the graph.


```json
[
  {...},
  {
    "id": 249, // Unique id
    "type": "node",
    "label": "Node name",
    "description": "<p>The description is displayed when clicking on a node</p>",
    "summary": "The summary is displayed inside a popup when hovering the node",
    "position": "1", // Used to determine the order of the children of a node.
    "default_expanded": "0",
    "fill": "#1c76d7",
    "fill_gradient": "#1d3bb3",
    "fill_collapsed": "#1d3bb3",
    "text_color": "#ffffff",
    "stroke": "#1d3bb3",
    "isroot": "0",
    "tags": [
      {
        "label": "Tag 1",
        "t_description": "On tag hover popup content",
        "background_color": "#1e73be",
        "text_color": "#ffffff",
        "ID": 220,
        "id": 220
      },
      {
        "label": "Tag 2",
        "t_description": "On tag hover popup content",
        "background_color": "#1e73be",
        "text_color": "#ffffff",
        "ID": 255,
        "id": 255
      }
    ],
    "parent_node": [
      {
        "ID": 186,
        "id": 186,
        "label": "Parent node name",
        "description": "<p>The description is displayed when clicking on a node</p>",
        "summary": "The summary is displayed inside a popup when hovering the node",
        "default_expanded": "0",
        "fill": "#1c76d7",
        "fill_gradient": "#1d3bb3",
        "fill_collapsed": "#4e8fdf",
        "text_color": "#ffffff",
        "stroke": "#1d3bb3",
        "isroot": "0",
      }
    ],
  },
  {...}
 ]
```

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app), using the [Redux](https://redux.js.org/) and [Redux Toolkit](https://redux-toolkit.js.org/) template.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
