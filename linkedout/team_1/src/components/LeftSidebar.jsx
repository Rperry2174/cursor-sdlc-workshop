import { currentUser, groups, savedItems, events } from '../data/mockData'

function LeftSidebar() {
  return (
    <div>
      <h3>My Profile</h3>
      <p>[PROFILE PHOTO]</p>
      <b>{currentUser.name}</b><br />
      {currentUser.headline}<br />
      {currentUser.location}<br />
      <hr />
      <b>Profile viewers:</b> {currentUser.profileViewers.toLocaleString()}<br />
      <b>Post impressions:</b> {currentUser.postImpressions.toLocaleString()}<br />
      <hr />
      <b>Connections:</b> {currentUser.connections}<br />
      <b>Following:</b> {currentUser.following}<br />
      <b>Followers:</b> {currentUser.followers}<br />
      <hr />

      <h4>My Groups</h4>
      <ul>
        {groups.map(group => (
          <li key={group.id}>
            {group.name} ({group.members.toLocaleString()} members)
          </li>
        ))}
      </ul>

      <h4>Saved Items</h4>
      <ul>
        {savedItems.map(item => (
          <li key={item.id}>
            {item.title} - saved {item.savedAgo}
          </li>
        ))}
      </ul>

      <h4>Events</h4>
      <ul>
        {events.map(event => (
          <li key={event.id}>
            {event.name} - {event.date}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default LeftSidebar
