import {Navigate} from 'react-router-dom'
import type { User } from './types'
import { JSX, useEffect } from 'react';

type Props={
    user:User |null;
    children : JSX.Element;
};


export default function RequireAdmin({user, children} : Props){
    if (!user || user.role !== 'admin' ){
        return <Navigate to="/" replace/>;
    }
    return children;
}

export function useClearErrorEvery3s(setError: React.Dispatch<React.SetStateAction<string | null>>) {
  useEffect(() => {
    const interval = setInterval(() => {
      setError(null);
    }, 3000);

    return () => clearInterval(interval);
  }, [setError]);
}