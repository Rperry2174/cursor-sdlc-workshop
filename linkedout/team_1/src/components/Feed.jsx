import { posts } from '../data/mockData'
import Post from './Post'

function Feed() {
  return (
    <div>
      <h3>Create a Post</h3>
      <textarea rows="3" cols="60" placeholder="What do you want to talk about?"></textarea><br />
      <button>📷 Photo</button>
      {' '}
      <button>🎥 Video</button>
      {' '}
      <button>📝 Write Article</button>
      {' '}
      <button>Post</button>
      <hr />

      <p>
        <b>Sort by:</b>{' '}
        <select>
          <option>Top</option>
          <option>Recent</option>
        </select>
      </p>

      {posts.map(post => (
        <Post key={post.id} post={post} />
      ))}

      <p><a href="#">Show more posts...</a></p>
    </div>
  )
}

export default Feed
