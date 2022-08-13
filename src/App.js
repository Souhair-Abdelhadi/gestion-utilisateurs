import {BrowserRouter as Router,Route,Routes} from "react-router-dom"
import Index from './pages/index'
import ListeOfUsers from "./pages/listeOfUsers";
import AddUser from "./pages/add/addUser";
import UpdateUser from "./pages/update/updateUser";
import Profile from "./pages/profile";
function App() {
  return (
      <Router>
        <Routes>
          <Route path="/"  element={<Index /> } />
        </Routes>
        <Routes>
          <Route path="/users_liste"  element={<ListeOfUsers /> } />
        </Routes>
        <Routes>
          <Route path="/addUser"  element={<AddUser /> } />
        </Routes>
        <Routes>
          <Route path="/updateUser/:id"  element={<UpdateUser /> } />
        </Routes>
        <Routes>
          <Route path="/profile"  element={<Profile /> } />
        </Routes>
      </Router>
  );
}

export default App;
