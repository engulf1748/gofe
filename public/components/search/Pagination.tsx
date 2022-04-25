import InternalLink from "../InternalLink";

import { getSearchPageURL } from "../../logic/query";

import { icons } from "../../data/icons";

interface Props {
	page: number;
	staticQuery: string;
}

interface PaginationLinkProps {
	goesToPage: number;
	staticQuery: string;
	children: React.ReactNode;
}

const PaginationLink = ({ goesToPage, staticQuery, children }: PaginationLinkProps) => {
	return (
		<InternalLink href={getSearchPageURL(staticQuery, goesToPage)}>
			<a className="pagination-link">
				{children}
			</a>
		</InternalLink>
	);
}

const Pagination = ({ page, staticQuery }: Props) => {
	return (
		<div className="w-100p mt-3r">
			<div className="w-100p mw-35r grid grid-3">
				<div className="grid-block">
					{page !== 1 && (
						<PaginationLink goesToPage={Math.max(page - 1, 1)} staticQuery={staticQuery}>
							<i className="j-icon mr-0-25r previous">{icons.arrowSmLeft}</i>
							<span>Previous</span>
						</PaginationLink>
					)}
				</div>

				<div className="grid-block flex-c">
					<p className='mb-0 lh-1 fs-sm opacity-6 fw-500'>Page {page}</p>
				</div>

				<div className="grid-block align-e">
					<PaginationLink goesToPage={page + 1} staticQuery={staticQuery}>
						<span>Next</span>
						<i className="j-icon ml-0-25r">{icons.arrowSmRight}</i>
					</PaginationLink>
				</div>
			</div>
		</div>
	);
}

export default Pagination;
