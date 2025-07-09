import { createContext, useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { setUser, clearUser } from '@/store/userSlice';
import { store } from '@/store';
import Layout from '@/components/organisms/Layout';
import Login from '@/components/pages/Login';
import Signup from '@/components/pages/Signup';
import Callback from '@/components/pages/Callback';
import ErrorPage from '@/components/pages/ErrorPage';
import ResetPassword from '@/components/pages/ResetPassword';
import PromptPassword from '@/components/pages/PromptPassword';
import GenerateContent from '@/components/pages/GenerateContent';
import MyDocuments from '@/components/pages/MyDocuments';
import Team from '@/components/pages/Team';
import Brands from '@/components/pages/Brands';
import Settings from '@/components/pages/Settings';
import NotFound from '@/components/pages/NotFound';

// Create auth context
export const AuthContext = createContext(null);

function AppContent() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Get authentication status with proper error handling
  const userState = useSelector((state) => state.user);
  const isAuthenticated = userState?.isAuthenticated || false;
  
  // Initialize ApperUI once when the app loads
useEffect(() => {
    const initializeSDK = async () => {
      try {
        // Wait for SDK to be loaded with retry mechanism
        await waitForSDK();
        
        const { ApperClient, ApperUI } = window.ApperSDK;
        
        const client = new ApperClient({
          apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
          apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
        });
        
        // Initialize but don't show login yet
        ApperUI.setup(client, {
          target: '#authentication',
          clientId: import.meta.env.VITE_APPER_PROJECT_ID,
          view: 'both',
          onSuccess: function (user) {
            setIsInitialized(true);
            // CRITICAL: This exact currentPath logic must be preserved in all implementations
            // DO NOT simplify or modify this pattern as it ensures proper redirection flow
            let currentPath = window.location.pathname + window.location.search;
            let redirectPath = new URLSearchParams(window.location.search).get('redirect');
            const isAuthPage = currentPath.includes('/login') || currentPath.includes('/signup') || 
                               currentPath.includes('/callback') || currentPath.includes('/error') || 
                               currentPath.includes('/prompt-password') || currentPath.includes('/reset-password');
            
            if (user) {
              // User is authenticated
              if (redirectPath) {
                navigate(redirectPath);
              } else if (!isAuthPage) {
                if (!currentPath.includes('/login') && !currentPath.includes('/signup')) {
                  navigate(currentPath);
                } else {
                  navigate('/');
                }
              } else {
                navigate('/');
              }
              // Store user information in Redux
              dispatch(setUser(JSON.parse(JSON.stringify(user))));
            } else {
              // User is not authenticated
              if (!isAuthPage) {
                navigate(
                  currentPath.includes('/signup')
                    ? `/signup?redirect=${currentPath}`
                    : currentPath.includes('/login')
                    ? `/login?redirect=${currentPath}`
                    : '/login'
                );
              } else if (redirectPath) {
                if (
                  !['error', 'signup', 'login', 'callback', 'prompt-password', 'reset-password'].some((path) => currentPath.includes(path))
                ) {
                  navigate(`/login?redirect=${redirectPath}`);
                } else {
                  navigate(currentPath);
                }
              } else if (isAuthPage) {
                navigate(currentPath);
              } else {
                navigate('/login');
              }
              dispatch(clearUser());
            }
          },
onError: function(error) {
            console.error("Authentication failed:", error);
            if (error.message && error.message.includes('Network Error')) {
              console.error("Network connectivity issue detected during authentication");
            }
            setIsInitialized(true);
          }
        });
} catch (error) {
        console.error("Failed to initialize SDK:", error);
        if (error.message && error.message.includes('Network Error')) {
          console.error("Network connectivity issue prevented SDK initialization");
        }
        setIsInitialized(true);
      }
    };

    const waitForSDK = async () => {
      const maxRetries = 5;
      const retryDelay = 1000;
      
      for (let i = 0; i < maxRetries; i++) {
        if (window.ApperSDK && window.ApperSDK.ApperClient && window.ApperSDK.ApperUI) {
          return;
        }
        
        if (i < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, retryDelay * Math.pow(2, i)));
        }
      }
      
      throw new Error('Apper SDK failed to load after multiple attempts. Please check your network connection and try again.');
    };

    initializeSDK();
  }, []); // No props and state should be bound
