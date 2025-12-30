import { Toaster } from 'react-hot-toast';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BlogLandingPage from './pages/Blog/BlogLandingPage';
import BlogPostView from './pages/Blog/BlogPostView';
import PrivateRoute from './routes/PrivateRoute';
import Dashboard from './pages/Admin/Dashboard';
import BlogPosts from './pages/Admin/BlogPosts';
import BlogPostEditor from './pages/Admin/BlogPostEditor';
// import Profile from './pages/Admin/Profile';
import { useThemeStore } from './store/themeStore';
import { useEffect } from 'react';
import { useAuthStore } from './store/useAuthStore';
import axiosInstance from './utils/axiosInstance';
import { API_PATHS } from './utils/apiPaths';
import ProtectedRoute from './components/layouts/ProtectedRoute';
import LandingPage from './pages/Blog/LandingPage';
import BlogPage from './pages/Blog/BlogPage';
import EditorPage from './pages/Admin/EditorPage';
import ProfilePage from './pages/Admin/ProfilePage';
import CommentsPage from './pages/Admin/CommentsPage';

function App() {

  const { theme } = useThemeStore();
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark'){
      root.classList.add('dark');
    }
    else {
      root.classList.add('light');
    }
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
          <Route path='/:slug' element={<BlogPage/>}/>
          {/*<Route path='/test2' element={<Test2/>}/>*/}
          {/*<Route path='/test3' element={<Test3/>}/>*/}
          {/*<Route path='/test4' element={<Test4/>}/>*/}
          {/*<Route path='/test7' element={<Test7/>}/>*/}
          
          {/* Admin routes */}
          <Route element={<ProtectedRoute/>}>
            <Route path='/admin/overview' element={<Dashboard/>}/>
            <Route path='/admin/posts' element={<BlogPosts/>}/>
            <Route path='/admin/create' element={<EditorPage/>}/>
            <Route path='/admin/profile' element={<ProfilePage/>}/>
            <Route path='/admin/comments' element={<CommentsPage/>}/>

            {/* <Route path='/admin/edit/:postSlug' element={<BlogPostEditor isEdit={true}/>}/> */}
          </Route>

          {/*<Route path='/admin-login' element={<AdminLogin/>}/>*/}

        </Routes>
      </Router>
    </div>
  )
}

export default App
