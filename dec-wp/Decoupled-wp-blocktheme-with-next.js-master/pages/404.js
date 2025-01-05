// Import necessary modules and components
import { initializeApollo } from "../lib/apollo";
import DynamicStyleTag from "../components/customStyle";
import DynamicScriptTag from "../components/customScript";
import UrlReplacer from "../lib/util";
import { NOT_FOUND_PAGE_QUERY, TEMPLATE_PARTS_QUERY } from "@/lib/queries";
import NotFoundContent from "../components/NotFoundContent";

// NotFoundPage component
const NotFoundPage = ({ templateDetails, headerPartsData, footerPartsData }) => {
  // If templateContent is empty, render NotFoundContent component
  if (!templateDetails.templateContent) {
    return <NotFoundContent headerPartsData={headerPartsData} footerPartsData={footerPartsData} />;
  }

  // Extract template content, styles, and scripts
  const { templateContent, templateStyles, templateScript } = templateDetails;

  // Styles object
  const styles = {
    styles: templateStyles,
  };

  // Scripts object
  const scripts = {
    scripts: templateScript,
  };

  // Render the page content
  return (
    <>
      <DynamicStyleTag styles={styles.styles} />
      <UrlReplacer templateContent={templateContent} />
      <DynamicScriptTag scripts={scripts.scripts} />
    </>
  );
};

// Function to get static props
export async function getStaticProps() {
  // Initialize Apollo Client
  const apolloClient = initializeApollo();

  // Initialize headerPartsData and footerPartsData arrays
  let headerPartsData = [];
  let footerPartsData = [];

  // Fetch header parts data from Apollo Client
  const headerPartsQueryResult = await apolloClient.query({
    query: TEMPLATE_PARTS_QUERY,
    variables: { templateTitles: ["header"] },
  });

  // If header parts data is available, assign it to headerPartsData
  if (headerPartsQueryResult?.data?.templateParts) {
    headerPartsData = headerPartsQueryResult.data.templateParts;
  }

  // Fetch footer parts data from Apollo Client
  const footerPartsQueryResult = await apolloClient.query({
    query: TEMPLATE_PARTS_QUERY,
    variables: { templateTitles: ["footer"] },
  });

  // If footer parts data is available, assign it to footerPartsData
  if (footerPartsQueryResult?.data?.templateParts) {
    footerPartsData = footerPartsQueryResult.data.templateParts;
  }

  try {
    // Fetch data for the 404 page from Apollo Client
    const { data } = await apolloClient.query({
      query: NOT_FOUND_PAGE_QUERY,
    });

    // Extract template details from the fetched data
    const templateDetails = data.templateDetails;

    // Return props with template details, header parts data, and footer parts data along with revalidation time
    return {
      props: {
        templateDetails,
        headerPartsData,
        footerPartsData,
      },
      revalidate: 1,
    };
  } catch (error) {
    // Log error to console if an error occurs
    console.error("Error fetching 404 page details:", error);
    // If an error occurs, return empty template details along with header parts data and footer parts data
    return {
      props: {
        templateDetails: null,
        headerPartsData,
        footerPartsData,
      },
      revalidate: 1,
    };
  }
}

// Export the NotFoundPage component
export default NotFoundPage;
