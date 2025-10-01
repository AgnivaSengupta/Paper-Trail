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

function App() {

  return (
    <div className="text-5xl t">
      <Router>
        <Routes>
          <Route path='/' element={<BlogLandingPage/>}/>
          <Route path='/:slug' element={<BlogPostView/>}/>

          {/* Admin routes */}
          {/* <Route element={<PrivateRoute  allowedRole={'admin'}/>}> */}
            <Route path='/admin/overview' element={<Dashboard/>}/>
            <Route path='/admin/posts' element={<BlogPosts/>}/>
            <Route path='/admin/create' element={<BlogPostEditor/>}/>
            <Route path='/admin/profile' element={<Profile/>}/>

            <Route path='/admin/edit/:postSlug' element={<BlogPostEditor isEdit={true}/>}/>
          {/* </Route> */}

          <Route path='/admin-login' element={<AdminLogin/>}/>

        </Routes>
      </Router>
    </div>
  )
}

export default App
