import React from 'react';
import {Decorator as Cerebral} from 'cerebral-react';

import MainLayout from 'components/layouts/main';
import AdminLayout from 'components/layouts/admin';

@Cerebral({
  layout: ['layout'],
  loading: ['loading']
})
export default class App extends React.Component {
  renderLoading() {
    return (
      <div>Loading...</div>
    );
  }

  render() {
    if (this.props.loading) return this.renderLoading();

    switch (this.props.layout) {
    case 'admin':
      return <AdminLayout/>;
    default:
      return <MainLayout/>;
    }
  }
}
