import React, { lazy, Suspense } from 'react';
import { Switch } from 'react-router';

import 'rsuite/dist/styles/rsuite-default.css';
import { ErrorBoundary } from './components/ErrorBoundary';
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';
import { ProfileProvider } from './context/profile.context';
import Home from './pages/Home';
import './styles/main.scss';

const SignIn = lazy(() => import('./pages/SignIn'));

function App() {
  return (
    <ErrorBoundary>
    <ProfileProvider>
    <Switch>
      <PublicRoute path="/signin">
        <Suspense fallback={<div>Loading...</div>}>
        <SignIn />
        </Suspense>
      </PublicRoute>
      <PrivateRoute path="/">
        <Home />
      </PrivateRoute>
    </Switch>
    </ProfileProvider>
    </ErrorBoundary>
  );
}

export default App;
