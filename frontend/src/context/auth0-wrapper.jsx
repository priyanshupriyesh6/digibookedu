import React, { createContext, useContext } from 'react';
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';

// Browser security rules treat localhost, 127.0.0.1, and any HTTPS connection as secure origins.
const isSecureOrigin = 
  window.location.hostname === 'localhost' || 
  window.location.hostname === '127.0.0.1' || 
  window.location.protocol === 'https:';

const isConfigured = 
  import.meta.env.VITE_AUTH0_DOMAIN && 
  import.meta.env.VITE_AUTH0_DOMAIN !== 'dummy.auth0.com' &&
  import.meta.env.VITE_AUTH0_CLIENT_ID && 
  import.meta.env.VITE_AUTH0_CLIENT_ID !== 'dummy';

export const isAuth0Active = isSecureOrigin && isConfigured;

// Mock context for non-secure origins and local fallback
const MockAuth0Context = createContext(null);

export const Auth0WrapperProvider = ({ children }) => {
  if (isAuth0Active) {
    return (
      <Auth0Provider
        domain={import.meta.env.VITE_AUTH0_DOMAIN}
        clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
        authorizationParams={{
          redirect_uri: window.location.origin
        }}
      >
        {children}
      </Auth0Provider>
    );
  }

  return (
    <MockAuth0Context.Provider value={{
      user: null,
      isAuthenticated: false,
      isLoading: false,
      loginWithRedirect: () => { console.log('Auth0 redirect mock called (not active on this origin)'); },
      logout: () => { console.log('Auth0 logout mock called (not active on this origin)'); }
    }}>
      {children}
    </MockAuth0Context.Provider>
  );
};

export const useAuth0Wrapper = () => {
  if (isAuth0Active) {
    // Disable ESLint rule since isAuth0Active is statically evaluated at runtime initialization
    // and its state never toggles dynamically during component lifecycles.
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useAuth0();
  }
  return {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    loginWithRedirect: () => { console.log('Auth0 redirect mock called (not active on this origin)'); },
    logout: () => { console.log('Auth0 logout mock called (not active on this origin)'); }
  };
};
