import { Route, Routes } from 'react-router-dom';
import Chat from './pages/chat/Chat';
import Login from './pages/Login/Login';
import SignUp from './pages/SignUp/SignUp';
import NotFound from './pages/NotFound'
import PrivateRoute from './components/templates/PrivateRoute'

function App() {
  return (
    <Routes>
      <Route path='/' element={<PrivateRoute element={Chat} />} />
      <Route path='/login' element={<Login />} />
      <Route path='/sign-up' element={<SignUp />} />
      <Route path='*' element={<NotFound />} />
    </Routes>
  );
}

export default App;
