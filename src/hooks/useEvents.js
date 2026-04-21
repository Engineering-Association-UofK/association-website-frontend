// src/hooks/useEvents.js
import { useState, useEffect, useCallback } from "react";
import { eventService } from "../api/event.service";

export const useEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

const fetchEvents = useCallback(async (page = 1) => {
  setLoading(true);
  setError(null);
  try {
    const response = await eventService.getAll(page);
    console.log("البيانات قادمة بنجاح:", response);

    // بناءً على رد السيرفر الذي رأيناه في Swagger
    setEvents(response.events || []);
  } catch (err) {
    console.error("فشل الاتصال بالسيرفر:", err);
    setError(
      "لا يمكن الاتصال بالسيرفر، تأكد من تشغيل الـ Backend أو صحة الرابط.",
    );
    setEvents([]);
  } finally {
    setLoading(false);
  }
}, []);

  const deleteEvent = async (id) => {
    if (!window.confirm("هل أنت متأكد من الحذف؟")) return;
    try {
      await eventService.delete(id);
      setEvents((prev) => prev.filter((ev) => ev.id !== id));
    } catch (err) {
      alert("فشل الحذف");
      console.log(err);
      
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return { events, loading, error, deleteEvent, refresh: fetchEvents };
};


// يمكنك إضافة هذا الجزء لـ useEvents.js أو إنشاء useEventDetail.js
export const useEventDetail = (id) => {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const data = await eventService.getById(id);
        setEvent(data); // هنا السيرفر يرجع الكائن مباشرة كما رأينا في Swagger
      } catch (err) {
        console.error("خطأ في جلب التفاصيل",err);

      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  return { event, loading };
};
