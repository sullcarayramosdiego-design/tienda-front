"use client"

import type { ReactNode } from "react"
import { SessionProvider } from "next-auth/react"
import { TooltipProvider } from "@/components/ui/tooltip"
import { ToastProvider } from "@/components/ui/toast"

type ProvidersProps = {
	children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
	return (
		<SessionProvider>
			<ToastProvider>
				<TooltipProvider>{children}</TooltipProvider>
			</ToastProvider>
		</SessionProvider>
	)
}
