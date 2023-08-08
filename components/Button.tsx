// components/MyButton.js
'use client'
import clsx from 'clsx';
import { relative } from 'path';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement>

export const Button = ({ className, ...rest }: Props) => {
  return <button className={clsx('bg-indigo-500 text-white', 'py-2 px-8 leading-6', 'rounded-full', 'font-semibold tracking-wide', 'cursor-pointer', 'inline-flex items-center justify-center', 'relative shadow',
    //Focus
    'outline-none', 'ring-indigo-500/70 ring-offset-2', 'focus-visible:ring-2 font-scale-[0.98]',
    //disabled
    'disabled:bg-indigo-500/50 disabled:cursor-not-allowed disabled:shadow',
    className)}{...rest}></button>
}
