import React, { Component } from 'react';
import OrganizationCard from './OrganizationCard';

import styles from './ResultList.module.css';


export class ResultList extends Component {
  render() {
    return(
      <div>
        <div className={styles.results}>
      
          { this.props.data.map(org => <OrganizationCard key={org.id} organization={org} haveCoords={this.props.haveCoords} currentPos={this.props.currentPos}/> ) }
          </div>

      </div>
    );
  }
}

export default ResultList;
