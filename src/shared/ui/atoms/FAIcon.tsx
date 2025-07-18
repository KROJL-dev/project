import type React from 'react'
import { memo } from 'react'

import { cn } from '@/lib/utils'

interface Props extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> {
  name: string
  prefix?: EPrefix
  disabled?: boolean
  hidden?: boolean
}

const FAIcon: React.FC<Props> = memo(
  ({ name = '', hidden, prefix, onClick, disabled, className, ...rest }) => {
    const clickHandler = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
      onClick && !disabled && onClick(e)
    }

    return (
      <i
        className={cn(prefix, name, 'grid text-[16px]', {
          ['cursor-not-allowed brightness-50']: disabled,
          [`${className}`]: className,
        })}
        onClick={clickHandler}
        aria-disabled={hidden}
        {...rest}
      />
    )
  }
)
export enum EPrefix {
  fa = 'fa',
  fas = 'fas',
  far = 'far',
  fab = 'fab',
  fal = 'fal',
  fad = 'fad',
  fat = 'fat',
}

export default FAIcon
