import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

// A function helper function to decode the JWT and extract the user's role
const getUserRoleFromToken = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload).role;
  } catch (error) {
    return null;
  }
};

const getToken = () => localStorage.getItem('token');

// We define the props for the ProtectedRoute component
interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRole?: string; 
}

export default function ProtectedRoute({ children, allowedRole }: ProtectedRouteProps) {
  // The token is kept in state so the component re-renders when it changes
  const [token, setToken] = useState<string | null>(getToken);

  useEffect(() => {
    const syncSession = () => setToken(getToken());

    // When the browser restores this page from the back-forward cache (bfcache),
    // React does not re-mount, so we must re-check the session manually.
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        syncSession();
      }
    };

    // Logout in another tab updates localStorage and fires "storage" here
    window.addEventListener('pageshow', handlePageShow);
    window.addEventListener('storage', syncSession);
    document.addEventListener('visibilitychange', syncSession);

    return () => {
      window.removeEventListener('pageshow', handlePageShow);
      window.removeEventListener('storage', syncSession);
      document.removeEventListener('visibilitychange', syncSession);
    };
  }, []);

  // If there's no token, redirect to the login page
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If an allowed role is specified and it doesn't match, redirect to the login page
  if (allowedRole) {
    const userRole = getUserRoleFromToken(token);
    if (userRole !== allowedRole) {
      return <Navigate to="/login" replace />;
    }
  }

  return children;
}
