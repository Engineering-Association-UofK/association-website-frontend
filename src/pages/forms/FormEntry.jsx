// import React, { useState } from 'react';
// import { Container, Form, Button, Row, Col, Card, Badge, Modal } from 'react-bootstrap';
// import { useNavigate } from 'react-router-dom';
// import ApplicationForm from './ApplicationForm'; 
// import { authFetch, endpoints } from '../../config/api';

// const FormEntry = () => {
//   const navigate = useNavigate();
//   const [isSaving, setIsSaving] = useState(false);
//   const [formName, setFormName] = useState('');
//   const [category, setCategory] = useState('competitions');
//   const [description, setDescription] = useState('');
//   const [openDate, setOpenDate] = useState('');
//   const [closeDate, setCloseDate] = useState('');
//   const [showPreview, setShowPreview] = useState(false);
//   const [allowMultiple, setAllowMultiple] = useState(false);

//   const [pages, setPages] = useState([
//     { id: Date.now(), title: 'Step 1', fields: [] }
//   ]);
//   const [activePageIndex, setActivePageIndex] = useState(0);

  // // Dynamic updates
  
  // Saving everything in a loop at the end would take a long
  // time and is risky, if one call failed it will prevent the 
  // rest from completing, and the saved data would be incomplete.
  
  // That's why creating questions and pages (By calling the backend API)
  // when the '+' button is pressed is the standard way to do it, it's state 
  // safe and saves the admin from waiting an hour for the form creation.
  
  // The loop is basically O(n) meaning the bigger the form, the more time 
  // it will take, And API calls (plus database calls in there) are heavy.
  

//   // To track form for dynamic updates
//   const [formId, setFormId] = useState(null);

//   // Initialize form first
//   const initializeForm = async () => {
//     if (!formName.trim()) return alert("Please enter a Form Name!");
//     setIsSaving(true);
    
//     try {
//       // Create Form
//       const formRes = await authFetch(endpoints.forms, {
//         method: 'POST',
//         body: JSON.stringify({
//           title: formName, description, allow_multiple: allowMultiple,
//           start_date: openDate, end_date: closeDate, type: category
//         })
//       });
//       const savedForm = await formRes.json();
//       setFormId(savedForm.id); // Save form ID

//       // Update local state with real backend IDs
//       setPages([{ id: firstPage.id, title: 'Step 1', fields: [] }]);
      
//     } catch (err) {
//       alert("Failed to initialize form.");
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   // Update the add page button to call the API
//   const addPage = async () => {
//   if (pages.length >= 7) return alert("Maximum 7 pages recommended.");
  
//   try {
//     // Create the page in the backend
//     const pageRes = await authFetch(endpoints.pages, {
//       method: 'POST',
//       body: JSON.stringify({ form_id: formId, page_num: pages.length + 1 })
//     });
//     const newBackendPage = await pageRes.json();

//     // Add to UI state
//     const newPage = { id: newBackendPage.id, title: `Step ${pages.length + 1}`, fields: [] };
//     setPages([...pages, newPage]);
//     setActivePageIndex(pages.length);
//   } catch (err) {
//     alert("Failed to add page.");
//   }
// };

//   const removePage = (index) => {
//     if (pages.length === 1) return;
//     const updated = pages.filter((_, i) => i !== index);
//     setPages(updated);
//     setActivePageIndex(0);
//   };

//   const addField = (fieldType) => {
//     const newField = {
//       id: Date.now(),
//       type: fieldType,
//       subType: 'short', // Default for text
//       label: '',
//       isRequired: false,
//       options: fieldType === 'choice' ? ['Option 1'] : []
//     };
//     const updatedPages = [...pages];
//     updatedPages[activePageIndex].fields.push(newField);
//     setPages(updatedPages);
//   };

//   const updateField = (fieldId, key, value) => {
//     const updatedPages = pages.map((page, pIdx) => {
//       if (pIdx === activePageIndex) {
//         return {
//           ...page,
//           fields: page.fields.map(f => f.id === fieldId ? { ...f, [key]: value } : f)
//         };
//       }
//       return page;
//     });
//     setPages(updatedPages);
//   };



  // const handleSave = (status) => {
  //   if (!formName || !closeDate) {
  //     alert("Please enter a form name and a close date!");
  //     return;
  //   }
  //   const newFormEntry = {
  //     id: Date.now(), title: formName, description, category, status,
  //     openDate, closeDate, pages, createdAt: new Date().toLocaleDateString(), submissions: 0
  //   };
  //   const existingForms = JSON.parse(localStorage.getItem('myCustomForms') || '[]');
  //   localStorage.setItem('myCustomForms', JSON.stringify([newFormEntry, ...existingForms]));
  //   alert(status === 'published' ? "🚀 Form Published!" : "💾 Draft Saved!");
  //   navigate('/admin/forms');
  // };
// const handleSave = async (status) => {
//   try {
//     // 1. Create Form
//     const formRes = await fetch(endpoints.forms, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         title: formName,
//         description: description || "No description provided",
//         is_active: true, // Force true for testing
//         allow_multiple: false,
//         //header_image_id: 1
//       })
//     });

//     const savedForm = await formRes.json();
//     console.log("Form Saved with ID:", savedForm.id); // CHECK THIS IN CONSOLE

//     if (!savedForm.id) {
//        alert("Server didn't return a Form ID!");
//        return;
//     }

//     // 2. Create Page
//     const pageRes = await fetch(endpoints.pages, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         form_id: savedForm.id,
//         page_num: 1
//       })
//     });
//     const savedPage = await pageRes.json();
//     console.log("Page Saved with ID:", savedPage.id);

//     alert("🚀 Form Synced! Refresh the browser link now.");
//     navigate('/admin/forms');
//   } catch (err) {
//     console.error("Fetch Error:", err);
//   }
// };
// const handleSave = async (status) => {
//   if (!formName.trim()) return alert("Please enter a Form Name!");

//   try {
//     // STEP 1: Create Form
//     console.log("Step 1: Creating form...");
//     const formRes = await authFetch(endpoints.forms, {
//       method: 'POST',
//       body: JSON.stringify({
//         title: formName,
//         description: description || "No description",
//         allow_multiple: false,
//         is_active: status === 'published',
//         header_image_id: 2
//       })
//     });
//     console.log("Form response status:", formRes.status);
//     const savedForm = await formRes.json();
//     console.log("Form response body:", JSON.stringify(savedForm));
//     if (!savedForm.id) return alert("Form creation failed");
//     const formId = savedForm.id;

//     // STEP 2: Create first page only to test
//     console.log("Step 2: Creating page for form ID:", formId);
//     const pageRes = await authFetch(endpoints.pages, {
//       method: 'POST',
//       body: JSON.stringify({
//         form_id: formId,
//         page_num: 1
//       })
//     });
//     console.log("Page response status:", pageRes.status);
//     const savedPage = await pageRes.json();
//     console.log("Page response body:", JSON.stringify(savedPage));

//   } catch (err) {
//     console.error("❌ Error:", err);
//   }
// };

// const handleSave = async (status) => {
//   if (!formName.trim()) return alert("Please enter a Form Name!");

//   try {
//     // 1. Create the Form
//     const formRes = await authFetch(endpoints.forms, {
//       method: 'POST',
//       body: JSON.stringify({
//         title: formName,
//         description: description || "No description",
//         allow_multiple: false,
//         is_active: status === 'published',
//         header_image_id: 2
//       })
//     });

//     if (!formRes.ok) {
//       const err = await formRes.text();
//       return alert(`Failed to create form: ${err}`);
//     }

//     const savedForm = await formRes.json();
//     const formId = savedForm.id;
//     console.log("✅ Form created, ID:", formId);

//     // 2. Create Pages one by one
//     for (let i = 0; i < pages.length; i++) {
//       const pageRes = await authFetch(endpoints.pages, {
//         method: 'POST',
//         body: JSON.stringify({
//           form_id: formId,
//           page_num: i + 1  // 1, 2, 3...
//         })
//       });

//       // 409 = page already exists, skip and continue
//       if (pageRes.status === 409) {
//         console.warn(`Page ${i + 1} already exists, skipping...`);
//         continue;
//       }

//       if (!pageRes.ok) {
//         const err = await pageRes.text();
//         console.error(`Failed to create page ${i + 1}:`, err);
//         continue;
//       }

//       const savedPage = await pageRes.json();
//       const pageId = savedPage.id;
//       console.log(`✅ Page ${i + 1} created, ID:`, pageId);

//       // 3. Create Questions for this page
//       for (let j = 0; j < pages[i].fields.length; j++) {
//         const field = pages[i].fields[j];

//         const typeMap = {
//           text: field.subType === 'long' ? 'PARAGRAPH' : 'TEXT',
//           number: 'NUMBER',
//           choice: 'RADIO',
//           date: 'TEXT',
//           file: 'TEXT',
//         };

//         let options = null;
//         if (field.type === 'number') {
//           options = { min: 0, max: 100 };
//         } else if (field.type === 'choice') {
//           options = field.options;
//         }

//         const questionRes = await authFetch(endpoints.questions, {
//           method: 'POST',
//           body: JSON.stringify({
//             form_page_id: pageId,
//             question_text: field.label || `Question ${j + 1}`,
//             type: typeMap[field.type] || 'TEXT',
//             options: options,
//             is_required: field.isRequired,
//             display_order: j + 1
//           })
//         });

