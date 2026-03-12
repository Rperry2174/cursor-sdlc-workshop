import {
  news,
  games,
  messages,
  jobs,
  notifications,
  suggestedConnections,
  promoted,
} from '../data/mockData'

function RightSidebar() {
  return (
    <div>
      {/* News */}
      <h3>LinkedOut News</h3>
      <b>Top Stories</b>
      <ul>
        {news.map(item => (
          <li key={item.id}>
            <b>{item.title}</b><br />
            <small>{item.timeAgo} &bull; {item.readers.toLocaleString()} readers</small>
          </li>
        ))}
      </ul>
      <a href="#">Show more →</a>
      <hr />

      {/* Games */}
      <h3>🎮 Today&apos;s Games</h3>
      <table border="1" cellPadding="5" width="100%">
        <tbody>
          {games.map(game => (
            <tr key={game.id}>
              <td>
                {game.emoji} <b>{game.name} #{game.number}</b><br />
                <small>{game.subtitle}</small>
              </td>
              <td><a href="#">Play →</a></td>
            </tr>
          ))}
        </tbody>
      </table>
      <hr />

      {/* Messaging */}
      <h3>💬 Messaging</h3>
      <table border="1" cellPadding="5" width="100%">
        <tbody>
          {messages.map(msg => (
            <tr key={msg.id}>
              <td style={msg.unread ? { backgroundColor: '#ffffcc' } : {}}>
                <b>{msg.senderName}</b>
                {msg.unread && (
                  <small> ({msg.unreadCount ? `${msg.unreadCount} new` : 'unread'})</small>
                )}
                <br />
                <small>{msg.preview}</small><br />
                <small>{msg.timeAgo}</small>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <a href="#">Open all messages</a>
      <hr />

      {/* Jobs */}
      <h3>💼 Jobs For You</h3>
      <table border="1" cellPadding="5" width="100%">
        <tbody>
          {jobs.map(job => (
            <tr key={job.id}>
              <td>
                <b>{job.title}</b><br />
                {job.company} &bull; {job.location}<br />
                <small>{job.salary} &bull; Posted {job.postedAgo} &bull; {job.applicants} applicants</small><br />
                <small>💡 {job.connectionsAtCompany} connections work here</small><br />
                <button>Save</button>{' '}
                <button>{job.easyApply ? 'Easy Apply' : 'Apply'}</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <a href="#">See all job recommendations →</a>
      <hr />

      {/* Notifications */}
      <h3>🔔 Notifications</h3>
      <ul>
        {notifications.map(notif => (
          <li key={notif.id}>
            {notif.text} <small>({notif.timeAgo})</small>
          </li>
        ))}
      </ul>
      <a href="#">See all notifications →</a>
      <hr />

      {/* People You May Know */}
      <h3>👥 People You May Know</h3>
      <table border="1" cellPadding="5" width="100%">
        <tbody>
          <tr>
            {suggestedConnections.slice(0, 2).map(person => (
              <td key={person.id}>
                [PHOTO]<br />
                <b>{person.name}</b><br />
                <small>{person.headline}</small><br />
                <small>{person.mutualConnections} mutual connections</small><br />
                <button>+ Connect</button>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
      <hr />

      {/* Promoted */}
      <h3>Promoted</h3>
      <table border="1" cellPadding="5" width="100%">
        <tbody>
          <tr>
            <td>
              {promoted.image}<br />
              <b>{promoted.title}</b><br />
              <small>{promoted.description}</small><br />
              <button>Learn More</button>
            </td>
          </tr>
        </tbody>
      </table>

      <hr />
      <small>About &bull; Accessibility &bull; Help Center &bull; Privacy &bull; Terms &bull; Ad Choices &bull; Advertising &bull; Business Services</small><br />
      <small>LinkedOut Corporation &copy; 2025</small>
    </div>
  )
}

export default RightSidebar
