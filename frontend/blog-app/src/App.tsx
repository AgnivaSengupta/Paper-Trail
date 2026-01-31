import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Admin/Dashboard';
import BlogPosts from './pages/Admin/BlogPosts';
import { useThemeStore } from './store/themeStore';
import { useEffect } from 'react';
import { useAuthStore } from './store/useAuthStore';
import ProtectedRoute from './components/layouts/ProtectedRoute';
import LandingPage from './pages/Blog/LandingPage';
import EditorPage from './pages/Admin/EditorPage';
import CommentsPage from './pages/Admin/CommentsPage';
import BlogPage2 from './pages/Blog/BlogPage2';
import Profile2 from './pages/Admin/Profile2';

function App() {

  const { theme } = useThemeStore();
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark'); 
    root.classList.add(theme);
  }, [theme]);

  const { setUser } = useAuthStore();
  useEffect(() => {
    setUser()
  }, [setUser]);
  
  return (
    <div className="text-5xl t">
      

      <Router>
        <Routes>
          <Route path='/' element={<LandingPage/>}/>
          <Route path='/:slug' element={<BlogPage2/>}/>
          
          {/* Admin routes */}
          <Route element={<ProtectedRoute/>}>
            <Route path='/admin/overview' element={<Dashboard/>}/>
            <Route path='/admin/posts' element={<BlogPosts/>}/>
            <Route path='/admin/create' element={<EditorPage/>}/>
            <Route path='/admin/profile' element={<Profile2/>}/>
            <Route path='/admin/comments' element={<CommentsPage/>}/>
          </Route>

        </Routes>
      </Router>
    </div>
  )
}

export default App
