// Import necessary modules and components
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { initializeApollo } from "../lib/apollo";
import UrlReplacer from "../lib/util";
import DynamicStyleTag from "@/components/customStyle";
import DynamicScriptTag from "@/components/customScript";
import SEO from "../components/seo";
import {
  ALL_SINGLE_POST_TEMPLATE,
  QUERY_SINGLE_TEMPLATE_DETAILS,
  SEO_QUERY
} from "@/lib/queries";

// Function to generate static paths
export async function getStaticPaths() {
  // Initialize Apollo Client
  const apolloClient = initializeApollo();

  // Fetch data from Apollo Client
  const { data } = await apolloClient.query({
    query: ALL_SINGLE_POST_TEMPLATE,
  });

  // Initialize an empty array to store paths
  const paths = [];

  // Iterate over each item in the fetched data
  data.allSinglePostTemplate.forEach((item) => {
    // Push path for the current item
    paths.push({
      params: {
        // Construct slug with template and post parameters
        slug: [item["template"].replace("single-", ""), item["post"]],
      },
    });

    // Iterate over each post count and push paths
    for (let i = 1; i <= item.post_count; i++) {
      paths.push({
        params: {
          // Construct slug with template and post count parameters
          slug: [item.template.replace("single-", ""), i.toString()],
        },
      });
    }
  });

  // Return the generated paths along with fallback option
  return { paths, fallback: false };
}

// Function to get static props
export async function getStaticProps({ params }) {
  // Initialize Apollo Client
  const apolloClient = initializeApollo();
  let pagination = parseInt(params.slug[1]);

  // Fetch SEO data from Apollo Client
  const { data: seoData } = await apolloClient.query({
    query: SEO_QUERY,
  });

  try {
    // Fetch template details from Apollo Client
    const { data } = await apolloClient.query({
      query: QUERY_SINGLE_TEMPLATE_DETAILS,
      variables: { id: "single-" + params.slug[0], postName: params.slug[1], pagination: pagination },
    });

    // Extract template details from the fetched data
    const templateDetails = data.templateDetails;

    // If template details are empty, return not found
    if (!templateDetails.templateContent) {
      return { notFound: true };
    }

    // Return props with template details and SEO data along with revalidation time
    return {
      props: {
        templateDetails,
        seoData,
        post: params.slug[1]
      },
      revalidate: 1,
    };
  } catch (error) {
    // Log error to console
    console.error('Error fetching template details:', error);
    // Return not found
    return { notFound: true };
  }
}

// DynamicPage component
export default function DynamicPage({ templateDetails, seoData, post }) {
  // If templateDetails is empty, show loading
  if (!templateDetails) {
    return <div>Loading...</div>;
  }

  // Extract template content, styles, and scripts
  const templateContent = templateDetails;
  const styles = {
    styles: templateContent.templateStyles,
  };
  const scripts = {
    scripts: templateContent.templateScript,
  };

  // Render the page content
  return (
    <>
      <SEO seoData={seoData} title={post} />
      <DynamicStyleTag styles={styles.styles} />
      <UrlReplacer templateContent={templateContent?.templateContent} />
      <DynamicScriptTag scripts={scripts.scripts} />
    </>
  );
}
