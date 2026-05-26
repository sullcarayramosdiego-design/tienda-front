"use client"

import type { ReactNode } from "react"
import { SessionProvider } from "next-auth/react"
import { TooltipProvider } from "@/components/ui/tooltip"
import { ToastProvider } from "@/components/ui/toast"
import { ThemeProvider } from "./ThemeProvider"

type ProvidersProps = {
	children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
	return (
		<SessionProvider>
			<ThemeProvider defaultTheme="system">
				<ToastProvider>
					<TooltipProvider>{children}</TooltipProvider>
				</ToastProvider>
			</ThemeProvider>
		</SessionProvider>
	)
}

