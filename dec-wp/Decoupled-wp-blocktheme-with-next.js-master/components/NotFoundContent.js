import Link from "next/link";
import DynamicStyleTag from "../components/customStyle";
import DynamicScriptTag from "../components/customScript";
import UrlReplacer from "../lib/util";

const NotFoundContent = ({ headerPartsData, footerPartsData }) => {
  return (
    <>
      {/* Render dynamic styles and scripts for the header */}
      <DynamicStyleTag styles={headerPartsData?.templateStyles} />
      <DynamicScriptTag scripts={headerPartsData?.templateScript} />
      {/* Replace URLs in the header template content */}
      <UrlReplacer templateContent={headerPartsData.templateContent} />

      {/* Main 404 content */}
      <div style={{ textAlign: "center", margin: "120px 0 120px 0" }}>
        <h1
          style={{
            textAlign: "center",
            marginBottom: "50px",
            fontSize: "38px",
          }}
        >
          404 - Page Not Found
        </h1>
        <p
          style={{
            textAlign: "center",
            marginBottom: "60px",
            fontSize: "18px",
          }}
        >
          The page you are looking for might have been removed or does not
          exist.
        </p>
        {/* Link to navigate back to the home page */}
        <Link
          href="/"
          style={{
            padding: "16px 22px",
            backgroundColor: "#0070f3",
            fontSize: "14px",
            textDecoration: "none",
            color: "#fff",
            borderRadius: "5px",
            border: "none",
            cursor: "pointer",
            margin: "20px 0 50px 0",
            transition: "background-color 0.3s",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#0056b3")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#0070f3")}
        >
          Go to Home Page
        </Link>
      </div>

      {/* Replace URLs in the footer template content */}
      <UrlReplacer templateContent={footerPartsData.templateContent} />
      {/* Render dynamic styles and scripts for the footer */}
      <DynamicStyleTag styles={footerPartsData?.templateStyles} />
      <DynamicScriptTag scripts={footerPartsData?.templateScript} />
    </>
  );
};

export default NotFoundContent;
