import MathJax from "react-native-mathjax";
import { mmlOptions } from "../../constants/constants";

interface MathJaxComponentProps {
  latex: string;
}

export const MathJaxComponent = ({ latex }: MathJaxComponentProps) => {
  return (
    <MathJax
      html={`<div><br> \\begin{align*}${latex}\\end{align*} <br> <br> <br> <div>`}
      mathJaxOptions={mmlOptions}
    />
  );
};
