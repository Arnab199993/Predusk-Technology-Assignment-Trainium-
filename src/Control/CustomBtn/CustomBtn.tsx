import type { ReactNode } from "react";
import "./CustomBtn.css";
interface customBtnTypes {
  backgroundColor?: string;
  border?: string;
  children?: ReactNode;
  hoverBackgroundColor?: string;
  hoverTextColor?: string;
}
const CustomBtn = (props: customBtnTypes) => {
  const {
    children,
    border,
    backgroundColor,
    hoverBackgroundColor,
    hoverTextColor,
    ...rest
  } = props;
  return (
    <button
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
