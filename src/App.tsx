import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from '@components/layout/Navbar';
import Footer from '@components/layout/Footer';
import Home from '@pages/Home';
// import Projects from '@pages/Projects';
// import ProjectDetail from '@pages/ProjectDetail';
import About from '@pages/About';
import Contact from '@pages/Contact';
import Art from '@pages/Art';
import NotFound from '@pages/NotFound';
import { ThemeProvider } from '@components/context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className='min-h-screen bg-dark-900 text-white'>
          <Navbar />
          <main className='flex-1'>
            <AnimatePresence mode='wait'>
              <Routes>
                <Route path='/' element={<Home />} />
                {/* Projects routes hidden for soft launch */}
                {/* <Route path='/projects' element={<Projects />} /> */}
                {/* <Route path='/projects/:id' element={<ProjectDetail />} /> */}
                <Route path='/about' element={<About />} />
                <Route path='/contact' element={<Contact />} />
                <Route path='/art' element={<Art />} />
                <Route path='*' element={<NotFound />} />
              </Routes>
            </AnimatePresence>
          </main>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
