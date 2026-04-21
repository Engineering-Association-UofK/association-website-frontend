// import React, { useState, useEffect, useCallback } from "react";
// import { eventService } from "../../api/event.service";

// const EventsPage = () => {
//   const [events, setEvents] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [pagination, setPagination] = useState({ current: 1, totalPages: 1 });

//   // حالات الـ Popup
//   const [selectedEvent, setSelectedEvent] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [modalLoading, setModalLoading] = useState(false);

//   const loadData = useCallback(async (page = 1) => {
//     setLoading(true);
//     try {
//       const response = await eventService.getAll(page, 10);
//       setEvents(response.events || []);
//       setPagination({
//         current: page,
//         totalPages: response.pages || 1,
//       });
//     } catch (err) {
//       console.error("خطأ في جلب البيانات", err);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     loadData(1);
//   }, [loadData]);

//   const handleOpenDetails = async (id) => {
//     setIsModalOpen(true);
//     setModalLoading(true);
//     try {
//       const detail = await eventService.getById(id);
//       setSelectedEvent(detail);
//     } catch (err) {
//       console.error("خطأ في جلب التفاصيل", err);
//     } finally {
//       setModalLoading(false);
//     }
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setSelectedEvent(null);
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
//       </div>
//     );
//   }

//   // دالة مساعدة لتنسيق العملة أو السعر
//   const formatPrice = (price) => (price === 0 ? "مجانية" : `${price} ج.س`);

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen font-sans" dir="rtl">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-3xl font-extrabold text-gray-800">
//           إدارة الفعاليات
//         </h1>
//         <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg shadow-md transition">
//           + إضافة فعالية
//         </button>
//       </div>

//       {/* الجدول المحسن */}
//       <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
//         <table className="min-w-full text-right uppercase">
//           <thead>
//             <tr className="bg-gray-100 text-gray-600 text-sm leading-normal font-bold">
//               <th className="px-6 py-4">الفعالية</th>
//               <th className="px-6 py-4 text-center">التاريخ والوقت</th>
//               <th className="px-6 py-4 text-center">النوع</th>
//               <th className="px-6 py-4 text-center">التكلفة</th>
//               <th className="px-6 py-4 text-center">الإجراءات</th>
//             </tr>
//           </thead>
//           <tbody className="text-gray-700 text-sm font-light">
//             {events.map((ev) => (
//               <tr
//                 key={ev.id}
//                 className="border-b border-gray-200 hover:bg-gray-50 transition"
//               >
//                 <td className="px-6 py-4 text-right">
//                   <div className="flex flex-col">
//                     <span className="font-bold text-gray-900">{ev.name}</span>
//                     <span className="text-xs text-gray-400">
//                       {ev.location || "غير محدد"}
//                     </span>
//                   </div>
//                 </td>
//                 <td className="px-6 py-4 text-center font-mono">
//                   {new Date(ev.start_date).toLocaleDateString("ar-SA")}
//                 </td>
//                 <td className="px-6 py-4 text-center">
//                   <span className="bg-indigo-100 text-indigo-700 py-1 px-3 rounded-full text-xs font-bold">
//                     {ev.event_type}
//                   </span>
//                 </td>
//                 <td className="px-6 py-4 text-center font-bold">
//                   {formatPrice(ev.price)}
//                 </td>
//                 <td className="px-6 py-4 text-center">
//                   <button
//                     onClick={() => handleOpenDetails(ev.id)}
//                     className="bg-white border border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white px-4 py-1 rounded transition duration-300"
//                   >
//                     عرض كامل التفاصيل
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* الـ Popup الشامل (Detailed Modal) */}
//       {isModalOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4">
//           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-fade-in">
//             {/* Header */}
//             <div className="bg-indigo-700 p-5 flex justify-between items-center text-white">
//               <div>
//                 <h2 className="text-2xl font-bold">
//                   {selectedEvent?.name || "تحميل..."}
//                 </h2>
//                 <p className="text-indigo-200 text-sm">
//                   تفاصيل الفعالية المسجلة في النظام
//                 </p>
//               </div>
//               <button
//                 onClick={closeModal}
//                 className="text-3xl font-light hover:text-gray-300"
//               >
//                 ×
//               </button>
//             </div>

