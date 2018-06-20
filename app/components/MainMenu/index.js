import React from 'react';
import { FormattedMessage } from 'react-intl';
import { NavLink } from 'react-router-dom';

import messages from './messages';
import './style.scss';

class MainMenu extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div className="row main-menu-component">
        <div className="container type-nav-primair">
          <nav>
            <ul className="links horizontal">
              <li>
                <NavLink to="/">
                  <span className="linklabel">
                    <FormattedMessage {...messages.home} />
                  </span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/incident">
                  <span className="linklabel">
                    <FormattedMessage {...messages.incident} />
                  </span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/admin">
                  <span className="linklabel">
                    <FormattedMessage {...messages.admin} />
                  </span>
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    );
  }
}

export default MainMenu;