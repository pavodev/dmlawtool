import { Grid } from '@material-ui/core';
import React from 'react';

import './About.scss';

class About extends React.Component {
  render() {
    return (
      <div>
        <Grid
          container
          direction="column"
          alignItems="center"
          justify="center"
          className="container"
        >
          <Grid>
            <h1>About us</h1>
            <p>
              DMLawTool has been developed by the Università della Svizzera italiana (USI) in
              collaboration with the University of Neuchâtel (UNINE) within the P-5 programme
              “Scientific information” of swissuniversities. The tool has been officially launched
              at the end of March, 2021, and will be available to everyone for free from the{' '}
              <a
                href="https://ccdigitallaw.ch/index.php/english"
                target="_blank"
                rel="noopener noreferrer"
              >
                CCdigitallaw.ch
              </a>{' '}
              platform.
            </p>
            <h3>
              <b>Coordination:</b>
            </h3>
            <p>
              <a
                href="https://search.usi.ch/en/people/9fd3744cedf324e92e975988ae7e6d58/picco-schwendener-anna"
                target="_blank"
                rel="noopener noreferrer"
              >
                Dr. Anna Picco-Schwendener
              </a>{' '}
              (USI, eLab,{' '}
              <a
                href="https://ccdigitallaw.ch/index.php/english"
                target="_blank"
                rel="noopener noreferrer"
              >
                CCdigitallaw.ch
              </a>
              ) with the support of{' '}
              <a
                href="https://search.usi.ch/people/61cb45bbf00a7cb11e9a92ce0427566d/trifkovic-branislava"
                target="_blank"
                rel="noopener noreferrer"
              >
                Branislava Trifkovic
              </a>{' '}
              (USI, eLab)
            </p>
            <h3>
              <b>Content development:</b>
            </h3>
            <p>
              <b>Legal aspects</b>:<br></br>
              <a
                href="https://search.usi.ch/en/people/a9eb2f1f9487f36a65cf66ca11cf6faf/marazza-suzanna"
                target="_blank"
                rel="noopener noreferrer"
              >
                Suzanna Marazza
              </a>{' '}
              (USI, eLab, CCdigitallaw) and{' '}
              <a
                href="https://www.unine.ch/droit/home/enseignants_1/assistantes/yves-bauer.html"
                target="_blank"
                rel="noopener noreferrer"
              >
                Yves Bauer
              </a>{' '}
              (UNINE) under the scientific supervision of{' '}
              <a
                href="https://www.unine.ch/nathalie.tissot/home.html"
                target="_blank"
                rel="noopener noreferrer"
              >
                Prof. Nathalie Tissot
              </a>{' '}
              (UNINE) <br></br>
              <br></br>
              <b>Narrative design and content organization:</b>
              <br></br>
              <a
                href="https://search.usi.ch/en/people/9fd3744cedf324e92e975988ae7e6d58/picco-schwendener-anna"
                target="_blank"
                rel="noopener noreferrer"
              >
                Dr. Anna Picco-Schwendener
              </a>{' '}
              with the support of{' '}
              <a
                href="https://search.usi.ch/people/61cb45bbf00a7cb11e9a92ce0427566d/trifkovic-branislava"
                target="_blank"
                rel="noopener noreferrer"
              >
                Branislava Trifkovic
              </a>{' '}
              and{' '}
              <a
                href="https://search.usi.ch/en/people/a9eb2f1f9487f36a65cf66ca11cf6faf/marazza-suzanna"
                target="_blank"
                rel="noopener noreferrer"
              >
                Suzanna Marazza
              </a>{' '}
              (USI, eLab, CCdigitallaw)
              <br></br>
              <br></br>
              <b>Technical implementation:</b>
              <br></br>{' '}
              <a
                href="https://search.usi.ch/people/6bd65192ce96d221cf29e3457a86b412/pavic-ivan"
                target="_blank"
                rel="noopener noreferrer"
              >
                Ivan Pavic
              </a>{' '}
              (USI, eLab) <br></br>
              <br></br>
              <b>Graphic design:</b>
              <br></br>
              <a
                href="https://search.usi.ch/en/people/5ce5f550b7261cc6a8dfda3e142eb58c/pera-mattia"
                target="_blank"
                rel="noopener noreferrer"
              >
                Mattia Pera
              </a>{' '}
              (USI, eLab)
            </p>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default About;
