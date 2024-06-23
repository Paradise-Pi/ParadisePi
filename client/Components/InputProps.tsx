/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Mantine V5 removes this typing and returns an Any, so we need to override
 * that with what we actually receive from the getInputProps function.
 */
export interface InputProps {
	value: string
	onChange: (event: any) => void
	error?: string
	checked?: boolean
	onFocus?: (event: any) => void
	onBlur?: (event: any) => void
}
