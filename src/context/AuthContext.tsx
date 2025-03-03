import { Identity, UseAuthReturnType } from "@ic-reactor/react/dist/types"
import type { Backend, User, Response_1 } from "../declarations/backend/backend.did.d.ts"
import { useAuth, useQueryCall } from "@ic-reactor/react";
import { createContext, useContext, useEffect, useState } from "react";


// We also have custom User data on top of Internet Identity
// The flow is -> login internet identity
// -> get custom user data based on principal
type CustomAuthType = {
    user: User | null;
    error: string | null;
    login: () => void;
    logout: () => void;
    identity: Identity | null;
    loading: boolean;
}

const AuthContext = createContext<CustomAuthType | null>(null);

export const useCustomAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("Cannot use custom auth without a custom auth provider");
    }
    return context;
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const { login, logout, identity, error: authError, authenticating } = useAuth();
    const { call, data, error: backendError, refetch, loading: backendLoading } = useQueryCall<Backend>({
        functionName: 'getUser',
    });
    const response = data as Response_1 | null;

    useEffect(() => {
        if (identity) {
            if (!response) {
                call();
            } else {
                refetch();
            }
        }
    }, [identity]);

    const customLogin = () => {
        login({
            identityProvider:
                process.env.DFX_NETWORK === 'ic'
                    ? 'https://identity.ic0.app/#authorize'
                    : 'http://rdmx6-jaaaa-aaaaa-aaadq-cai.localhost:4943/#authorize',
        });
    }
    const loading = authenticating || backendLoading;
    const customError = authError?.message ?? backendError?.message ?? (response ? "err" in response ? response.err : null : null);
    const user = response ? "ok" in response ? response.ok : null : null;

    return <AuthContext.Provider value={{
        user,
        error: customError,
        loading,
        login: customLogin,
        logout,
        identity
    }}>
        {children}
    </AuthContext.Provider>
}

