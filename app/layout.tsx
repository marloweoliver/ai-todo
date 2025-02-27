import type React from "react"
import type { Metadata } from "next"
import { Inter } from 'next/font/google'
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Sidebar } from "@/components/sidebar"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
	title: "Smart Todo App",
	description: "A modern todo application with AI-powered features",
	metadataBase: new URL("https://todo.example.com"),
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={inter.className}>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<div className="flex min-h-screen">
						<Sidebar className="w-64 border-r px-4" />
						<main className="flex-1 overflow-y-auto">
							{children}
						</main>
					</div>
					<Toaster />
				</ThemeProvider>
			</body>
		</html>
	)
}