//         if (!questionRes.ok) {
//           const err = await questionRes.text();
//           console.error(`Failed to create question ${j + 1}:`, err);
//         } else {
//           const savedQ = await questionRes.json();
//           console.log(`✅ Question created, ID:`, savedQ.id);
//         }
//       }
//     }

//     alert(status === 'published' ? "🚀 Form Published!" : "💾 Draft Saved!");
//     navigate('/admin/forms');

//   } catch (err) {
//     console.error("❌ Error:", err);
//     alert("Connection failed. Is the server online?");
//   }
// };

// const handleSave = async (status) => {
//   if (!formName.trim()) return alert("Please enter a Form Name!");

//   try {
//     // --- 1. Create the Form ---
//     const formRes = await authFetch(endpoints.forms, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         title: formName,
//         description: description || "No description",
//         allow_multiple: false,
//         is_active: status === 'published',
//         //header_image_id: 2
//       })
//     })

//     if (!formRes.ok) {
//       const err = await formRes.text();
//       return alert(`Failed to create form: ${err}`);
//     }

//     const savedForm = await formRes.json();
//     const formId = savedForm.id;
//     console.log("✅ Form created, ID:", formId);

//     // --- 2. Create Pages and Questions ---
//     for (let i = 0; i < pages.length; i++) {
//       const pageRes = await authFetch(endpoints.pages, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ form_id: formId, page_num: i + 1 })
//       });

//       if (!pageRes.ok) {
//         const err = await pageRes.text();
//         return alert(`Failed to create page ${i + 1}: ${err}`);
//       }

//       const savedPage = await pageRes.json();
//       const pageId = savedPage.id;
//       console.log(`✅ Page ${i + 1} created, ID:`, pageId);

//       // --- 3. Create Questions for this Page ---
//       for (let j = 0; j < pages[i].fields.length; j++) {
//         const field = pages[i].fields[j];

//         // Map your frontend types → backend types
//         const typeMap = {
//           text: field.subType === 'long' ? 'PARAGRAPH' : 'TEXT',
//           number: 'NUMBER',
//           choice: 'RADIO',   // You can later add CHECKBOX/DROPDOWN support
//           date: 'TEXT',
//           file: 'TEXT',
//         };

//         // Map options based on type
//         let options = null;
//         if (field.type === 'number') {
//           options = { min: 0, max: 100 };
//         } else if (field.type === 'choice') {
//           options = field.options; // Already an array of strings
//         }

//         const questionRes = await authFetch(endpoints.questions, {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({
//             form_page_id: pageId,
//             question_text: field.label || `Question ${j + 1}`,
//             type: typeMap[field.type] || 'TEXT',
//             options: options,
//             is_required: field.isRequired,
//             display_order: j + 1
//           })
//         });

//         if (!questionRes.ok) {
//           const err = await questionRes.text();
//           console.error(`Failed to create question ${j + 1}:`, err);
//         } else {
//           const savedQ = await questionRes.json();
//           console.log(`✅ Question created, ID:`, savedQ.id);
//         }
//       }
//     }

//     alert(status === 'published' ? "🚀 Form Published!" : "💾 Draft Saved!");
//     navigate('/admin/forms');

//   } catch (err) {
//     console.error("❌ Error:", err);
//     alert("Connection failed. Is the server online?");
//   }
// };

// const handleSave = async (status) => {
//   if (!formName.trim()) return alert("Please enter a Form Name!");

//   try {
//     // STEP 1: Create Form
//     console.log("Step 1: Creating form...");
//     const formRes = await authFetch(endpoints.forms, {
//       method: 'POST',
//       body: JSON.stringify({
//         title: formName,
//         description: description || "No description",
//         allow_multiple: false,
//         is_active: status === 'published'
//         // ❌ removed header_image_id — causes 500
//       })
//     });

//     const savedForm = await formRes.json();
//     console.log("✅ Form created, ID:", savedForm.id);
//     if (!savedForm.id) return alert("Form creation failed");
//     const formId = savedForm.id;

//     // STEP 2: Create Pages
//     for (let i = 0; i < pages.length; i++) {
//       console.log(`Step 2: Creating page ${i + 1}...`);
//       const pageRes = await authFetch(endpoints.pages, {
//         method: 'POST',
//         body: JSON.stringify({
//           form_id: formId,
//           page_num: i + 1
//         })
//       });

//       if (pageRes.status === 409) {
//         console.warn(`Page ${i + 1} already exists, skipping...`);
//         continue;
//       }

//       const savedPage = await pageRes.json();
//       console.log(`✅ Page ${i + 1} created, ID:`, savedPage.id);
//       if (!savedPage.id) continue;
//       const pageId = savedPage.id;

//       // STEP 3: Create Questions for this page
//       // for (let j = 0; j < pages[i].fields.length; j++) {
//       //   const field = pages[i].fields[j];

//       //   const typeMap = {
//       //     text: field.subType === 'long' ? 'PARAGRAPH' : 'TEXT',
//       //     number: 'NUMBER',
//       //     choice: 'RADIO',
//       //     date: 'TEXT',
//       //     file: 'TEXT',
//       //   };

//       //   let options = null;
//       //   if (field.type === 'number') {
//       //     options = { min: 0, max: 100 };
//       //   } else if (field.type === 'choice') {
//       //     options = field.options;
//       //   }

//       //   console.log(`Step 3: Creating question ${j + 1} for page ${i + 1}...`);
//       //   const questionRes = await authFetch(endpoints.questions, {
//       //     method: 'POST',
//       //     body: JSON.stringify({
//       //       form_page_id: pageId,
//       //       question_text: field.label || `Question ${j + 1}`,
//       //       type: typeMap[field.type] || 'TEXT',
//       //       options: options,
//       //       is_required: field.isRequired,
//       //       display_order: j + 1
//       //     })
//       //   });

//       //   const savedQ = await questionRes.json();
//       //   console.log(`✅ Question ${j + 1} created:`, JSON.stringify(savedQ));
//       // }


//       // STEP 3: Create Questions for this page
// for (let j = 0; j < pages[i].fields.length; j++) {
//   const field = pages[i].fields[j];

//   const typeMap = {
//     text: field.subType === 'long' ? 'PARAGRAPH' : 'TEXT',
//     number: 'NUMBER',
//     choice: 'RADIO',
//     date: 'TEXT',
//     file: 'TEXT',
//   };

//   let options = null;
//   if (field.type === 'number') {
//     options = { min: 0, max: 100 };
//   } else if (field.type === 'choice') {
//     options = field.options;
//   }

//   const questionPayload = {
//     form_page_id: pageId,
//     question_text: field.label || `Question ${j + 1}`,
//     type: typeMap[field.type] || 'TEXT',
//     options: options,
//     is_required: field.isRequired,
//     display_order: j + 1
//   };

//   console.log(`Creating question ${j + 1}:`, JSON.stringify(questionPayload));

//   const questionRes = await authFetch(endpoints.questions, {
//     method: 'POST',
//     body: JSON.stringify(questionPayload)
//   });

//   console.log(`Question ${j + 1} status:`, questionRes.status);
//   const questionData = await questionRes.json();
//   console.log(`Question ${j + 1} response:`, JSON.stringify(questionData));
// }
//     }

//     alert(status === 'published' ? "🚀 Form Published!" : "💾 Draft Saved!");
//     navigate('/admin/forms');

//   } catch (err) {
//     console.error("❌ Error:", err);
//     alert("Connection failed. Is the server online?");
//   }
// };

// const handleSave = async (status) => {
//   if (!formName.trim()) return alert("Please enter a Form Name!");

//   try {
//     // STEP 1: Create Form
//     console.log("Step 1: Creating form...");
//     const formRes = await authFetch(endpoints.forms, {
//       method: 'POST',
//       body: JSON.stringify({
//         title: formName,
//         description: description || "No description",
//         allow_multiple: false,
//         is_active: status === 'published'
//       })
//     });

//     const savedForm = await formRes.json();
//     console.log("✅ Form created, ID:", savedForm.id);
//     if (!savedForm.id) return alert("Form creation failed");
//     const formId = savedForm.id;

//     // STEP 2: Fetch the form immediately to get auto-created pages
//     console.log("Step 2: Fetching form structure...");
//     const formDetailRes = await authFetch(`${endpoints.forms}/${formId}`);
//     const formDetail = await formDetailRes.json();
//     console.log("Form detail:", JSON.stringify(formDetail));

//     // Get existing pages from backend
//     let existingPages = formDetail.pages || [];

//     // Create any missing pages
//     for (let i = 0; i < pages.length; i++) {
//       const existingPage = existingPages.find(p => p.page_num === i + 1);
      
//       if (!existingPage) {
//         console.log(`Creating missing page ${i + 1}...`);
//         const pageRes = await authFetch(endpoints.pages, {
//           method: 'POST',
//           body: JSON.stringify({ form_id: formId, page_num: i + 1 })
//         });
//         const newPage = await pageRes.json();
//         existingPages.push(newPage);
//         console.log(`✅ Page ${i + 1} created, ID:`, newPage.id);
//       } else {
//         console.log(`✅ Page ${i + 1} already exists, ID:`, existingPage.id);
//       }
//     }

//     // STEP 3: Create Questions using correct page IDs
//     for (let i = 0; i < pages.length; i++) {
//       const backendPage = existingPages.find(p => p.page_num === i + 1);
//       if (!backendPage) {
//         console.error(`No backend page found for page ${i + 1}`);
//         continue;
//       }
//       const pageId = backendPage.id;

