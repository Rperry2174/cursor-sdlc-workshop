function Post({ post }) {
  return (
    <div>
      <table border="1" cellPadding="5" width="100%">
        <tbody>
          <tr>
            <td>
              <b>{post.authorName}</b> &bull; {post.connectionDegree}<br />
              <i>{post.authorHeadline}</i><br />
              <small>{post.timeAgo} &bull; 🌐</small>

              <p>{post.content}</p>

              {post.extraContent && (
                <p style={{ whiteSpace: 'pre-line' }}>{post.extraContent}</p>
              )}

              {/* Poll */}
              {post.type === 'poll' && post.pollOptions && (
                <div>
                  <table border="1" width="80%">
                    <tbody>
                      {post.pollOptions.map((option, i) => (
                        <tr key={i}>
                          <td>⬜ {option.text} ({option.percentage}%)</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <small>{post.pollVotes.toLocaleString()} votes &bull; {post.pollTimeLeft}</small>
                </div>
              )}

              {/* Shared Article */}
              {post.type === 'article' && post.article && (
                <table border="1" cellPadding="5" width="100%" style={{ backgroundColor: '#f0f0f0' }}>
                  <tbody>
                    <tr>
                      <td>
                        {post.article.thumbnail}<br />
                        <b>{post.article.title}</b><br />
                        <small>{post.article.source} &bull; {post.article.readTime}</small>
                      </td>
                    </tr>
                  </tbody>
                </table>
              )}

              {/* Image placeholder */}
              {post.image && <p>{post.image}</p>}

              {/* Engagement stats */}
              <p>
                {post.reactions
                  ? post.reactions.join(' ') + ' '
                  : '👍 '}
                {post.likedBy
                  ? `${post.likedBy} and ${post.likes.toLocaleString()} others`
                  : `${post.likes.toLocaleString()} others`}
                &nbsp;&nbsp;&nbsp;
                {post.comments} comments
                &nbsp;&nbsp;&nbsp;
                {post.reposts} reposts
              </p>

              {/* Action buttons */}
              <button>👍 Like</button>
              {' '}
              <button>💬 Comment</button>
              {' '}
              <button>🔄 Repost</button>
              {' '}
              <button>📤 Send</button>

              {/* Top Comments */}
              {post.topComments && post.topComments.length > 0 && (
                <div>
                  <hr />
                  <b>Top Comments:</b><br /><br />
                  {post.topComments.map((comment, i) => (
                    <div key={i}>
                      <b>{comment.authorName}</b> - <i>{comment.authorHeadline}</i><br />
                      &ldquo;{comment.content}&rdquo;<br />
                      👍 {comment.likes}
                      &nbsp;&nbsp;
                      💬 Reply
                      {comment.replies > 0 && ` (${comment.replies} replies)`}
                      <br /><br />
                    </div>
                  ))}
                  {post.comments > 5 && (
                    <a href="#">Show {post.comments - post.topComments.length} more comments...</a>
                  )}
                </div>
              )}
            </td>
          </tr>
        </tbody>
      </table>
      <br />
    </div>
  )
}

export default Post
