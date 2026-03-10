import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'react-toastify/dist/ReactToastify.css';  // thêm dòng này
import App from './App.jsx'
import { BrowserRouter } from "react-router-dom"
import { AuthProvider } from './context/AuthContext.jsx'
<<<<<<< HEAD
=======

>>>>>>> e69123e557f4b216ae6845ca95fd19a786e37a89
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
)