//             {/* Content Body */}
//             <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
//               {modalLoading ? (
//                 <div className="flex justify-center items-center py-20">
//                   <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-700"></div>
//                 </div>
//               ) : selectedEvent ? (
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   {/* قسم المعلومات الأساسية */}
//                   <div className="space-y-4">
//                     <div>
//                       <h4 className="text-xs text-gray-400 font-bold uppercase tracking-wider">
//                         وصف الفعالية
//                       </h4>
//                       <p className="text-gray-700 mt-1 leading-relaxed text-sm">
//                         {selectedEvent.description ||
//                           "لا يوجد وصف لهذه الفعالية حالياً."}
//                       </p>
//                     </div>
//                     <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
//                       <h4 className="text-xs text-indigo-400 font-bold uppercase">
//                         المكان / الرابط
//                       </h4>
//                       <p className="text-indigo-900 font-semibold">
//                         {selectedEvent.location || "غير محدد"}
//                       </p>
//                     </div>
//                   </div>

//                   {/* قسم البيانات الرقمية والتواريخ */}
//                   <div className="bg-gray-50 p-5 rounded-xl space-y-4 border border-gray-100">
//                     <div className="flex justify-between border-b pb-2">
//                       <span className="text-gray-500">التكلفة:</span>
//                       <span className="font-bold text-green-600">
//                         {formatPrice(selectedEvent.price)}
//                       </span>
//                     </div>
//                     <div className="flex justify-between border-b pb-2">
//                       <span className="text-gray-500">تاريخ البدء:</span>
//                       <span className="font-mono text-xs">
//                         {new Date(selectedEvent.start_date).toLocaleString(
//                           "ar-SA",
//                         )}
//                       </span>
//                     </div>
//                     <div className="flex justify-between border-b pb-2">
//                       <span className="text-gray-500">تاريخ الانتهاء:</span>
//                       <span className="font-mono text-xs">
//                         {new Date(selectedEvent.end_date).toLocaleString(
//                           "ar-SA",
//                         )}
//                       </span>
//                     </div>
//                     <div className="flex justify-between border-b pb-2">
//                       <span className="text-gray-500">المقاعد المتاحة:</span>
//                       <span className="font-bold">
//                         {selectedEvent.max_participants}
//                       </span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-500">المنظم:</span>
//                       <span className="text-indigo-600 font-medium">
//                         {selectedEvent.organizer || "الإدارة العامة"}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               ) : (
//                 <p className="text-center text-red-500">
//                   حدث خطأ أثناء جلب البيانات.
//                 </p>
//               )}
//             </div>

