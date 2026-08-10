import MainContainer from '@/widgets/app-shell/ui/AppShell'
import { ToastProvider } from '@/shared/ui/toast/toast-provider'
import { PropsWithChildren } from 'react'

export default function ProtectedLayout({ children }: PropsWithChildren) {
	return <MainContainer>{children}<ToastProvider /></MainContainer>
}
