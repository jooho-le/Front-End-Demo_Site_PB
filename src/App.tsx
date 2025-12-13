import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Provider as ReduxProvider } from 'react-redux';
import MainLayout from './components/layout/MainLayout';
import Home from './pages/Home';
import Popular from './pages/Popular';
import Search from './pages/Search';
import Wishlist from './pages/Wishlist';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import { AuthProvider } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext';
import AuthModal from './components/auth/AuthModal';
import ProtectedRoute from './routes/ProtectedRoute';
import { store } from './store';

function App() {
  return (
    <BrowserRouter>
      <ReduxProvider store={store}>
        <AuthProvider>
          <WishlistProvider>
            <MainLayout>
              <Routes>
                <Route element={<ProtectedRoute />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/popular" element={<Popular />} />
                  <Route path="/search" element={<Search />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                </Route>
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
              </Routes>
              <AuthModal />
            </MainLayout>
          </WishlistProvider>
        </AuthProvider>
      </ReduxProvider>
    </BrowserRouter>
  );
}

export default App;
