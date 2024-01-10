import "../styles/css/style.css";

export const metadata = {
  title: "Driving School App",
  description: "Designed and developed by WebAct"
};

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
};

export default RootLayout;
