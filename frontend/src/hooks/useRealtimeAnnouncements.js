import { useState, useEffect, useCallback, useRef } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./useAuth";
import { announcementsAPI } from "../api/announcements";

export const useRealtimeAnnouncements = (initialLimit = 5) => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [newAnnouncementIds, setNewAnnouncementIds] = useState([]);

  const { token, user } = useAuth();
  const socketRef = useRef(null);

  // Fetch initial announcements
  useEffect(() => {
    const fetchInitialAnnouncements = async () => {
      try {
        setLoading(true);
        const data = await announcementsAPI.getRecentAnnouncements();
        setAnnouncements(data.announcements || []);
        setError(null);
      } catch (err) {
        setError(err.message || "Failed to fetch announcements");
        console.error("Error fetching announcements:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialAnnouncements();
  }, []);

  // Setup WebSocket connection
  useEffect(() => {
    if (!token || !user) return;

    const API_URL = import.meta.env.VITE_API_URL;

    if (!API_URL) {
      console.error("VITE_API_URL is not defined");
      return;
    }

    const socket = io(API_URL, {
      auth: { token: `Bearer ${token}` },
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("🔌 Connected to real-time server");
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      console.log("🔌 Disconnected from real-time server");
      setIsConnected(false);
    });

    socket.on("connect_error", (err) => {
      console.error("Connection error:", err);
      setIsConnected(false);
    });

    socket.on("new-announcement", (data) => {
      const newAnnouncement = data.announcement;

      const shouldShow =
        newAnnouncement.targetAudience === "all" ||
        (newAnnouncement.targetAudience === "students" &&
          user.role === "student") ||
        (newAnnouncement.targetAudience === "admins" &&
          user.role === "admin");

      if (shouldShow) {
        setAnnouncements((prev) =>
          [newAnnouncement, ...prev].slice(0, initialLimit)
        );

        setNewAnnouncementIds((prev) => [
          newAnnouncement._id,
          ...prev,
        ]);

        setTimeout(() => {
          setNewAnnouncementIds((prev) =>
            prev.filter((id) => id !== newAnnouncement._id)
          );
        }, 10000);

        if ("Notification" in window && Notification.permission === "granted") {
          new Notification("New Announcement 📢", {
            body: newAnnouncement.title,
          });
        }
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [token, user, initialLimit]);

  const requestNotificationPermission = useCallback(async () => {
    if ("Notification" in window && Notification.permission === "default") {
      await Notification.requestPermission();
    }
  }, []);

  const createAnnouncement = useCallback(async (announcementData) => {
    try {
      const response =
        await announcementsAPI.createAnnouncement(announcementData);
      return response;
    } catch (err) {
      console.error("Failed to create announcement:", err);
      throw err;
    }
  }, []);

  return {
    announcements,
    loading,
    error,
    isConnected,
    newAnnouncementIds,
    createAnnouncement,
    requestNotificationPermission,
  };
};

export default useRealtimeAnnouncements;