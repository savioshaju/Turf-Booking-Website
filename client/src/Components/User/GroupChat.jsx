import React, { useEffect, useRef, useState } from "react";
import axiosInstance from "../../Config/axiosInstance";
import { useSelector } from "react-redux";
import { Send } from "lucide-react";

function GroupChat({ groupId }) {
    const user = useSelector((state) => state.user.userData)
    const userId = user?._id

    const [lastTimestamp, setLastTimestamp] = useState(0)
    const lastTimestampRef = useRef(0)

    const [messages, setMessages] = useState([])
    const [content, setContent] = useState("");

    const bottomRef = useRef(null);


    const loadMessages = () => {
        axiosInstance({
            method: "GET",
            url: `/messages/${groupId}`,
        })
            .then((res) => {
                const data = res?.data?.data || [];

                const newMessages = data.filter((msg) => {
                    const ts = new Date(msg.createdAt).getTime();
                    return ts > lastTimestampRef.current;
                });

                if (newMessages.length > 0) {
                    setMessages((prev) => [...prev, ...newMessages]);

                    const latestTs = new Date(
                        newMessages[newMessages.length - 1].createdAt
                    ).getTime();

                    setLastTimestamp(latestTs);
                    lastTimestampRef.current = latestTs;
                }
            })
            .catch((err) => {
                console.error("Failed to load messages:", err);
            });
    };

    useEffect(() => {
        axiosInstance({
            method: "GET",
            url: `/messages/${groupId}`,
        })
            .then((res) => {
                const list = res?.data?.data || [];
                setMessages(list);

                if (list.length > 0) {
                    const ts = new Date(list[list.length - 1].createdAt).getTime();
                    setLastTimestamp(ts);
                    lastTimestampRef.current = ts;
                } else {
                    setLastTimestamp(0);
                    lastTimestampRef.current = 0;
                }
            })
            .catch((err) => {
                console.error("Initial load failed:", err)
            })

        const interval = setInterval(() => {
            loadMessages()
        }, 30000)

        return () => clearInterval(interval)
    }, [groupId])

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])


    const sendMessage = (e) => {
        e.preventDefault();
        if (!content.trim()) return

        const tempMessage = {
            _id: Date.now(),
            senderId: { _id: userId, name: user?.name || "User" },
            content,
            createdAt: new Date().toISOString(),
        }

        setMessages((prev) => [...prev, tempMessage])
        const now = Date.now()
        setLastTimestamp(now)
        lastTimestampRef.current = now

        const msg = content
        setContent("");

        axiosInstance({
            method: "POST",
            url: "/messages/send",
            data: { groupId, content: msg },
        })
            .catch((err) => {
                console.error("Send message failed:", err)
            })
    }

    return (
        <div className="flex flex-col h-full bg-white">

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg) => (
                    <div
                        key={msg._id}
                        className={`max-w-xs px-2 py-2 rounded-lg text-sm ${msg.senderId?._id === userId
                            ? "bg-green-200 text-gray-800 ml-auto"
                            : "bg-white text-gray-700 border mr-auto"
                            }`}
                    >
                        <p className="font-semibold">{msg.senderId?.name || "User"}</p>
                        <p>{msg.content}</p>
                    </div>
                ))}
                <div ref={bottomRef}></div>
            </div>

            <form
                onSubmit={sendMessage}
                className="mt-3 flex items-center gap-3 border rounded-full px-4 py-2 bg-white shadow"
            >
                <input
                    type="text"
                    className="flex-1 p-2 outline-none"
                    placeholder="Type a message..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />

                <button
                    type="submit"
                    className="p-3 bg-green-600 text-white rounded-full hover:bg-green-700"
                >
                    <Send className="w-4 h-4" />
                </button>
            </form>

        </div>
    )
}

export default GroupChat;
