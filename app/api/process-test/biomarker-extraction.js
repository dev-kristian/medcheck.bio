//app/api/process-test/test-biomarker-extraction.js

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
  trend: z.enum(['increasing', 'decreasing', 'stable', 'fluctuating', 'unknown']).optional().describe("The trend of this biomarker compared to previous measurements, if available in the user profile data."),
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
  "Cancer Marker Panel"
]).describe("The type of medical test.");

// Define the schema for test date
const TestDate = z.union([
  z.string().describe("The timestamp of the test, e.g., '2024-08-15T16:12:29.869Z'. This should be in ISO 8601 format."),
  z.null()
]).describe("The date and time when the test was conducted. This should be a timestamp in ISO 8601 format, or null if not available.");

// Define the combined schema for the entire report
const BiomarkerReport = z.object({
  test_type: TestType.describe("The type of medical test that the biomarkers are extracted from."),
  test_date: TestDate.describe("The date and time when the test was conducted."),
  biomarkers: z.array(Biomarker).describe("A list of extracted biomarkers. Each biomarker should include detailed information about its name, long name, value, unit (if available), and reference range (if available)."),
  interpretations: z.array(BiomarkerInterpretation).describe("A list of interpretations for the extracted biomarkers. Each interpretation should categorize the biomarker value into one of the specified levels, providing a clear assessment of whether the value is within normal limits or indicates a potential health concern."),
  clinical_significance: z.array(ClinicalSignificance).describe("A list of clinical significances for the report. Each significance should provide a detailed explanation of the clinical implications of the biomarker values, including potential health risks and the importance of monitoring or addressing the condition."),
  general_recommendations: z.array(GeneralRecommendation).describe("A list of general recommendations for the report. Each recommendation should suggest a specific action that the user can take to improve their health, along with a detailed explanation of why the recommendation is beneficial."),
  dietary_recommendations: z.array(DietaryRecommendation).describe("A list of dietary recommendations for the report. Each recommendation should suggest a specific dietary change that the user can make to improve their health, along with a detailed explanation of why the dietary change is beneficial. Additionally, it should include a list of specific foods that are recommended or should be avoided based on the dietary recommendation."),
  specialty_consultations: z.array(SpecialtyConsultation).describe("A list of specialty consultations for the report. Each consultation should identify the type of medical specialist that the user should consult, along with a detailed explanation of why consulting the specialist is important."),
});

async function extractAndInterpretBiomarkers(images, profileData) {
  const results = await Promise.all(images.map(async (base64Image) => {
    const messages = [
      { role: "system", content: "You are an AI assistant that extracts biomarker information from medical test images and provides detailed interpretations for each biomarker." },
      { 
        role: "user", 
        content: [
          {
            type: "text",
            text: `Extract all biomarkers from the following medical test image. Include the name, long name, value, unit (if available), and reference range (if available) for each biomarker.
            Then provide a detailed interpretation for each biomarker as one of the following categories: extremely low, very low, low, normal, high, very high, extremely high.
            Additionally, provide detailed clinical significance, general recommendations, dietary recommendations, and specialty consultations for the entire report.
            Ensure that each section is comprehensive and provides in-depth information. User profile data: Age: ${profileData.age}, Gender: ${profileData.gender}, Height: ${profileData.height}, Weight: ${profileData.weight}, Medical History: ${JSON.stringify(profileData.medicalHistory)}`
          },
          {
            type: "image_url",
            image_url: {
              url: `data:image/jpeg;base64,${base64Image}`,
              detail: "high"
            }
          }
        ]
      }
    ];

    try {
      const completion = await openai.beta.chat.completions.parse({
        model: "gpt-4o-mini",
        messages: messages,
        response_format: zodResponseFormat(BiomarkerReport, "biomarker_report"),
        temperature: 0.2,
      });

      const biomarkerReport = completion.choices[0].message;
      if (biomarkerReport.parsed) {
        return biomarkerReport.parsed;
      } else if (biomarkerReport.refusal) {
        console.log('Model refused to process the request:', biomarkerReport.refusal);
        return null;
      }
    } catch (e) {
      if (e.constructor.name === "LengthFinishReasonError") {
        console.log("Too many tokens: ", e.message);
      } else {
        console.log("An error occurred: ", e.message);
      }
      return null;
    }
  }));

  const groupedResults = results.reduce((acc, report) => {
    if (report) {
      if (!acc[report.test_type]) {
        acc[report.test_type] = [];
      }
      acc[report.test_type].push(report);
    }
    return acc;
  }, {});

  return groupedResults;
}

module.exports = { extractAndInterpretBiomarkers };