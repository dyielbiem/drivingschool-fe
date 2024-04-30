import "../styles/css/style.css";

export const metadata = {
  title: "Driving School | Admin",
  description: "Designed and developed by WebAct",
  icons: {
    icon: "/favicon.png"
  }
};

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
};

export default RootLayout;
