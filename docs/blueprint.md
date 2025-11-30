# **App Name**: HealthHub Rural

## Core Features:

- Role-Based Authentication: Secure authentication using Firebase Auth with custom claims or user documents to manage roles (Admin, Doctor, Nurse, Receptionist, Pharmacist, LabTech) and enforce access control.
- Patient Records Management: Create, view, and update patient profiles with key information (name, dob, gender, contact details, medical history) stored in Firestore. Different roles have different read and write access.
- AI-Powered Risk Analysis: A Cloud Function that, with patient consent, uses an external LLM tool to analyze patient history, vitals, and lab reports to provide a structured risk assessment (riskLevel, riskFactors, evidence, recommendation).
- Appointment Scheduling and Management: Allow receptionists to create appointments, and allow doctors and nurses to view appointments. The app notifies users about upcoming appointments.
- Billing and Invoicing: Automatically generate draft bills upon patient discharge, including itemized service charges. Receptionists can initiate the billing flow, while admin roles are required to finalize billing. Printable bills that match provided screenshots.
- Lab Report Management: Lab technicians and doctors can upload lab reports, associate them with patients and visits, and view lab-related sections of patient records. Uploads are stored in Firebase Storage.
- Audit Logging: Log all sensitive actions (create, update, delete patient data, discharge, bill finalization) in an audit_logs collection for compliance and accountability.

## Style Guidelines:

- Primary color: Forest green (#388E3C) evoking health, nature, and trust, which aligns well with a healthcare application focused on rural health.
- Background color: Very light green (#F1F8E9), offering a soft, unobtrusive backdrop that doesn't distract from content, but still harmonizes with the theme.
- Accent color: Teal (#008080), to give prominence to important CTAs or UI elements in places the forest green color may be overused.
- Body text font: 'PT Sans', a humanist sans-serif that offers a balance of modernity and warmth for a welcoming feel.
- Headline font: 'Playfair', a serif font intended to give the headers a more sophisticated feel, without clashing with the simple san-serif body text. 
- Code font: 'Source Code Pro' for any code snippets that may be displayed.
- Use clear, intuitive icons sourced from a consistent library (e.g., Material Design Icons) to represent different sections and actions, ensuring easy navigation and understanding.
- Pixel-perfect replication of provided screenshots (layout, spacing, color palette, card styles, modals, buttons) for desktop and responsive tablet/mobile. Rounded card corners, soft shadows and consistent inner padding.
- Use subtle animations for transitions and interactions to enhance the user experience without being distracting. This could include fade-in effects, button presses, or loading animations.