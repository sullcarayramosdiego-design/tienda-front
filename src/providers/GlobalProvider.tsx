"use client"

import { useEffect } from "react"
import type { ReactNode } from "react"
import { SessionProvider, useSession } from "next-auth/react"
import { TooltipProvider } from "@/components/ui/tooltip"
import { ToastProvider } from "@/components/ui/toast"

function AuthSync() {
  const { data: session } = useSession()

  useEffect(() => {
    // Sincronizar los tokens recibidos del backend a través de NextAuth
    // con el localStorage que usa apiClient
    if (session && (session as any).backendTokens) {
      const tokens = (session as any).backendTokens;
      const currentToken = localStorage.getItem('access_token');
      
      if (tokens.accessToken && currentToken !== tokens.accessToken) {
        localStorage.setItem('access_token', tokens.accessToken);
        localStorage.setItem('refresh_token', tokens.refreshToken);
        if (tokens.user) {
          localStorage.setItem('user', JSON.stringify(tokens.user));
        }
      }
    }
  }, [session])

  return null
}

type ProvidersProps = {
	children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
	return (
		<SessionProvider>
			<AuthSync />
			<ToastProvider>
				<TooltipProvider>{children}</TooltipProvider>
			</ToastProvider>
		</SessionProvider>
	)
}