//       for (let j = 0; j < pages[i].fields.length; j++) {
//         const field = pages[i].fields[j];

//         const typeMap = {
//           text: field.subType === 'long' ? 'PARAGRAPH' : 'TEXT',
//           number: 'NUMBER',
//           choice: 'RADIO',
//           date: 'TEXT',
//           file: 'TEXT',
//         };

//         let options = null;
//         if (field.type === 'number') {
//           options = { min: 0, max: 100 };
//         } else if (field.type === 'choice') {
//           options = field.options;
//         }

//         const questionPayload = {
//           form_page_id: pageId,
//           question_text: field.label || `Question ${j + 1}`,
//           type: typeMap[field.type] || 'TEXT',
//           options: options,
//           is_required: field.isRequired,
//           display_order: j + 1
//         };

//         console.log(`Creating question ${j + 1}:`, JSON.stringify(questionPayload));

//         const questionRes = await authFetch(endpoints.questions, {
//           method: 'POST',
//           body: JSON.stringify(questionPayload)
//         });

//         console.log(`Question ${j + 1} status:`, questionRes.status);
//         const questionData = await questionRes.json();
//         console.log(`Question ${j + 1} response:`, JSON.stringify(questionData));
//       }
//     }

//     alert(status === 'published' ? "🚀 Form Published!" : "💾 Draft Saved!");
//     navigate('/admin/forms');

//   } catch (err) {
//     console.error("❌ Error:", err);
//     alert("Connection failed. Is the server online?");
//   }
// };

// const handleSave = async (status) => {
//   if (!formName.trim()) return alert("Please enter a Form Name!");

//   try {
//     // STEP 1: Create Form with new required fields
//     const formRes = await authFetch(endpoints.forms, {
//       method: 'POST',
//       body: JSON.stringify({
//         title: formName,
//         description: description || "No description",
//         allow_multiple: false,
//         start_date: openDate ? `${openDate}T00:00:00Z` : new Date().toISOString(),
//         end_date: closeDate ? `${closeDate}T00:00:00Z` : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
//         type: category // competitions, positions, workshops
//       })
//     });

//     const savedForm = await formRes.json();
//     console.log("✅ Form created:", JSON.stringify(savedForm));
//     if (!savedForm.id) return alert(`Form creation failed: ${JSON.stringify(savedForm)}`);
//     const formId = savedForm.id;

//     // STEP 2: Fetch form to get auto-created pages
//     const formDetailRes = await authFetch(`${endpoints.forms}/${formId}`);
//     const formDetail = await formDetailRes.json();
//     let existingPages = formDetail.pages || [];

//     // Create missing pages
//     for (let i = 0; i < pages.length; i++) {
//       const existingPage = existingPages.find(p => p.page_num === i + 1);
//       if (!existingPage) {
//         const pageRes = await authFetch(endpoints.pages, {
//           method: 'POST',
//           body: JSON.stringify({ form_id: formId, page_num: i + 1 })
//         });
//         const newPage = await pageRes.json();
//         existingPages.push(newPage);
//         console.log(`✅ Page ${i + 1} created, ID:`, newPage.id);
//       } else {
//         console.log(`✅ Page ${i + 1} exists, ID:`, existingPage.id);
//       }
//     }

//     // STEP 3: Create Questions
//     for (let i = 0; i < pages.length; i++) {
//       const backendPage = existingPages.find(p => p.page_num === i + 1);
//       if (!backendPage) continue;
//       const pageId = backendPage.id;

//       for (let j = 0; j < pages[i].fields.length; j++) {
//         const field = pages[i].fields[j];

//         const typeMap = {
//           text: field.subType === 'long' ? 'PARAGRAPH' : 'TEXT',
//           number: 'NUMBER',
//           choice: 'RADIO',
//           date: 'TEXT',
//           file: 'TEXT',
//         };

//         let options = null;
//         if (field.type === 'number') options = { min: 0, max: 100 };
//         else if (field.type === 'choice') options = field.options;

//         const questionRes = await authFetch(endpoints.questions, {
//           method: 'POST',
//           body: JSON.stringify({
//             form_page_id: pageId,
//             question_text: field.label || `Question ${j + 1}`,
//             type: typeMap[field.type] || 'TEXT',
//             options: options,
//             is_required: field.isRequired,
//             display_order: j + 1
//           })
//         });

//         const savedQ = await questionRes.json();
//         console.log(`✅ Question ${j + 1}:`, JSON.stringify(savedQ));
//       }
//     }

//     alert(status === 'published' ? "🚀 Form Published!" : "💾 Draft Saved!");
//     navigate('/admin/forms');

//   } catch (err) {
//     console.error("❌ Error:", err);
//     alert("Connection failed.");
//   }
// };

// const handleSave = async (status) => {
//   if (!formName.trim()) return alert("Please enter a Form Name!");
//   if (isSaving) return; // ← prevent double clicks
  
//   setIsSaving(true); // ← lock the button

//   try {
//     const formRes = await authFetch(endpoints.forms, {
//       method: 'POST',
//       body: JSON.stringify({
//         title: formName,
//         description: description || "No description",
//         allow_multiple: false,
//         start_date: openDate ? `${openDate}T00:00:00Z` : new Date().toISOString(),
//         end_date: closeDate ? `${closeDate}T00:00:00Z` : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
//         type: category
//       })
//     });

//     const savedForm = await formRes.json();
//     console.log("✅ Form created:", JSON.stringify(savedForm));

//     if (savedForm.id === undefined || savedForm.id === null) {
//       return alert(`Form creation failed: ${JSON.stringify(savedForm)}`);
//     }

//     const formId = savedForm.id;

//     // Fetch form to get auto-created pages
//     const formDetailRes = await authFetch(`${endpoints.forms}/${formId}`);
//     const formDetail = await formDetailRes.json();
//     let existingPages = formDetail.pages || [];

//     // Create missing pages
//     for (let i = 0; i < pages.length; i++) {
//       const existingPage = existingPages.find(p => p.page_num === i + 1);
//       if (!existingPage) {
//         const pageRes = await authFetch(endpoints.pages, {
//           method: 'POST',
//           body: JSON.stringify({ form_id: formId, page_num: i + 1 })
//         });
//         const newPage = await pageRes.json();
//         existingPages.push(newPage);
//       }
//     }

//     // Create questions
//     for (let i = 0; i < pages.length; i++) {
//       const backendPage = existingPages.find(p => p.page_num === i + 1);
//       if (!backendPage) continue;
//       const pageId = backendPage.id;

//       for (let j = 0; j < pages[i].fields.length; j++) {
//         const field = pages[i].fields[j];

//         const typeMap = {
//           text: field.subType === 'long' ? 'PARAGRAPH' : 'TEXT',
//           number: 'NUMBER',
//           choice: field.subType || 'RADIO',
//           date: 'TEXT',
//           file: 'TEXT',
//         };

//         let options = null;
//         if (field.type === 'number') options = { min: 0, max: 100 };
//         else if (field.type === 'choice') options = field.options;

//         await authFetch(endpoints.questions, {
//           method: 'POST',
//           body: JSON.stringify({
//             form_page_id: pageId,
//             question_text: field.label || `Question ${j + 1}`,
//             type: typeMap[field.type] || 'TEXT',
//             options: options,
//             is_required: field.isRequired,
//             display_order: j + 1
//           })
//         });
//       }
//     }

//     alert(status === 'published' ? "🚀 Form Published!" : "💾 Draft Saved!");
//     navigate('/admin/forms');

//   } catch (err) {
//     console.error("❌ Error:", err);
//     alert("Connection failed.");
//   } finally {
//     setIsSaving(false); // ← always unlock when done
//   }
// };
// const handleSave = async (status) => {
//   if (!formName.trim()) return alert("Please enter a Form Name!");
//   if (isSaving) return;
//   setIsSaving(true);

//   try {
//     // STEP 1: Create Form
//     console.log("Step 1: Creating form...");
//     const formRes = await authFetch(endpoints.forms, {
//       method: 'POST',
//       body: JSON.stringify({
//         title: formName,
//         description: description || "No description",
//         allow_multiple: false,
//         start_date: openDate ? `${openDate}T00:00:00Z` : new Date().toISOString(),
//         end_date: closeDate ? `${closeDate}T00:00:00Z` : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
//         type: category
//       })
//     });

//     const savedForm = await formRes.json();
//     console.log("✅ Form created:", JSON.stringify(savedForm));

//     if (savedForm.id === undefined || savedForm.id === null) {
//       return alert(`Form creation failed: ${JSON.stringify(savedForm)}`);
//     }
//     const formId = savedForm.id;

//     // STEP 2: Fetch form to get auto-created pages
//     console.log("Step 2: Fetching form structure for ID:", formId);
//     const formDetailRes = await authFetch(`${endpoints.forms}/${formId}`);
//     const formDetail = await formDetailRes.json();
//     console.log("Form detail response:", JSON.stringify(formDetail));
//     let existingPages = formDetail.pages || [];
//     console.log("Existing pages from backend:", JSON.stringify(existingPages));

