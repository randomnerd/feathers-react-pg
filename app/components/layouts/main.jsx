import React from 'react';
import {Decorator as Cerebral} from 'cerebral-react';
import HomePage from 'components/home';
import PostsPage from 'components/posts';
import PostPage from 'components/post';

@Cerebral({
  page: ['page'],
  title: ['title']
})
export default class MainLayout extends React.Component {
  getPageComponent() {
    switch (this.props.page) {
    case 'posts':
      return <PostsPage/>;
    case 'post':
      return <PostPage/>;
    default:
      return <HomePage/>;
    };
  }

  renderTitle() {
    return <title>{this.props.title}</title>;
  }

  renderNavbar() {
    return (
      <ul>
        <li><a href="/">Home page</a></li>
        <li><a href="/posts">Posts page</a></li>
        <li><a href="/admin">Admin home</a></li>
      </ul>
    );
  }

  render() {
    return (
      <div>
        {this.renderTitle()}
        {this.renderNavbar()}
        {this.getPageComponent()}
      </div>
    );
  }
}
