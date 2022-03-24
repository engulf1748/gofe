const TextResultSkeleton = () => {
	return (
		<div className='text-result'>
			<div className="w-100p mw-35r is-skeleton">
				<div className="mb-0-5r">
					<div className="link-area">
						<div className="s-link skeleton"></div>
						<div className="s-description skeleton"></div>
					</div>
				</div>
				<div className="s-context one skeleton"></div>
				<div className="s-context two skeleton"></div>
			</div>
		</div>
	);
};


export default TextResultSkeleton;