const EmptyQuery = () => {
	return (
		<div className='w-100p px-3r py-10r flex-c utility-panel bg'>
			<div className="mw-25r flex-c text-c">
				<h4 className='mb-0-5r'>No search query</h4>
				<p>
					You may have accidentally searched for nothing. Try typing again in the search bar.
				</p>
			</div>
		</div>
	);
}

export default EmptyQuery;