//     // Create missing pages
//     for (let i = 0; i < pages.length; i++) {
//       const existingPage = existingPages.find(p => p.page_num === i + 1);
//       if (!existingPage) {
//         console.log(`Creating missing page ${i + 1}...`);
//         const pageRes = await authFetch(endpoints.pages, {
//           method: 'POST',
//           body: JSON.stringify({ form_id: formId, page_num: i + 1 })
//         });
//         console.log(`Page ${i + 1} status:`, pageRes.status);
//         const newPage = await pageRes.json();
//         console.log(`Page ${i + 1} response:`, JSON.stringify(newPage));
//         existingPages.push(newPage);
//       } else {
//         console.log(`Page ${i + 1} already exists, ID:`, existingPage.id);
//       }
//     }

//     console.log("All pages after creation:", JSON.stringify(existingPages));

//     // STEP 3: Create Questions
//     console.log("Step 3: Total frontend pages:", pages.length);
//     for (let i = 0; i < pages.length; i++) {
//       console.log(`Page ${i} fields:`, JSON.stringify(pages[i].fields));
//       console.log(`Page ${i} fields count:`, pages[i].fields.length);

//       const backendPage = existingPages.find(p => p.page_num === i + 1);
//       console.log(`Backend page for index ${i + 1}:`, JSON.stringify(backendPage));

//       if (!backendPage) {
//         console.error(`❌ No backend page found for page_num ${i + 1}`);
//         continue;
//       }

//       const pageId = backendPage.id;
//       console.log(`Using pageId: ${pageId} for page ${i + 1}`);

//       for (let j = 0; j < pages[i].fields.length; j++) {
//         const field = pages[i].fields[j];
//         console.log(`Processing field ${j + 1}:`, JSON.stringify(field));

//         const typeMap = {
//           text: field.subType === 'long' ? 'PARAGRAPH' : 'TEXT',
//           number: 'NUMBER',
//           choice: field.subType || 'RADIO',
//           date: 'TEXT',
//           file: 'TEXT',
//         };

//         let options = null;
//         if (field.type === 'number') options = { min: 0, max: 100 };
//         else if (field.type === 'choice') options = field.options;

//         const questionPayload = {
//           form_page_id: pageId,
//           question_text: field.label || `Question ${j + 1}`,
//           type: typeMap[field.type] || 'TEXT',
//           options: options,
//           is_required: field.isRequired,
//           display_order: j + 1
//         };

//         console.log(`Creating question ${j + 1}:`, JSON.stringify(questionPayload));

//         const questionRes = await authFetch(endpoints.questions, {
//           method: 'POST',
//           body: JSON.stringify(questionPayload)
//         });

//         console.log(`Question ${j + 1} status:`, questionRes.status);
//         const questionData = await questionRes.json();
//         console.log(`Question ${j + 1} response:`, JSON.stringify(questionData));
//       }
//     }

//     alert(status === 'published' ? "🚀 Form Published!" : "💾 Draft Saved!");
//     navigate('/admin/forms');

//   } catch (err) {
//     console.error("❌ Error:", err);
//     alert("Connection failed.");
//   } finally {
//     setIsSaving(false);
//   }
// };
// const handleSave = async (status) => {
//   if (!formName.trim()) return alert("Please enter a Form Name!");
//   if (isSaving) return;
//   setIsSaving(true);

//   try {
//     // STEP 1: Create Form
//     console.log("Step 1: Creating form...");
//     const formRes = await authFetch(endpoints.forms, {
//       method: 'POST',
//       body: JSON.stringify({
//         title: formName,
//         description: description || "No description",
//         allow_multiple: false,
//         start_date: openDate ? `${openDate}T00:00:00Z` : new Date().toISOString(),
//         end_date: closeDate ? `${closeDate}T00:00:00Z` : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
//         type: category
//       })
//     });

//     const savedForm = await formRes.json();
//     console.log("Form creation response:", JSON.stringify(savedForm));

//     // WORKAROUND: backend returns id:0, so fetch all forms and get the newest one
//     let formId = savedForm.id;
//     if (!formId || formId === 0) {
//       console.log("ID is 0, fetching all forms to find the real ID...");
//       const allFormsRes = await authFetch(endpoints.forms);
//       const allForms = await allFormsRes.json();

//       // Sort by created_at descending and get the first one
//       const sorted = allForms.sort((a, b) =>
//         new Date(b.created_at) - new Date(a.created_at)
//       );
//       const newest = sorted[0];
//       console.log("Newest form found:", JSON.stringify(newest));
//       formId = newest.id;
//     }

//     console.log("✅ Using form ID:", formId);

//     // STEP 2: Fetch form to get auto-created pages
//     console.log("Step 2: Fetching form structure for ID:", formId);
//     const formDetailRes = await authFetch(`${endpoints.forms}/${formId}`);
//     const formDetail = await formDetailRes.json();
//     console.log("Form detail:", JSON.stringify(formDetail));
//     let existingPages = formDetail.pages || [];

//     // Create missing pages
//     for (let i = 0; i < pages.length; i++) {
//       const existingPage = existingPages.find(p => p.page_num === i + 1);
//       if (!existingPage) {
//         console.log(`Creating page ${i + 1}...`);
//         const pageRes = await authFetch(endpoints.pages, {
//           method: 'POST',
//           body: JSON.stringify({ form_id: formId, page_num: i + 1 })
//         });
//         console.log(`Page ${i + 1} status:`, pageRes.status);
//         const newPage = await pageRes.json();
//         console.log(`Page ${i + 1} response:`, JSON.stringify(newPage));
//         existingPages.push(newPage);
//       } else {
//         console.log(`Page ${i + 1} already exists, ID:`, existingPage.id);
//       }
//     }

//     // STEP 3: Create Questions
//     for (let i = 0; i < pages.length; i++) {
//       const backendPage = existingPages.find(p => p.page_num === i + 1);
//       if (!backendPage) {
//         console.error(`❌ No backend page for page_num ${i + 1}`);
//         continue;
//       }
//       const pageId = backendPage.id;
//       console.log(`Creating ${pages[i].fields.length} questions for page ${i + 1}, pageId: ${pageId}`);

//       for (let j = 0; j < pages[i].fields.length; j++) {
//         const field = pages[i].fields[j];

//         const typeMap = {
//           text: field.subType === 'long' ? 'PARAGRAPH' : 'TEXT',
//           number: 'NUMBER',
//           choice: field.subType || 'RADIO',
//           date: 'TEXT',
//           file: 'TEXT',
//         };

//         let options = null;
//         if (field.type === 'number') options = { min: 0, max: 100 };
//         else if (field.type === 'choice') options = field.options;

//         const questionPayload = {
//           form_page_id: pageId,
//           question_text: field.label || `Question ${j + 1}`,
//           type: typeMap[field.type] || 'TEXT',
//           options: options,
//           is_required: field.isRequired,
//           display_order: j + 1
//         };

//         console.log(`Creating question ${j + 1}:`, JSON.stringify(questionPayload));
//         const questionRes = await authFetch(endpoints.questions, {
//           method: 'POST',
//           body: JSON.stringify(questionPayload)
//         });
//         console.log(`Question ${j + 1} status:`, questionRes.status);
//         const questionData = await questionRes.json();
//         console.log(`Question ${j + 1} response:`, JSON.stringify(questionData));
//       }
//     }

//     alert(status === 'published' ? "🚀 Form Published!" : "💾 Draft Saved!");
//     navigate('/admin/forms');

//   } catch (err) {
//     console.error("❌ Error:", err);
//     alert("Connection failed.");
//   } finally {
//     setIsSaving(false);
//   }
// };

// ─── Old Content ────────────────────────────────────────────────────────────────

// const handleSave = async (status) => {
//   if (!formName.trim()) return alert("Please enter a Form Name!");
//   if (isSaving) return;
//   setIsSaving(true);

//   try {
//     // STEP 1: Create Form
//     const formRes = await authFetch(endpoints.forms, {
//       method: 'POST',
//       body: JSON.stringify({
//         title: formName,
//         description: description || "No description",
//         allow_multiple: allowMultiple,
//         start_date: openDate ? `${openDate}T00:00:00Z` : new Date().toISOString(),
//         end_date: closeDate ? `${closeDate}T00:00:00Z` : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
//         type: category
//       })
//     });

//     const savedForm = await formRes.json();
//     console.log("✅ Form created:", JSON.stringify(savedForm));

//     // ✅ Now works correctly — no more workaround needed
//     const formId = savedForm.id;
//     if (!formId) return alert(`Form creation failed: ${JSON.stringify(savedForm)}`);

//     // STEP 2: Fetch form to get auto-created pages
//     const formDetailRes = await authFetch(`${endpoints.forms}/${formId}`);
//     const formDetail = await formDetailRes.json();
//     let existingPages = formDetail.pages || [];

//     // Create missing pages
//     for (let i = 0; i < pages.length; i++) {
//       const existingPage = existingPages.find(p => p.page_num === i + 1);
//       if (!existingPage) {
//         const pageRes = await authFetch(endpoints.pages, {
//           method: 'POST',
//           body: JSON.stringify({ form_id: formId, page_num: i + 1 })
//         });
//         const newPage = await pageRes.json();
//         existingPages.push(newPage);
//       }
//     }

//     // STEP 3: Create Questions
//     for (let i = 0; i < pages.length; i++) {
//       const backendPage = existingPages.find(p => p.page_num === i + 1);
//       if (!backendPage) continue;
//       const pageId = backendPage.id;

//       for (let j = 0; j < pages[i].fields.length; j++) {
//         const field = pages[i].fields[j];

