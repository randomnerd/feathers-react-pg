import React from 'react';
import {Decorator as Cerebral} from 'cerebral-react';

@Cerebral({
  posts: ['data', 'posts']
})
export default class PostsPage extends React.Component {
  submitPost(e) {
    e.preventDefault();
    let post = {
      title: this.refs.title.value
    };
    this.props.signals.createPost({model: post});
    this.refs.title.value = '';
    this.refs.title.focus();
  }

  renderPost(post) {
    return (
      <li key={post.id}>
        <a href={"/posts/" + post.id}>{post.title}</a>
      <button onClick={this.props.signals.removePost.bind(this, {model: post})}>&times;</button>
      </li>
    );
  }

  render() {
    let posts = this.props.posts || [];
    return (
      <div>
        Posts page
        <form onSubmit={this.submitPost.bind(this)}>
          <input ref="title"/>
          <input type="submit"/>
        </form>
        <ul>
          {posts.map((post) => { return this.renderPost(post); })}
        </ul>
      </div>
    );
  }
}
