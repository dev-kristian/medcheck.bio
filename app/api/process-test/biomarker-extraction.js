const fs = require('fs');
const OpenAI = require('openai');
const { z } = require('zod');
const { zodResponseFormat } = require('openai/helpers/zod');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.NEXT_PRIVATE_OPENAI_API_KEY,
});

// Define the schema for biomarker extraction
const Biomarker = z.object({
  name: z.string().describe("The short name of the biomarker, e.g., 'LDL'. This should be a concise identifier that is commonly used in medical contexts."),
  long_name: z.string().describe("The full name of the biomarker, e.g., 'Low-Density Lipoprotein'. This should provide a complete and clear description of what the biomarker represents."),
  value: z.string().describe("The measured value of the biomarker, e.g., '120'. This should include the numerical value obtained from the test."),
  unit: z.string().optional().describe("The unit of measurement for the biomarker, e.g., 'mg/dL'. This should specify the units in which the biomarker value is expressed."),
  reference_range: z.string().optional().describe("The reference range for the biomarker, e.g., '100-129 mg/dL'. This should indicate the normal range of values for the biomarker, providing context for the measured value."),
  info: z.string().describe("The description of what the biomarker is for, e.g., 'Hemoglobin is a protein in red blood cells that carries oxygen."),
});

// Define the schema for biomarker interpretation
const BiomarkerInterpretation = z.object({
  name: z.string().describe("The short name of the biomarker, e.g., 'LDL'. This should match the name used in the biomarker extraction."),
  state: z.enum([
    "extremely low",
    "very low",
    "low",
    "normal",
    "high",
    "very high",
    "extremely high"
  ]).describe("The interpretation of the biomarker value based on the reference range. This should categorize the value into one of the specified levels, providing a clear assessment of whether the value is within normal limits or indicates a potential health concern."),
  state_description: z.string().describe("A professional interpretation of the biomarker state. For example, if the state of WBC is 'high', the description might be 'Elevated white blood cell count may indicate an ongoing infection or inflammatory process.' This should provide context and potential implications of the biomarker state."),
  personalized_context: z.string().describe("Detailed interpretation in the context of the user's profile data."),
});

// Define the schema for clinical significance
const ClinicalSignificance = z.object({
  name: z.string().describe("The name of the condition related to the biomarker, e.g., 'Hypercholesterolemia'. This should identify the medical condition that is associated with the biomarker."),
  reason: z.string().describe("The reason why this condition is significant, e.g., 'Elevated LDL levels are associated with an increased risk of cardiovascular disease. High levels of LDL cholesterol can lead to the buildup of plaque in the arteries, a condition known as atherosclerosis. This can reduce or block blood flow, increasing the risk of heart attacks, strokes, and other cardiovascular diseases. Managing LDL levels through lifestyle changes and medication can significantly reduce these risks.'"),
  severity: z.enum(['low', 'moderate', 'high', 'critical']).describe("The severity of the clinical significance."),
  risk_factors: z.array(z.string()).describe("Risk factors from the user's profile that may contribute to this condition."),
  preventive_measures: z.array(z.string()).describe("Preventive measures tailored to the user's profile."),
});

// Define the schema for general recommendations
const GeneralRecommendation = z.object({
  name: z.string().describe("The name of the general recommendation, e.g., 'Increase physical activity'. This should suggest a specific action that the user can take to improve their health."),
  reason: z.string().describe("The reason for this recommendation, e.g., 'Regular exercise can help lower LDL levels. Engaging in physical activities such as walking, jogging, cycling, or swimming for at least 150 minutes a week can improve cardiovascular health. Exercise helps increase the levels of high-density lipoprotein (HDL), the 'good' cholesterol, and decreases triglycerides. This combination can lead to a healthier lipid profile and reduced risk of cardiovascular diseases.'"),
  priority: z.enum(['low', 'medium', 'high']).describe("The priority of this recommendation."),
  difficulty: z.enum(['easy', 'moderate', 'challenging']).describe("The difficulty level of implementing this recommendation."),
  timeframe: z.string().describe("The expected timeframe to see results, e.g., '2-3 weeks'."),
});

// Define the schema for dietary recommendations
const DietaryRecommendation = z.object({
  name: z.string().describe("The name of the dietary recommendation."),
  reason: z.string().describe("The reason for this recommendation."),
  foods: z.array(z.object({
    type: z.enum(["recommended", "to avoid"]).describe("Indicates whether the food is recommended or should be avoided."),
    name: z.string().describe("The name of the food item."),
  })).describe("A list of 5 to 10 specific foods that are recommended or should be avoided."),
  nutrient_focus: z.array(z.string()).describe("Key nutrients to focus on based on biomarker results."),
  lifestyle_adjustments: z.string().describe("Suggested lifestyle adjustments to support dietary changes."),
  hydration_recommendation: z.string().describe("Personalized hydration recommendation based on user profile and biomarkers.")
});

// Define the schema for specialty consultations
const SpecialtyConsultation = z.object({
  name: z.string().describe("The name of the specialist."),
  reason: z.string().describe("The detailed reason for recommending this specialist."),
  urgency: z.enum(['routine', 'soon', 'urgent']).describe("The urgency of the consultation."),
});

