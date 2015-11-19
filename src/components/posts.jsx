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

  updatePost(post, e) {
    e.preventDefault();
    let query = { id: post.id };
    let model = { title: this.refs.title.value };
    this.props.signals.updatePost({query, model});
  }

  removePost(post, e) {
    e.preventDefault();
    let query = { id: post.id };
    this.props.signals.removePost({query});
  }

  renderPost(post) {
    return (
      <li key={post.id}>
        <a href={"/posts/" + post.id}>{post.title}</a>
        <button onClick={this.updatePost.bind(this, post)}>UPD</button>
        <button onClick={this.removePost.bind(this, post)}>&times;</button>
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