//         const typeMap = {
//           text: field.subType === 'long' ? 'PARAGRAPH' : 'TEXT',
//           number: 'NUMBER',
//           choice: field.subType || 'RADIO',
//           date: 'TEXT',
//           file: 'TEXT',
//         };

//         let options = null;
//         if (field.type === 'number') options = { min: 0, max: 100 };
//         else if (field.type === 'choice') options = field.options;

//         await authFetch(endpoints.questions, {
//           method: 'POST',
//           body: JSON.stringify({
//             form_page_id: pageId,
//             question_text: field.label || `Question ${j + 1}`,
//             type: typeMap[field.type] || 'TEXT',
//             options: options,
//             is_required: field.isRequired,
//             display_order: j + 1
//           })
//         });
//       }
//     }

//     alert(status === 'published' ? "🚀 Form Published!" : "💾 Draft Saved!");
//     navigate('/admin/forms');

//   } catch (err) {
//     console.error("❌ Error:", err);
//     alert("Connection failed.");
//   } finally {
//     setIsSaving(false);
//   }
// };
//   return (
//     <Container className="py-4 text-start">
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <h4 className="fw-bold text-primary">Multi-Page Form Builder</h4>
//         <Button variant="outline-secondary" size="sm" onClick={() => navigate('/admin/forms')}>Back</Button>
//       </div>

//       <Card className="p-4 mb-4 shadow-sm border-0 bg-white">
//         <Row className="g-3">
//           <Col md={6}><Form.Label className="fw-bold">Form Name</Form.Label><Form.Control value={formName} onChange={(e) => setFormName(e.target.value)} /></Col>
//           <Col md={6}><Form.Label className="fw-bold">Category</Form.Label>
//             <Form.Select value={category} onChange={(e) => setCategory(e.target.value)}>
              
//   <option value="competitions">Competitions</option>
//   <option value="positions">Apply for Position</option>
//   <option value="workshops">Workshops</option>
//   <option value="event">Event</option>

//             </Form.Select>
//           </Col>
//           <Col md={12}><Form.Label className="fw-bold">Description</Form.Label><Form.Control as="textarea" rows={2} value={description} onChange={(e) => setDescription(e.target.value)} /></Col>
//           <Col md={6}><Form.Label className="fw-bold text-success">Open Date</Form.Label><Form.Control type="date" value={openDate} onChange={(e) => setOpenDate(e.target.value)} /></Col>
//           <Col md={6}><Form.Label className="fw-bold text-danger">Close Date</Form.Label><Form.Control type="date" value={closeDate} onChange={(e) => setCloseDate(e.target.value)} /></Col>
//          <Col md={12}>
//       <div style={{
//         display: 'flex', alignItems: 'center', justifyContent: 'space-between',
//         padding: '12px 16px', background: '#f8fafc',
//         borderRadius: '10px', border: '1px solid #e2e8f0'
//       }}>
//         <div>
//           <p className="fw-bold mb-0" style={{ fontSize: 14 }}>Allow Multiple Submissions</p>
//           <p className="text-muted mb-0" style={{ fontSize: 12 }}>
//             {allowMultiple
//               ? 'Students can submit this form more than once.'
//               : 'Each student can only submit this form once.'}
//           </p>
//         </div>
//         <Form.Check
//           type="switch"
//           id="allow-multiple-switch"
//           checked={allowMultiple}
//           onChange={(e) => setAllowMultiple(e.target.checked)}
//         />
//       </div>
//     </Col>
  
//         </Row>
//       </Card>

//       <div className="d-flex gap-2 mb-4 overflow-auto pb-2 border-bottom">
//         {pages.map((page, index) => (
//           <div key={page.id} className="position-relative">
//             <Button variant={activePageIndex === index ? "primary" : "outline-primary"} onClick={() => setActivePageIndex(index)} className="px-4 fw-bold">Step {index + 1}</Button>
//             {pages.length > 1 && (
//               <Badge bg="danger" className="position-absolute top-0 start-100 translate-middle rounded-circle" style={{ cursor: 'pointer', zIndex: 10 }} onClick={(e) => { e.stopPropagation(); removePage(index); }}>&times;</Badge>
//             )}
//           </div>
//         ))}
//         <Button variant="success" onClick={addPage} className="fw-bold">+</Button>
//       </div>

//       <div className="bg-light p-4 rounded mb-4 border shadow-sm">
//         <Form.Control className="form-control-lg fw-bold mb-4" value={pages[activePageIndex].title} onChange={(e) => {
//           const updated = [...pages]; updated[activePageIndex].title = e.target.value; setPages(updated);
//         }} />

//         <div className="d-flex flex-wrap gap-2 mb-4">
//           <Button variant="outline-primary" size="sm" onClick={() => addField('text')}>+ Text</Button>
//           <Button variant="outline-primary" size="sm" onClick={() => addField('number')}>+ Number</Button>
//           <Button variant="outline-primary" size="sm" onClick={() => addField('choice')}>+ Choice</Button>
//           <Button variant="outline-primary" size="sm" onClick={() => addField('file')}>+ File</Button>
//           <Button variant="outline-primary" size="sm" onClick={() => addField('date')}>+ Date</Button>
//         </div>

//         {pages[activePageIndex].fields.map((field, index) => (
//           <Card key={field.id} className="mb-3 p-3 border-start border-primary border-4 shadow-sm border-0">
//             <div className="d-flex justify-content-between align-items-center mb-2">
//                <h6 className="m-0 text-primary small fw-bold">Element #{index + 1}: {field.type.toUpperCase()}</h6>
//                <Button variant="link" className="text-danger p-0" onClick={() => {
//                  const updated = [...pages]; updated[activePageIndex].fields = updated[activePageIndex].fields.filter(f => f.id !== field.id); setPages(updated);
//                }}>Delete</Button>
//             </div>
//             <Form.Control className="mb-2" placeholder="Question Label" value={field.label} onChange={e => updateField(field.id, 'label', e.target.value)} />
            
//             {field.type === 'text' && (
//               <Form.Select size="sm" className="mb-2" value={field.subType} onChange={e => updateField(field.id, 'subType', e.target.value)}>
//                 <option value="short">Short Answer</option>
//                 <option value="long">Long Answer</option>
//                 <option value="email">Email</option>
//                 <option value="phone">Phone</option>
//               </Form.Select>
//             )}

//             {field.type === 'choice' && (
//   <>
//     {/* STEP 1: Pick the choice type */}
//     <Form.Select
//       size="sm"
//       className="mb-2"
//       value={field.subType || 'RADIO'}
//       onChange={e => updateField(field.id, 'subType', e.target.value)}
//     >
//       <option value="RADIO">Radio (pick one)</option>
//       <option value="CHECKBOX">Checkbox (pick many)</option>
//       <option value="DROPDOWN">Dropdown (pick one)</option>
//     </Form.Select>

//     {/* STEP 2: Add the options */}
//     <div className="bg-white p-2 rounded border mb-2">
//       <p className="text-muted small mb-2 fw-bold">Options:</p>
//       {field.options.map((opt, oIdx) => (
//         <div key={oIdx} className="d-flex gap-2 mb-1 align-items-center">
//           <Form.Control
//             size="sm"
//             value={opt}
//             placeholder={`Option ${oIdx + 1}`}
//             onChange={e => {
//               const updated = [...pages];
//               updated[activePageIndex].fields.find(f => f.id === field.id).options[oIdx] = e.target.value;
//               setPages(updated);
//             }}
//           />
//           {/* Delete option button */}
//           <Button
//             variant="link"
//             size="sm"
//             className="text-danger p-0"
//             onClick={() => {
//               const updated = [...pages];
//               updated[activePageIndex].fields.find(f => f.id === field.id).options =
//                 field.options.filter((_, i) => i !== oIdx);
//               setPages(updated);
//             }}
//           >
//             ✕
//           </Button>
//         </div>
//       ))}
//       <Button
//         variant="link"
//         size="sm"
//         onClick={() => {
//           const updated = [...pages];
//           updated[activePageIndex].fields.find(f => f.id === field.id).options.push(`Option ${field.options.length + 1}`);
//           setPages(updated);
//         }}
//       >
//         + Add Option
//       </Button>
//     </div>

//     {/* STEP 3: Live preview of how it will look */}
//     <div className="bg-light p-2 rounded border mb-2">
//       <p className="text-muted small mb-2">Preview:</p>
//       {field.subType === 'DROPDOWN' ? (
//         <Form.Select size="sm" disabled>
//           <option>Select an option...</option>
//           {field.options.map((opt, i) => <option key={i}>{opt}</option>)}
//         </Form.Select>
//       ) : (
//         field.options.map((opt, i) => (
//           <Form.Check
//             key={i}
//             type={field.subType === 'CHECKBOX' ? 'checkbox' : 'radio'}
//             label={opt || `Option ${i + 1}`}
//             disabled
//             className="small"
//           />
//         ))
//       )}
//     </div>
//   </>
// )}
//             <Form.Check type="checkbox" label="Required" checked={field.isRequired} onChange={e => updateField(field.id, 'isRequired', e.target.checked)} />
//           </Card>
//         ))}
//       </div>

//       <div className="d-flex justify-content-end gap-3 mt-5">
//         <Button 
//   variant="outline-secondary" 
//   onClick={() => handleSave('draft')}
//   disabled={isSaving} // ← add this
// >
//   {isSaving ? 'Saving...' : 'Save Draft'}
// </Button>

