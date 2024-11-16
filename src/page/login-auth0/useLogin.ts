import { useAuth0 } from "@auth0/auth0-react";
import { access } from "fs";
import { useEffect } from "react";

export function useLogin() {
    const {
        error,
        getAccessTokenSilently,
        isAuthenticated,
        loginWithRedirect,
        logout
    } = useAuth0();

    console.log(error);

    useEffect(() => {
        if (!isAuthenticated) {
            loginWithRedirect()
                .then(() => {
                    console.log("loginWithRedirect OK");
                })
                .catch(() => {
                    console.log("loginWithRedirect ERROR");
                });
        } else {
            getAccessTokenSilently({ cacheMode: "on" })
                .then((accessToken) => {
                    console.log("getAccessTokenSilently OK");
                })
                .catch(() => {
                    console.log("getAccessTokenSilently ERROR");
                });
        }
    }, [isAuthenticated, error]);

    return {
        logout
    };
}
