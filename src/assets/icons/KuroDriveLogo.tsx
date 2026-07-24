interface Props {
	className?: string
	width?: number
	height?: number
}

export function KuroDriveLogo({ className, width = 232, height = 78 }: Props) {
	return (
		<svg
			width='173'
			height='66'
			viewBox='0 0 173 66'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'
			xmlnsXlink='http://www.w3.org/1999/xlink'
		>
			<rect width='173' height='66' fill='url(#pattern0_9_3)' />
			<defs>
				<pattern
					id='pattern0_9_3'
					patternContentUnits='objectBoundingBox'
					width='1'
					height='1'
				>
					<use
						xlinkHref='#image0_9_3'
						transform='matrix(0.000820989 0 0 0.00210412 -0.237907 -0.391788)'
					/>
				</pattern>
				<image
					id='image0_9_3'
					width='1774'
					height='887'
					preserveAspectRatio='none'
				/>
			</defs>
		</svg>
	)
}
