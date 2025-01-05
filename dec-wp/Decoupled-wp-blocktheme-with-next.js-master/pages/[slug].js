// Import necessary modules and components
import React from "react";
import { useRouter } from "next/router";
import { initializeApollo } from "../lib/apollo";
import UrlReplacer from "../lib/util";
import DynamicStyleTag from "@/components/customStyle";
import DynamicScriptTag from "@/components/customScript";
import SEO from "../components/seo";
import {
  GET_PAGE_BY_SLUG,
  QUERY_TEMPLATE_DETAILS,
  QUERY_TEMPLATE_DETAILS_PAGES,
  TEMPLATE_TITLES,
  TEMPLATE_PARTS_QUERY,
  SEO_QUERY,
  ALL_PAGE_TEMPLATE_URI,
} from "@/lib/queries";
import { environment } from "@/setup";

// Function to generate static paths for dynamic pages
export async function getStaticPaths() {
  // Initialize Apollo Client
  const apolloClient = initializeApollo();

  // Fetch template titles from Apollo Client
  const { data } = await apolloClient.query({
    query: TEMPLATE_TITLES,
  });

  // Generate paths for each template title and page slug
  let paths = data.templateTitles.map((title) => ({
    params: { slug: title.replace("archive-", "") },
  }));
  data.pages.nodes.forEach((node) => {
    paths.push({ params: { slug: node.slug } });
  });

  // Return generated paths and fallback behavior
  return { paths, fallback: false };
}

// Function to get static props for dynamic pages
export async function getStaticProps({ params }) {
  // Initialize Apollo Client
  const apolloClient = initializeApollo();

  // Initialize variables
  let templateDetails = null;
  let templateDetailsArchive = null;
  let headerPartsData = [];
  let footerPartsData = [];
  let seoData = null;
  let isDefaultTemplate = false;

  try {
    // Fetch SEO data from Apollo Client
    const { data: seoQueryData } = await apolloClient.query({
      query: SEO_QUERY,
    });
    seoData = seoQueryData;

    // Fetch template details for archive pages from Apollo Client
    const { data: archiveData } = await apolloClient.query({
      query: QUERY_TEMPLATE_DETAILS,
      variables: {
        id: "archive-" + params.slug,
      },
    });
    templateDetailsArchive = archiveData.templateDetails;

    // Check if template details for archive pages exist
    if (!templateDetailsArchive || !templateDetailsArchive.templateContent) {
      try {
      // Fetch page template data for non-archive pages
      const { data } = await apolloClient.query({
        query: ALL_PAGE_TEMPLATE_URI,
        variables: { id: params.slug },
      });

      // Check if the page template is not default
      if (data.page.template.templateName !== "Default") {
        // Fetch template details for non-archive pages from Apollo Client
        const { data: templateData } = await apolloClient.query({
          query: QUERY_TEMPLATE_DETAILS_PAGES,
          variables: {
            id: data.page.template.templateName,
            postType: "page",
            postName: params.slug,
          },
        });

        // Extract template details for non-archive pages
        templateDetails = templateData.templateDetails;
      } else {
        try {
        isDefaultTemplate = true;

        // Fetch page data for default page template from WordPress backend
        const { data: pageData } = await apolloClient.query({
          query: GET_PAGE_BY_SLUG,
          variables: { slug: params.slug },
        });
        templateDetails = {
          templateContent: pageData.page.content,
          template_title: pageData.page.title,
          templateStyles: pageData.page.enqueuedStylesheets.nodes,
          templateScript: pageData.page.enqueuedScripts.nodes,
        };
      } catch (error) {
        console.error("Error fetching WP front page data:", error);
      }
      try {

        // Fetch header parts data from Apollo Client
        const headerPartsQueryResult = await apolloClient.query({
          query: TEMPLATE_PARTS_QUERY,
          variables: { templateTitles: ["header"] },
        });
        if (headerPartsQueryResult?.data?.templateParts) {
          headerPartsData = headerPartsQueryResult.data.templateParts;
        }
      } catch (error) {
        console.error("Error fetching header parts data:", error);
      }

      try {
        // Fetch footer parts data from Apollo Client
        const footerPartsQueryResult = await apolloClient.query({
          query: TEMPLATE_PARTS_QUERY,
          variables: { templateTitles: ["footer"] },
        });
        if (footerPartsQueryResult?.data?.templateParts) {
          footerPartsData = footerPartsQueryResult.data.templateParts;
        }

      } catch (error) {
        console.error("Error fetching footer parts data:", error);
      }
      
    }
  } catch (error) {
    // Log error to console if an error occurs
    console.error("Error fetching template details:", error);
  }
}
} catch (error) {
  // Log error to console if an error occurs
  console.error("Error fetching template details:", error);

}
  // Return props with template details, header parts data, footer parts data, and SEO data along with revalidation time
  return {
    props: {
      templateDetails,
      templateDetailsArchive,
      headerPartsData,
      footerPartsData,
      seoData,
      isDefaultTemplate,
    },
    revalidate: 1,
  };
}

