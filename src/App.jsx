import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider } from '@/lib/AuthContext';
import ScrollToTop from './components/ScrollToTop';
import Browse from '@/pages/Browse';
import Profile from '@/pages/Profile';

const CLERK_PUBLISHABLE_KEY = "pk_test_c2V0dGxlZC1weXRob24tMjcuY2xlcmsuYWNjb3VudHMuZGV2JA";

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
          <Router>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Browse />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </Router>
        </ClerkProvider>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App