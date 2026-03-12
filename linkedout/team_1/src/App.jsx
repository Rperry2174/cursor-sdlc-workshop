import Navbar from './components/Navbar'
import LeftSidebar from './components/LeftSidebar'
import Feed from './components/Feed'
import RightSidebar from './components/RightSidebar'
import './App.css'

function App() {
  return (
    <div>
      <Navbar />
      <hr />

      <table width="100%" border="1" cellPadding="10">
        <tbody>
          <tr valign="top">
            <td width="20%">
              <LeftSidebar />
            </td>
            <td width="50%">
              <Feed />
            </td>
            <td width="30%">
              <RightSidebar />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default App
