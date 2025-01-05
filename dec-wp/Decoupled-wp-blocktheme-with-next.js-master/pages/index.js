// Import necessary modules and components
import React from "react";
import { initializeApollo } from "../lib/apollo";
import DynamicStyleTag from "../components/customStyle";
import { useRouter } from "next/router";
import UrlReplacer from "@/lib/util";
import DynamicScriptTag from "@/components/customScript";
import SEO from "../components/seo";
import {
  FRONT_PAGE_TEMPLATE,
  QUERY_TEMPLATE_DETAILS_PAGES,
  WP_FRONT_PAGE,
  SEO_QUERY,
  TEMPLATE_PARTS_QUERY,
} from "../lib/queries";
import { environment } from "@/setup";

// Function to get static props
export async function getStaticProps() {
  // Initialize Apollo Client
  const apolloClient = initializeApollo();

  // Initialize variables
  let templateDetails = null;
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
  } catch (error) {
    console.error("Error fetching SEO data:", error);
  }
  try {
    // Fetch data for the front page template from Apollo Client
    const { data: frontPageTemplateData } = await apolloClient.query({
      query: FRONT_PAGE_TEMPLATE,
    });

    // Extract front page template and post name
    const frontPageTemplate = frontPageTemplateData?.pageBy?.template;
    const postName = frontPageTemplateData?.pageBy?.slug;

    // Check if front page template exists and is not default
    if (frontPageTemplate && frontPageTemplate.templateName !== "Default") {
      // Convert template name to lowercase
      const templateName = frontPageTemplate.templateName.toLowerCase();
        try {
        // Fetch template details for the front page from Apollo Client
        const { data: templateData } = await apolloClient.query({
          query: QUERY_TEMPLATE_DETAILS_PAGES,
          variables: {
            id: templateName,
            postType: "page",
            postName,
          },
        });

        // Extract template details
        templateDetails = {
          title: templateData.templateDetails.template_title,
          content: templateData.templateDetails.templateContent,
          enqueuedStylesheets:
            templateData?.templateDetails?.templateStyles || [],
          enqueuedScripts: templateData?.templateDetails?.templateScript || [],
        };
      } catch (error) {
        console.error("Error fetching template details data:", error);
      }
      } else {
        try {
        isDefaultTemplate = true;

        // Fetch data for the front page from WordPress backend
        const { data: pageData } = await apolloClient.query({
          query: WP_FRONT_PAGE,
        });
        templateDetails = {
          title: pageData?.pageBy?.title || "",
          content: pageData?.pageBy?.content || "",
          enqueuedStylesheets:
            pageData?.pageBy?.enqueuedStylesheets?.nodes || [],
          enqueuedScripts: pageData?.pageBy?.enqueuedScripts?.nodes || [],
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
    console.error("Error fetching data:", error);
  }

  // Return props with template details, header parts data, footer parts data, and SEO data along with revalidation time
  return {
    props: {
      templateDetails,
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
  padding: '15px',
  textAlign: 'center',
};

// Create default header and footer content using warningStyle
const createDefaultContent = (message) => `
  <div style="
    background-color: ${warningStyle.backgroundColor};
    border: ${warningStyle.border};
    color: ${warningStyle.color};
    padding: ${warningStyle.padding};
    text-align: ${warningStyle.textAlign};
  ">
    <h3>${message}</h3>
  </div>
`;

// Default header and footer content
const defaultHeaderContent = `<header>${createDefaultContent('Please set the header in the WordPress block theme. Ensure the template part name is "header".')}</header>`;
const defaultFooterContent = `<footer>${createDefaultContent('Please set the footer in the WordPress block theme. Ensure the template part name is "footer".')}</footer>`;
const defaultTemplateContent = `<div>${createDefaultContent('The template you selected has no data added. Please add some content.')}</div>`;

// IndexPage component
const IndexPage = ({
  templateDetails,
  seoData,
  headerPartsData,
  footerPartsData,
  isDefaultTemplate,
}) => {
  // Initialize router
  const router = useRouter();

  // If router is fallback or templateDetails is not available, return null
  if (router.isFallback || !templateDetails) {
    return null;
  }

  // Extract content, enqueued stylesheets, enqueued scripts, and title from templateDetails
  const { content, enqueuedStylesheets, enqueuedScripts, title } =
    templateDetails;

    const showDefaultContent = process.env.NODE_ENV === "development";
  // Render the page content
  return (
    <>
      <SEO seoData={seoData} title={title} />
      <div>
      {isDefaultTemplate && (
          <>
            <DynamicStyleTag styles={headerPartsData?.templateStyles || []} />
            <UrlReplacer
              templateContent={
                headerPartsData?.templateContent ||
                (showDefaultContent && defaultHeaderContent)
              }
            />
            <DynamicScriptTag scripts={headerPartsData?.templateScript || []} />
          </>
        )}
      </div>
      <DynamicStyleTag styles={enqueuedStylesheets} />
      <UrlReplacer
        templateContent={
          content || (showDefaultContent && defaultTemplateContent)
        }
      />
      <DynamicScriptTag scripts={enqueuedScripts} />
      <div>
        {isDefaultTemplate && (
          <>
            <DynamicStyleTag styles={footerPartsData?.templateStyles || []} />
            <UrlReplacer
              templateContent={
                footerPartsData?.templateContent ||
                (showDefaultContent && defaultFooterContent)
              }
            />
            <DynamicScriptTag scripts={footerPartsData?.templateScript || []} />
          </>
        )}
      </div>
    </>
  );
};

// Export the IndexPage component
export default IndexPage;