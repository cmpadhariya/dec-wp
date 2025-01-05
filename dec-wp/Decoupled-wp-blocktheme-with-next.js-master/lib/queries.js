// lib/queries.js

// GraphQL queries for various template details, including page content, styles, and scripts.

import { gql } from "@apollo/client";

// Query to fetch template details for pages
export const QUERY_TEMPLATE_DETAILS_PAGES = gql`
  query TemplateDetails(
    $id: ID!
    $postType: String = ""
    $postName: String = ""
  ) {
    templateDetails(id: $id, postType: $postType, postName: $postName) {
      templateContent
      template_title
      templateStyles {
        src
      }
      templateScript {
        src
      }
    }
  }
`;

// Query to get page details by slug
export const GET_PAGE_BY_SLUG = gql`
  query GetPageBySlug($slug: ID!) {
    page(id: $slug, idType: URI) {
      id
      uri
      slug
      title(format: RENDERED)
      content(format: RENDERED)
      enqueuedStylesheets {
        nodes {
          handle
          src
        }
      }
      enqueuedScripts {
        nodes {
          handle
          src
        }
      }
    }
  }
`;

// Query to fetch the front page template
export const FRONT_PAGE_TEMPLATE = gql`
  query frontpagetemplate {
    pageBy(uri: "/") {
      id
      slug
      template {
        templateName
      }
    }
  }
`;

// Query to fetch details of the front page
export const WP_FRONT_PAGE = gql`
  query frontpage {
    pageBy(uri: "/") {
      id
      content(format: RENDERED)
      title(format: RENDERED)
      enqueuedStylesheets(first: 100) {
        nodes {
          src
        }
      }
      enqueuedScripts {
        nodes {
          src
        }
      }
    }
  }
`;

// Query to fetch details of the 404 page
export const NOT_FOUND_PAGE_QUERY = gql`
  query notFoundPage {
    templateDetails(id: "404", postType: "page") {
      templateContent
      template_title
      templateScript {
        src
      }
      templateStyles {
        src
      }
    }
  }
`;

// Query to fetch template titles
export const TEMPLATE_TITLES = gql`
  query TemplateTitles {
    templateTitles
    pages(first: 100) {
      nodes {
        slug
        title
      }
    }
  }
`;

// Query to fetch template details by ID
export const QUERY_TEMPLATE_DETAILS = gql`
  query TemplateDetails($id: ID!) {
    templateDetails(id: $id) {
      templateContent
      template_title
      templateStyles {
        src
      }
      templateScript {
        src
      }
    }
  }
`;

// Query to fetch all single post templates
export const ALL_SINGLE_POST_TEMPLATE = gql`
  query allSinglePostTemplate {
    allSinglePostTemplate {
      post
      template
      post_count
    }
  }
`;

// Query to fetch details of a single template with pagination
export const QUERY_SINGLE_TEMPLATE_DETAILS = gql`
  query TemplateDetails($id: ID = "", $postName: String = "", $pagination: Int = 0 ) {
    templateDetails(id: $id, postName: $postName, pagination: $pagination) {
      template_title
      templateContent
      templateStyles {
        src
      }
      templateScript {
        src
      }
    }
    allSinglePostTemplate {
      post
      template
    }
  }
`;

// Query to fetch template parts based on template titles
export const TEMPLATE_PARTS_QUERY = gql`
  query GetTemplateParts($templateTitles: [String]!) {
    templateParts(templateTitles: $templateTitles) {
      templateContent
      templateStyles {
        handle
        src
      }
      templateScript {
        src
      }
    }
  }
`;

// Query to fetch SEO settings
export const SEO_QUERY = gql`
  query SEO {
    generalSettings {
      description
      url
      title
    }
    user(idType: SLUG, id: "admin") {
      name
      slug
      avatar {
        url
      }
    }
    customizerOptions {
      id
      logo
      siteIcon
    }
  }
`;

// Query to fetch the page selected templates by uri
export const ALL_PAGE_TEMPLATE_URI = gql`
  query PageTemplates($id: ID!) {
    page(id: $id, idType: URI) {
      id
      template {
        templateName
      }
      uri
      slug
    }
  }
`;

// Query to fetch the replace URL
export const REPLACE_URL = gql`
  query replaceUrl {
    generalSettings {
      url
    }
  }
`;
