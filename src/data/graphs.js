import * as d3 from 'd3v4';

export const c2Nodes = [
  {
    id: '1',
    label: '<h3>Human</h3>',
    class: 'node',
    title: 'Human',
    labelType: 'html',
    config: {
      shape: 'rect',
    },
  },
  {
    id: '2',
    label: '<h3>Original</h3>',
    class: 'node',
    title: 'Original',
    labelType: 'html',
    // shape: 'rect',
  },
  {
    id: '3',
    label: '<h3>Express</h3>',
    class: 'node',
    title: 'Express',
    labelType: 'html',
    // shape: 'rect',
  },

  {
    id: '4',
    label: '<h3>Ownership</h3>',
    class: 'node',
    title: 'Ownership',
    labelType: 'html',
  },
  {
    id: '5',
    label: '<h3>Exit</h3>',
    class: 'node',
    title: 'Exit',
    labelType: 'html',
  },
  {
    id: '6',
    label: '<h3>CC open educational resources</h3>',
    class: 'node',
    title: 'CC open educational resources',
    labelType: 'html',
  },
  {
    id: '7',
    label: '<h3>CC more restrictive licences</h3>',
    class: 'node',
    title: 'CC more restrictive licences',
    labelType: 'html',
  },
  {
    id: '8',
    label: '<h3>Sheet with licences, 1, 2, 3</h3>',
    class: 'node',
    title: 'Sheet with licences, 1, 2, 3',
    labelType: 'html',
  },
  {
    id: '9',
    label: '<h3>Sheet with licences, 4, 5, 6</h3>',
    class: 'node',
    title: 'Sheet with licences, 4, 5, 6',
    labelType: 'html',
  },
];

export const c2Links = [
  {
    source: '1',
    target: '4',
    label: 'TO',
    config: {
      // arrowheadStyle: 'display: none',
      curve: d3.curveBasis,
    },
  },
  {
    source: '2',
    target: '4',
    label: 'TO',
    config: {
      // arrowheadStyle: 'display: none',
      curve: d3.curveBasis,
    },
  },
  {
    source: '3',
    target: '4',
    label: 'TO',
    config: {
      // arrowheadStyle: 'display: none',
      curve: d3.curveBasis,
    },
  },
  {
    source: '3',
    target: '5',
    label: 'TO',
    config: {
      // arrowheadStyle: 'display: none',
      curve: d3.curveBasis,
    },
  },
  {
    source: '4',
    target: '6',
    label: 'TO',
    config: {
      // arrowheadStyle: 'display: none',
      curve: d3.curveBasis,
    },
  },
  {
    source: '4',
    target: '7',
    label: 'TO',
    config: {
      // arrowheadStyle: 'display: none',
      curve: d3.curveBasis,
    },
  },
  {
    source: '6',
    target: '8',
    label: 'TO',
    config: {
      // arrowheadStyle: 'display: none',
      curve: d3.curveBasis,
    },
  },
  {
    source: '7',
    target: '9',
    label: 'TO',
    config: {
      // arrowheadStyle: 'display: none',
      curve: d3.curveBasis,
    },
  },
];

export const c1Nodes = [
  {
    id: '1',
    label: '<h3>Original</h3>',
    class: 'node',
    title: 'Original',
    labelType: 'html',
    config: {
      shape: 'rect',
    },
  },
  {
    id: '1',
    label: '<h3>Original</h3>',
    class: 'node',
    title: 'Original',
    labelType: 'html',
    shape: 'rect',
  },
];
