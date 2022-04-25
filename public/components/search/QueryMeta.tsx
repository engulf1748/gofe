import { useRouter } from "next/router";

interface QueryMetaProps {
	dym: string;
	srf: string;
	setQuery(v: string): void;
}

const QueryMeta = ({ dym, srf, setQuery }: QueryMetaProps) => {
	const { push } = useRouter();

	const searchFor = (newQuery: string) => {
		setQuery(newQuery);
		push(`/search?q=${newQuery}`);
	}

	if (dym) {
		return (
			<div className="mb-2r">
				<p>Did you mean <a className='g-link' onClick={() => searchFor(dym)}>{dym.trim()}?</a></p>
			</div>
		);
	}

	if (srf) {
		return (
			<div className="mb-2r">
				<p>Showing results for <span className='fw-600'>{srf.trim()}</span></p>
			</div>
		);
	}

	return <div className='h-1r'></div>;
}

export default QueryMeta;