useEffect(() => {
const initializeSDK = async () => {
      try {
        // Wait for SDK to be loaded with enhanced error handling
        await waitForSDK();
        
        const { ApperClient, ApperUI } = window.ApperSDK;
        
        const client = new ApperClient({
          apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
          apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
        });
        
        // Initialize but don't show login yet
        ApperUI.setup(client, {
          target: '#authentication',
          clientId: import.meta.env.VITE_APPER_PROJECT_ID,
          view: 'both',
          onSuccess: function (user) {
            setIsInitialized(true);
            // CRITICAL: This exact currentPath logic must be preserved in all implementations
            // DO NOT simplify or modify this pattern as it ensures proper redirection flow
            let currentPath = window.location.pathname + window.location.search;
            let redirectPath = new URLSearchParams(window.location.search).get('redirect');
            const isAuthPage = currentPath.includes('/login') || currentPath.includes('/signup') || 
                               currentPath.includes('/callback') || currentPath.includes('/error') || 
                               currentPath.includes('/prompt-password') || currentPath.includes('/reset-password');
            
            if (user) {
              // User is authenticated
              if (redirectPath) {
                navigate(redirectPath);
              } else if (!isAuthPage) {
                if (!currentPath.includes('/login') && !currentPath.includes('/signup')) {
                  navigate(currentPath);
                } else {
                  navigate('/');
                }
              } else {
                navigate('/');
              }
              // Store user information in Redux
              dispatch(setUser(JSON.parse(JSON.stringify(user))));
            } else {
              // User is not authenticated
              if (!isAuthPage) {
                navigate(
                  currentPath.includes('/signup')
                    ? `/signup?redirect=${currentPath}`
                    : currentPath.includes('/login')
                    ? `/login?redirect=${currentPath}`
                    : '/login'
                );
              } else if (redirectPath) {
                if (
                  !['error', 'signup', 'login', 'callback', 'prompt-password', 'reset-password'].some((path) => currentPath.includes(path))
                ) {
                  navigate(`/login?redirect=${redirectPath}`);
                } else {
                  navigate(currentPath);
                }
              } else if (isAuthPage) {
                navigate(currentPath);
              } else {
                navigate('/login');
              }
              dispatch(clearUser());
            }
          },
          onError: function(error) {
            console.error("Authentication failed:", error);
            if (error.message && error.message.includes('Network Error')) {
              console.error("Network connectivity issue detected during authentication");
            }
            setIsInitialized(true);
          }
        });
      } catch (error) {
        console.error("Failed to initialize SDK:", error);
        
        // Handle specific error types
        if (error.message && error.message.includes('Network Error')) {
          console.error("Network connectivity issue prevented SDK initialization");
        } else if (error.message && error.message.includes('SDK failed to load')) {
          console.error("Apper SDK could not be loaded from CDN");
        } else {
          console.error("Unknown error during SDK initialization:", error);
        }
        
        // Ensure app continues to function even if SDK fails
        setIsInitialized(true);
      }
    };

    const waitForSDK = async () => {
      const maxRetries = 5;
      const baseRetryDelay = 1000;
      
      for (let i = 0; i < maxRetries; i++) {
        try {
          // Check if SDK is available
          if (window.ApperSDK && window.ApperSDK.ApperClient && window.ApperSDK.ApperUI) {
            console.log('Apper SDK loaded successfully');
            return;
          }
          
          // If not the last retry, wait before trying again
          if (i < maxRetries - 1) {
            const delay = baseRetryDelay * Math.pow(2, i); // Exponential backoff
            console.log(`Waiting for SDK to load, retry ${i + 1}/${maxRetries} in ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
          }
        } catch (error) {
          console.error(`Error checking SDK availability (attempt ${i + 1}):`, error);
          if (i < maxRetries - 1) {
            const delay = baseRetryDelay * Math.pow(2, i);
            await new Promise(resolve => setTimeout(resolve, delay));
          }
        }
      }
      
      // Enhanced error message with troubleshooting guidance
      const errorMessage = `Apper SDK failed to load after ${maxRetries} attempts. This may be due to:
      - Network connectivity issues
      - CDN unavailability
      - Browser blocking the script
      - Firewall restrictions
      
      Please check your network connection and try refreshing the page.`;
      
      console.error(errorMessage);
      throw new Error('Apper SDK failed to load after multiple attempts. Please check your network connection and try again.');
    };

    initializeSDK();
  }, []); // No props and state should be bound
  
  // Authentication methods to share via context
  const authMethods = {
    isInitialized,
    logout: async () => {
      try {
        const { ApperUI } = window.ApperSDK;
        await ApperUI.logout();
        dispatch(clearUser());
        navigate('/login');
      } catch (error) {
        console.error("Logout failed:", error);
      }
    }
  };
  
  // Don't render routes until initialization is complete
  if (!isInitialized) {
    return (
      <div className="loading flex items-center justify-center p-6 h-screen w-full">
        <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v4"></path>
          <path d="m16.2 7.8 2.9-2.9"></path>
          <path d="M18 12h4"></path>
          <path d="m16.2 16.2 2.9 2.9"></path>
          <path d="M12 18v4"></path>
          <path d="m4.9 19.1 2.9-2.9"></path>
          <path d="M2 12h4"></path>
          <path d="m4.9 4.9 2.9 2.9"></path>
        </svg>
      </div>
    );
  }
  
  return (
    <AuthContext.Provider value={authMethods}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/callback" element={<Callback />} />
        <Route path="/error" element={<ErrorPage />} />
        <Route path="/prompt-password/:appId/:emailAddress/:provider" element={<PromptPassword />} />
        <Route path="/reset-password/:appId/:fields" element={<ResetPassword />} />
        <Route path="/" element={
          <Layout>
            <GenerateContent />
          </Layout>
        } />
        <Route path="/generate" element={
          <Layout>
            <GenerateContent />
          </Layout>
        } />
        <Route path="/documents" element={
          <Layout>
            <MyDocuments />
          </Layout>
        } />
        <Route path="/brands" element={
          <Layout>
            <Brands />
          </Layout>
        } />
        <Route path="/team" element={
          <Layout>
            <Team />
          </Layout>
        } />
        <Route path="/settings" element={
          <Layout>
            <Settings />
          </Layout>
        } />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        className="z-[9999]"
      />
    </AuthContext.Provider>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;