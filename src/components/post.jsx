import React from 'react';
import {Decorator as Cerebral} from 'cerebral-react';

@Cerebral({
  post: ['post']
})
export default class PostPage extends React.Component {
  render() {
    let {post} = this.props;
    return (
      <div>
        <h1>{post.title} (#{post.id})</h1>
        <p>{post.body}</p>
        <time>{post.createdAt}</time>
      </div>
    );
  }
}
