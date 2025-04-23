
import WellnessCalculatorHub from "@/components/WellnessCalculatorHub";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100">
      <WellnessCalculatorHub />
      
      <div className="max-w-4xl mx-auto p-8 mt-8 bg-white rounded-lg shadow-sm">
        <h2 className="text-2xl font-bold mb-6">WordPress Integration Guide</h2>
        
        <div className="prose max-w-none">
          <h3>Integrating with WordPress (Kadence/Spectra)</h3>
          <p>
            To integrate these calculators into your WordPress site using Kadence/Spectra, follow these steps:
          </p>
          
          <h4>Option 1: Using Code Snippets Plugin (Recommended)</h4>
          <ol>
            <li>Install and activate the "Code Snippets" plugin from the WordPress plugin repository</li>
            <li>Create a new snippet for each calculator (or one large snippet for all calculators)</li>
            <li>
              For each snippet:
              <ul>
                <li>Set it to run on the frontend</li>
                <li>Include the required CSS, HTML, and JavaScript for the calculator</li>
                <li>Create a shortcode to display the calculator on your pages</li>
              </ul>
            </li>
            <li>Add your shortcode to the desired page using Kadence/Spectra blocks</li>
          </ol>
          
          <h4>Option 2: Using Custom HTML Block</h4>
          <ol>
            <li>Create a new page in WordPress</li>
            <li>Add a Custom HTML block using Kadence/Spectra</li>
            <li>Copy the rendered HTML from this application</li>
            <li>Add necessary JavaScript and CSS in the header using Kadence settings</li>
          </ol>
          
          <h4>Option 3: Using iFrame (Simplest)</h4>
          <ol>
            <li>Host this React application on a subdomain (e.g., calculators.survivewellness.com)</li>
            <li>Embed the application using an iFrame in your WordPress pages</li>
            <li>Add custom CSS to style the iFrame properly</li>
          </ol>
          
          <h3>Required Files for Integration</h3>
          <p>For each calculator, you'll need:</p>
          <ul>
            <li>HTML structure (the rendered output)</li>
            <li>CSS for styling (can be added to your theme's custom CSS)</li>
            <li>JavaScript for calculations and interactivity</li>
          </ul>
          
          <h3>Steps for Best Integration</h3>
          <ol>
            <li>Export the JavaScript calculation functions for each calculator</li>
            <li>Create HTML forms matching the structure of the React components</li>
            <li>Add the necessary CSS to your theme</li>
            <li>Integrate the JavaScript to handle form submission and display results</li>
            <li>Implement validation similar to what's done in the React components</li>
          </ol>
          
          <h3>Implementing Copy and Download Functionality</h3>
          <p>
            To implement the copy and download features in WordPress:
          </p>
          <ol>
            <li>Include the JavaScript functions for creating CSV content</li>
            <li>Add event listeners to copy and download buttons</li>
            <li>Use the browser's clipboard API or a Clipboard.js library</li>
          </ol>
          
          <p>
            <strong>Note:</strong> For the most seamless integration, consider using a headless WordPress 
            setup or embedding the React application directly. If you need specific code for WordPress integration, 
            please reach out for customized solutions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
