import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BlogLandingPage from './pages/Blog/BlogLandingPage';
import AdminLogin from './pages/Admin/AdminLogin';
import PrivateRoute from './routes/PrivateRoute';
import BlogPosts from './pages/Admin/BlogPosts';
import { useThemeStore } from './store/themeStore';
import { useEffect } from 'react';
import Test2 from './pages/Admin/Test2';
import Test3 from './pages/Admin/Test3';
import Test5 from './pages/Admin/Test5';
import Test6 from './pages/Admin/Test6';
import Test7 from './pages/Admin/Test7';
import BlogPage from './pages/Blog/BlogPage';
import { useAuthStore } from './store/useAuthStore';

function App() {
  const { theme } = useThemeStore();
  const { fetchProfile } = useAuthStore();

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
  }, [theme]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);
  
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Router>
        <Routes>
          <Route path='/' element={<BlogLandingPage/>}/>
          <Route path='/:slug' element={<BlogPage/>}/>
          <Route path='/test2' element={<Test2/>}/>
          <Route path='/test3' element={<Test3/>}/>
          <Route path='/test7' element={<Test7/>}/>
          
          {/* Admin routes */}
          <Route element={<PrivateRoute/>}>
            <Route path='/admin/overview' element={<Test5/>}/>
            <Route path='/admin/posts' element={<BlogPosts/>}/>
            <Route path='/admin/create' element={<Test6/>}/>
            <Route path='/admin/profile' element={<Test2/>}/>
            <Route path='/admin/comments' element={<Test3/>}/>
          </Route>

          <Route path='/admin-login' element={<AdminLogin/>}/>
        </Routes>
      </Router>
    </div>
  )
}

export default App
