import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Onboarding from "./pages/Onboarding";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Profile from "./pages/Profile";
import { useCookies } from 'react-cookie'
import SwipePage from "./pages/SwipePage";

function App() {

  const [cookies] = useCookies(['user'])

  const authToken = cookies.AuthToken

  return (
    <BrowserRouter>
      <Routes>
        <Route path={"/"} element={<Home />} />
        {authToken && <Route path="/dashboard" element={<Dashboard />} />}
        {authToken && <Route path="/swipepage" element={<SwipePage />} />}
        {authToken && <Route path="/onboarding" element={<Onboarding />} />}
        {authToken && <Route path={"/profile"} element={<Profile />} />}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
