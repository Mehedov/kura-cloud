import MainContainer from '@/components/containers/main-container'
import { PropsWithChildren } from 'react'

export default function ProtectedLayout({ children }: PropsWithChildren) {
	return <MainContainer>{children}</MainContainer>
}
