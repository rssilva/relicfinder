import type { HTMLProps, ReactNode } from "react"

const damn = '1'

export const exportedButOnlyUsedLocally = () => ''

export const Button = ({ children, ...props }: { children: ReactNode } & Omit<HTMLProps<HTMLButtonElement>, 'type'> & { type?: HTMLButtonElement['type'] }) => {
  exportedButOnlyUsedLocally()

  return (
    <button {...props}>{children}</button>
  )
}

export { damn as hotDamn }