// Define the warningStyle object
const warningStyle = {
  backgroundColor: '#ffeeba',
  border: '1px solid #ffeeba',
  color: '#856404',
  padding: '10px',
  marginBottom: '15px',
  textAlign: 'center',
};

// Create default header and footer content using warningStyle
const createDefaultContent = (message) => `
  <div style="
    background-color: ${warningStyle.backgroundColor};
    border: ${warningStyle.border};
    color: ${warningStyle.color};
    padding: ${warningStyle.padding};
    margin-bottom: ${warningStyle.marginBottom};
    text-align: ${warningStyle.textAlign};
  ">
    <h3>${message}</h3>
  </div>
`;

// Default header and footer content
const defaultHeaderContent = `<header>${createDefaultContent('Please set the header in the WordPress block theme. Ensure the template part name is "header".')}</header>`;
const defaultFooterContent = `<footer>${createDefaultContent('Please set the footer in the WordPress block theme. Ensure the template part name is "footer".')}</footer>`;
const defaultTemplateContent = `<div>${createDefaultContent('The template you selected has no data added. Please add some content.')}</div>`;

// TemplatePage component for rendering dynamic pages
const TemplatePage = ({
  templateDetails,
  templateDetailsArchive,
  headerPartsData,
  footerPartsData,
  seoData,
  isDefaultTemplate,
}) => {
  // Initialize router
  const router = useRouter();

  // If router is fallback, show loading indicator
  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  // Determine the template content, styles, and scripts
  const templateContent =
    templateDetails?.templateContent || templateDetailsArchive?.templateContent;
  const styles =
    templateDetails?.templateStyles || templateDetailsArchive?.templateStyles;
  const scripts =
    templateDetails?.templateScript || templateDetailsArchive?.templateScript;
  // Check if environment is set to "develop"
  const showDefaultContent = process.env.NODE_ENV === "development";
  // Render the template page with SEO, header, content, and footer components
  return (
    <>
      <SEO
        seoData={seoData}
        title={
          templateDetails?.template_title ||
          templateDetailsArchive?.template_title
        }
      />
      {isDefaultTemplate && (
        <div>
          <DynamicStyleTag styles={headerPartsData?.templateStyles || []} />
          <UrlReplacer
            templateContent={
              headerPartsData?.templateContent ||
              (showDefaultContent && defaultHeaderContent)
            }
          />
          <DynamicScriptTag scripts={headerPartsData?.templateScript || []} />
        </div>
      )}
      <DynamicStyleTag styles={styles} />
      <UrlReplacer
        templateContent={
          templateContent || (showDefaultContent && defaultTemplateContent)
        }
      />
      <DynamicScriptTag scripts={scripts} />
      {isDefaultTemplate && (
        <div>
          <DynamicStyleTag styles={footerPartsData?.templateStyles || []} />
          <UrlReplacer
            templateContent={
              footerPartsData?.templateContent ||
              (showDefaultContent && defaultFooterContent)
            }
          />
          <DynamicScriptTag scripts={footerPartsData?.templateScript || []} />
        </div>
      )}
    </>
  );
};

export default TemplatePage;