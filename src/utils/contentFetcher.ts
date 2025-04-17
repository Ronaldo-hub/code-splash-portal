import { toast } from "sonner";
import axios from "axios";
import { vectorDb, DocumentChunk } from "./vectorDb";
import { websiteConfig, xApiConfig } from "./apiConfig";

// Sample tweets for the mock database - will be replaced with real API data when keys are provided
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

// Website content chunks - will be replaced with real data from web scraping
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

// Check if X API credentials are configured
const isXApiConfigured = (): boolean => {
  return Boolean(xApiConfig.bearerToken);
};

// Fetch tweets from X API
async function fetchTweetsFromXApi(): Promise<DocumentChunk[]> {
  if (!isXApiConfigured()) {
    console.log("X API not configured, using sample tweets");
    return SAMPLE_KHOISAN_TWEETS;
  }

  try {
    console.log("Fetching tweets from X API...");
    
    // Make request to X API
    const response = await axios.get(
      `${xApiConfig.baseUrl}/tweets/search/recent?query=from:KhoisanVoice&max_results=100`,
      {
        headers: {
          Authorization: `Bearer ${xApiConfig.bearerToken}`
        }
      }
    );

    if (response.data && response.data.data) {
      // Transform tweets into DocumentChunk format
      return response.data.data.map((tweet: any, index: number) => ({
        id: `tweet-${tweet.id}`,
        text: tweet.text,
        date: tweet.created_at || new Date().toISOString(),
        source: "https://x.com/KhoisanVoice"
      }));
    }
    
    console.log("No tweets found, using sample tweets");
    return SAMPLE_KHOISAN_TWEETS;
  } catch (error) {
    console.error("Error fetching tweets:", error);
    console.log("Using sample tweets as fallback");
    return SAMPLE_KHOISAN_TWEETS;
  }
}

// Simple web scraper for the Khoisan Voice website
// In a real implementation, you'd use a proper library or service
async function scrapeWebsite(): Promise<DocumentChunk[]> {
  try {
    console.log("Attempting to scrape website...");
    
    // Try to fetch the website content
    const response = await axios.get(websiteConfig.url, {
      timeout: 10000 // 10 seconds timeout
    });
    
    if (response.status === 200) {
      // Very basic HTML parsing - in production use a proper HTML parser
      const htmlContent = response.data;
      
      // Extract text content (very simplified approach)
      let textContent = htmlContent
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, " ")
        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, " ")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim();
      
      // Split into chunks of ~500 characters
      const chunks = [];
      const chunkSize = 500;
      
      for (let i = 0; i < textContent.length; i += chunkSize) {
        const chunk = textContent.substring(i, i + chunkSize);
        if (chunk.trim().length > 50) { // Only add non-trivial chunks
          chunks.push({
            id: `web-${i / chunkSize}`,
            text: chunk,
            date: new Date().toISOString(),
            source: websiteConfig.url
          });
        }
      }
      
      if (chunks.length > 0) {
        console.log(`Extracted ${chunks.length} chunks from website`);
        return chunks;
      }
    }
    
    console.log("Website scraping failed or returned no content, using sample content");
    return WEBSITE_CONTENT;
  } catch (error) {
    console.error("Error scraping website:", error);
    console.log("Using sample website content as fallback");
    return WEBSITE_CONTENT;
  }
}

export async function initializeContentDatabase() {
  if (vectorDb.getDocumentCount() > 0) {
    console.log("Content database already initialized with", vectorDb.getDocumentCount(), "documents");
    return;
  }

  try {
    console.log("Initializing content database...");
    toast.info("Loading Khoisan Voice content database...");
    
    // Fetch tweets and website content in parallel
    const [tweets, websiteContent] = await Promise.all([
      fetchTweetsFromXApi(),
      scrapeWebsite()
    ]);
    
    const allContent = [
      ...tweets,
      ...websiteContent,
      ...MANDATE_SECTIONS // Always include the mandate sections
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
export async function updateContentDatabase() {
  try {
    console.log("Updating content database...");
    toast.info("Refreshing content database...");
    
    // Clear existing content
    vectorDb.clearDocuments();
    
    // Re-fetch all content
    await initializeContentDatabase();
    
    return true;
  } catch (error) {
    console.error("Error updating content database:", error);
    toast.error("Failed to update content database");
    return false;
  }
}

// Schedule regular updates (e.g., daily)
export function scheduleContentUpdates() {
  const updateInterval = websiteConfig.refreshInterval;
  
  // Set up interval for content updates
  setInterval(async () => {
    console.log("Running scheduled content update...");
    await updateContentDatabase();
  }, updateInterval);
  
  console.log(`Content updates scheduled every ${updateInterval / (60 * 60 * 1000)} hours`);
}
