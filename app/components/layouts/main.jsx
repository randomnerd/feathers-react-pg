import React from 'react';
import {Decorator as Cerebral} from 'cerebral-react';
import HomePage from 'components/home';
import PostsPage from 'components/posts';
import PostPage from 'components/post';

@Cerebral({
  page: ['page'],
  title: ['title'],
  user: ['user']
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

  renderLoginForm() {
    return (
      <form onSubmit={this.login.bind(this)}>
        <input ref="username" placeholder="username" />
        <input type="password" ref="password" placeholder="password" />
        <input type="submit"/>
      </form>
    );
  }

  renderGreeting() {
    return (
      <span>
        Hello, {this.props.user.username}
        <button onClick={this.logout.bind(this)}>Log out</button>
      </span>
    );
  }

  logout(e) {
    if (e) e.preventDefault();
    this.props.signals.feathers.logout();
  }

  login(e) {
    if (e) e.preventDefault();
    this.props.signals.feathers.login({
      username: this.refs.username.value,
      password: this.refs.password.value
    });
  }

  render() {
    return (
      <div>
        {this.renderTitle()}
        {this.renderNavbar()}
        {this.props.user ? this.renderGreeting() : this.renderLoginForm()}
        {this.getPageComponent()}
      </div>
    );
  }
}
