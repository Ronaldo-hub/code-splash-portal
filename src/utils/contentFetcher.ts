
import { toast } from "sonner";
import { vectorDb, DocumentChunk } from "./vectorDb";

// Sample tweets for the mock database
const SAMPLE_KHOISAN_TWEETS = [
  {
    id: "tweet1",
    text: "We demand full recognition of Khoisan as the original and sovereign First Nations of Southern Africa. Our people's identity must be acknowledged in constitution and practice.",
    date: "2023-11-15",
    source: "https://x.com/KhoisanVoice"
  },
  {
    id: "tweet2",
    text: "The unconditional return of ancestral territories is non-negotiable. This includes complete land ownership, mineral rights, and access to maritime resources that were historically ours.",
    date: "2023-12-01",
    source: "https://x.com/KhoisanVoice"
  },
  {
    id: "tweet3",
    text: "We call for immediate cessation of using the term 'coloured' in all official documentation. This colonial classification erases our identity as indigenous Khoisan people.",
    date: "2024-01-10",
    source: "https://x.com/KhoisanVoice"
  },
  {
    id: "tweet4",
    text: "Our languages must be recognized as official national languages with comprehensive state-funded preservation and development programs to revitalize our endangered linguistic heritage.",
    date: "2024-01-25",
    source: "https://x.com/KhoisanVoice"
  },
  {
    id: "tweet5",
    text: "Direct proportional parliamentary representation is essential for our people. We demand absolute veto power on legislation affecting Khoisan territories and rights.",
    date: "2024-02-05",
    source: "https://x.com/KhoisanVoice"
  },
  {
    id: "tweet6",
    text: "No agreements, treaties, or legislative actions shall be enacted without explicit, documented Khoisan community consent. This principle of Free, Prior and Informed Consent is fundamental.",
    date: "2024-02-20",
    source: "https://x.com/KhoisanVoice"
  },
  {
    id: "tweet7",
    text: "Financial reparations must include a dedicated national fund for Khoisan community development and a transparent mechanism for historical economic damage compensation.",
    date: "2024-03-01",
    source: "https://x.com/KhoisanVoice"
  },
  {
    id: "tweet8",
    text: "Education in our schools must include Khoisan history, taught from our perspective. Our children deserve to learn about their heritage with pride.",
    date: "2024-03-15",
    source: "https://x.com/KhoisanVoice"
  },
  {
    id: "tweet9",
    text: "Traditional Khoisan leadership structures must be officially recognized and incorporated into the governance framework of territories where our people historically resided.",
    date: "2024-03-30",
    source: "https://x.com/KhoisanVoice"
  },
  {
    id: "tweet10",
    text: "Climate action must recognize indigenous knowledge. Khoisan conservation practices that maintained ecological balance for thousands of years must inform environmental policy.",
    date: "2024-04-10",
    source: "https://x.com/KhoisanVoice"
  }
];

// Website content chunks
const WEBSITE_CONTENT = [
  {
    id: "web1",
    text: "The Khoisan are the indigenous people of Southern Africa. Archaeological evidence suggests they have lived there for up to 140,000 years. Our traditional nomadic lifestyle was deeply connected to the land and its resources.",
    date: "2024-01-01",
    source: "https://khoisanvoice.carrd.co/"
  },
  {
    id: "web2",
    text: "Colonial oppression devastated Khoisan communities through land dispossession, forced removals, and systematic genocide. These historical injustices continue to affect our people today through intergenerational trauma and economic disadvantage.",
    date: "2024-01-02",
    source: "https://khoisanvoice.carrd.co/"
  },
  {
    id: "web3",
    text: "Despite constitutional recognition in some countries, practical implementation of Khoisan rights remains severely limited. Our communities continue to face marginalization in political, economic, and social spheres.",
    date: "2024-01-03",
    source: "https://khoisanvoice.carrd.co/"
  },
  {
    id: "web4",
    text: "The mandate's land sovereignty principles are rooted in historical fact: Khoisan peoples were the first inhabitants of Southern Africa, with archaeological evidence confirming our presence for tens of thousands of years before colonial arrival.",
    date: "2024-01-04",
    source: "https://khoisanvoice.carrd.co/"
  },
  {
    id: "web5",
    text: "Cultural recognition demands extend beyond symbolic gestures. Our languages are endangered, with some having fewer than 100 fluent speakers remaining. State-funded programs are essential for preservation before this knowledge is lost forever.",
    date: "2024-01-05",
    source: "https://khoisanvoice.carrd.co/"
  }
];

// Mandate text broken into sections for better retrieval
const MANDATE_SECTIONS = [
  {
    id: "mandate1",
    text: "Official Mandate to Parliamentary Representatives: WE, THE KHOISAN FIRST NATIONS PEOPLE, HEREBY DECLARE: LAND AND SOVEREIGNTY: Full recognition of Khoisan as the original and sovereign First Nations of Southern Africa.",
    date: "2024-04-01",
    source: "Khoisan Mandate"
  },
  {
    id: "mandate2",
    text: "Unconditional return of ancestral territories, including: Complete and unencumbered land ownership, Full mineral extraction rights, Comprehensive fishing and maritime resource rights.",
    date: "2024-04-01",
    source: "Khoisan Mandate"
  },
  {
    id: "mandate3",
    text: "CULTURAL RECOGNITION: Immediate cessation of the term 'coloured' in all official documentation, Official recognition of Khoisan languages as national languages, Comprehensive state-funded language preservation and development programs.",
    date: "2024-04-01",
    source: "Khoisan Mandate"
  },
  {
    id: "mandate4",
    text: "REPRESENTATION AND CONSENT: Direct, proportional parliamentary representation, Absolute veto power on any legislation affecting Khoisan territories and rights, No agreements, treaties, or legislative actions shall be enacted without explicit, documented Khoisan community consent.",
    date: "2024-04-01",
    source: "Khoisan Mandate"
  },
  {
    id: "mandate5",
    text: "FINANCIAL REPARATION: Dedicated national fund for Khoisan community development, Transparent mechanism for historical economic damage compensation. This mandate is a non-negotiable assertion of our fundamental human rights, cultural identity, and territorial sovereignty.",
    date: "2024-04-01",
    source: "Khoisan Mandate"
  }
];

export async function initializeContentDatabase() {
  if (vectorDb.getDocumentCount() > 0) {
    console.log("Content database already initialized with", vectorDb.getDocumentCount(), "documents");
    return;
  }

  try {
    console.log("Initializing content database...");
    toast.info("Loading Khoisan content database...");
    
    // In a real implementation, you would fetch tweets from the X API
    // and scrape content from the website
    // For now, we'll use the sample data
    
    const allContent = [
      ...SAMPLE_KHOISAN_TWEETS,
      ...WEBSITE_CONTENT,
      ...MANDATE_SECTIONS
    ];
    
    await vectorDb.addDocuments(allContent);
    
    console.log(`Content database initialized with ${vectorDb.getDocumentCount()} documents`);
    toast.success("Content database loaded successfully");
  } catch (error) {
    console.error("Error initializing content database:", error);
    toast.error("Failed to load content database");
  }
}

// Function to update the database with new content
// In a real implementation, this would fetch new tweets periodically
export async function updateContentDatabase() {
  try {
    // For demo purposes, we're just reloading the same content
    // In a real implementation, you would fetch only new content
    console.log("Updating content database...");
    toast.info("Refreshing content database...");
    
    // Clear existing content and reload
    vectorDb.clearDocuments();
    await initializeContentDatabase();
    
    return true;
  } catch (error) {
    console.error("Error updating content database:", error);
    toast.error("Failed to update content database");
    return false;
  }
}
