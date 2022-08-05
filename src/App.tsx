import { IPublicClientApplication } from "@azure/msal-browser";
import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { loginRequest } from "./AuthConfig";
import Storage from "./Storage";

function handleLogin(instance: IPublicClientApplication) {
  instance.loginRedirect(loginRequest).catch((e: Error) => {
    console.error(e);
  });
}
function handleLogout(instance: IPublicClientApplication) {
  instance.logoutRedirect().catch((e: Error) => {
    console.error(e);
  });
}

const App = () => {
  const { instance } = useMsal();
  const isAuthenticated = useIsAuthenticated();

  return (
    <div>
      {!isAuthenticated ? (
        <button onClick={() => handleLogin(instance)}>Sign in</button>
      ) : (
        <button onClick={() => handleLogout(instance)}>Sign Out</button>
      )}

      <Storage />
    </div>
  );
};

export default App;
