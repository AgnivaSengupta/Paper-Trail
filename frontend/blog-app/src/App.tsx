import { Toaster } from 'react-hot-toast';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BlogLandingPage from './pages/Blog/BlogLandingPage';
import BlogPostView from './pages/Blog/BlogPostView';
import AdminLogin from './pages/Admin/AdminLogin';
import PrivateRoute from './routes/PrivateRoute';
import Dashboard from './pages/Admin/Dashboard';
import BlogPosts from './pages/Admin/BlogPosts';
import BlogPostEditor from './pages/Admin/BlogPostEditor';
import Profile from './pages/Admin/Profile';
import { useThemeStore } from './store/themeStore';
import { useEffect } from 'react';
import Test from './pages/Admin/Test';
import Comments from './pages/Admin/Comments';
import Test2 from './pages/Admin/Test2';
import Test3 from './pages/Admin/Test3';
// import Test4 from './pages/Admin/Test4';
import Test5 from './pages/Admin/Test5';
import Test6 from './pages/Admin/Test6';
import Test7 from './pages/Admin/Test7';

function App() {

  const { theme } = useThemeStore();
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark'){
      root.classList.add('light');
    }
    else {
      root.classList.add('light');
    }
  }, [theme]);

  return (
    <div className="text-5xl t">
      

      <Router>
        <Routes>
          <Route path='/' element={<BlogLandingPage/>}/>
          <Route path='/:slug' element={<BlogPostView/>}/>
          <Route path='/test2' element={<Test2/>}/>
          <Route path='/test3' element={<Test3/>}/>
          {/*<Route path='/test4' element={<Test4/>}/>*/}
          <Route path='/test7' element={<Test7/>}/>
          
          {/* Admin routes */}
          <Route /*element={<PrivateRoute/>}*/>
            <Route path='/admin/overview' element={<Test5/>}/>
            <Route path='/admin/posts' element={<BlogPosts/>}/>
            <Route path='/admin/create' element={<Test6/>}/>
            <Route path='/admin/profile' element={<Test2/>}/>
            <Route path='/admin/comments' element={<Test3/>}/>

            {/* <Route path='/admin/edit/:postSlug' element={<BlogPostEditor isEdit={true}/>}/> */}
          </Route>

          <Route path='/admin-login' element={<AdminLogin/>}/>

        </Routes>
      </Router>
    </div>
  )
}

export default App
