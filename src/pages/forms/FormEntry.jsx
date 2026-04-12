import React, { useState } from 'react';
import { Container, Form, Button, Row, Col, Card, Badge, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import ApplicationForm from './ApplicationForm'; 
import { authFetch, endpoints } from '../../config/api';

const FormEntry = () => {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);

  
  const [formName, setFormName] = useState('');
  const [category, setCategory] = useState('competitions');
  const [description, setDescription] = useState('');
  const [openDate, setOpenDate] = useState('');
  const [closeDate, setCloseDate] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [allowMultiple, setAllowMultiple] = useState(false);

  const [pages, setPages] = useState([
    { id: Date.now(), title: 'Step 1', fields: [] }
  ]);
  const [activePageIndex, setActivePageIndex] = useState(0);

  const addPage = () => {
    if (pages.length >= 7) return alert("Maximum 7 pages recommended for Student UX.");
    const newPage = { id: Date.now(), title: `Step ${pages.length + 1}`, fields: [] };
    setPages([...pages, newPage]);
    setActivePageIndex(pages.length);
  };

  const removePage = (index) => {
    if (pages.length === 1) return;
    const updated = pages.filter((_, i) => i !== index);
    setPages(updated);
    setActivePageIndex(0);
  };

  const addField = (fieldType) => {
    const newField = {
      id: Date.now(),
      type: fieldType,
      subType: 'short', // Default for text
      label: '',
      isRequired: false,
      options: fieldType === 'choice' ? ['Option 1'] : []
    };
    const updatedPages = [...pages];
    updatedPages[activePageIndex].fields.push(newField);
    setPages(updatedPages);
  };

  const updateField = (fieldId, key, value) => {
    const updatedPages = pages.map((page, pIdx) => {
      if (pIdx === activePageIndex) {
        return {
          ...page,
          fields: page.fields.map(f => f.id === fieldId ? { ...f, [key]: value } : f)
        };
      }
      return page;
    });
    setPages(updatedPages);
  };

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
const handleSave = async (status) => {
  if (!formName.trim()) return alert("Please enter a Form Name!");
  if (isSaving) return;
  setIsSaving(true);

  try {
    // STEP 1: Create Form
    const formRes = await authFetch(endpoints.forms, {
      method: 'POST',
      body: JSON.stringify({
        title: formName,
        description: description || "No description",
        allow_multiple: allowMultiple,
        start_date: openDate ? `${openDate}T00:00:00Z` : new Date().toISOString(),
        end_date: closeDate ? `${closeDate}T00:00:00Z` : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        type: category
      })
    });

    const savedForm = await formRes.json();
    console.log("✅ Form created:", JSON.stringify(savedForm));

    // ✅ Now works correctly — no more workaround needed
    const formId = savedForm.id;
    if (!formId) return alert(`Form creation failed: ${JSON.stringify(savedForm)}`);

    // STEP 2: Fetch form to get auto-created pages
    const formDetailRes = await authFetch(`${endpoints.forms}/${formId}`);
    const formDetail = await formDetailRes.json();
    let existingPages = formDetail.pages || [];

    // Create missing pages
    for (let i = 0; i < pages.length; i++) {
      const existingPage = existingPages.find(p => p.page_num === i + 1);
      if (!existingPage) {
        const pageRes = await authFetch(endpoints.pages, {
          method: 'POST',
          body: JSON.stringify({ form_id: formId, page_num: i + 1 })
        });
        const newPage = await pageRes.json();
        existingPages.push(newPage);
      }
    }

    // STEP 3: Create Questions
    for (let i = 0; i < pages.length; i++) {
      const backendPage = existingPages.find(p => p.page_num === i + 1);
      if (!backendPage) continue;
      const pageId = backendPage.id;

      for (let j = 0; j < pages[i].fields.length; j++) {
        const field = pages[i].fields[j];

        const typeMap = {
          text: field.subType === 'long' ? 'PARAGRAPH' : 'TEXT',
          number: 'NUMBER',
          choice: field.subType || 'RADIO',
          date: 'TEXT',
          file: 'TEXT',
        };

        let options = null;
        if (field.type === 'number') options = { min: 0, max: 100 };
        else if (field.type === 'choice') options = field.options;

        await authFetch(endpoints.questions, {
          method: 'POST',
          body: JSON.stringify({
            form_page_id: pageId,
            question_text: field.label || `Question ${j + 1}`,
            type: typeMap[field.type] || 'TEXT',
            options: options,
            is_required: field.isRequired,
            display_order: j + 1
          })
        });
      }
    }

    alert(status === 'published' ? "🚀 Form Published!" : "💾 Draft Saved!");
    navigate('/admin/forms');

  } catch (err) {
    console.error("❌ Error:", err);
    alert("Connection failed.");
  } finally {
    setIsSaving(false);
  }
};
  return (
    <Container className="py-4 text-start">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold text-primary">Multi-Page Form Builder</h4>
        <Button variant="outline-secondary" size="sm" onClick={() => navigate('/admin/forms')}>Back</Button>
      </div>

      <Card className="p-4 mb-4 shadow-sm border-0 bg-white">
        <Row className="g-3">
          <Col md={6}><Form.Label className="fw-bold">Form Name</Form.Label><Form.Control value={formName} onChange={(e) => setFormName(e.target.value)} /></Col>
          <Col md={6}><Form.Label className="fw-bold">Category</Form.Label>
            <Form.Select value={category} onChange={(e) => setCategory(e.target.value)}>
              
  <option value="competitions">Competitions</option>
  <option value="positions">Apply for Position</option>
  <option value="workshops">Workshops</option>
  <option value="event">Event</option>

            </Form.Select>
          </Col>
          <Col md={12}><Form.Label className="fw-bold">Description</Form.Label><Form.Control as="textarea" rows={2} value={description} onChange={(e) => setDescription(e.target.value)} /></Col>
          <Col md={6}><Form.Label className="fw-bold text-success">Open Date</Form.Label><Form.Control type="date" value={openDate} onChange={(e) => setOpenDate(e.target.value)} /></Col>
          <Col md={6}><Form.Label className="fw-bold text-danger">Close Date</Form.Label><Form.Control type="date" value={closeDate} onChange={(e) => setCloseDate(e.target.value)} /></Col>
         <Col md={12}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 16px', background: '#f8fafc',
        borderRadius: '10px', border: '1px solid #e2e8f0'
      }}>
        <div>
          <p className="fw-bold mb-0" style={{ fontSize: 14 }}>Allow Multiple Submissions</p>
          <p className="text-muted mb-0" style={{ fontSize: 12 }}>
            {allowMultiple
              ? 'Students can submit this form more than once.'
              : 'Each student can only submit this form once.'}
          </p>
        </div>
        <Form.Check
          type="switch"
          id="allow-multiple-switch"
          checked={allowMultiple}
          onChange={(e) => setAllowMultiple(e.target.checked)}
        />
      </div>
    </Col>
  
        </Row>
      </Card>

      <div className="d-flex gap-2 mb-4 overflow-auto pb-2 border-bottom">
        {pages.map((page, index) => (
          <div key={page.id} className="position-relative">
            <Button variant={activePageIndex === index ? "primary" : "outline-primary"} onClick={() => setActivePageIndex(index)} className="px-4 fw-bold">Step {index + 1}</Button>
            {pages.length > 1 && (
              <Badge bg="danger" className="position-absolute top-0 start-100 translate-middle rounded-circle" style={{ cursor: 'pointer', zIndex: 10 }} onClick={(e) => { e.stopPropagation(); removePage(index); }}>&times;</Badge>
            )}
          </div>
        ))}
        <Button variant="success" onClick={addPage} className="fw-bold">+</Button>
      </div>

      <div className="bg-light p-4 rounded mb-4 border shadow-sm">
        <Form.Control className="form-control-lg fw-bold mb-4" value={pages[activePageIndex].title} onChange={(e) => {
          const updated = [...pages]; updated[activePageIndex].title = e.target.value; setPages(updated);
        }} />

        <div className="d-flex flex-wrap gap-2 mb-4">
          <Button variant="outline-primary" size="sm" onClick={() => addField('text')}>+ Text</Button>
          <Button variant="outline-primary" size="sm" onClick={() => addField('number')}>+ Number</Button>
          <Button variant="outline-primary" size="sm" onClick={() => addField('choice')}>+ Choice</Button>
          <Button variant="outline-primary" size="sm" onClick={() => addField('file')}>+ File</Button>
          <Button variant="outline-primary" size="sm" onClick={() => addField('date')}>+ Date</Button>
        </div>

        {pages[activePageIndex].fields.map((field, index) => (
          <Card key={field.id} className="mb-3 p-3 border-start border-primary border-4 shadow-sm border-0">
            <div className="d-flex justify-content-between align-items-center mb-2">
               <h6 className="m-0 text-primary small fw-bold">Element #{index + 1}: {field.type.toUpperCase()}</h6>
               <Button variant="link" className="text-danger p-0" onClick={() => {
                 const updated = [...pages]; updated[activePageIndex].fields = updated[activePageIndex].fields.filter(f => f.id !== field.id); setPages(updated);
               }}>Delete</Button>
            </div>
            <Form.Control className="mb-2" placeholder="Question Label" value={field.label} onChange={e => updateField(field.id, 'label', e.target.value)} />
            
            {field.type === 'text' && (
              <Form.Select size="sm" className="mb-2" value={field.subType} onChange={e => updateField(field.id, 'subType', e.target.value)}>
                <option value="short">Short Answer</option>
                <option value="long">Long Answer</option>
                <option value="email">Email</option>
                <option value="phone">Phone</option>
              </Form.Select>
            )}

            {field.type === 'choice' && (
  <>
    {/* STEP 1: Pick the choice type */}
    <Form.Select
      size="sm"
      className="mb-2"
      value={field.subType || 'RADIO'}
      onChange={e => updateField(field.id, 'subType', e.target.value)}
    >
      <option value="RADIO">Radio (pick one)</option>
      <option value="CHECKBOX">Checkbox (pick many)</option>
      <option value="DROPDOWN">Dropdown (pick one)</option>
    </Form.Select>

    {/* STEP 2: Add the options */}
    <div className="bg-white p-2 rounded border mb-2">
      <p className="text-muted small mb-2 fw-bold">Options:</p>
      {field.options.map((opt, oIdx) => (
        <div key={oIdx} className="d-flex gap-2 mb-1 align-items-center">
          <Form.Control
            size="sm"
            value={opt}
            placeholder={`Option ${oIdx + 1}`}
            onChange={e => {
              const updated = [...pages];
              updated[activePageIndex].fields.find(f => f.id === field.id).options[oIdx] = e.target.value;
              setPages(updated);
            }}
          />
          {/* Delete option button */}
          <Button
            variant="link"
            size="sm"
            className="text-danger p-0"
            onClick={() => {
              const updated = [...pages];
              updated[activePageIndex].fields.find(f => f.id === field.id).options =
                field.options.filter((_, i) => i !== oIdx);
              setPages(updated);
            }}
          >
            ✕
          </Button>
        </div>
      ))}
      <Button
        variant="link"
        size="sm"
        onClick={() => {
          const updated = [...pages];
          updated[activePageIndex].fields.find(f => f.id === field.id).options.push(`Option ${field.options.length + 1}`);
          setPages(updated);
        }}
      >
        + Add Option
      </Button>
    </div>

    {/* STEP 3: Live preview of how it will look */}
    <div className="bg-light p-2 rounded border mb-2">
      <p className="text-muted small mb-2">Preview:</p>
      {field.subType === 'DROPDOWN' ? (
        <Form.Select size="sm" disabled>
          <option>Select an option...</option>
          {field.options.map((opt, i) => <option key={i}>{opt}</option>)}
        </Form.Select>
      ) : (
        field.options.map((opt, i) => (
          <Form.Check
            key={i}
            type={field.subType === 'CHECKBOX' ? 'checkbox' : 'radio'}
            label={opt || `Option ${i + 1}`}
            disabled
            className="small"
          />
        ))
      )}
    </div>
  </>
)}
            <Form.Check type="checkbox" label="Required" checked={field.isRequired} onChange={e => updateField(field.id, 'isRequired', e.target.checked)} />
          </Card>
        ))}
      </div>

      <div className="d-flex justify-content-end gap-3 mt-5">
        <Button 
  variant="outline-secondary" 
  onClick={() => handleSave('draft')}
  disabled={isSaving} // ← add this
>
  {isSaving ? 'Saving...' : 'Save Draft'}
</Button>

<Button 
  variant="success" 
  className="px-5 fw-bold" 
  onClick={() => handleSave('published')}
  disabled={isSaving} // ← add this
>
  {isSaving ? 'Publishing...' : 'Publish'}
</Button>
      </div>

      <Modal show={showPreview} onHide={() => setShowPreview(false)} size="lg" centered>
        <Modal.Header closeButton className="bg-primary text-white"><Modal.Title>Live Preview</Modal.Title></Modal.Header>
        <Modal.Body className="bg-light p-0">
          <ApplicationForm schema={{ id: 'preview', title: formName, description, pages }} />
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default FormEntry;