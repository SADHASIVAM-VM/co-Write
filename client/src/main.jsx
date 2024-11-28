import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ClerkProvider } from '@clerk/clerk-react'


const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
console.log(PUBLISHABLE_KEY)
if(!PUBLISHABLE_KEY){
  //console.log("MISSING PUBLISH KEY FROM @CLERK...")
}
createRoot(document.getElementById('root')).render(
  <>
  <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
  <App /> 
  </ClerkProvider>
  </>
  
  )
