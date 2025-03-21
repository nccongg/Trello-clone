// import Footer from './Header/Footer/Footer';
// import Header from './Header/Header';

interface DefaultLayoutProps {
  children: React.ReactNode;
}

function DefaultLayout({ children }: DefaultLayoutProps) {
  return (
    <div className="flex flex-row h-screen">
      {/* <Header /> */}
      <div className="w-full h-full flex flex-col overflow-auto">
        <div className="w-full flex-grow">
          {children}
          {/* <Footer /> */}
        </div>
      </div>
    </div>
  );
}

export default DefaultLayout;
