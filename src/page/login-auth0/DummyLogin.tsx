import { useLogin } from "./useLogin";

export default function () {
    const { logout } = useLogin();

    return (
        <>
            {/* <button
                onClick={() =>
                    
                }
            >
                Log In
            </button> */}
            <button
                onClick={() =>
                    logout({
                        logoutParams: { returnTo: window.location.origin }
                    })
                }
            >
                Log Out
            </button>
        </>
    );
}
