import React, { Component } from 'react';
import * as d3 from 'd3v4';

import chroma from 'chroma-js';

// Style
import './Tree.scss';

// Material-UI
import CloseIcon from '@material-ui/icons/Close';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import CenterFocusStrongIcon from '@material-ui/icons/CenterFocusStrong';
import UnfoldMoreIcon from '@material-ui/icons/UnfoldMore';
import UnfoldLessIcon from '@material-ui/icons/UnfoldLess';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';
import TuneIcon from '@material-ui/icons/Tune';
import { Snackbar, SnackbarContent } from '@material-ui/core';
/**
 * The tree component acts as a wrapper to the D3.js tree graph.
 * D3.js graphs have a lifecycle that is managed through the enter(), update() and exit() methods.
 */
class Tree extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchText: '',
      closeBtn: null,
      nodeId: 0,
      root: null,
      baseSvg: null,
      svgGroup: null,
      treemap: null,
      treeData: null,
      zoomListener: null,
      maxLabelLength: 15,
      viewerWidth: 0,
      viewerHeight: 0,
      duration: 750,
      zoom: null,
      open: false,
      snackBarOpen: false,
      snackBarMessage: '',
      anchorEl: null,

      defaultUpdate: () => {},

      isOpen: false,
      currentNode: null,
    };
  }

  async componentDidMount() {
    await this.setState({
      viewerWidth: document.getElementById('tree').innerWidth,
      viewerHeight: document.getElementById('tree').innerHeight,
    });
    await this.drawChart();
  }

  /**
   * Check whether there are changes in the props.
   */
  async componentDidUpdate(prevProps) {
    if (prevProps.search !== this.props.search) {
      this.doReset();
      await this.setState({ searchText: this.props.search });
      this.onSearchChange();
    }

    if (prevProps.currentNodes !== this.props.currentNodes) {
      this.resetAnimated();
      this.doReset();

      for (let i = 0; i < this.props.currentNodes.length; i++) {
        await this.setState({ currentNodes: this.props.currentNodes });
        this.setAnimated(this.props.currentNodes[i]);
        this.highlightPath({ data: this.props.currentNodes[i] });
      }
    }

    if (prevProps.selectedTags !== this.props.selectedTags) {
      await this.setState({ selectedTags: this.props.selectedTags });
      this.doReset();
      await this.searchForNodes();
      this.onTagChange();
    }
  }

  openScrollDialog = (node = null) => {
    this.setState({ isOpen: true, currentNode: node });
  };

  closeScrollDialog = () => {
    this.setState({ isOpen: false, currentNode: null });
  };

  resetAnimated = () => {
    this.state.flattenedNodes.forEach((d) => {
      d.animated = false;
    });
  };

  setAnimated = (node) => {
    let find = this.state.flattenedNodes.find((d) => {
      if (d.data.id === node.id) {
        return true;
      }
    });

    if (typeof find === 'undefined') {
      return false;
    }

    while (find.parent) {
      find.animated = true;
      find = find.parent;
    }

    this.update(this.state.root);
  };

  handleClick = (event) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    return (
      <div>
        <div id="tree">
          <div className="bottom-toolbar">
            <Button
              className="bottom-toolbar__menu-button"
              aria-controls="simple-menu"
              aria-haspopup="true"
              onClick={this.handleClick}
            >
              <TuneIcon style={{ marginRight: '7px' }} />
              Tree utilities
            </Button>
            <Menu
              id="simple-menu"
              anchorEl={this.state.anchorEl}
              keepMounted
              open={Boolean(this.state.anchorEl)}
              onClose={this.handleClose}
              getContentAnchorEl={null}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
              transformOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
              <MenuItem onClick={this.centerTree}>
                <ListItemIcon>
                  <CenterFocusStrongIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Center Tree" />
              </MenuItem>
              <Divider />
              <MenuItem onClick={this.expandAll}>
                <ListItemIcon>
                  <UnfoldMoreIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Expand" />
              </MenuItem>
              <MenuItem onClick={this.setInitialNodeState}>
                <ListItemIcon>
                  <UnfoldLessIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Collapse" />
              </MenuItem>
              <Divider />
              <MenuItem onClick={this.zoomIn}>
                <ListItemIcon>
                  <ZoomInIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Zoom in" />
              </MenuItem>
              <MenuItem onClick={this.zoomOut}>
                <ListItemIcon>
                  <ZoomOutIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Zoom out" />
              </MenuItem>
            </Menu>
          </div>
        </div>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          open={this.state.snackBarOpen}
          autoHideDuration={5000}
          onClose={this.handleSnackBarClose}
        >
          <SnackbarContent className="snackbar" message={this.state.snackBarMessage} />
        </Snackbar>
      </div>
    );
  }

  handleSnackBarClose = () => {
    this.setState({ snackBarOpen: false });
  };

  resetZoom = () => {
    this.state.baseSvg
      .transition()
      .duration(600)
      .call(this.state.zoom.scale, 0.2)
      .on('end', () => {
        this.centerNode(this.state.root);
      });
  };

  centerTree = () => {
    this.handleClose(); // close the selection menu
    this.centerNode(this.state.root);
  };

  zoom = () => {
    if (d3.event.transform != null) {
      this.state.svgGroup.attr('transform', d3.event.transform);
    }
  };

  zoomIn = () => this.state.baseSvg.transition().call(this.state.zoom.scaleBy, 2);
  zoomOut = () => this.state.baseSvg.transition().call(this.state.zoom.scaleBy, 0.5);

  async drawChart() {
    // Get the root computed by d3.
    let root = d3.hierarchy(this.props.jsonData, function (d) {
      return d.children;
    });

    this.setState({
      viewerWidth: window.innerWidth,
      viewerHeight: window.innerHeight,
    });

    let treemap;

    // define the this.state.zoomListener which calls the zoom function on the "zoom" event constrained within the scaleExtents
    let zoomListener = d3.zoom().scaleExtent([0.1, 3]).on('zoom', this.zoom);
    this.setState({ zoom: zoomListener });

    // define the baseSvg, attaching a class for styling and the this.state.zoomListener
    let baseSvg = d3
      .select('#tree')
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('pointer-events', 'all')
      .attr('class', 'overlay')
      .call(zoomListener);

    // create a tooltip element
    let tooltip = d3
      .select('#tree')
      .append('div')
      .style('opacity', 0)
      .attr('class', 'tooltip')
      .style('background-color', 'white')
      .style('position', 'absolute')
      .style('border', 'solid')
      .style('border-width', '2px')
      .style('border-radius', '5px')
      .style('z-index', 100)
      .style('pointer-events', 'none')
      .attr('transform', 'translate(' + 0 + ',' + 0 + ')');

    // Append a group which holds all the nodes and which the zoom Listener can act upon.
    let svgGroup = baseSvg.append('g').attr('width', '2000px').attr('height', '2000px');

    // Position the root
    root.x0 = this.state.viewerHeight / 2;
    root.x0 = 200;
    root.y0 = 50;

    this.setState({
      root,
      treemap,
      treeData: this.props.treeData,
      svgGroup,
      baseSvg,
      zoomListener,
      tooltip,
    });

    // Apply some initial positioning.

    this.state.baseSvg.call(this.state.zoom.scaleBy, 0.35);

    this.setInitialNodeState();

    this.update(this.state.root);

    await this.setState({ flattenedNodes: this.flatten(this.state.root) });
    this.centerNode(this.state.root);
  }

  // Resets the node states to the default one
  setInitialNodeState = () => {
    this.handleClose(); // close the selection menu
    this.collapseToInitialState(this.state.root);

    this.update(this.state.root);
    this.centerNode(this.state.root);
  };

  // Use the node's default_expanded property to set its state to the initial one.
  collapseToInitialState = (d) => {
    this.update(this.state.root);

    if (d.data.default_expanded === '1') d.children.forEach(this.collapseToInitialState);
    if (d.data.default_expanded === '0' && d.children) {
      d._children = d.children;
      d._children.forEach(this.collapseToInitialState);
      d.children = null;
    }
  };

  /**
   * Expand the nodes recursively by setting its children property and resetting its _children property.
   * Both properties are used by d3 to determine if the node should be expanded or collapsed
   */
  expand = (d) => {
    var children = d.children ? d.children : d._children;
    if (d._children) {
      d.children = d._children;
      d._children = null;
    }
    if (children) children.forEach(this.expand);
  };

  /**
   * Collapse the nodes recursively by setting its _children property and resetting its children property.
   * Both properties are used by d3 to determine if the node should be expanded or collapsed.
   */
  collapse = (d) => {
    if (d.children) {
      d._children = d.children;
      d._children.forEach(this.collapse);
      d.children = null;
    }
  };

  expandAll = async (event) => {
    this.handleClose(); // close the selection menu
    this.expand(this.state.root);
    this.update(this.state.root);
    this.centerNode(this.state.root);
    this.onSearchChange();
    this.onTagChange();
  };

  collapseAll = async () => {
    this.collapse(this.state.root);
    this.update(this.state.root);
    this.centerNode(this.state.root);
  };

  expandSpecific = (d) => {
    if (d._children && d.data.default_expanded) {
      d.children = d._children;
      d.children.forEach(this.expandSpecific);
      d._children = null;
    }
  };

  /**
   * Recursively find all the paths that lead to a node.
   */
  searchTree = (obj, search, path) => {
    if (obj.data.label === search) {
      path.push(obj);
      return path;
    } else if (obj.children || obj._children) {
      // if children are collapsed d3 object will have them instantiated as _children
      let children = obj.children ? obj.children : obj._children;
      for (let i = 0; i < children.length; i++) {
        path.push(obj); // we assume this path is the right one
        let found = this.searchTree(children[i], search, path);
        if (found) {
          // we were right, this should return the bubbled-up path from the first if statement
          return found;
        } else {
          //we were wrong, remove this parent from the path and continue iterating
          path.pop();
        }
      }
    } else {
      //not the right object, return false so it will continue to iterate in the loop
      return false;
    }
  };

  /**
   * Open the paths that are passed as argument.
   */
  openPaths = (paths) => {
    for (let i = 0; i < paths.length; i++) {
      if (paths[i].id !== '1') {
        //i.e. not root
        paths[i].class = 'found';
        if (paths[i]._children) {
          // if children are hidden: open them, otherwise: don't do anything
          paths[i].children = paths[i]._children;
          paths[i]._children = null;
        }
        this.update(paths[i]);
      }
    }
  };

  // Returns a list of all the nodes under the root.
  flatten = (root) => {
    let nodes = [],
      i = 0;

    let recurse = (node) => {
      if (node.children) node.children.forEach(recurse);
      if (node._children) node._children.forEach(recurse);
      if (!node.id) {
        node.id = i++;
      }
      nodes.push(node);
    };
    recurse(root);

    return nodes;
  };

  /*
    This method finds the node inside the flattened array and adds a path_color property to each of his parents.
    The update method will take care of changing the colors of the correct paths.
  */
  highlightPath = (hoveredNode) => {
    if (!hoveredNode.data.label) {
      this.doReset();
      return;
    }

    if (hoveredNode.data.label === this.state.root.data.label) {
      this.doReset();
      return;
    }

    let find = this.state.flattenedNodes.find((d) => {
      if (d.data.id === hoveredNode.data.id) {
        return true;
      }
    });

    if (typeof find === 'undefined') {
      return;
    }

    let targetNode = find;

    while (find.parent) {
      find.path_color = targetNode.data.fill;
      find = find.parent;
    }

    this.update(this.state.root);
  };

  /*
    Search-bar callback
  */
  onSearchChange = () => {
    let that = this;

    if (!this.state.searchText) {
      d3.selectAll('foreignObject')
        .select('body')
        .style('border', function (d) {
          d3.select(this).classed('matchsearch', false);
          if (d3.select(this).classed('hovered')) return '5px solid black';
          return '5px solid ' + d.data.stroke;
        });

      return;
    }
    d3.selectAll('foreignObject').each(function (d) {
      let body = d3.select(this).select('body');

      if (
        d.data.description.toLowerCase().includes(that.state.searchText.toLowerCase()) ||
        d.data.label.toLowerCase().includes(that.state.searchText.toLowerCase())
      ) {
        body.style('border', function (d) {
          if (d3.select(this).classed('hovered')) return '5px solid black';
          d3.select(this).classed('matchsearch', true);
          return '8px solid #f74a27';
        });
      } else {
        body.style('border', function (d) {
          if (d3.select(this).classed('hovered')) return '5px solid black';
          d3.select(this).classed('matchsearch', false);
          return '5px solid ' + d.data.stroke;
        });
      }
    });
  };

  /*
    Invoked each time the tags prop changes
  */
  onTagChange = async () => {
    let that = this;

    if (!this.state.selectedTags || this.state.selectedTags.length === 0) {
      d3.selectAll('foreignObject')
        .select('body')
        .classed('equalsFilter', true)
        .style('color', function (d) {
          return d.data.text_color;
        })
        .style('background', function (d) {
          if (d.data.fill_gradient)
            return `linear-gradient(0.25turn, ${d.data.fill},${d.data.fill_gradient})`;

          return d.data.fill;
        });
      return;
    }

    d3.selectAll('foreignObject').each(function (d) {
      let found = false;

      if (!d.data.tags) {
        d3.select(this)
          .select('body')
          .classed('equalsFilter', false)
          .style('color', function (d) {
            return that.getBrighterFont(d.data.text_color);
          })
          .style('background', function (d) {
            return that.getBrighterLinearGradient(d.data.fill, d.data.fill_gradient);
          });

        return;
      }

      for (let i = 0; i < that.state.selectedTags.length; i++) {
        if (
          d.data.tags.filter(function (e) {
            return e.label === that.state.selectedTags[i].label;
          }).length > 0
        ) {
          d3.select(this)
            .select('body')
            .classed('equalsFilter', true)
            .style('color', function (d) {
              return d.data.text_color;
            })
            .style('background', function (d) {
              if (d.data.fill_gradient)
                return `linear-gradient(0.25turn, ${d.data.fill},${d.data.fill_gradient})`;

              return d.data.fill;
            });
          return;
        }
      }

      if (!found) {
        d3.select(this)
          .select('body')
          .classed('equalsFilter', false)
          .style('color', function (d) {
            return that.getBrighterFont(d.data.text_color);
          })
          .style('background', function (d) {
            return that.getBrighterLinearGradient(d.data.fill, d.data.fill_gradient);
          });
      }
    });
  };

  /**
   * This method searchs for all the nodes that match the selected tags and opens all the paths that lead to them
   */
  searchForNodes = async () => {
    let matchedNodesTags = [];

    if (this.state.selectedTags && this.state.selectedTags.length > 0) {
      await this.flatten(this.state.root).forEach((d) => {
        if (!d.data.tags) {
          return;
        }

        for (let i = 0; i < this.state.selectedTags.length; i++) {
          if (
            d.data.tags.filter((e) => {
              return e.label === this.state.selectedTags[i].label;
            }).length > 0
          ) {
            matchedNodesTags.push(d);
            return;
          }
        }
      });
    }

    if (matchedNodesTags.length === 1) {
      await this.setState({
        snackBarOpen: true,
        snackBarMessage: `Found ${matchedNodesTags.length} node with the seleted Tags`,
      });
    }
    if (matchedNodesTags.length > 1) {
      await this.setState({
        snackBarOpen: true,
        snackBarMessage: `Found ${matchedNodesTags.length} nodes with the seleted Tags`,
      });
    }

    await this.openPathToNodes(matchedNodesTags);
    await this.centerTree();
  };

  openPathToNodes = async (nodes) => {
    for (let i = 0; i < nodes.length; i++) {
      let paths = await this.searchTree(this.state.root, nodes[i].data.label, []);

      if (typeof paths !== 'undefined') {
        this.openPaths(paths);
      }
    }
  };

  // Reset search-bar
  resetSearch = () => {
    this.setState({ searchText: '' });
  };

  // Reset all the nodes
  doReset = () => {
    this.flatten(this.state.root).forEach((d) => {
      // reset path and node colors
      d.path_color = undefined;

      if (d.class === 'found') {
        d.class = '';
      }
    });
    this.update(this.state.root);
  };

  // Toggles a node's state
  toggleChildren = (d) => {
    if (d.children) {
      d._children = d.children;
      d.children = null;
    } else if (d._children) {
      d.children = d._children;
      d._children = null;
    }
    return d;
  };

  // center the view onto the node.
  centerNode = (source) => {
    let t = d3.zoomTransform(this.state.baseSvg.node());
    let x = -source.y0;
    let y = -source.x0;
    x = x * t.k + this.state.viewerWidth / 2;
    y = y * t.k + this.state.viewerHeight / 2;
    this.state.baseSvg
      .transition()
      .duration(this.state.duration)
      .call(this.state.zoomListener.transform, d3.zoomIdentity.translate(x, y).scale(t.k));
  };

  // Node click handler.
  click = (d) => {
    d3.event.stopPropagation();

    // disable mouseenter and mouseleave events while nodes are expanding or collapsing
    d3.selectAll('foreignObject')
      .on('mouseenter', () => {})
      .on('mouseleave', () => {});
    d3.selectAll('foreignObject')
      .select('body')
      .on('mouseenter', () => {})
      .on('mouseleave', () => {});
    d3.selectAll('foreignObject')
      .select('.node__container')
      .on('mouseenter', () => {})
      .on('mouseleave', () => {});
    d3.selectAll('foreignObject')
      .select('.node__label')
      .on('mouseenter', () => {})
      .on('mouseleave', () => {});

    if (d.children) {
      d._children = d.children;
      d.children = null;
    } else {
      d.children = d._children;
      d._children = null;
    }

    this.update(d);
    this.centerNode(d);

    this.onSearchChange();
    this.onTagChange();
  };

  /*
    Compute the diagonal of the paths that represent the links between the nodes
  */
  diagonal = (s, d) => {
    if (s != null && d != null) {
      let path =
        'M ' +
        (s.y - 172) +
        ' ' +
        s.x +
        ' C ' +
        (s.y + d.y) / 2 +
        ' ' +
        s.x +
        ',' +
        (s.y + d.y) / 2 +
        ' ' +
        d.x +
        ',' +
        ' ' +
        (d.y + 172) +
        ' ' +
        d.x;

      return path;
    }
  };

  /* 
    Compute a lighter gradient using chromajs
  */
  getBrighterLinearGradient = (color1, color2) => {
    let fill = color1;
    let brighterGradient = 'black';

    if (fill) {
      fill = chroma(fill).alpha(0.2).rgba();
      brighterGradient = fill;
    }

    let fill_gradient = color2;

    if (fill_gradient) {
      fill_gradient = chroma(fill_gradient).alpha(0.2).rgba();
      // prettier-ignore
      brighterGradient = `linear-gradient(0.25turn, rgba(${fill}), rgba(${fill_gradient}))`;
    }

    return brighterGradient;
  };

  /*
    Compute a brighter color for the font color code passed as argument using chromajs
  */
  getBrighterFont = (fontColor) => {
    if (!fontColor) return 'black';
    let brighterFontColor = chroma(fontColor).alpha(0.4).rgba();
    return `rgba(${brighterFontColor})`;
  };

  /*
    Define the tooltip content and make it visible. The tooltip is not shown on mobile platforms.
  */
  showTooltip = (d) => {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
      return;

    this.state.tooltip
      .transition()
      .duration(400)
      .style('opacity', 1)
      .style('left', d3.event.pageX + 'px')
      .style('top', d3.event.pageY + 'px');

    this.state.tooltip.html(
      `
            <div class="ui card tooltip__container">
              <div class="content center tooltip__header">
                <h3 class="ui header" style="margin:0;">${d.data.label}</h3>
              </div>
              <div class="content tooltip__content">
                <div class="ui small feed">
                  <div class="event">
                    <div class="content">
                      <div class="summary">
                        <p>${d.data.summary}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          `,
    );
  };

  /*
    Hide the main tooltip
  */
  hideTooltip = () => {
    this.state.tooltip.transition().duration(10).style('opacity', 0);
  };

  /*
    This function updates the tree by taking into consideration d3js's enter(), update() and exit() nodes.
    Each of these three states can be used to manipulate and style the nodes. 
    The update function must be called each time we want to update the appereance of the tree.
  */
  update = (source) => {
    let that = this;

    // Compute the new height, function counts total children of root node and sets tree height accordingly.
    // This prevents the layout looking squashed when new nodes are made visible or looking sparse when nodes are removed
    // This makes the layout more consistent.
    let levelWidth = [1];
    let childCount = (level, n) => {
      if (n.children && n.children.length > 0) {
        if (levelWidth.length <= level + 1) levelWidth.push(0);

        levelWidth[level + 1] += n.children.length;
        n.children.forEach((d) => {
          childCount(level + 1, d);
        });
      }
    };

    childCount(0, this.state.root);

    let newHeight = d3.max(levelWidth) * 25; // 25 pixels per line

    // Baum-Layout erzeugen und die Größen zuweisen
    let treemap = d3.tree().size([newHeight, this.state.viewerWidth]);
    this.setState({ treemap });

    // Berechnung x- und y-Positionen pro Knoten
    let treeData = treemap(this.state.root);
    // Compute the new tree layout.
    let nodes = treeData.descendants(),
      links = treeData.descendants().slice(1);

    // Set horizontal distance between levels based on maxLabelLength.
    nodes.forEach((d) => {
      d.y = d.depth * (this.state.maxLabelLength * 35); //maxLabelLength * 10px
      // alternatively to keep a fixed scale one can set a fixed depth per level
      // Normalize for fixed-depth by commenting out below line
      d.y = d.depth * 690; //500px per level.
    });

    // Update vertical distance between nodes
    nodes.forEach((d) => {
      // spread out the vertical axis (if this isn't here, lines tend to overlap on denser graphs)
      d.x = d.x * 15;
    });

    let count = 0;

    // Update the node's ids, must be unique otherwise the enter(), update() and exit() methods won't work properly.
    let node = this.state.svgGroup.selectAll('g.node').data(nodes, (d) => {
      return d.id || (d.id = ++count);
    });

    // Transition exiting nodes to the parent's new position.
    node
      .exit()
      .transition()
      .duration(this.state.duration)
      .attr('transform', (d) => {
        return 'translate(' + source.y0 + ',' + source.x0 + ')';
      })
      .remove();

    // Enter any new nodes at the parent's previous position.
    let nodeEnter = node
      .enter()
      .append('g') //.call(dragListener)
      .attr('class', 'node')
      .attr('transform', (d) => {
        return 'translate(' + source.y0 + ',' + source.x0 + ')';
      })
      .on('click', (d) => {
        d3.event.stopPropagation();
        this.setState({ snackBarOpen: false });
        this.hideTooltip();
        this.props.openDrawer(d);
        this.centerNode(d);
      });

    nodeEnter
      .append('foreignObject')
      .attr('width', 20)
      .attr('height', function (d) {
        d.originalHeight = 40;
        return d.originalHeight;
      })
      .append('xhtml:body')
      .classed('equalsFilter', true)
      .style('font', "25px 'Open Sans'")
      .attr('font-weight', 'bold')
      .style('color', (d) => d.data.text_color)
      .style('background', function (d) {
        if (d.data.fill_gradient) {
          return `linear-gradient(0.25turn, ${d.data.fill},${d.data.fill_gradient})`;
        }
        return d.data.fill;
      })
      .style('border-radius', '15px')
      .style('border', (d) => {
        return '5px solid ' + d.data.stroke;
      })
      .on('mouseenter', function (d) {
        d3.event.stopPropagation();
      })
      .on('mouseleave', function (d) {
        d3.event.stopPropagation();
      })
      .each(function (d) {
        d3.select(this).html(
          "<div class='node__container'><p class='node__label'>" + d.data.label + '</p></div>',
        );
      });

    d3.selectAll('foreignObject')
      .select('.node__container')
      .on('mouseenter', function (d) {
        d3.event.stopPropagation();
        let parentNode = d3.select(this.parentNode);

        parentNode.classed('hovered', true);
        parentNode
          .style('background', '#e8e8e8')
          .style('border', '5px solid black')
          .style('color', 'black');
        d3.select(this).style('cursor', 'pointer'); // .style('text-decoration', 'underline');

        if (d.data.summary) {
          that.showTooltip(d);
        }
      })
      .on('mouseleave', function (d) {
        that.hideTooltip();

        d3.event.stopPropagation();

        let parentNode = d3.select(this.parentNode);

        parentNode.classed('hovered', false);
        parentNode
          .style('color', function (d) {
            if (!d3.select(this).classed('equalsFilter'))
              return that.getBrighterFont(d.data.text_color);
            return d.data.text_color;
          })
          .style('border', function (d) {
            if (d3.select(this).classed('matchsearch')) return '8px solid #f74a27';
            return '5px solid ' + d.data.stroke;
          })
          .style('background', function (d) {
            if (!d3.select(this).classed('equalsFilter')) {
              return that.getBrighterLinearGradient(d.data.fill, d.data.fill_gradient);
            }

            if (d.data.fill_gradient) {
              return `linear-gradient(
                0.25turn,
                ${d.data.fill},
                ${d.data.fill_gradient}
              )`;
            }
            return d.data.fill;
          });

        d3.select(this).style('cursor', 'initial'); //.style('text-decoration', 'initial');
      });

    // expand / collapse button
    let expander = nodeEnter
      .append('g')
      .attr('class', 'expander')
      .attr('display', function (d) {
        if ((!d.children && !d._children) || d.data.isroot === '1') return 'none';
      })
      .on('click', this.click)
      .on('mouseenter', function (d) {
        d3.select(this).style('cursor', 'pointer');
      })
      .on('mouseleave', function (d) {
        d3.select(this).style('cursor', 'initial');
      });

    expander
      .append('circle')
      .attr('class', 'expander__shape')
      .attr('r', 25)
      .attr('cx', 345 / 2);

    expander
      .append('text')
      .style('fill', 'white')
      .style('text-decoration', 'none')
      .style('font-size', '40px')
      .attr('class', 'expander__label')
      .attr('dy', 11);

    d3.selectAll('.expander__shape')
      .style('stroke', function (d) {
        return 'black';
      })
      .style('stroke-width', '5px')
      .style('fill', function (d) {
        if (!d._children && d.children) return '#d72a24';
        if (d._children && !d.children) return '#067302';

        return '';
      });

    d3.selectAll('.expander__label')
      .attr('dx', function (d) {
        if (!d._children && d.children) return 345 / 2 - 7;
        if (d._children && !d.children) return 345 / 2 - 12;
        return 0;
      })
      .text(function (d) {
        if (!d._children && d.children) return '-';
        if (d._children && !d.children) return '+';

        return '';
      });

    // Transition nodes to their new position.
    let nodeUpdate = nodeEnter.merge(node);

    nodeUpdate
      .transition()
      .duration(this.state.duration)
      .attr('transform', (d) => {
        return 'translate(' + d.y + ',' + d.x + ')';
      })
      .on('end', () => {
        this.onSearchChange();
      });

    nodeUpdate
      .select('foreignObject')
      .attr('width', 350)
      .attr('height', function (d) {
        let content = d3.select(this).select('.node__label');
        return content.node().clientHeight + 30;
      })
      .attr('rx', '20px')
      .attr('x', (d) => {
        return -350 / 2;
      })
      .attr('y', function (d) {
        return -d3.select(this).node().getBBox().height / 2;
      });

    // Update the links…
    let link = this.state.svgGroup.selectAll('path.tree-link').data(links, (d) => {
      return d.id;
    });

    // Enter any new links at the parent's previous position.
    var linkEnter = link.enter().insert('g', 'g').attr('class', 'link-group');

    let linkElement = linkEnter
      .append('path')
      .attr('d', (d) => {
        let o = { x: source.x0, y: source.y0 };
        return this.diagonal(o, o);
      })
      .attr('class', 'link flowline tree-link')
      .style('stroke', 'black')
      .style('stroke-width', 30)
      .style('fill', 'none');

    // Transition links to their new position.
    let linkUpdate = linkElement.merge(link);
    linkUpdate
      .transition()
      .duration(this.state.duration)
      .attr('d', (d) => {
        return this.diagonal(d, d.parent);
      });

    // Transition exiting nodes to the parent's new position.
    let linkExit = link
      .exit()
      .transition()
      .duration(this.state.duration)
      .attr('d', (d) => {
        let o = { x: source.x, y: source.y };
        return this.diagonal(o, o);
      })
      .remove();

    d3.selectAll('.tree-link')
      .style('stroke', (d) => {
        if (typeof d === 'undefined') return;

        if (d.animated && !d.path_color) return d.fill;
        if (d.path_color) return d.path_color;

        return 'gray';
      })
      .style('stroke-width', (d) => {
        if (typeof d === 'undefined') return;

        if (d.path_color) {
          return '15px';
        } else {
          return 10;
        }
      })
      .each(function (d) {
        if (d.animated) {
          d3.select(this).classed('animate', true);
        } else {
          d3.select(this).classed('animate', false);
        }
      });

    // Stash the old positions for transition.
    nodes.forEach((d) => {
      d.x0 = d.x;
      d.y0 = d.y;
    });
  };

  showCloseBtn = () => {
    this.setState({
      closeBtn: (
        <button className="searchButton closeButton" onClick={this.resetSearch}>
          <CloseIcon color="action" />
        </button>
      ),
    });
  };

  hideCloseBtn = () => {
    this.setState({ closeBtn: null });
  };
}

export default Tree;

/*
    Copyright (c) 2013-2016, Rob Schmuecker
    All rights reserved.

    Redistribution and use in source and binary forms, with or without
    modification, are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright notice, this
      list of conditions and the following disclaimer.

    * Redistributions in binary form must reproduce the above copyright notice,
      this list of conditions and the following disclaimer in the documentation
      and/or other materials provided with the distribution.

    * The name Rob Schmuecker may not be used to endorse or promote products
      derived from this software without specific prior written permission.

    THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
    AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
    IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
    DISCLAIMED. IN NO EVENT SHALL MICHAEL BOSTOCK BE LIABLE FOR ANY DIRECT,
    INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
    BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
    DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
    OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
    NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
    EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
  */
