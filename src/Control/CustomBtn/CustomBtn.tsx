import type { ReactNode } from "react";
import "./CustomBtn.css";
interface customBtnTypes {
  backgroundColor?: string;
  border?: string;
  children?: ReactNode;
  hoverBackgroundColor?: string;
  hoverTextColor?: string;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
}
const CustomBtn = (props: customBtnTypes) => {
  const {
    children,
    border,
    backgroundColor,
    hoverBackgroundColor,
    hoverTextColor,
    onClick,
    ...rest
  } = props;
  return (
    <button
      onClick={onClick}
      {...rest}
      style={
        {
          border: border,
          "--bg": backgroundColor,
          "--hover-bg": hoverBackgroundColor,
          "--hover-text": hoverTextColor,
        } as React.CSSProperties
      }
      className="px-4 py-2 rounded-2xl custom-btn cursor-pointer"
    >
      {children}
    </button>
  );
};

export default CustomBtn;