// <Button 
//   variant="success" 
//   className="px-5 fw-bold" 
//   onClick={() => handleSave('published')}
//   disabled={isSaving} // ← add this
// >
//   {isSaving ? 'Publishing...' : 'Publish'}
// </Button>
//       </div>

//       <Modal show={showPreview} onHide={() => setShowPreview(false)} size="lg" centered>
//         <Modal.Header closeButton className="bg-primary text-white"><Modal.Title>Live Preview</Modal.Title></Modal.Header>
//         <Modal.Body className="bg-light p-0">
//           <ApplicationForm schema={{ id: 'preview', title: formName, description, pages }} />
//         </Modal.Body>
//       </Modal>
//     </Container>
//   );
// };

// export default FormEntry;

// ─── New Content ────────────────────────────────────────────────────────────────

import React, { useState, useEffect } from 'react';
import {
  Container, Form, Button, Row, Col,
  Card, Badge, Modal, Spinner
} from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import ApplicationForm from './ApplicationForm';
import { authFetch, endpoints } from '../../config/api';

// ─── Constants ────────────────────────────────────────────────────────────────
const FIELD_LABELS = { text: 'Text', number: 'Number', choice: 'Choice', file: 'File', date: 'Date' };

const defaultField = (type) => ({
  id: null,
  type,
  subType: type === 'text' ? 'short' : type === 'choice' ? 'RADIO' : null,
  label: '',
  isRequired: false,
  options: type === 'choice' ? ['Option 1'] : [],
});

const typeMap = (field) => ({
  text:   field.subType === 'long' ? 'PARAGRAPH' : 'TEXT',
  number: 'NUMBER',
  choice: field.subType || 'RADIO',
  date:   'TEXT',
  file:   'TEXT',
}[field.type] ?? 'TEXT');

const buildOptions = (field) => {
  if (field.type === 'number') return { min: 0, max: 100 };
  if (field.type === 'choice') return field.options;
  return null;
};

