import InternalLink from "../InternalLink";

import { getSearchPageURL } from "../../logic/query";
import { useQuery } from "../../providers/QueryProvider";
import { useCallback } from "react";
import { icons } from "../../data/icons";

interface Props {
	query: string;
	page: number;
}

interface PaginationLinkProps {
	goesToPage: string;
	children: React.ReactNode;
}

const PaginationLink = ({ goesToPage, children }: PaginationLinkProps) => {
	const { query } = useQuery();

	return (
		<InternalLink href={getSearchPageURL(query, goesToPage)}>
			<a className="pagination-link">
				{children}
			</a>
		</InternalLink>
	);
}

const Pagination = ({ query, page }: Props) => {
	return (
		<div className="w-100p mt-3r">
			<div className="w-100p mw-35r flex-sb">
				<div>
					{page !== 1 && (
						<PaginationLink goesToPage={String(Math.max(page - 1, 1))}>
							<i className="j-icon mr-0-25r previous">{icons.arrowSmLeft}</i>
							<span>Previous</span>
						</PaginationLink>
					)}
				</div>

				<div>
					<p className='mb-0 lh-1 fs-sm text-dynamic-06 fw-500'>Page {page}</p>
				</div>

				<PaginationLink goesToPage={String(page + 1)}>
					<span>Next</span>
					<i className="j-icon ml-0-25r">{icons.arrowSmRight}</i>
				</PaginationLink>
			</div>
		</div>
	);
}

export default Pagination;