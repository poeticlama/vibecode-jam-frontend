import type { ReactNode } from 'react';
import { Navigate, useLocation, Outlet } from 'react-router';

import { useAppSelector } from '../../hooks/rtk.ts';

type PrivateRouteProps = {
  children?: ReactNode;
};

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const location = useLocation();

  const { isAuthenticated, loading } = useAppSelector((state) => state.auth);

  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <span className="loading loading-spinner loading-xl"></span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children || <Outlet />;
};

export default PrivateRoute;
