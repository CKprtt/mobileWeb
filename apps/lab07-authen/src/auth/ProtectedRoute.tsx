import { Route, Redirect } from "react-router-dom";
import { useEffect, useState } from "react";
import { authService } from "./auth-service";

const ProtectedRoute = ({ component: Component, ...rest }: any) => {
  const [user, setUser] = useState<any>(undefined);

  useEffect(() => {
    const check = async () => {
      const u = await authService.getCurrentUser();
      setUser(u);
    };
    check();
  }, []);

  if (user === undefined) return null;

  return (
    <Route
      {...rest}
      render={(props) =>
        user ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );
};

export default ProtectedRoute;