// Define the schema for test type
const TestType = z.enum([
  "Complete Blood Count",
  "Thyroid Function Test",
  "Liver Function Test",
  "Kidney Function Test",
  "Lipid Profile",
  "Urine Analysis",
  "Blood Glucose Test",
  "Electrolyte Panel",
  "Hormone Panel",
  "Vitamin and Mineral Panel",
  "Metabolic Panel",
  "Inflammatory Markers Panel",
  "Cardiovascular Risk Panel",
  "Autoimmune Panel",
  "Allergy Panel",
  "Nutritional Deficiency Panel",
  "Heavy Metal Toxicity Screen",
  "Gut Microbiome Analysis",
  "Genomic Screening Panel",
  "Cancer Marker Panel",
  "Other"
]).describe("The type of medical test.");

// Define the schema for test date
const TestDate = z.union([
  z.string().describe("The timestamp of the test, e.g., '2024-08-15T16:12:29.869Z'. This should be in ISO 8601 format."),
  z.null()
]).describe("The date and time when the test was conducted. This should be a timestamp in ISO 8601 format, or null if not available.");

async function extractBiomarkers(image, profileData) {
  console.log(`Starting biomarker extraction`);
  const messages = [
    { role: "system", content: "You are an AI assistant that extracts biomarker information from medical test images." },
    { 
      role: "user", 
      content: [
        {
          type: "text",
          text: `Extract all biomarkers from the following medical test image. Include the name, long name, value, unit (if available), and reference range (if available) for each biomarker.`
        },
        {
          type: "image_url",
          image_url: {
            url: `data:image/jpeg;base64,${image}`,
            detail: "high"
          }
        }
      ]
    }
  ];

  try {
    const completion = await openai.beta.chat.completions.parse({
      model: "gpt-4o-2024-08-06",
      messages: messages,
      response_format: zodResponseFormat(z.object({
        test_type: TestType,
        test_date: TestDate,
        biomarkers: z.array(Biomarker)
      }), "biomarker_extraction"),
    });

    const extractionResult = completion.choices[0].message;
    if (extractionResult.parsed) {
      console.log(`Biomarker extraction successful`);
      return extractionResult.parsed;
    } else if (extractionResult.refusal) {
      console.log('Model refused to process the request:', extractionResult.refusal);
      return null;
    }
  } catch (e) {
    console.log("An error occurred during biomarker extraction: ", e.message);
    return null;
  }
}

async function interpretBiomarkers(extractedData, profileData) {
  console.log(`Starting biomarker interpretation`);
  const messages = [
    { role: "system", content: "You are an AI assistant that provides detailed interpretations and recommendations based on biomarker information." },
    { 
      role: "user", 
      content: `Provide detailed interpretations, clinical significance, general recommendations, dietary recommendations, and specialty consultations based on the following biomarker data: ${JSON.stringify(extractedData)}. User profile data: Age: ${profileData.age}, Gender: ${profileData.gender}, Height: ${profileData.height}, Weight: ${profileData.weight}, Medical History: ${JSON.stringify(profileData.medicalHistory)}`
    }
  ];

  try {
    const completion = await openai.beta.chat.completions.parse({
      model: "gpt-4o-2024-08-06",
      messages: messages,
      response_format: zodResponseFormat(z.object({
        interpretations: z.array(BiomarkerInterpretation),
        clinical_significance: z.array(ClinicalSignificance),
        general_recommendations: z.array(GeneralRecommendation),
        dietary_recommendations: z.array(DietaryRecommendation),
        specialty_consultations: z.array(SpecialtyConsultation)
      }), "biomarker_interpretation"),
    });

    const interpretationResult = completion.choices[0].message;
    if (interpretationResult.parsed) {
      console.log(`Biomarker interpretation successful`);
      return interpretationResult.parsed;
    } else if (interpretationResult.refusal) {
      console.log('Model refused to process the request:', interpretationResult.refusal);
      return null;
    }
  } catch (e) {
    console.log("An error occurred during biomarker interpretation: ", e.message);
    return null;
  }
}

async function extractAndInterpretBiomarkers(images, profileData) {
  console.log(`Starting processing for ${images.length} images`);

  const results = await Promise.all(images.map(async (base64Image, index) => {
    console.log(`Processing image ${index + 1}`);

    console.log(`Extracting biomarkers for image ${index + 1}`);
    const extractedData = await extractBiomarkers(base64Image, profileData);
    if (!extractedData) {
      console.log(`Failed to extract biomarkers for image ${index + 1}`);
      return null;
    }
    console.log(`Successfully extracted biomarkers for image ${index + 1}:`, JSON.stringify(extractedData, null, 2));

    console.log(`Interpreting biomarkers for image ${index + 1}`);
    const interpretationData = await interpretBiomarkers(extractedData, profileData);
    if (!interpretationData) {
      console.log(`Failed to interpret biomarkers for image ${index + 1}`);
      return null;
    }
    console.log(`Successfully interpreted biomarkers for image ${index + 1}:`, JSON.stringify(interpretationData, null, 2));

    return {
      ...extractedData,
      ...interpretationData
    };
  }));

  console.log(`Finished processing all images`);

  const groupedResults = results.reduce((acc, report) => {
    if (report) {
      if (!acc[report.test_type]) {
        acc[report.test_type] = [];
      }
      acc[report.test_type].push(report);
    }
    return acc;
  }, {});

  console.log(`Grouped results:`, JSON.stringify(groupedResults, null, 2));

  return groupedResults;
}

module.exports = { extractAndInterpretBiomarkers };
