interface Props {
	title: string
	description?: string
	children?: React.ReactNode
}

export function Title({title, description, children}: Props) {
	return (
		<div>
			<h1 className='text-2xl font-semibold text-neutral-700'>
				{title}
			</h1>
			<p className='text-sm text-neutral-500'>
				{description}
			</p>
			{children}
		</div>
	)
}
