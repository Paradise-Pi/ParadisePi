/**
 * Mantine V5 removes this typing and returns an Any, so we need to override
 * that with what we actually receive from the getInputProps function.
 */
export interface InputProps {
	value: string
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	onChange: (event: any) => void
	error: string
}