// ─── Component ────────────────────────────────────────────────────────────────
const FormEntry = () => {
  const navigate = useNavigate();
  const { id: routeFormId } = useParams();

  const [isLoadingForm, setIsLoadingForm] = useState(!!routeFormId);

  // Form metadata
  const [formName, setFormName]       = useState('');
  const [category, setCategory]       = useState('competitions');
  const [description, setDescription] = useState('');
  const [openDate, setOpenDate]       = useState('');
  const [closeDate, setCloseDate]     = useState('');
  const [isPublished, setIsPublished] = useState(false);
  const [allowMultiple, setAllowMultiple] = useState(false);
  const [isUpdatingDetails, setIsUpdatingDetails] = useState(false);
  
  // Modal
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Lifecycle flags
  const [formId, setFormId]           = useState(null);
  const [initialized, setInitialized] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [isPublishing, setIsPublishing]     = useState(false);

  // Pages
  const [pages, setPages]                   = useState([]);
  const [activePageIndex, setActivePageIndex] = useState(0);
  const [deletingPageId, setDeletingPageId] = useState(null);

  // Field modal
  const [modal, setModal]               = useState({ show: false, isNew: true, field: null });
  const [isSavingField, setIsSavingField] = useState(false);
  const [deletingFieldId, setDeletingFieldId] = useState(null);

  // Preview modal
  const [showPreview, setShowPreview] = useState(false);

  // ─── ID check if given ────────────────────────────────────────────────────────
  useEffect(() => {
  const loadExistingForm = async () => {
    if (!routeFormId) return;

    try {
      const res = await authFetch(`${endpoints.forms}/${routeFormId}`);
      if (!res.ok) throw new Error('Failed to fetch form details');

      const data = await res.json();
      const { form, pages: backendPages, questions: backendQuestions } = data;

      // 1. Populate basic form metadata
      setFormId(form.id);
      setFormName(form.title || '');
      setDescription(form.description || '');
      setCategory(form.type || 'competitions');
      setAllowMultiple(form.allow_multiple || false);
      setIsPublished(form.is_published || false);

      if (form.start_date) setOpenDate(form.start_date.split('T')[0]);
      if (form.end_date) setCloseDate(form.end_date.split('T')[0]);

      // 2. Helper to map Backend types to Frontend state
      const reverseTypeMap = (q) => {
        switch (q.type) {
          case 'PARAGRAPH': return { type: 'text',   subType: 'long' };
          case 'TEXT':      return { type: 'text',   subType: 'short' };
          case 'NUMBER':    return { type: 'number', subType: null };
          case 'RADIO':     return { type: 'choice', subType: 'RADIO' };
          case 'CHECKBOX':  return { type: 'choice', subType: 'CHECKBOX' };
          case 'DROPDOWN':  return { type: 'choice', subType: 'DROPDOWN' };
          default:          return { type: 'text',   subType: 'short' };
        }
      };

      // 3. Map pages and nest the corresponding questions
      const formattedPages = (backendPages || [])
        .map(p => {
          const pageFields = (backendQuestions || [])
            .filter(q => q.form_page_id === p.id)
            .map(q => {
              const { type, subType } = reverseTypeMap(q);
              return {
                id: q.id,
                label: q.question_text,
                type,
                subType,
                isRequired: q.is_required,
                options: Array.isArray(q.options) ? q.options : [],
                display_order: q.display_order
              };
            })
            .sort((a, b) => a.display_order - b.display_order);

          return {
            id: p.id,
            title: `Step ${p.page_num}`,
            pageNum: p.page_num,
            fields: pageFields,
          };
        })
        .sort((a, b) => a.pageNum - b.pageNum);

      setPages(formattedPages);
      setInitialized(true);

    } catch (err) {
      console.error("Error loading form:", err);
      alert("Could not load the form for editing.");
      navigate('/admin/forms');
    } finally {
      setIsLoadingForm(false);
    }
  };

  loadExistingForm();
}, [routeFormId, navigate]);

  // ─── Create Form ──────────────────────────────────────────────────
  const initializeForm = async () => {
    if (!formName.trim()) return alert('Please enter a Form Name!');
    setIsInitializing(true);
    try {
      const res = await authFetch(endpoints.forms, {
        method: 'POST',
        body: JSON.stringify({
          title:          formName,
          description:    description || 'No description',
          allow_multiple: allowMultiple,
          start_date: openDate  ? `${openDate}T00:00:00Z`  : new Date().toISOString(),
          end_date:   closeDate ? `${closeDate}T00:00:00Z` : new Date(Date.now() + 7 * 86_400_000).toISOString(),
          type: category,
        }),
      });
      
      if (!res.ok) throw new Error('Failed to create form on backend');
      
      const savedForm = await res.json();
      if (!savedForm.id) throw new Error('No Form ID returned');

      setFormId(savedForm.id);

      const detailRes  = await authFetch(`${endpoints.forms}/${savedForm.id}`);
      const formDetail = await detailRes.json();
      let backendPages = formDetail.pages ?? [];

      if (backendPages.length === 0) {
        const pageRes = await authFetch(endpoints.pages, {
          method: 'POST',
          body: JSON.stringify({ form_id: savedForm.id, page_num: 1 }),
        });
        backendPages = [await pageRes.json()];
      }

      setPages(backendPages.map(p => ({
        id:      p.id,
        title:   `Step ${p.page_num}`,
        pageNum: p.page_num,
        fields:  [],
      })));
      setActivePageIndex(0);
      setInitialized(true);
    } catch (err) {
      console.error(err);
      alert('Failed to initialize form: ' + err.message);
    } finally {
      setIsInitializing(false);
    }
  };

  // ─── Update Form ──────────────────────────────────────────────────
  const updateFormDetails = async () => {
    if (!formName.trim() || !description.trim()) {
      return alert('Title and Description are required!');
    }

    setIsUpdatingDetails(true);
    try {
      const res = await authFetch(endpoints.forms, {
        method: 'PUT',
        body: JSON.stringify({
          id:             formId,
          title:          formName,
          description:    description,
          allow_multiple: allowMultiple,
          start_date:     openDate.includes('T') ? openDate : `${openDate}T00:00:00Z`,
          end_date:       closeDate.includes('T') ? closeDate : `${closeDate}T00:00:00Z`,
          type:           category,
        }),
      });

      if (!res.ok) throw new Error('Failed to update form details');
      
      setShowDetailsModal(false); 
      // TODO: Show a small toast instead of a disruptive alert
    } catch (err) {
      console.error(err);
      alert('Error updating: ' + err.message);
    } finally {
      setIsUpdatingDetails(false);
    }
  };

  // ─── PAGES ────────────────────────────────────────────────────────────────
  const addPage = async () => {
    if (pages.length >= 7) return alert('Maximum 7 pages.');
    try {
      const res = await authFetch(endpoints.pages, {
        method: 'POST',
        body: JSON.stringify({ form_id: formId, page_num: pages.length + 1 }),
      });
      if (!res.ok) throw new Error('Failed to create page');
      
      const p = await res.json();
      const newPage = { id: p.id, title: `Step ${pages.length + 1}`, pageNum: pages.length + 1, fields: [] };
      const updated = [...pages, newPage];
      setPages(updated);
      setActivePageIndex(updated.length - 1);
    } catch (err) {
      console.error(err);
      alert('Failed to add page.');
    }
  };

  const deletePage = async (index) => {
    if (pages.length === 1) return;
    const page = pages[index];
    setDeletingPageId(page.id);
    try {
      const res = await authFetch(`${endpoints.pages}/${page.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(`Backend returned status: ${res.status}`);
      
      const updated = pages.filter((_, i) => i !== index);
      setPages(updated);
      setActivePageIndex(prev => Math.min(prev, updated.length - 1));
    } catch (err) {
      console.error(err);
      alert('Failed to delete page.');
    } finally {
      setDeletingPageId(null);
    }
  };

  // ─── FIELD MODAL ──────────────────────────────────────────────────────────
  const openAdd  = (type) => setModal({ show: true, isNew: true,  field: defaultField(type) });
  const openEdit = (field) => setModal({ show: true, isNew: false, field: { ...field } });
  const closeModal = () => setModal({ show: false, isNew: true, field: null });

  const patchModal = (key, val) =>
    setModal(prev => ({ ...prev, field: { ...prev.field, [key]: val } }));

  const saveField = async () => {
    const { field, isNew } = modal;
    if (!field.label.trim()) return alert('Please enter a question label.');
    setIsSavingField(true);

    const currentPage = pages[activePageIndex];

    try {
      if (isNew) {
        const res = await authFetch(endpoints.questions, {
          method: 'POST',
          body: JSON.stringify({
            form_page_id:  currentPage.id,
            question_text: field.label,
            type:          typeMap(field),
            options:       buildOptions(field),
            is_required:   field.isRequired,
            display_order: currentPage.fields.length + 1,
          }),
        });
        if (!res.ok) throw new Error('Failed to save field');
        
        const saved = await res.json();
        const newField = { ...field, id: saved.id };

        setPages(prev => prev.map((p, i) =>
          i === activePageIndex ? { ...p, fields: [...p.fields, newField] } : p
        ));
      } else {
        const order = currentPage.fields.findIndex(f => f.id === field.id) + 1;
        const res = await authFetch(`${endpoints.questions}`, {
          method: 'PUT',
          body: JSON.stringify({
            id:            field.id,
            form_page_id:  currentPage.id,
            question_text: field.label,
            type:          typeMap(field),
            options:       buildOptions(field),
            is_required:   field.isRequired,
            display_order: order,
          }),
        });
        if (!res.ok) throw new Error('Failed to update field');

        setPages(prev => prev.map((p, i) =>
          i === activePageIndex
            ? { ...p, fields: p.fields.map(f => f.id === field.id ? { ...field } : f) }
            : p
        ));
      }
      closeModal();
    } catch (err) {
      console.error(err);
      alert('Failed to save question.');
    } finally {
      setIsSavingField(false);
    }
  };

  const deleteField = async (fieldId) => {
    setDeletingFieldId(fieldId);
    try {
      const res = await authFetch(`${endpoints.questions}/${fieldId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(`Backend returned status: ${res.status}`);

      setPages(prev => prev.map((p, i) =>
        i === activePageIndex ? { ...p, fields: p.fields.filter(f => f.id !== fieldId) } : p
      ));
    } catch (err) {
      console.error(err);
      alert('Failed to delete question.');
    } finally {
      setDeletingFieldId(null);
    }
  };

  const publishForm = async () => {
    setIsPublishing(true);
    try {
      const res = await authFetch(`${endpoints.forms}/publish${formId}`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error('Publish failed');
      alert('🚀 Form Published!');
      navigate('/admin/forms');
    } catch (err) {
      console.error(err);
      alert('Failed to publish.');
    } finally {
      setIsPublishing(false);
    }
  };

  // ─── MODAL BODY ───────────────────────────────────────────────────────────
  const renderModalBody = () => {
    const { field } = modal;
    if (!field) return null;
    return (
      <>
        <Form.Group className="mb-3">
          <Form.Label className="fw-bold">
            Question Label <span className="text-danger">*</span>
          </Form.Label>
          <Form.Control
            value={field.label}
            placeholder="e.g. What is your full name?"
            onChange={e => patchModal('label', e.target.value)}
          />
        </Form.Group>

        {field.type === 'text' && (
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Answer Type</Form.Label>
            <Form.Select value={field.subType} onChange={e => patchModal('subType', e.target.value)}>
              <option value="short">Short Answer</option>
              <option value="long">Long Answer (Paragraph)</option>
              <option value="email">Email</option>
              <option value="phone">Phone</option>
            </Form.Select>
          </Form.Group>
        )}

        {field.type === 'choice' && (
          <>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Choice Type</Form.Label>
              <Form.Select value={field.subType || 'RADIO'} onChange={e => patchModal('subType', e.target.value)}>
                <option value="RADIO">Radio — pick one</option>
                <option value="CHECKBOX">Checkbox — pick many</option>
                <option value="DROPDOWN">Dropdown — pick one</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Options</Form.Label>
              {field.options.map((opt, i) => (
                <div key={i} className="d-flex gap-2 mb-2 align-items-center flex-wrap flex-sm-nowrap">
                  <Form.Control
                    size="sm"
                    value={opt}
                    placeholder={`Option ${i + 1}`}
                    onChange={e => {
                      const opts = [...field.options];
                      opts[i] = e.target.value;
                      patchModal('options', opts);
                    }}
                  />
                  <Button
                    variant="link"
                    className="text-danger p-0 fw-bold ms-auto"
                    onClick={() => patchModal('options', field.options.filter((_, j) => j !== i))}
                  >✕ Remove</Button>
                </div>
              ))}
              <Button
                variant="link"
                size="sm"
                className="px-0"
                onClick={() => patchModal('options', [...field.options, `Option ${field.options.length + 1}`])}
              >+ Add Option</Button>
            </Form.Group>

            <div className="bg-light p-3 rounded border mb-3 text-break">
              <p className="text-muted small fw-bold mb-2">Preview:</p>
              {field.subType === 'DROPDOWN' ? (
                <Form.Select size="sm" disabled>
                  <option>Select an option...</option>
                  {field.options.map((o, i) => <option key={i}>{o}</option>)}
                </Form.Select>
              ) : (
                field.options.map((o, i) => (
                  <Form.Check
                    key={i}
                    type={field.subType === 'CHECKBOX' ? 'checkbox' : 'radio'}
                    label={o || `Option ${i + 1}`}
                    disabled
                    className="small"
                  />
                ))
              )}
            </div>
          </>
        )}

        <Form.Check
          type="switch"
          label="Required"
          checked={field.isRequired}
          onChange={e => patchModal('isRequired', e.target.checked)}
        />
      </>
    );
  };

  // ─── RENDER ───────────────────────────────────────────────────────────────
  if (isLoadingForm) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <h5 className="mt-3 text-muted">Loading form builder...</h5>
      </Container>
    );
  }

  return (
    <Container fluid="md" className="py-4 text-start">

      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
        <h4 className="fw-bold text-primary mb-0">Multi-Page Form Builder</h4>
        <Button variant="outline-secondary" size="sm" onClick={() => navigate('/admin/forms')}>Back</Button>
      </div>

      {/* ── SECTION 1: Form Details ──────────────────────────────────────── */}
      <Card className="p-3 p-md-4 mb-4 shadow-sm border-0 bg-white w-100">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="d-flex align-items-center gap-2">
            <h5 className="fw-bold mb-0 text-dark">Form Configuration</h5>
            {initialized && (
              <Badge bg={isPublished ? "success" : "warning"} text={isPublished ? "white" : "dark"} className="ms-2">
                {isPublished ? 'Live' : 'Draft'}
              </Badge>
            )}
          </div>
          {initialized && (
            <Button variant="link" className="p-0 text-decoration-none fw-bold" onClick={() => setShowDetailsModal(true)}>
              <i className="bi bi-pencil-square me-1"></i> Edit Details
            </Button>
          )}
        </div>

        {!initialized ? (
          /* INITIAL CREATION VIEW */
          <Row className="g-3">
            <Col md={6}>
              <Form.Label className="fw-bold">Form Name</Form.Label>
              <Form.Control value={formName} onChange={e => setFormName(e.target.value)} placeholder="e.g., Summer Internship 2026" />
            </Col>
            <Col md={6}>
              <Form.Label className="fw-bold">Category</Form.Label>
              <Form.Select value={category} onChange={e => setCategory(e.target.value)}>
                <option value="competitions">Competitions</option>
                <option value="positions">Apply for Position</option>
                <option value="workshops">Workshops</option>
                <option value="event">Event</option>
              </Form.Select>
            </Col>
            <Col md={12}>
              <Form.Label className="fw-bold">Brief Description</Form.Label>
              <Form.Control as="textarea" rows={2} value={description} onChange={e => setDescription(e.target.value)} />
            </Col>
            <Col md={12}>
              <Button variant="primary" className="w-100 fw-bold mt-2" onClick={initializeForm} disabled={isInitializing}>
                {isInitializing ? <Spinner size="sm" animation="border" /> : 'Create Form & Start Building →'}
              </Button>
            </Col>
          </Row>
        ) : (
          /* SUMMARY VIEW */
          <>
            <Row className="g-3 border-bottom pb-3 mb-3">
              <Col md={4}>
                <small className="text-muted d-block text-uppercase fw-bold" style={{ fontSize: '10px' }}>Title</small>
                <p className="mb-0 fw-bold text-primary">{formName}</p>
              </Col>
              <Col md={3}>
                <small className="text-muted d-block text-uppercase fw-bold" style={{ fontSize: '10px' }}>Category</small>
                <Badge bg="secondary" className="text-capitalize">{category}</Badge>
              </Col>
              <Col md={5}>
                <small className="text-muted d-block text-uppercase fw-bold" style={{ fontSize: '10px' }}>Timeline</small>
                <p className="mb-0 small">
                  <span className="text-success fw-bold">{openDate || 'No Start'}</span> 
                  <span className="mx-2 text-muted">→</span> 
                  <span className="text-danger fw-bold">{closeDate || 'No End'}</span>
                </p>
              </Col>
            </Row>
            <Row>
              <Col md={9}>
                <small className="text-muted d-block text-uppercase fw-bold" style={{ fontSize: '10px' }}>Description</small>
                <p className="mb-0 small text-muted pe-md-4" style={{ lineHeight: '1.4' }}>
                  {description || <span className="fst-italic text-light">No description provided.</span>}
                </p>
              </Col>
              <Col md={3} className="border-start d-flex flex-column justify-content-center">
                <div className="d-flex align-items-center gap-2">
                  <i className={`bi ${allowMultiple ? 'bi-check-circle-fill text-success' : 'bi-x-circle text-muted'}`}></i>
                  <span className="small fw-bold">{allowMultiple ? 'Multi-entry' : 'Single entry'}</span>
                </div>
                <small className="text-muted" style={{ fontSize: '10px' }}>Created: {new Date().toLocaleDateString()}</small>
              </Col>
            </Row>
          </>
        )}
      </Card>

      {/* ── MODAL: Edit Form Details ────────────────────────────────────── */}
      <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)} size="lg" centered>
        <Modal.Header closeButton className="bg-light">
          <Modal.Title className="fw-bold">Update Form Configuration</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <Row className="g-4">
            <Col md={8}>
              <Form.Group>
                <Form.Label className="fw-bold">Form Title <span className="text-danger">*</span></Form.Label>
                <Form.Control 
                  size="lg"
                  value={formName} 
                  onChange={e => setFormName(e.target.value)} 
                  placeholder="e.g. Workshop Registration"
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label className="fw-bold">Category</Form.Label>
                <Form.Select value={category} onChange={e => setCategory(e.target.value)}>
                  <option value="competitions">Competitions</option>
                  <option value="positions">Positions</option>
                  <option value="workshops">Workshops</option>
                  <option value="event">Event</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={12}>
              <Form.Group>
                <Form.Label className="fw-bold">Description <span className="text-danger">*</span></Form.Label>
                <Form.Control 
                  as="textarea" 
                  rows={4} 
                  value={description} 
                  onChange={e => setDescription(e.target.value)} 
                  placeholder="Describe the purpose of this form..."
                />
                <Form.Text className="text-muted">This will be shown to applicants at the top of the form.</Form.Text>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-bold text-success">Opening Date</Form.Label>
                <Form.Control type="date" value={openDate} onChange={e => setOpenDate(e.target.value)} />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-bold text-danger">Closing Date</Form.Label>
                <Form.Control type="date" value={closeDate} onChange={e => setCloseDate(e.target.value)} />
              </Form.Group>
            </Col>

            <Col md={12}>
              <div className="p-3 rounded border bg-light d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="mb-1 fw-bold">Multiple Submissions</h6>
                  <p className="mb-0 text-muted small">Can a single user submit this form multiple times?</p>
                </div>
                <Form.Check 
                  type="switch" 
                  id="multi-entry-toggle"
                  style={{ transform: 'scale(1.2)' }}
                  checked={allowMultiple} 
                  onChange={e => setAllowMultiple(e.target.checked)} 
                />
              </div>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer className="border-0 p-4">
          <Button variant="outline-secondary" className="px-4" onClick={() => setShowDetailsModal(false)}>
            Discard Changes
          </Button>
          <Button 
            variant="primary" 
            className="px-5 fw-bold shadow-sm" 
            onClick={updateFormDetails} 
            disabled={isUpdatingDetails}
          >
            {isUpdatingDetails ? <Spinner size="sm" animation="border" /> : 'Save Changes'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ── SECTION 2: Page Builder ──────────────────────────────────────── */}
      {initialized && (
        <>
          {/* Responsive scrollable tabs */}
          <div className="d-flex gap-2 mb-4 overflow-x-auto pb-2 border-bottom w-100" style={{ whiteSpace: 'nowrap' }}>
            {pages.map((page, index) => (
              <div key={page.id} className="position-relative flex-shrink-0">
                <Button
                  variant={activePageIndex === index ? 'primary' : 'outline-primary'}
                  onClick={() => setActivePageIndex(index)}
                  className="px-4 fw-bold"
                >
                  {page.title}
                </Button>
                {pages.length > 1 && (
                  <Badge
                    bg={deletingPageId === page.id ? 'secondary' : 'danger'}
                    className="position-absolute top-0 start-100 translate-middle rounded-circle"
                    style={{ cursor: deletingPageId ? 'default' : 'pointer', zIndex: 10, fontSize: 12 }}
                    onClick={(e) => {
                      e.stopPropagation(); // Prevents activating the tab when deleting
                      if (!deletingPageId) deletePage(index);
                    }}
                  >
                    {deletingPageId === page.id ? '…' : '×'}
                  </Badge>
                )}
              </div>
            ))}
            <Button variant="success" onClick={addPage} className="fw-bold flex-shrink-0">+</Button>
          </div>

          <div className="bg-light p-3 p-md-4 rounded mb-4 border shadow-sm w-100">
            <Form.Control
              className="form-control-lg fw-bold mb-4"
              value={pages[activePageIndex]?.title ?? ''}
              onChange={e => {
                const updated = [...pages];
                updated[activePageIndex].title = e.target.value;
                setPages(updated);
              }}
            />

            <div className="d-flex flex-wrap gap-2 mb-4">
              {Object.keys(FIELD_LABELS).map(type => (
                <Button key={type} variant="outline-primary" size="sm" onClick={() => openAdd(type)}>
                  + {FIELD_LABELS[type]}
                </Button>
              ))}
            </div>

            {pages[activePageIndex]?.fields.length === 0 && (
              <div className="text-center py-5 text-muted">
                <p className="mb-1 fw-bold">No questions yet.</p>
                <p className="small">Use the buttons above to add questions to this step.</p>
              </div>
            )}

            {pages[activePageIndex]?.fields.map((field, index) => (
              <Card key={field.id} className="mb-3 p-3 border-start border-primary border-4 shadow-sm border-0 w-100">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
                  
                  <div className="d-flex align-items-center gap-2 flex-wrap text-break w-100">
                    <span className="text-muted small fw-bold">#{index + 1}</span>
                    <Badge bg="light" text="dark" className="border">{field.type.toUpperCase()}</Badge>
                    <span className="fw-bold text-break">
                      {field.label || <span className="text-muted fst-italic">Untitled Question</span>}
                    </span>
                    {field.isRequired && (
                      <Badge bg="danger" style={{ fontSize: 10 }}>Required</Badge>
                    )}
                  </div>

                  <div className="d-flex gap-2 flex-shrink-0 align-self-end align-self-md-auto mt-2 mt-md-0">
                    <Button variant="outline-primary" size="sm" onClick={() => openEdit(field)}>
                      Edit
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      disabled={deletingFieldId === field.id}
                      onClick={() => deleteField(field.id)}
                    >
                      {deletingFieldId === field.id ? <Spinner size="sm" animation="border" /> : 'Delete'}
                    </Button>
                  </div>

                </div>

                {field.type === 'choice' && field.options.length > 0 && (
                  <div className="mt-3 ps-md-3 text-break w-100">
                    {field.subType === 'DROPDOWN'
                      ? <Form.Select size="sm" disabled className="w-100 w-md-50">
                          <option>Select an option...</option>
                          {field.options.map((o, i) => <option key={i}>{o}</option>)}
                        </Form.Select>
                      : field.options.map((o, i) => (
                          <Form.Check
                            key={i}
                            type={field.subType === 'CHECKBOX' ? 'checkbox' : 'radio'}
                            label={o}
                            disabled
                            className="small text-muted"
                          />
                        ))
                    }
                  </div>
                )}
              </Card>
            ))}
          </div>

          <div className="d-flex flex-wrap justify-content-end gap-3 mt-5">
            <Button variant="outline-secondary" onClick={() => navigate('/admin/forms')} className="w-100 w-md-auto">
              Save & Exit
            </Button>
            <Button
              variant="success"
              className="px-5 fw-bold w-100 w-md-auto"
              onClick={publishForm}
              disabled={isPublishing}
            >
              {isPublishing
                ? <><Spinner size="sm" className="me-2" animation="border" />Publishing...</>
                : '🚀 Publish Form'}
            </Button>
          </div>
        </>
      )}

      <Modal show={modal.show} onHide={closeModal} centered>
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>
            {modal.isNew ? `Add ${FIELD_LABELS[modal.field?.type] ?? ''} Question` : 'Edit Question'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {renderModalBody()}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>Cancel</Button>
          <Button variant="primary" onClick={saveField} disabled={isSavingField}>
            {isSavingField ? <><Spinner size="sm" className="me-2" animation="border" />{modal.isNew ? 'Adding...' : 'Updating...'}</> : modal.isNew ? 'Add Question' : 'Update Question'}
          </Button>
        </Modal.Footer>
      </Modal>

    </Container>
  );
};

export default FormEntry;