import React from 'react';
import Home from 'components/home';
import {Decorator as Cerebral} from 'cerebral-react';

@Cerebral({
  page: ['page']
})
export default class MainLayout extends React.Component {
  getPageComponent() {
    switch (this.props.page) {
    default:
      return <Home/>;
    };
  }

  render() {
    return (
      <div>
        {this.getPageComponent()}
      </div>
    );
  }
}
