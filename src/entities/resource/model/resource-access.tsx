'use client'

import { createContext, PropsWithChildren, useContext, useMemo } from 'react'

export type ResourcePermission = 'owner' | 'editor' | 'viewer'

export interface ResourceAccess {
	canEdit: boolean
	canMove: boolean
	canManageAccess: boolean
	canMoveToRoot: boolean
	canUndoDelete: boolean
}

const OWNER_ACCESS: ResourceAccess = {
	canEdit: true,
	canMove: true,
	canManageAccess: true,
	canMoveToRoot: true,
	canUndoDelete: true,
}

const ResourceAccessContext = createContext<ResourceAccess>(OWNER_ACCESS)

export function getResourceAccess(
	permission: ResourcePermission = 'owner',
): ResourceAccess {
	const isOwner = permission === 'owner'
	return {
		canEdit: permission !== 'viewer',
		canMove: isOwner,
		canManageAccess: isOwner,
		canMoveToRoot: isOwner,
		canUndoDelete: isOwner,
	}
}

export function ResourceAccessProvider({
	permission = 'owner',
	children,
}: PropsWithChildren<{ permission?: ResourcePermission }>) {
	const access = useMemo(() => getResourceAccess(permission), [permission])

	return (
		<ResourceAccessContext.Provider value={access}>
			{children}
		</ResourceAccessContext.Provider>
	)
}

export function useResourceAccess() {
	return useContext(ResourceAccessContext)
}
