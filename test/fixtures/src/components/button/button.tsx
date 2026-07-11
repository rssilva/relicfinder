import type { HTMLProps, ReactNode } from "react"

const damn = '1'

export const Button = ({ children, ...props }: { children: ReactNode } & Omit<HTMLProps<HTMLButtonElement>, 'type'> & { type?: HTMLButtonElement['type'] }) => {
  return (
    <button {...props}>{children}</button>
  )
}

export { damn as hotDamn }