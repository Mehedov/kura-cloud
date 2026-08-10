import {
	Bell,
	Database,
	HardDrive,
	Monitor,
	Palette,
	ShieldCheck,
	UploadCloud,
	UserRound,
	Users,
	type LucideIcon,
} from 'lucide-react'

const SETTINGS_NAV: Array<{ id: string; label: string; icon: LucideIcon }> = [
	{ id: 'profile', label: 'Профиль', icon: UserRound },
	{ id: 'appearance', label: 'Внешний вид', icon: Palette },
	{ id: 'interface', label: 'Интерфейс', icon: Monitor },
	{ id: 'storage', label: 'Хранилище', icon: HardDrive },
	{ id: 'uploads', label: 'Загрузки', icon: UploadCloud },
	{ id: 'sharing', label: 'Общий доступ', icon: Users },
	{ id: 'notifications', label: 'Уведомления', icon: Bell },
	{ id: 'security', label: 'Безопасность', icon: ShieldCheck },
	{ id: 'data', label: 'Данные', icon: Database },
]

export function SettingsNavigation() {
	return (
		<nav
			aria-label='Разделы настроек'
			className='order-first lg:order-last lg:col-start-2 lg:sticky lg:top-4'
		>
			<div className='flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:rounded-xl lg:border lg:border-border lg:bg-card lg:p-2'>
				{SETTINGS_NAV.map(item => (
					<a
						key={item.id}
						href={`#${item.id}`}
						className='flex shrink-0 items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:border-transparent lg:bg-transparent'
					>
						<item.icon size={17} />
						{item.label}
						<span className='ml-auto hidden lg:block'>›</span>
					</a>
				))}
			</div>
		</nav>
	)
}
