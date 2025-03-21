import './GlobalStyle.scss';

interface GlobalStyleProps {
  children: React.ReactNode;
}

function GlobalStyle({ children }: GlobalStyleProps) {
  return <>{children}</>;
}
export default GlobalStyle;
