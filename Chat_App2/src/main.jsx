import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router'
import "dropzone/dist/dropzone.css"
import { Provider as ReduxProvider } from 'react-redux'
import { store } from './redux/store.js'
import { Bounce, ToastContainer } from 'react-toastify'

createRoot(document.getElementById('root')).render(
  <ReduxProvider store={store}>
    <BrowserRouter>
      <App />
      <ToastContainer
      position="top-right"
      autoClose={2000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover={false}
      theme="colored"
      transition={Bounce} />
    </BrowserRouter>
  </ReduxProvider>
)
