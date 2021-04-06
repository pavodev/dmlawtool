import { Grid } from '@material-ui/core';
import React from 'react';

import './Disclaimer.scss';

class Disclaimer extends React.Component {
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
            <h1>DMLawTool</h1>

            <h3>
              <b>About the DMLawTool:</b>
            </h3>
            <p>
              The DMLawTool is a decision-tree tool developed by the Università della Svizzera
              italiana in collaboration with the University of Neuchâtel within the P-5 program
              “Scientific Information” of swissuniversities. It is available under the CC-BY-SA 4.0
              license as an open source software.
              <br />
              The tool guides researchers working mainly in the fields of humanities and social
              sciences through the most relevant legal issues related to data management. At the end
              of the process, the tool proposes different solution approaches on what can be done
              with research data and how it can be archived in a repository.
            </p>
            <h3>
              <b>Disclaimer:</b>
            </h3>
            <p>
              This tool is a basic guide with the only purpose of giving a general understanding on
              the main legal aspects of Copyright and Data Protection according to Swiss
              legislations and to the European General Data Protection Regulation as of March 2021.{' '}
              <br />
              The tool is developed in a practical manner and it is written in a non-legal language.
              Its purpose is not to provide complete and tailored legal advice to the user’s case,
              but to help researchers identify legal issues, and highlight clues that users may
              consider or implement with the help of specialists when necessary.
              <br />
              If not indicated otherwise, the examples used are invented and have the only purpose
              of a better illustration of the information provided. All the information provided in
              this tool does not, and is not intended to, constitute legal or other professional
              advice.
              <br />
              The user of this tool acknowledges that each situation must be judged on a
              case-by-case basis and must seek legal advice from a competent attorney to resolve
              their specific case with respect to any particular legal matter.
            </p>
            <h3>
              <b>Copyright:</b>
            </h3>
            <p>
              All text in this tool, except third party contents (e.g. quotes), is published under
              the Creative Commons Attribution Share Alike 4.0 International License. To view a copy
              of this license, visit{' '}
              <a
                href="https://creativecommons.org/licenses/by-sa/4.0/"
                target="_blank"
                rel="noopener noreferrer"
              >
                this page.
              </a>
            </p>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default Disclaimer;
