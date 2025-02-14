import { ButtonHTMLAttributes, ReactNode } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  disabled?: boolean;
  className?: string;
  children: ReactNode;
}

export default function IconButton({
  disabled,
  className = "",
  children,
  ...rest
}: Props) {
  //#region Styles

  let buttonStyle =
    "flex select-none items-center gap-2 rounded-full outline-none transition duration-200 ease-out active:duration-300";

  if (disabled) {
    // Disabled Style
    buttonStyle +=
      " cursor-not-allowed text-slate-900/80 hover:text-slate-900/80 dark:text-slate-50/80 dark:hover:fill-slate-50/80" +
      " fill-slate-900/80 hover:fill-slate-900/80 dark:fill-slate-50/80 dark:hover:fill-slate-50/80";
  } else {
    buttonStyle +=
      " text-slate-900 hover:text-indigo-700 focus-visible:text-indigo-700 focus-visible:ring-4 focus-visible:ring-indigo-700/90" +
      " dark:text-slate-50 hover:dark:text-indigo-300 focus-visible:dark:text-indigo-300 focus-visible:dark:ring-indigo-300/90 " +
      " fill-slate-900 hover:fill-indigo-700 focus-visible:fill-indigo-700 dark:fill-slate-50 hover:dark:fill-indigo-300 focus-visible:dark:fill-indigo-300";
  }

  //#endregion

  return (
    <button
      className={`${buttonStyle} ${className}`}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
}
