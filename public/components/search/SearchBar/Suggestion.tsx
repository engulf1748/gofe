import { useRouter } from "next/router";

import { useQuery } from "../../../providers/QueryProvider";

import { getSearchPageURL } from "../../../logic/query";
import Keyboard from "../../Keyboard";

interface Props {
	suggestion: string;
	selected: boolean;
	close(): void;
}

const Suggestion = ({ suggestion, selected, close }: Props) => {
	const { query, setQuery, previousQuery } = useQuery();
	const { push } = useRouter();

	const onClick = () => {
		if (suggestion !== previousQuery) {
			setQuery(suggestion);
			push(getSearchPageURL(suggestion, 1));
		}
	};

	if (suggestion === query.trim()) {
		return <></>;
	}

	return (
		<>
			<button
				onClick={onClick}
				className={selected ? 'selected' : ''}
			>{suggestion}</button>

			{selected && (
				<Keyboard
					keys={['enter']}
					callback={() => {
						onClick();
						close();
					}}
					handleFocusableElements
				/>
			)}
		</>
	);
}


export default Suggestion;