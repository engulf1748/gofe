import classNames from "classnames";

const Divider = ({ hideOnTP }: any) => <p className={classNames(
	'mb-0 mx-1r opacity-4',
	hideOnTP && 'tp-hide'
)}>|</p>;

export default Divider;