//             {/* Footer */}
//             <div className="bg-gray-50 px-8 py-4 flex justify-end gap-3 border-t">
//               <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition font-bold shadow-md">
//                 تعديل الفعالية
//               </button>
//               <button
//                 onClick={closeModal}
//                 className="bg-white text-gray-600 border border-gray-300 px-6 py-2 rounded-lg hover:bg-gray-100 transition"
//               >
//                 إغلاق
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default EventsPage;
import React, { useState, useEffect, useCallback } from "react";
import { eventService  } from "../../api/event.service";

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  const loadData = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const response = await eventService.getAll(page, 10);
      setEvents(response.events || []);
      
    } catch (err) {
      console.error("خطأ", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData(1);
  }, [loadData]);

  const handleOpenDetails = async (id) => {
    setIsModalOpen(true);
    setModalLoading(true);
    try {
      const detail = await eventService.getById(id);
      setSelectedEvent(detail);
    } catch (err) {
      console.error(err);
    } finally {
      setModalLoading(false);
    }
  };
  if(loading) {
    return (
      <div className="flex justify-center items-center h-screen"> 
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen font-sans" dir="rtl">
      {/* Header: متجاوب بين الصف والعمود */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-800">
          إدارة الفعاليات
        </h1>
        <button className="w-full md:w-auto bg-indigo-600 text-white px-5 py-2.5 rounded-xl shadow-lg font-bold">
          + إضافة فعالية
        </button>
      </div>

      {/* عرض البيانات: جدول للكمبيوتر وبطاقات للموبايل */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="min-w-full text-right">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="px-6 py-4">الفعالية</th>
              <th className="px-6 py-4 text-center">النوع</th>
              <th className="px-6 py-4 text-center">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {events.map((ev) => (
              <tr key={ev.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-bold">{ev.name}</td>
                <td className="px-6 py-4 text-center italic">
                  {ev.event_type}
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => handleOpenDetails(ev.id)}
                    className="text-indigo-600 font-bold underline"
                  >
                    عرض
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* نسخة الموبايل (Cards) */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {events.map((ev) => (
          <div
            key={ev.id}
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-200"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-gray-900">{ev.name}</h3>
              <span className="bg-indigo-50 text-indigo-700 text-xs px-2 py-1 rounded-lg font-bold">
                {ev.event_type}
              </span>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              {new Date(ev.start_date).toLocaleDateString("ar-SA")}
            </p>
            <button
              onClick={() => handleOpenDetails(ev.id)}
              className="w-full bg-indigo-50 text-indigo-600 py-2 rounded-lg font-bold text-sm"
            >
              عرض التفاصيل
            </button>
          </div>
        ))}
      </div>

      {/* الـ Popup المتجاوب */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/30 bg-opacity-60 backdrop-blur-sm p-0 md:p-4 ">
          <div className="bg-white w-full max-w-[90%] md:max-w-2xl rounded-t-3xl md:rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col ">
            {/* Header */}
            <div className="bg-indigo-700 p-5 flex justify-between items-center text-white shrink-0">
              <h2 className="text-xl font-bold">تفاصيل الفعالية</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-3xl"
              >
                ×
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto">
              {modalLoading ? (
                <div className="text-center py-10">جاري التحميل...</div>
              ) : (
                selectedEvent && (
                  <div className="space-y-6 text-right">
                    <section>
                      <div className="flex justify-between items-start mb-1">
                        <span className="bg-indigo-100 text-indigo-700 text-[10px] px-2 py-0.5 rounded font-bold">
                          {selectedEvent.event_type}
                        </span>
                      </div>
                      <h3 className="text-xl font-extrabold text-gray-800 leading-tight">
                        {selectedEvent.name}
                      </h3>
                    </section>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <label className="text-xs text-gray-400 block">
                          التكلفة
                        </label>
                        <span className="font-bold text-green-600">
                          {selectedEvent.price || "مجانية"}
                        </span>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <label className="text-xs text-gray-400 block">
                          المقاعد
                        </label>
                        <span className="font-bold">
                          {selectedEvent.max_participants}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                        <label className="text-[10px] text-gray-400 font-bold block mb-1">
                          معرف المحاضر (Presenter ID)
                        </label>
                        <span className="font-bold text-gray-700">
                          #{selectedEvent.presenter_id}
                        </span>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                        <label className="text-[10px] text-gray-400 font-bold block mb-1">
                          أقصى عدد للمشاركين
                        </label>
                        <span className="font-bold text-indigo-600">
                          {selectedEvent.max_participants} مقعد
                        </span>
                      </div>
                    </div>

                    <section className="space-y-3">
                      <h4 className="text-xs  font-bold text-gray-400 uppercase border-b pb-3">
                        الجدول الزمني
                      </h4>
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <label className="text-[10px] text-gray-400 block">
                            تاريخ البدء
                          </label>
                          <p className="text-sm font-mono font-semibold text-gray-700">
                            {new Date(
                              selectedEvent.start_date,
                            ).toLocaleDateString("ar-SA", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                        <div className="text-indigo-300 text-xl">←</div>
                        <div className="flex-1">
                          <label className="text-[10px] text-gray-400 block">
                            تاريخ الانتهاء
                          </label>
                          <p className="text-sm font-mono font-semibold text-gray-700">
                            {new Date(
                              selectedEvent.end_date,
                            ).toLocaleDateString("ar-SA", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                    </section>

                    <section className="border-t pt-4">
                      <label className="text-xs text-gray-400 font-bold block mb-1">
                        عن الفعالية
                      </label>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {selectedEvent.description}
                      </p>
                    </section>
                  </div>
                )
              )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-gray-50 border-t flex flex-col md:flex-row gap-3">
              <button className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold">
                تعديل البيانات
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-full bg-gray-200 text-gray-700 py-3 rounded-xl font-bold"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
};

export default EventsPage;