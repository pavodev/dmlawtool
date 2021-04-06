import React from 'react';

// MaterialUI
import { withStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import Tooltip from '@material-ui/core/Tooltip';

import './ScrollDialog.scss';

const formattingElements = [
  '<b>',
  '</b>',
  '<strong>',
  '</strong>',
  '<i>',
  '</i>',
  '<em>',
  '</em>',
  '<mark>',
  '</mark>',
  '<small>',
  '</small>',
  '<del>',
  '</del>',
  '<ins>',
  '</ins>',
  '<sub>',
  '</sub>',
  '<sup>',
  '</sup>',
  '<span>',
  '</span>',
  '<p>',
  '</p>',
  '&nbsp;',
  '&nbsp',
  '&amp;',
  '&amp',
];

class CustomChip extends React.Component {
  render() {
    return (
      <div>
        <Chip
          key={this.props.tag.id}
          className="chip"
          color="primary"
          label={this.props.tag.label}
          style={{
            backgroundColor: this.props.tag.background_color,
            color: this.props.tag.text_color,
          }}
        />
      </div>
    );
  }
}

const styles = {
  tooltip: {
    marginRight: '0px',
    backgroundColor: 'white',
    border: '1px solid #bdbdbd',
  },
};

const CustomTooltip = withStyles(styles)(Tooltip);

/**
 * This component renders a side dialog that can be toggled by its parent component
 * It also provides a "search" props that is used to search and highlight all occurences of a given string.
 */
export default class ScrollDialog extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      newNodeDescription: '',
    };
  }

  componentDidMount() {
    // reset the scroll when the user refreshes the page.
    window.onbeforeunload = function () {
      let sidenav = document.getElementById('node-sidenav');
      if (sidenav) {
        sidenav.scrollTop = 0; // For Chrome, Firefox, IE and Opera
      }
    };
  }

  async componentDidUpdate(oldProps) {
    let sidenav = document.getElementById('node-sidenav');
    if (sidenav) {
      if (this.props.node && oldProps.node && this.props.node.data.id !== oldProps.node.data.id)
        sidenav.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    }

    if (this.props.node && this.props.node !== oldProps.node) {
      await this.setState({ newNodeDescription: '' });
      this.searchText();
    }

    // try selecting all span elements with document.querySelectorAll and then highlight
    if (oldProps.search !== this.props.search && this.props.node) {
      this.searchText();
    }
  }

  /*
    Search callback. Searches for the word specified in the "search" prop.
  */
  searchText = async () => {
    await this.setState({ newNodeDescription: this.props.node.data.description });

    if (!this.props.search) {
      return;
    }

    let nodeDescription = document.querySelector('.node__description');
    let spans = [...nodeDescription.querySelectorAll('span')];
    let details = nodeDescription.querySelectorAll('details');

    details.forEach((detail) => {
      detail.open = true;
    });

    if (spans) {
      spans = spans.filter(this.filterSpanWithImgElements);
      spans.forEach((span) => {
        let strippedContent = this.stripFromElement(span, formattingElements);

        span.innerHTML = strippedContent;
        span.innerHTML = this.customReplaceAll(
          span.innerHTML,
          this.props.search,
          `<mark>${this.props.search}</mark>`,
          true,
        );
      });
    }
  };

  /*
    This function allows to replace all occurences of a word with a given string.
    It was implemented because the native javascript .replaceAll() function is not 
    able to do a case-insensitive search.
  */
  customReplaceAll = (_s, _f, _r, _c) => {
    var o = _s.toString();
    var r = '';
    var s = o;
    var b = 0;
    var e = -1;
    if (_c) {
      _f = _f.toLowerCase();
      s = o.toLowerCase();
    }

    // get the original string
    let getChars = (original, startIndex, toBeReplaced) => {
      let result = '';
      let end = startIndex + toBeReplaced.length;

      if (end > original.length) end = original.length;

      for (let i = startIndex; i < end; i++) {
        result += original.charAt(i);
      }

      return result;
    };

    while ((e = s.indexOf(_f)) > -1) {
      r += o.substring(b, b + e) + `<mark>${_s.substring(b + e, b + e + _f.length)}</mark>`;
      s = s.substring(e + _f.length, s.length);
      b += e + _f.length;
    }

    // Add Leftover
    if (s.length > 0) {
      r += o.substring(o.length - s.length, o.length);
    }

    // Return New String
    return r;
  };

  /*
    Strip out the formatting elements from the given element
    arg1: Dom Node element, arg2: List of Strings containing the formatting elements
  */
  stripFromElement = (element, formattingElements) => {
    let strippedContent = element.innerHTML;
    for (let i = 0; i < formattingElements.length; i++) {
      strippedContent = strippedContent.split(formattingElements[i]).join('');
    }

    return strippedContent;
  };

  /* 
    Check if the given element has a child img element
    args: DOM Node element
  */
  filterSpanWithImgElements = (span) => {
    if (
      span.innerHTML.includes('<img') ||
      span.innerHTML.includes('<span') ||
      span.innerHTML.includes('<ol') ||
      span.innerHTML.includes('<li')
    ) {
      return false;
    }
    return true;
  };

  escapeRegExp = (stringToGoIntoTheRegex) => {
    return stringToGoIntoTheRegex.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  };

  render() {
    let tags = [];

    if (this.props.node) {
      this.props.node.data.tags ? (tags = this.props.node.data.tags) : (tags = []);
    }

    return (
      <div>
        {this.props.node ? (
          <div id="node-sidenav" className="sidenav scroll-content">
            <div className="closebtn__container">
              <button className="closebtn" onClick={this.props.close}>
                &times;
              </button>
            </div>
            <div className="ui container" style={{ padding: '10px' }}>
              <div className="column centered">
                <div className="ui card" style={{ width: '100%' }}>
                  <div className="content">
                    <h2
                      className="ui header"
                      style={{
                        textAlign: 'center',
                        marginTop: '10px',
                      }}
                    >
                      <span>{this.props.node.data.label}</span>
                    </h2>

                    {tags.length > 0 ? (
                      <div className="ui small feed">
                        <div className="ui divider" />
                        <div className="event">
                          <div className="content" style={{ width: '100%' }}>
                            <div className="chip__container">
                              {tags.map((tag) => {
                                if (tag.t_description) {
                                  return (
                                    <CustomTooltip
                                      key={tag.id}
                                      placement="left"
                                      title={
                                        <p
                                          style={{
                                            fontSize: '1.3em',
                                            color: 'black',
                                          }}
                                        >
                                          {tag.t_description}
                                        </p>
                                      }
                                      aria-label="add"
                                    >
                                      <div>
                                        <CustomChip tag={tag}></CustomChip>
                                      </div>
                                    </CustomTooltip>
                                  );
                                } else {
                                  return (
                                    <div key={tag.id}>
                                      <CustomChip tag={tag}></CustomChip>
                                    </div>
                                  );
                                }
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : null}
                    <div className="ui divider" />
                    <div className="content node__description">
                      <div className="ui small feed">
                        <div className="event">
                          <div className="content" style={{ width: '100%' }}>
                            {!this.state.newNodeDescription ? (
                              <div
                                className="summary"
                                key={Math.random()}
                                dangerouslySetInnerHTML={{
                                  __html: this.props.node.data.description,
                                }}
                              ></div>
                            ) : (
                              <div
                                className="summary"
                                key={Math.random()}
                                dangerouslySetInnerHTML={{ __html: this.state.newNodeDescription }}
                              ></div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div></div>
        )}
      </div>
    );
  }
}
