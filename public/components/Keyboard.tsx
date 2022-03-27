import dynamic from 'next/dynamic';

const KeyboardEventHandler = dynamic(
	() => import('react-keyboard-event-handler'),
	{ ssr: false }
);

interface KeyboardProps {
	children?: React.ReactNode,
	keys: string[],
	callback(key?: string, ev?: any): void,
	handleFocusableElements?: boolean,
	isDisabled?: boolean,
	isExclusive?: boolean
}

const Keyboard = ({
	children,
	keys,
	callback,
	handleFocusableElements = false,
	isDisabled = false,
	isExclusive = false,
}: KeyboardProps) => {
	return (
		<KeyboardEventHandler
            // We get type errors during build for this.
            // Let's just ignore it.
            // @ts-ignore
			handleKeys={keys}
			onKeyEvent={callback}
			handleFocusableElements={handleFocusableElements}
			isDisabled={isDisabled}
			isExclusive={isExclusive}
		>
			{children}
		</KeyboardEventHandler>
	);
};

export default Keyboard;
