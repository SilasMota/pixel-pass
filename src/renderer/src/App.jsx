import EncodePage from './pages/EncodePage'
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom'
// import Stegonography from './components/Stegonography'
import DecodePage from './pages/DecodePage'
import { KeyIcon, LockClosedIcon, LockOpenIcon } from '@heroicons/react/24/solid'
import { Navigate } from 'react-router-dom'
import logo from './assets/logo.png'
import { useState } from 'react'
import Login from './pages/Login'
function App() {
  const [passKey, setPassKey] = useState(null)
  // const ipcHandle = () => window.electron.ipcRenderer.send('ping')

  // eslint-disable-next-line react/prop-types
  const RequireAuth = ({ children }) => {
    return passKey ? children : <Navigate to="/login" />
  }

  return (
    <div className=" flex bg-slate-600 after:h-screen ">
      <Router>
        {passKey && (
          <div className="basis-1/6 bg-slate-700 rounded-r-md max-w-36">
            <ul className="pt-3 px-1">
              <li>
                <div className="flex justify-center items-center">
                  <img className="h-20" src={logo} />
                </div>
              </li>
              <Link to="/">
                <li className=" text-gray-50 text-center hover:cursor-pointer">
                  <div className="flex items-center justify-start space-x-3 p-3 rounded-md hover:bg-slate-500">
                    <LockOpenIcon className="w-5 h-5" />
                    <span>Decode</span>
                  </div>
                </li>
              </Link>
              <Link to="/encode">
                <li className=" text-gray-50 text-center hover:cursor-pointer">
                  <div className="flex items-center justify-start space-x-3 p-3 rounded-md hover:bg-slate-500">
                    <LockClosedIcon className="w-5 h-5" />
                    <span>Encode</span>
                  </div>
                </li>
              </Link>
              <Link to="/login">
                <li className=" text-gray-50 text-center hover:cursor-pointer">
                  <div className="flex items-center justify-start space-x-1 p-3 rounded-md hover:bg-slate-500">
                    <KeyIcon className="w-5 h-5" />
                    <span>Change Key</span>
                  </div>
                </li>
              </Link>
              {/* <Link to="/test">
              <li className=" text-gray-50 text-center hover:cursor-pointer">
                <div className="flex items-center justify-start space-x-3 p-3 rounded-md hover:bg-slate-500">
                  <ExclamationTriangleIcon className="w-5 h-5" />
                  <span>TEST</span>
                </div>
              </li>
            </Link> */}
            </ul>
          </div>
        )}
        <div className="basis-5/6 mx-auto">
          <Routes>
            <Route
              path="/encode"
              element={
                <RequireAuth>
                  <EncodePage passKey={passKey} />
                </RequireAuth>
              }
            />
            <Route
              path="/"
              element={
                <RequireAuth>
                  <DecodePage passKey={passKey} />
                </RequireAuth>
              }
            />
            <Route path="/login" element={<Login setPassKey={setPassKey} />} />
            {/* <Route path="/test" element={<Stegonography />} /> */}
          </Routes>
        </div>
      </Router>
    </div>
  )
}

export default App
