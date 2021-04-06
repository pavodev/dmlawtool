import React from 'react';

// Redux
import { connect } from 'react-redux';
import { fetchNodes } from '../../app/actions/actions';
import { fetchQuestions } from '../../app/actions/actions';

// Chat
import {
  Widget,
  addResponseMessage,
  renderCustomComponent,
  toggleWidget,
  toggleMsgLoader,
  deleteMessages,
} from 'react-chat-widget';

// Styles
import 'react-chat-widget/lib/styles.css';
import './Home.scss';

// Components
import Tree from './Tree/Tree.js';
import ScrollDialog from '../ScrollDialog/ScrollDialog';
import MessageBasic from '../Messages/MessageBasic';
import MultiSelect from '../MultiSelect/MultiSelect';
import ChipsList from './ChipsList/ChipsList';
import { IconButton } from '@material-ui/core';

/**
 * The Home component acts as a wrapper to the DMLawTool's body.
 */
class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: '',
      open: false,
      currentNode: null,
      currentNodes: null,
      tags: [],
      nodes: [],
      questions: [],
      openDialog: false,
      selectedTags: [],
      clear: false,
      guideStarted: false,
      welcomeStarted: false,
    };
  }

  async componentDidMount() {
    await this.props.fetchNodes();
    await this.props.fetchQuestions();
    await this.setState({
      nodes: this.props.nodes,
      questions: this.props.questions,
      tags: this.props.tags,
    });

    // toggleInputDisabled();
    await this.msgLoading(500);
    toggleWidget();
    await this.setState({ welcomeStarted: true });
    await this.renderWelcomeMessage();
    await this.setState({ guideStarted: true });
    // toggleInputDisabled();
  }

  /*
    Await a given / random amount delay in ms
  */
  timeout = async (amount = 0) => {
    const randomAmount = Math.floor(Math.random() * 5) + 4 * 1000;
    let actualAmount = amount ? amount : randomAmount;
    const delay = (ms) => new Promise((res) => setTimeout(res, ms));
    await delay(actualAmount);
  };

  /*
    Simulate the chat bot writing animation
  */
  msgLoading = async (delay) => {
    toggleMsgLoader();
    await this.timeout(delay);
    toggleMsgLoader();
  };

  renderWelcomeMessage = async () => {
    let welcomeMessage = [
      {
        data: {
          message_label: 'Hi there!',
          text:
            '<div><p>Welcome to DMLaw Tool!<br/>I am Lawly, your virtual assistant, and I will give you some tips on how to use the tool, but first a short reminder:</p></div>',
        },
      },
      {
        data: {
          message_label: '',
          text:
            '<div><p>The goal of DMLaw Tool (Data Management Law Tool) is to guide researchers through the most relevant legal issues in research data management.</p></div>',
        },
      },
      {
        data: {
          message_label: '',
          text: '<div><p>Let’s now discover how it works: </p></div>',
        },
      },
      {
        data: {
          message_label: '',
          text:
            '<div><p><ul><li>The tool is organized as a decision tree in which each node provides the necessary definitions and explanations to choose the next branch.</li></ul></p></div>',
        },
      },
      {
        data: {
          message_label: '',
          text:
            '<div><p><ul><li>To see the definitions and explanations, simply click on the node</li></ul></p></div>',
        },
      },
      {
        data: {
          message_label: '',
          text:
            '<div><p><ul><li>Click on the + symbol to open up the next branches of a node (or the - symbol to close the branches)</li></ul></p></div>',
        },
      },
      {
        data: {
          message_label: '',
          text:
            '<div><p><ul><li>Different topics have different colors: Copyright nodes are in blue and Data Protection nodes in green</li></ul></p></div>',
        },
      },
      {
        data: {
          message_label: '',
          text:
            '<div><p><ul><li>All end-nodes are marked as yellow. They contain solution approaches that can be applied once arrived at the end of a branch.</li></ul></p></div>',
        },
      },
      {
        data: {
          message_label: '',
          text:
            '<div><p>You can search for specific terms by using the search box in the upper lefthand corner. All nodes that contain the word will be highlighted. You need to open up the tree to see all highlighted nodes. The term is highlighted in yellow within each text.You can also filter the contents by Tags. Each node has a series of tags that are shown at the beginning of each text and thus summarize the treated topics. When you filter by tags, the tree opens up automatically and shows all nodes that have the chosen tag(s).</p></div>',
        },
      },
      {
        data: {
          message_label: '',
          text:
            '<div><p>Tree utilities at the bottom, allow to center the tree, expand or collapse its branches and to zoom in and out. </p></div>',
        },
      },
      {
        data: {
          message_label: '',
          text:
            '<div><p>For any question regarding the tool or for more specific advice on the topics of copyright and data protection please write to: <address><a href="mailto:info@ccdigitallaw.ch">info@ccdigitallaw.ch</a></address></p></div>',
        },
      },
    ];

    for (let i = 0; i < welcomeMessage.length; i++) {
      await this.msgLoading();
      // renderCustomComponent(MessageBasic, welcomeMessage[i]);
      if (this.state.welcomeStarted) {
        renderCustomComponent(MessageBasic, welcomeMessage[i]);
      } else {
        return;
      }
    }

    await this.setState({ welcomeStarted: false });
  };

  startGuided = async () => {
    if (this.state.questions == null) return;
    this.nextQuestion(this.state.questions);
  };

  handleNewUserMessage = async (newMessage) => {
    if (newMessage.toLowerCase() === 'start' && !this.state.welcomeStarted) {
      // await deleteMessages();
      await this.setState({
        currentQuestion: null,
        currentNodes: [],
        guideStarted: false,
        welcomeStarted: true,
      });
      await this.renderWelcomeMessage();
      await this.setState({ guideStarted: true });
      return;
    } else if (newMessage.toLowerCase() === 'clear' && !this.state.welcomeStarted) {
      this.setState({
        currentQuestion: null,
        currentNodes: [],
        guideStarted: false,
        welcomeStarted: true,
      });
      await deleteMessages();
      await this.renderWelcomeMessage();
      await this.setState({ guideStarted: true });

      document.getElementById('start-guided').disabled = true;

      return;
    }

    await this.guided(newMessage);
  };

  // Handle the user answers to the questions of the chatbot
  guided = async (message) => {
    if (this.state.guideStarted) {
      if (!this.state.currentQuestion) {
        if (message.toLowerCase() === 'yes' || message.toLowerCase() === 'y') {
          document.getElementById('start-guided').disabled = true;
          this.startGuided();
        } else if (message.toLowerCase() === 'no' || message.toLowerCase() === 'n') {
          renderCustomComponent(MessageBasic, {
            data: {
              message_label: '',
              text:
                '<div><p>Thank you for letting us know your preference! If you feel stuck at a certain point of your journey, you can always switch your navigation method into “guided” by typing “<strong>Start</strong>“!</p></div>',
            },
          });
        } else {
          await this.msgLoading();
          addResponseMessage(
            "The request couldn' be satisfied, be sure to type the correct option...",
          );
        }
      } else {
        let question = this.state.currentQuestion;

        let matched = false;

        for (let i = 0; i < question.children.length; i++) {
          let child = question.children[i];

          if (message.toLowerCase() === child.label.toLowerCase()) {
            await this.msgLoading();
            await this.nextQuestion(child);

            if (child.nodes && child.nodes.length) {
              document.getElementById('start-guided').disabled = false;

              this.setState({
                currentNodes: child.nodes,
                currentQuestion: null,
                startGuided: false,
              });

              await this.msgLoading();
              renderCustomComponent(MessageBasic, {
                data: {
                  message_label: '',
                  text:
                    '<div><p>If you want to answer the questions again just type <b>start</b>!</p></div>',
                },
              });
            }

            matched = true;
            break;
          }
        }

        if (!matched && !this.state.startGuided) {
          addResponseMessage(
            "The request couldn' be satisfied, be sure to type the correct option...",
          );
        }
      }
    }
  };

  // Get the next question to be displayed in the chatbot
  nextQuestion = async (question) => {
    if (!question) return;
    this.setState({ currentQuestion: question });

    let splittedMessage = [];

    if (question.message) {
      splittedMessage = question.message.split('<p>...</p>');

      let questionSlice = {};
      for (let i = 0; i < splittedMessage.length; i++) {
        if (i === 0) {
          questionSlice = { ...question };
          questionSlice.message = splittedMessage[i];
        } else {
          questionSlice = {
            message: splittedMessage[i],
            text: '',
          };
        }
        await this.msgLoading(2500);

        if (this.state.guideStarted) renderCustomComponent(MessageBasic, { data: questionSlice });
        else return;
      }
    }
  };

  openDrawer = (node) => {
    this.setState({ open: true, currentNode: node });

    // setBadgeCount(3);
    document.getElementById('node-sidenav').style.opacity = 1;
    if (window.innerWidth <= 800) document.getElementById('node-sidenav').style.width = '100%';
    else document.getElementById('node-sidenav').style.width = '600px';
    document.getElementById('node-sidenav').style.height = '100%';
  };

  closeDrawer = () => {
    if (!this.state.open) return;
    document.getElementById('node-sidenav').style.opacity = 0;
    document.getElementById('node-sidenav').style.width = '0';
    document.getElementById('node-sidenav').style.height = '0';
    this.setState({ open: false, currentNode: null });
  };

  setSelectedTags = async (tags) => {
    this.closeDrawer();

    if (tags && !tags.length) {
      await this.setState({ clear: true });
      await this.setState({ clear: false });
    }
    this.setState({ selectedTags: tags });
  };

  /*
    Callback called when the search-box input changes
  */
  inputChanged = () => {
    const searchText = document.querySelector('.search-input').value;
    if (!searchText) this.setState({ searchText });
  };

  /*
    Callback called when the input is focused and the user presses enter (key code 13)
  */
  handleInputSearch = (e) => {
    let key = e.keyCode || e.which;
    if (key === 13) {
      const searchText = document.querySelector('.search-input').value;
      this.setState({ searchText });
    }
  };

  /*
    Callback called when the search button is pressed
  */
  handleInputButtonSearch = () => {
    const searchText = document.querySelector('.search-input').value;
    this.setState({ searchText });
  };

  handleFocus = (e) => {
    e.target.select();
  };

  render() {
    return (
      <div>
        <ScrollDialog
          node={this.state.currentNode}
          isOpen={this.state.open}
          open={this.openDrawer}
          close={this.closeDrawer}
          search={this.state.searchText}
        ></ScrollDialog>
        <Widget title="Lawly" subtitle="" handleNewUserMessage={this.handleNewUserMessage} />
        <div className="toolbar">
          <div className="toolbar__col toolbar__col--center">
            <div className="ui icon input toolbar__search">
              <input
                className="search-input toolbar__search__input"
                type="text"
                placeholder="Search for a word..."
                onChange={this.inputChanged}
                onKeyPress={this.handleInputSearch}
                onFocus={this.handleFocus}
              />
              <IconButton
                className="toolbar__search__button"
                onClick={this.handleInputButtonSearch}
              >
                <i className="search icon toolbar__search__button__icon"></i>
              </IconButton>
            </div>
          </div>
          <div className="toolbar__col toolbar__col--center">
            <MultiSelect
              options={this.state.tags}
              clear={this.state.clear}
              closeDrawer={this.closeDrawer}
              setTags={this.setSelectedTags}
            ></MultiSelect>
          </div>
          <div className="toolbar__col toolbar__col--start">
            <ChipsList
              items={this.state.selectedTags}
              clear={() => this.setSelectedTags([])}
            ></ChipsList>
          </div>
        </div>
        {this.props.nodes ? (
          <div>
            <Tree
              search={this.state.searchText}
              openDrawer={this.openDrawer}
              closeDrawer={this.closeDrawer}
              currentNodes={this.state.currentNodes}
              jsonData={this.props.nodes}
              selectedTags={this.state.selectedTags}
            ></Tree>
          </div>
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    nodes: state.nodes.data,
    tags: state.nodes.tags,
    questions: state.questions.data,
  };
};

export default connect(mapStateToProps, {
  fetchNodes,
  fetchQuestions,
})(Home);
