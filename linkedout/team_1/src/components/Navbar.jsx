import { messages, notifications } from '../data/mockData'

function Navbar() {
  const unreadMessages = messages.filter(m => m.unread).length
  const notifCount = notifications.length

  return (
    <div>
      <h1>LinkedOut</h1>
      <a href="#">Home</a>
      {' | '}
      <a href="#">My Network</a>
      {' | '}
      <a href="#">Jobs</a>
      {' | '}
      <a href="#">Messaging ({unreadMessages})</a>
      {' | '}
      <a href="#">Notifications ({notifCount})</a>
      {' | '}
      <a href="#">Me</a>
      {' | '}
      <a href="#">Games</a>
    </div>
  )
}

export default Navbar
