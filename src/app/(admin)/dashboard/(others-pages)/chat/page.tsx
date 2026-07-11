"use client";

import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase";

type UserProfile = {
  id: string;
  full_name: string | null;
  email: string | null;
  role: string | null;
  job_title: string | null;
  country: string | null;
  city_state: string | null;
  avatar_url: string | null;
  is_online: boolean | null;
  last_seen: string | null;
  status: string | null;
};

type Chat = {
  id: string;
  type: "group" | "private";
  name: string | null;
  private_pair_key?: string | null;
  is_approved: boolean | null;
  created_at: string;
  updated_at: string | null;

  display_name?: string | null;
  display_avatar_url?: string | null;
  display_subtitle?: string | null;

  other_user?: UserProfile | null;
  last_message?: string | null;
    last_message_at?: string | null;
    pinned_message_id?: string | null;
    unread_count?: number;
};

type GroupMember = {
  user_id: string;
  member_role: string | null;
  profile: {
    id: string;
    full_name: string | null;
    email: string | null;
    role: string | null;
    job_title: string | null;
    country: string | null;
    city_state: string | null;
    avatar_url: string | null;
    is_online: boolean | null;
    last_seen: string | null;
  } | null;
}; 

type PrivateChatRequest = {
  id: string;
  requester_id: string;
  receiver_id: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  requester: {
    id: string;
    full_name: string | null;
    email: string | null;
    job_title: string | null;
    avatar_url: string | null;
  } | null;
  receiver: {
    id: string;
    full_name: string | null;
    email: string | null;
    job_title: string | null;
    avatar_url: string | null;
  } | null;
};

type ChatMessage = {
  id: string;
  chat_id: string;
  sender_id: string;
  message: string | null;
  message_type: string;
  file_url: string | null;
  file_name: string | null;
  file_type: string | null;
  voice_url: string | null;
  is_deleted: boolean | null;
  created_at: string;
  updated_at: string | null;
  sender: {
    id: string;
    full_name: string | null;
    email: string | null;
    avatar_url: string | null;
    job_title: string | null;
  } | null;
  reply_to: string | null;
    is_starred: boolean | null;
    is_pinned: boolean | null;
    edited_at: string | null;
    reads?: {
    user_id: string;
    read_at: string;
    }[];
    reply_message?: {
    id: string;
    message: string | null;
    sender_id: string;
    } | null;
    reactions?: {
    user_id: string;
    emoji: string;
    }[];
};

export default function ChatPage() {
const [currentProfile, setCurrentProfile] = useState<UserProfile | null>(null);
const [isStaff, setIsStaff] = useState(false);

const [chats, setChats] = useState<Chat[]>([]);
const chatsRef = useRef<Chat[]>([]);
const [employees, setEmployees] = useState<UserProfile[]>([]);

const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
const [selectedEmployee, setSelectedEmployee] = useState<UserProfile | null>(
  null
);

const [showEmployeeModal, setShowEmployeeModal] = useState(false);
const [search, setSearch] = useState("");

const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

const [showCreateGroup, setShowCreateGroup] = useState(false);
const [groupName, setGroupName] = useState("");
const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
const [creatingGroup, setCreatingGroup] = useState(false);
const [success, setSuccess] = useState("");

const [showManageGroup, setShowManageGroup] = useState(false);
const [groupMembers, setGroupMembers] = useState<GroupMember[]>([]);
const [loadingMembers, setLoadingMembers] = useState(false);
const [memberActionLoading, setMemberActionLoading] = useState(false);

const [privateRequests, setPrivateRequests] = useState<PrivateChatRequest[]>([]);
const [showRequestsModal, setShowRequestsModal] = useState(false);
const [requestLoading, setRequestLoading] = useState(false);
const [showGroupInfo, setShowGroupInfo] = useState(false);

const [messages, setMessages] = useState<ChatMessage[]>([]);
const [messageText, setMessageText] = useState("");
const [messagesLoading, setMessagesLoading] = useState(false);
const [sendingMessage, setSendingMessage] = useState(false);
const [activeMessage, setActiveMessage] = useState<ChatMessage | null>(null);
const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);
const [editingMessage, setEditingMessage] = useState<ChatMessage | null>(null);
const [forwardingMessage, setForwardingMessage] = useState<ChatMessage | null>(null);
const [showForwardModal, setShowForwardModal] = useState(false);
const [chatFilter, setChatFilter] = useState<"all" | "private" | "group">(
  "all"
);
const [switchingChat, setSwitchingChat] = useState(false);
const [uploadingFile, setUploadingFile] = useState(false);
const [recording, setRecording] = useState(false);
const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
const [showEmojiPicker, setShowEmojiPicker] = useState(false);
const [typingUsers, setTypingUsers] = useState<string[]>([]);
const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
const [pinnedMessage, setPinnedMessage] = useState<ChatMessage | null>(null);
const [forwardTargetChatId, setForwardTargetChatId] = useState("");
const [sidebarTyping, setSidebarTyping] = useState<Record<string, string>>({});
const [showRenameGroupModal, setShowRenameGroupModal] = useState(false);
const [groupNameInput, setGroupNameInput] = useState("");
const [renamingGroup, setRenamingGroup] = useState(false);

useEffect(() => {
  chatsRef.current = chats;
}, [chats]);


useEffect(() => {
  fetchSidebarData();
}, []);

useEffect(() => {
  setActiveMessage(null);
  setReplyingTo(null);
  setEditingMessage(null);
  setMessageText("");
  setMessages([]);

  if (selectedChat?.id) {
    fetchMessages(selectedChat.id, true);
  }
}, [selectedChat?.id]);

useEffect(() => {
  if (!selectedChat?.id) return;

  const chatId = selectedChat.id;
  const supabase = createClient();

  const channel = supabase
    .channel(`chat-room-${chatId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "chat_messages",
        filter: `chat_id=eq.${chatId}`,
      },
      async () => {
        await fetchMessages(chatId, false);
      }
    )
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "chat_reactions",
      },
      async () => {
        await fetchMessages(chatId, false);
      }
    )
    .subscribe((status) => {
      console.log("Chat realtime status:", status);
    });

  return () => {
    supabase.removeChannel(channel);
  };
}, [selectedChat?.id]);

useEffect(() => {
  if (!selectedChat?.id || !currentProfile?.id) return;

  const chatId = selectedChat.id;
  const currentUserId = currentProfile.id;
  const supabase = createClient();

  async function loadTypingUsers() {
    const { data: typingRows, error: typingError } = await supabase
      .from("chat_typing_status")
      .select("user_id,is_typing,updated_at")
      .eq("chat_id", chatId)
      .neq("user_id", currentUserId)
      .eq("is_typing", true);

    if (typingError) {
      console.error("Load typing users error:", typingError);
      setTypingUsers([]);
      return;
    }

    const names = await Promise.all(
      (typingRows || []).map(async (item) => {
        try {
          const res = await fetch(`/api/chat/profile-name/${item.user_id}`, {
            cache: "no-store",
          });

          const data = await res.json();

          if (!res.ok) {
            console.error("Load typing profile failed:", data.error);
            return "Someone";
          }

          return data.profile?.full_name?.trim() || "Someone";
        } catch (error) {
          console.error("Typing user name request error:", error);
          return "Someone";
        }
      })
    );

    setTypingUsers(names);
  }

  loadTypingUsers();

  const channel = supabase
    .channel(`typing-${chatId}-${currentUserId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "chat_typing_status",
        filter: `chat_id=eq.${chatId}`,
      },
      async () => {
        await loadTypingUsers();
      }
    )
    .subscribe((status) => {
      console.log("Selected chat typing status:", status);
    });

  return () => {
    supabase.removeChannel(channel);
  };
}, [selectedChat?.id, currentProfile?.id]);

useEffect(() => {
  if (!currentProfile?.id) return;

  const supabase = createClient();

  const channel = supabase
    .channel(`sidebar-live-updates-${currentProfile.id}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "chat_messages",
      },
      (payload) => {
        const newMessage = payload.new as ChatMessage;

        setChats((prev) => {
          const belongsToMySidebar = prev.some(
            (chat) => chat.id === newMessage.chat_id
          );

          if (!belongsToMySidebar) {
            fetchSidebarData();
            return prev;
          }

          return prev.map((chat) => {
            if (chat.id !== newMessage.chat_id) return chat;

            const isCurrentOpenChat = selectedChat?.id === chat.id;

            return {
              ...chat,
              last_message: getLastMessageText(newMessage),
              last_message_at: newMessage.created_at,
              unread_count: isCurrentOpenChat
                ? 0
                : (chat.unread_count || 0) + 1,
            };
          });
        });
      }
    )
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "chats",
      },
      async (payload) => {
  const updatedChat = payload.new as {
    id: string;
    name: string | null;
    updated_at: string;
  };

  setChats((prev) =>
    prev.map((chat) =>
      chat.id === updatedChat.id
        ? {
            ...chat,
            name: updatedChat.name,
            display_name:
              chat.type === "group"
                ? updatedChat.name || "Group Chat"
                : chat.display_name,
          }
        : chat
    )
  );

  setSelectedChat?.((prev) =>
    prev?.id === updatedChat.id
      ? {
          ...prev,
          name: updatedChat.name,
          display_name:
            prev.type === "group"
              ? updatedChat.name || "Group Chat"
              : prev.display_name,
        }
      : prev
  );

  await fetchSidebarData();
}
    )
    .subscribe((status) => {
      console.log("Sidebar realtime status:", status);
    });

  return () => {
    supabase.removeChannel(channel);
  };
}, [currentProfile?.id, selectedChat?.id]);

useEffect(() => {
  if (!currentProfile?.id) return;

  const currentUserId = currentProfile.id;
  const supabase = createClient();

  const channel = supabase
    .channel(`sidebar-typing-status-${currentUserId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "chat_typing_status",
      },
      async (payload) => {
        const row = (payload.new || payload.old) as {
          chat_id?: string;
          user_id?: string;
          is_typing?: boolean;
          updated_at?: string;
        };

        if (!row?.chat_id || !row?.user_id) return;

        // Do not show the logged-in user's own typing status.
        if (row.user_id === currentUserId) return;

        const chatExists = chatsRef.current.some(
          (chat) => chat.id === row.chat_id
        );

        // Ignore typing events from chats the user does not belong to.
        if (!chatExists) return;

        if (!row.is_typing) {
          setSidebarTyping((prev) => {
            const copy = { ...prev };
            delete copy[row.chat_id as string];
            return copy;
          });

          return;
        }

        let typingName = "Someone";

        try {
          const profileRes = await fetch(
            `/api/chat/profile-name/${row.user_id}`,
            {
              cache: "no-store",
            }
          );

          const profileData = await profileRes.json();

          if (profileRes.ok) {
            typingName =
              profileData.profile?.full_name?.trim() || "Someone";
          } else {
            console.error(
              "Failed to load typing user name:",
              profileData.error
            );
          }
        } catch (error) {
          console.error("Typing profile request failed:", error);
        }

        setSidebarTyping((prev) => ({
          ...prev,
          [row.chat_id as string]: `${typingName} is typing...`,
        }));

        window.setTimeout(() => {
          setSidebarTyping((prev) => {
            const copy = { ...prev };
            delete copy[row.chat_id as string];
            return copy;
          });
        }, 2500);
      }
    )
    .subscribe((status) => {
      console.log("Sidebar typing realtime status:", status);
    });

  return () => {
    supabase.removeChannel(channel);
  };
}, [currentProfile?.id]);

async function fetchSidebarData() {
  setLoading(true);
  setError("");

  const res = await fetch("/api/chat/sidebar", {
    cache: "no-store",
  });
  const data = await res.json();

  if (!res.ok) {
    setError(data.error || "Failed to load chat data.");
    setLoading(false);
    return;
  }

  setCurrentProfile(data.currentProfile);
  setIsStaff(Boolean(data.isStaff));
  setChats(data.chats || []);
  // console.log(data.chats);
  setEmployees(data.employees || []);
  if (Boolean(data.isStaff)) {
  fetchPrivateRequests();
}
  setLoading(false);
}

const filteredChats = chats.filter((chat) => {
  const matchesFilter = chatFilter === "all" || chat.type === chatFilter;

  const text = `${chat.display_name || chat.name || ""} ${
    chat.last_message || ""
  } ${chat.display_subtitle || ""}`.toLowerCase();

  const matchesSearch = text.includes(search.toLowerCase());

  return matchesFilter && matchesSearch;
});

const filteredEmployees = employees.filter((employee) => {
  const text = `${employee.full_name || ""} ${employee.email || ""} ${
    employee.job_title || ""
  }`.toLowerCase();

  return text.includes(search.toLowerCase());
});

function toggleMember(memberId: string) {
  setSelectedMemberIds((prev) =>
    prev.includes(memberId)
      ? prev.filter((id) => id !== memberId)
      : [...prev, memberId]
  );
}

async function handleCreateGroup(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();

  setError("");
  setSuccess("");
  setCreatingGroup(true);

  const res = await fetch("/api/chat/groups", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: groupName,
      memberIds: selectedMemberIds,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    setError(data.error || "Failed to create group.");
    setCreatingGroup(false);
    return;
  }

  setSuccess(data.message || "Group created successfully.");
  setGroupName("");
  setSelectedMemberIds([]);
  setShowCreateGroup(false);

  await fetchSidebarData();

  setCreatingGroup(false);
}

async function fetchGroupMembers(chatId: string) {
  setLoadingMembers(true);
  setError("");

  const res = await fetch(`/api/chat/groups/${chatId}/members-list`);
  const data = await res.json();

  if (!res.ok) {
    setError(data.error || "Failed to load group members.");
    setLoadingMembers(false);
    return;
  }

  setGroupMembers(data.members || []);
  setLoadingMembers(false);
}

async function openManageGroup() {
  if (!selectedChat || selectedChat.type !== "group") return;

  setShowManageGroup(true);
  await fetchGroupMembers(selectedChat.id);
}

async function handleAddMember(memberId: string) {
  if (!selectedChat) return;

  setMemberActionLoading(true);
  setError("");
  setSuccess("");

  const res = await fetch(`/api/chat/groups/${selectedChat.id}/members`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ memberId }),
  });

  const data = await res.json();

  if (!res.ok) {
    setError(data.error || "Failed to add member.");
    setMemberActionLoading(false);
    return;
  }

  setSuccess(data.message || "Employee added successfully.");
  await fetchGroupMembers(selectedChat.id);
  await fetchSidebarData();

  setMemberActionLoading(false);
}

async function handleRemoveMember(memberId: string) {
  if (!selectedChat) return;

  const confirmed = window.confirm(
    "Are you sure you want to remove this employee from the group?"
  );

  if (!confirmed) return;

  setMemberActionLoading(true);
  setError("");
  setSuccess("");

  const res = await fetch(`/api/chat/groups/${selectedChat.id}/members`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ memberId }),
  });

  const data = await res.json();

  if (!res.ok) {
    setError(data.error || "Failed to remove member.");
    setMemberActionLoading(false);
    return;
  }

  setSuccess(data.message || "Employee removed successfully.");
  await fetchGroupMembers(selectedChat.id);
  await fetchSidebarData();

  setMemberActionLoading(false);
}

async function fetchPrivateRequests() {
  const res = await fetch("/api/chat/private-requests");
  const data = await res.json();

  if (res.ok) {
    setPrivateRequests(data.requests || []);
  }
}

async function handleSendPrivateRequest(receiverId: string) {
  setError("");
  setSuccess("");
  setRequestLoading(true);

  const res = await fetch("/api/chat/private-requests", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ receiverId }),
  });

  const data = await res.json();

  if (!res.ok) {
    setError(data.error || "Failed to send private chat request.");
    setRequestLoading(false);
    return;
  }

setPrivateRequests((prev) => [
  ...prev,
  {
    id: data.requestId,
    requester_id: currentProfile?.id || "",
    receiver_id: receiverId,
    status: "pending",
    created_at: new Date().toISOString(),

    requester: {
      id: currentProfile?.id || "",
      full_name: currentProfile?.full_name || null,
      email: currentProfile?.email || null,
      job_title: currentProfile?.job_title || null,
      avatar_url: currentProfile?.avatar_url || null,
    },

    receiver: selectedEmployee
      ? {
          id: selectedEmployee.id,
          full_name: selectedEmployee.full_name || null,
          email: selectedEmployee.email || null,
          job_title: selectedEmployee.job_title || null,
          avatar_url: selectedEmployee.avatar_url || null,
        }
      : null,
  },
]);

  setSuccess(data.message || "Private chat request sent successfully.");
  setShowEmployeeModal(false);
  setRequestLoading(false);
}

async function handleReviewPrivateRequest(
  requestId: string,
  action: "approve" | "reject"
) {
  setError("");
  setSuccess("");

  const res = await fetch(`/api/chat/private-requests/${requestId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ action }),
  });

  const data = await res.json();

  if (!res.ok) {
    setError(data.error || "Failed to review request.");
    return;
  }

  setSuccess(data.message);
  await fetchPrivateRequests();
  await fetchSidebarData();
}

async function openGroupInfo() {
  if (!selectedChat || selectedChat.type !== "group") return;

  setShowGroupInfo(true);
  await fetchGroupMembers(selectedChat.id);
}

function isStaffUser(role?: string | null) {
  return role === "admin" || role === "manager" || role === "supervisor";
}

function hasPrivateChatWith(employeeId: string) {
  return chats.some(
    (chat) => chat.type === "private" && chat.other_user?.id === employeeId
  );
}

function hasPendingRequestWith(employeeId: string) {
  return privateRequests.some(
    (request) =>
      request.status === "pending" &&
      (request.requester_id === employeeId || request.receiver_id === employeeId)
  );
}

function upsertMessage(newMessage: ChatMessage) {
  setMessages((prev) => {
    const exists = prev.some((msg) => msg.id === newMessage.id);

    if (exists) {
      return prev.map((msg) =>
        msg.id === newMessage.id ? newMessage : msg
      );
    }

    return [...prev, newMessage];
  });
}

function getLastMessageText(message: ChatMessage) {
  if (message.message_type === "image") return "📷 Image";
  if (message.message_type === "voice") return "🎤 Voice note";
  if (message.message_type === "file") {
    return `📎 ${message.file_name || "File"}`;
  }

  return message.message || "";
}

function updateSidebarLastMessage(message: ChatMessage) {
  setChats((prev) =>
    prev.map((chat) =>
      chat.id === message.chat_id
        ? {
            ...chat,
            last_message: getLastMessageText(message),
            last_message_at: message.created_at,
          }
        : chat
    )
  );
}

async function fetchMessages(chatId: string, showLoader = true) {
  if (showLoader) setMessagesLoading(true);

  if (showLoader) setError("");

  try {
    const res = await fetch(`/api/chat/messages?chatId=${chatId}`, {
      cache: "no-store",
    });

    const data = await res.json();

    if (!res.ok) {
      if (showLoader) {
        setError(data.error || "Failed to load messages.");
      } else {
        console.error("Background fetch messages failed:", data.error);
      }
      return;
    }

    setMessages(data.messages || []);

    setChats((prev) =>
      prev.map((chat) =>
        chat.id === chatId ? { ...chat, unread_count: 0 } : chat
      )
    );
  } catch (error) {
    console.error("Fetch messages error:", error);

    if (showLoader) {
      setError("Failed to load messages.");
    }
  } finally {
    if (showLoader) setMessagesLoading(false);
  }
}

async function handleSendMessage(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();

  if (!selectedChat || !messageText.trim()) return;

  setSendingMessage(true);
  setError("");

  const textToSend = messageText.trim();
  const replyToMessage = replyingTo;

  try {
    const res = await fetch("/api/chat/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chatId: selectedChat.id,
        message: textToSend,
        replyTo: replyToMessage?.id || null,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Failed to send message.");
      return;
    }

    if (data.chatMessage) {
      upsertMessage({
        ...data.chatMessage,
        reply_message: replyToMessage
          ? {
              id: replyToMessage.id,
              message: replyToMessage.message,
              sender_id: replyToMessage.sender_id,
            }
          : data.chatMessage.reply_message || null,
      });

      updateSidebarLastMessage(data.chatMessage);
    }

    setMessageText("");
    setReplyingTo(null);
  } catch (error) {
    console.error("Send message error:", error);
    setError("Failed to send message.");
  } finally {
    setSendingMessage(false);
  }
}

async function handleMessageAction(
  messageId: string,
  action: "star" | "pin" | "delete" | "react",
  emoji?: string
) {
  setError("");

  if (action === "react" && emoji) {
    setMessages((prev) =>
        prev.map((msg) =>
        msg.id === messageId
            ? {
                ...msg,
                reactions: [
                ...(msg.reactions || []).filter(
                    (reaction) => reaction.user_id !== currentProfile?.id
                ),
                {
                    user_id: currentProfile?.id || "",
                    emoji,
                },
                ],
            }
            : msg
        )
    );

    setActiveMessage(null);
    }

    if (action === "star") {
  setMessages((prev) =>
    prev.map((msg) =>
      msg.id === messageId
        ? {
            ...msg,
            is_starred: !msg.is_starred,
          }
        : msg
    )
  );

  setActiveMessage(null);
}

if (action === "pin") {
  setMessages((prev) =>
    prev.map((msg) =>
      msg.id === messageId
        ? {
            ...msg,
            is_pinned: !msg.is_pinned,
          }
        : {
            ...msg,
            is_pinned: false,
          }
    )
  );

  setSelectedChat((prev) =>
    prev
      ? {
          ...prev,
          pinned_message_id:
            prev.pinned_message_id === messageId ? null : messageId,
        }
      : prev
  );

  setChats((prev) =>
    prev.map((chat) =>
      chat.id === selectedChat?.id
        ? {
            ...chat,
            pinned_message_id:
              chat.pinned_message_id === messageId ? null : messageId,
          }
        : chat
    )
  );

  setActiveMessage(null);
}

if (action === "delete") {
  const isStaffUser =
    currentProfile?.role === "admin" ||
    currentProfile?.role === "manager" ||
    currentProfile?.role === "supervisor";

  const isOwner =
    activeMessage?.sender_id === currentProfile?.id;

  setMessages((prev) =>
    isStaffUser
      ? prev.filter((msg) => msg.id !== messageId)
      : isOwner
      ? prev.map((msg) =>
          msg.id === messageId
            ? {
                ...msg,
                is_deleted: true,
                message: null,
              }
            : msg
        )
      : prev.filter((msg) => msg.id !== messageId)
  );

  setActiveMessage(null);
}

  const res = await fetch(`/api/chat/messages/${messageId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      action,
      emoji,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    setError(data.error || "Action failed.");
    return;
  }

    if (
    selectedChat?.id &&
    action !== "react" &&
    action !== "star" &&
    action !== "pin" &&
    action !== "delete"
  ) {
    await fetchMessages(selectedChat.id, false);
  }

  setActiveMessage(null);
}

async function handleEditMessage(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();

  if (!editingMessage || !messageText.trim()) return;

  const res = await fetch(`/api/chat/messages/${editingMessage.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      action: "edit",
      message: messageText.trim(),
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    setError(data.error || "Failed to edit message.");
    return;
  }

  setEditingMessage(null);
  setMessageText("");

    setMessages((prev) =>
    prev.map((msg) =>
        msg.id === editingMessage.id
        ? {
            ...msg,
            message: messageText.trim(),
            edited_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            }
        : msg
    )
    );
}

async function handleForwardMessage(targetChatId: string) {
  if (!forwardingMessage) return;

  const res = await fetch(`/api/chat/messages/${forwardingMessage.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      action: "forward",
      targetChatId,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    setError(data.error || "Failed to forward message.");
    return;
  }

  setForwardingMessage(null);
  setShowForwardModal(false);
  await fetchSidebarData();
}

async function handleFileUpload(file: File) {
  if (!selectedChat) return;

  setUploadingFile(true);
  setError("");

  const formData = new FormData();
  formData.append("chatId", selectedChat.id);
  formData.append("file", file);
  formData.append("messageType", file.type.startsWith("image/") ? "image" : "file");

  const res = await fetch("/api/chat/upload", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();

  if (!res.ok) {
    setError(data.error || "Failed to upload file.");
    setUploadingFile(false);
    return;
  }

if (data.chatMessage) {
  upsertMessage(data.chatMessage);
  updateSidebarLastMessage(data.chatMessage);
}

  setUploadingFile(false);
}

async function startVoiceRecording() {
  if (!selectedChat) return;

  setError("");

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    const chunks: Blob[] = [];

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) chunks.push(event.data);
    };

    recorder.onstop = async () => {
      try {
      const mimeType = MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : "audio/mp4";

      const extension = mimeType === "audio/webm" ? "webm" : "mp4";

      const blob = new Blob(chunks, { type: mimeType });

      const file = new File([blob], `voice-${Date.now()}.${extension}`, {
        type: mimeType,
      });

        const formData = new FormData();
        formData.append("chatId", selectedChat.id);
        formData.append("file", file);
        formData.append("messageType", "voice");

        const res = await fetch("/api/chat/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Failed to send voice note.");
          return;
        }

        setError("");

        if (data.chatMessage) {
          upsertMessage(data.chatMessage);
          updateSidebarLastMessage(data.chatMessage);

          await fetchMessages(selectedChat.id, false);
        }
      } catch (uploadError) {
        console.error("Voice upload error:", uploadError);
        setError("Failed to send voice note.");
      } finally {
        stream.getTracks().forEach((track) => track.stop());
        setRecording(false);
        setMediaRecorder(null);
      }
    };

    recorder.start();
    setMediaRecorder(recorder);
    setRecording(true);
  } catch (recordError) {
    console.error("Voice recording error:", recordError);
    setError("Microphone access was denied or recording failed.");
    setRecording(false);
    setMediaRecorder(null);
  }
}

function stopVoiceRecording() {
  if (!mediaRecorder) return;

  mediaRecorder.stop();
}

const quickEmojis = [
  "😀", "😂", "😊", "😍", "👍", "🙏", "✅", "🔥",
  "👏", "💯", "😅", "😎", "🤝", "📌", "🚚", "📦",
  "🕒", "⚠️", "🎉", "❤️", "💪", "👀", "👌", "🙌",
];

function insertEmoji(emoji: string) {
  setMessageText((prev) => prev + emoji);
  setShowEmojiPicker(false);
}

async function handleDeleteChat(chatId: string, chatType: "group" | "private") {
  const confirmed = window.confirm(
    chatType === "group"
      ? "Are you sure you want to delete this group chat?"
      : "Are you sure you want to delete this private chat?"
  );

  if (!confirmed) return;

  setError("");

  const res = await fetch(`/api/chat/${chatId}`, {
    method: "DELETE",
  });

  const data = await res.json();

  if (!res.ok) {
    setError(data.error || "Failed to delete chat.");
    return;
  }

  setChats((prev) => prev.filter((chat) => chat.id !== chatId));
  setSelectedChat(null);
  setMessages([]);
  setActiveMessage(null);
}

function getPinnedMessage() {
  if (!selectedChat?.pinned_message_id) return null;

  return (
    messages.find((msg) => msg.id === selectedChat.pinned_message_id) || null
  );
}

async function updateTypingStatus(isTyping: boolean) {
  if (!selectedChat?.id || !currentProfile?.id) return;

  const supabase = createClient();

  await supabase.from("chat_typing_status").upsert(
    {
      chat_id: selectedChat.id,
      user_id: currentProfile.id,
      is_typing: isTyping,
      updated_at: new Date().toISOString(),
    },
    {
      onConflict: "chat_id,user_id",
    }
  );
}

function handleTypingChange(value: string) {
  setMessageText(value);

  updateTypingStatus(true);

  if (typingTimeout) clearTimeout(typingTimeout);

  const timeout = setTimeout(() => {
    updateTypingStatus(false);
  }, 1500);

  setTypingTimeout(timeout);
}

const currentUserIsStaff =
  currentProfile?.role === "admin" ||
  currentProfile?.role === "manager" ||
  currentProfile?.role === "supervisor";

  async function handleRenameGroup(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();

  if (!selectedChat?.id || selectedChat.type !== "group") return;

  const cleanName = groupNameInput.trim();

  if (!cleanName) {
    setError("Group name is required.");
    return;
  }

  setRenamingGroup(true);
  setError("");
  setSuccess("");

  try {
    const res = await fetch(`/api/chat/groups/${selectedChat.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: cleanName,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Failed to rename group.");
      return;
    }

setChats((prev) =>
  prev.map((chat) =>
    chat.id === selectedChat.id
      ? {
          ...chat,
          name: data.group.name,
          display_name: data.group.name,
        }
      : chat
  )
);

setSelectedChat((prev) =>
  prev
    ? {
        ...prev,
        name: data.group.name,
        display_name: data.group.name,
      }
    : prev
);

setSuccess("Group name updated successfully.");
setShowRenameGroupModal(false);
setGroupNameInput("");
  } catch (error) {
    console.error("Rename group error:", error);
    setError("Failed to rename group.");
  } finally {
    setRenamingGroup(false);
  }
}

  return (
    <div className="h-[calc(100vh-90px)] overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="relative h-full lg:grid lg:grid-cols-[360px_1fr]">
        {/* Sidebar */}
        <aside
          className={`${
            selectedChat ? "hidden lg:flex" : "flex"
          } min-h-0 h-full flex-col border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900`}
        >
          <div className="border-b border-gray-200 p-4 dark:border-gray-800">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Chats
            </h1>

            <div className="mt-4">
                <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search employee or group..."
                className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-black dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
            </div>

           <div className="mt-4 flex gap-2">
            <button
                onClick={() => setChatFilter("all")}
                className={`rounded-full px-4 py-2 text-xs font-semibold ${
                chatFilter === "all"
                    ? "bg-black text-white"
                    : "border border-gray-300 text-gray-700 dark:border-gray-700 dark:text-gray-300"
                }`}
            >
                All
            </button>

            <button
                onClick={() => setChatFilter("private")}
                className={`rounded-full px-4 py-2 text-xs font-semibold ${
                chatFilter === "private"
                    ? "bg-black text-white"
                    : "border border-gray-300 text-gray-700 dark:border-gray-700 dark:text-gray-300"
                }`}
            >
                Private
            </button>

            <button
                onClick={() => setChatFilter("group")}
                className={`rounded-full px-4 py-2 text-xs font-semibold ${
                chatFilter === "group"
                    ? "bg-black text-white"
                    : "border border-gray-300 text-gray-700 dark:border-gray-700 dark:text-gray-300"
                }`}
            >
                Groups
            </button>
            </div>

            {isStaff && (
                <button
                onClick={() => setShowCreateGroup(true)}
                className="mt-4 w-full rounded-xl bg-black px-4 py-3 text-sm font-semibold text-white hover:bg-gray-900"
                >
                Create Group Chat
                </button>
            )}

            {isStaff && (
            <button
                onClick={() => setShowRequestsModal(true)}
                className="mt-3 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
                Private Chat Requests
                {privateRequests.filter((req) => req.status === "pending").length > 0 && (
                <span className="ml-2 rounded-full bg-red-600 px-2 py-0.5 text-xs text-white">
                    {privateRequests.filter((req) => req.status === "pending").length}
                </span>
                )}
            </button>
            )}

            {error && (
                <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
                {error}
                </p>
            )}

            {success && (
                <p className="mt-3 rounded-lg bg-green-50 px-3 py-2 text-xs text-green-700">
                {success}
                </p>
            )}
            </div>

          <div className="min-h-0 flex-1 overflow-y-auto">
            {loading ? (
                <p className="p-4 text-sm text-gray-500">Loading chats...</p>
            ) : error ? (
                <p className="p-4 text-sm text-red-600">{error}</p>
            ) : (
                <>
                <div className="px-4 pb-2 pt-4">
                    <p className="text-xs font-semibold uppercase text-gray-400">
                    My Chats
                    </p>
                </div>

                {filteredChats.length === 0 ? (
                    <p className="px-4 py-3 text-sm text-gray-500">
                    No chats yet.
                    </p>
                ) : (
                    filteredChats.map((chat) => (
                    <ChatListItem
                        key={chat.id}
                        name={chat.display_name || "Chat"}
                      message={
                          sidebarTyping[chat.id]
                            ? sidebarTyping[chat.id]
                            : chat.last_message
                            ? chat.last_message
                            : chat.type === "group"
                            ? "Group conversation"
                            : chat.display_subtitle || "Private conversation"
                        }
                        active={selectedChat?.id === chat.id}
                        unreadCount={chat.unread_count || 0}
                        isTyping={Boolean(sidebarTyping[chat.id])}
                        avatarUrl={chat.display_avatar_url || null}
                        onClick={() => {
                        setSelectedChat(chat);
                        setMessages([]);
                        setActiveMessage(null);
                        setReplyingTo(null);
                        setEditingMessage(null);
                        setMessageText("");

                        setChats((prev) =>
                            prev.map((item) =>
                            item.id === chat.id ? { ...item, unread_count: 0 } : item
                            )
                        );
                        }}
                        />
                    ))
                )}
                </>
            )}
            </div>
        </aside>

        {/* Chat Area */}
        <main
            className={`${
              selectedChat ? "flex" : "hidden lg:flex"
            } min-h-0 h-full flex-col bg-gray-50 dark:bg-gray-950`}
          >
          {selectedChat ? (
            <>
              <div className="flex flex-col gap-3 border-b border-gray-200 bg-white px-3 py-3 dark:border-gray-800 dark:bg-gray-900 sm:px-5 sm:py-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedChat(null);
                      setMessages([]);
                      setActiveMessage(null);
                    }}
                    className="mr-1 shrink-0 rounded-full border border-gray-300 px-2.5 py-1.5 text-sm font-semibold text-gray-700 dark:border-gray-700 dark:text-gray-300 lg:hidden"
                  >
                    ←
                  </button>
                  <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full sm:h-11 sm:w-11 bg-gray-200 dark:bg-gray-800">
                    {selectedChat?.display_avatar_url ? (
                      <Image
                        src={selectedChat.display_avatar_url}
                        alt={selectedChat.display_name || "Chat"}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center font-bold text-gray-600 dark:text-gray-300">
                        {(selectedChat?.display_name || "U").charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>

                  <div>
                    <h2 className="max-w-[150px] truncate text-sm font-semibold text-gray-900 dark:text-white sm:max-w-none sm:text-base">
                      {selectedChat?.display_name || "Chat"}
                    </h2>
                    <p className="max-w-40 truncate text-[11px] text-gray-500 sm:max-w-none sm:text-xs">
                    {typingUsers.length > 0
                      ? `${typingUsers.join(", ")} ${typingUsers.length > 1 ? "are" : "is"} typing...`
                      : selectedChat?.type === "group"
                      ? "Group chat"
                      : getUserStatusText(selectedChat?.other_user)}
                  </p> 
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 pl-10 sm:pl-0 lg:justify-end">

                  {isStaff && selectedChat && (
                <button
                  onClick={() => handleDeleteChat(selectedChat.id, selectedChat.type)}
                  className="rounded-full bg-red-600 px-3 py-1.5 text-[11px] sm:px-4 sm:py-2 sm:text-xs font-semibold text-white hover:bg-red-700"
                >
                  {selectedChat.type === "group" ? "Delete Group" : "Delete Chat"}
                </button>
              )}
                {selectedChat?.type === "private" && selectedChat.other_user && (
                <button
                    onClick={() => {
                    setSelectedEmployee(selectedChat.other_user || null);
                    setShowEmployeeModal(true);
                    }}
                    className="rounded-full border border-gray-300 px-3 py-1.5 text-[11px] sm:px-4 sm:py-2 sm:text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                    View Profile
                </button>
                )}
                {selectedChat?.type === "group" && (
                    <button
                    onClick={openGroupInfo}
                    className="rounded-full border border-gray-300 px-3 py-1.5 text-[11px] sm:px-4 sm:py-2 sm:text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                    >
                    Group Info
                    </button>
                )}
                {selectedChat?.type === "group" && currentUserIsStaff && (
                  <button
                    type="button"
                    onClick={() => {
                      setGroupNameInput(selectedChat.name || "");
                      setShowRenameGroupModal(true);
                    }}
                    className="shrink-0 rounded-lg border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                  >
                    Rename Group
                  </button>
                )}

                {isStaff && selectedChat?.type === "group" && (
                    <button
                    onClick={openManageGroup}
                    className="rounded-full bg-black px-3 py-1.5 text-[11px] sm:px-4 sm:py-2 sm:text-xs font-semibold text-white hover:bg-gray-900"
                    >
                    Manage Group
                    </button>
                )}
                </div>
              </div>
              {getPinnedMessage() && (
              <div className="border-b border-gray-200 bg-yellow-50 px-5 py-3 dark:border-gray-800 dark:bg-yellow-950/20">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-yellow-700 dark:text-yellow-300">
                      📌 Pinned Message
                    </p>
                    <p className="truncate text-sm text-gray-700 dark:text-gray-300">
                      {getPinnedMessage()?.message || "Pinned attachment"}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const msg = getPinnedMessage();
                      if (msg) handleMessageAction(msg.id, "pin");
                    }}
                    className="rounded-full bg-yellow-200 px-3 py-1 text-xs font-semibold text-yellow-800 hover:bg-yellow-300"
                  >
                    Unpin
                  </button>
                </div>
              </div>
            )}

              <div
                  onClick={() => setActiveMessage(null)}
                  className="min-h-0 flex-1 space-y-4 overflow-y-auto p-5"
                >
                {messagesLoading ? (
                <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                  Loading messages...
                </p>
              ) : messages.length === 0 ? (
                    <div className="flex h-full items-center justify-center">
                    <div className="text-center">
                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        No messages yet
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                        Send the first message to start the conversation.
                        </p>
                    </div>
                    </div>
                ) : (
                    messages.map((msg, index) => {
                    const isMine = msg.sender_id === currentProfile?.id;

                    const currentLabel = getDateLabel(msg.created_at);
                    const previousLabel =
                        index > 0 ? getDateLabel(messages[index - 1].created_at) : null;

                    const showDateLabel = currentLabel !== previousLabel;

                    return (
                        <div
                        key={msg.id}
                        className={activeMessage && activeMessage.id !== msg.id ? "blur-[2px]" : ""}
                        >
                        {showDateLabel && (
                            <div className="my-4 flex justify-center">
                            <span className="rounded-full bg-gray-200 px-4 py-1 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                                {currentLabel}
                            </span>
                            </div>
                        )}

                        <MessageBubble
                            message={msg}
                            isMine={isMine}
                            isActive={activeMessage?.id === msg.id}
                            onClick={() =>
                                setActiveMessage(activeMessage?.id === msg.id ? null : msg)
                            }
                            onReply={() => {
                                setReplyingTo(msg);
                                setActiveMessage(null);
                            }}
                           onForward={() => {
                            setForwardingMessage(msg);
                            setForwardTargetChatId("");
                            setShowForwardModal(true);
                            setActiveMessage(null);
                          }}
                            onCopy={async () => {
                                await navigator.clipboard.writeText(msg.message || "");
                                setActiveMessage(null);
                            }}
                            onStar={() => handleMessageAction(msg.id, "star")}
                            onPin={() => handleMessageAction(msg.id, "pin")}
                            onDelete={() => handleMessageAction(msg.id, "delete")}
                            onEdit={() => {
                                setEditingMessage(msg);
                                setMessageText(msg.message || "");
                                setActiveMessage(null);
                            }}
                            onReact={(emoji) => handleMessageAction(msg.id, "react", emoji)}
                            canManageMessages={
                              currentProfile?.role === "admin" ||
                              currentProfile?.role === "manager" ||
                              currentProfile?.role === "supervisor"
                            }
                            />
                        </div>
                    );
                    })
                )}
                </div>

              <div className="border-t border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                {replyingTo && (
            <div className="mb-3 flex items-center justify-between rounded-xl border-l-4 border-black bg-gray-50 px-4 py-3 dark:bg-gray-800">
                <div>
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                    Replying to
                </p>
                <p className="line-clamp-1 text-sm text-gray-500">
                    {replyingTo.message || "Message"}
                </p>
                </div>

                <button
                type="button"
                onClick={() => setReplyingTo(null)}
                className="text-sm font-semibold text-red-600"
                >
                Cancel
                </button>
            </div>
            )}

        {editingMessage && (
        <div className="mb-3 flex items-center justify-between rounded-xl border-l-4 border-blue-600 bg-blue-50 px-4 py-3 dark:bg-blue-950/30">
            <div>
            <p className="text-xs font-semibold text-blue-700">Editing message</p>
            <p className="line-clamp-1 text-sm text-blue-700">
                {editingMessage.message || "Message"}
            </p>
            </div>

            <button
            type="button"
            onClick={() => {
                setEditingMessage(null);
                setMessageText("");
            }}
            className="text-sm font-semibold text-red-600"
            >
            Cancel
            </button>
        </div>
        )}
           <form
              onSubmit={editingMessage ? handleEditMessage : handleSendMessage}
              className="flex w-full items-center gap-1.5 sm:gap-3"
            >
           <div className="relative">
          <button
            type="button"
            onClick={() => setShowEmojiPicker((prev) => !prev)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-300 text-lg dark:border-gray-700 sm:h-11 sm:w-11"
          >
            😊
          </button>

          {showEmojiPicker && (
            <div className="absolute bottom-12 left-0 z-50 grid w-56 grid-cols-7 gap-1 rounded-2xl border border-gray-200 bg-white p-2 shadow-xl dark:border-gray-700 dark:bg-gray-900 sm:bottom-14 sm:w-64 sm:grid-cols-8 sm:gap-2 sm:p-3">
              {quickEmojis.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => insertEmoji(emoji)}
                  className="rounded-lg p-2 text-xl hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>

            <label className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-gray-300 text-sm dark:border-gray-700 sm:h-11 sm:w-11">
            {uploadingFile ? "..." : "📎"}
            <input
              type="file"
              hidden
              accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.zip,.txt"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file);
                e.currentTarget.value = "";
              }}
            />
          </label>

            <input
            value={messageText}
            onChange={(e) => handleTypingChange(e.target.value)}
            onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();

                if (editingMessage) {
                const form = e.currentTarget.closest("form");
                form?.requestSubmit();
                } else {
                const form = e.currentTarget.closest("form");
                form?.requestSubmit();
                }
            }
            }}
            placeholder={editingMessage ? "Edit your message..." : "Type a message..."}
           className="min-w-0 flex-1 rounded-full border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-black dark:border-gray-700 dark:bg-gray-800 dark:text-white sm:px-5 sm:py-3"
            />

            <button
            type="button"
            onClick={recording ? stopVoiceRecording : startVoiceRecording}
           className={`h-10 shrink-0 rounded-full px-3 text-xs font-semibold text-white sm:h-11 sm:px-4 sm:text-sm ${
            recording ? "bg-red-600" : "bg-gray-700"
          }`}
          >
            {recording ? "Stop" : "🎤"}
          </button>

            <button
            type="submit"
            disabled={!messageText.trim()}
            className="h-10 shrink-0 rounded-full bg-black px-3 text-xs font-semibold text-white disabled:opacity-60 sm:h-11 sm:px-5 sm:text-sm"
            >
            {editingMessage ? "Update" : "Send"}
            </button>
        </form>
        </div>
            </>
          ) : (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Select a chat
                </h2>
                <p className="mt-2 text-sm text-gray-500">
                  Choose a private chat or group conversation to begin.
                </p>
              </div>
            </div>
          )}
        </main>        
      </div>

    {showForwardModal && forwardingMessage && (
  <div onClick={() => setShowForwardModal(false)} className="fixed inset-0 z-99999 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
    <div onClick={(e) => e.stopPropagation()} className="max-h-[85vh] w-full max-w-lg overflow-auto rounded-2xl shadow-xl bg-white p-6 dark:bg-gray-900">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
        Forward Message
      </h2>

      <p className="mt-1 text-sm text-gray-500">
        Select a chat or group to forward this message.
      </p>

          <div className="mt-4 rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
      <p className="text-xs font-semibold text-gray-500">Forwarding</p>
      <p className="mt-1 line-clamp-3 text-sm text-gray-800 dark:text-gray-200">
        {forwardingMessage.message || forwardingMessage.file_name || "Attachment"}
      </p>
    </div>

      <div className="mt-5 max-h-80 space-y-2 overflow-y-auto">
        {chats.map((chat) => (
        <button
          key={chat.id}
          onClick={() => setForwardTargetChatId(chat.id)}
          className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-800 ${
            forwardTargetChatId === chat.id
              ? "border-black bg-gray-50 dark:border-white dark:bg-gray-800"
              : "border-gray-200 dark:border-gray-700"
          }`}
        >
            <div className="relative h-10 w-10 overflow-hidden rounded-full bg-gray-200">
              {chat.display_avatar_url ? (
                <Image
                  fill
                  src={chat.display_avatar_url}
                  alt={chat.display_name || "Chat"}
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center font-bold text-gray-600">
                  {(chat.display_name || "C").charAt(0)}
                </div>
              )}
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {chat.display_name || "Chat"}
              </p>
              <p className="text-xs text-gray-500">
                {chat.type === "group" ? "Group" : "Private"}
              </p>
            </div>
          </button>
        ))}
      </div>
        <button
        type="button"
        disabled={!forwardTargetChatId}
        onClick={() => handleForwardMessage(forwardTargetChatId)}
        className="mt-5 w-full rounded-xl bg-black px-4 py-3 text-sm font-semibold text-white disabled:opacity-50"
      >
        Forward Message
      </button>
      <button
       onClick={() => {
        setShowForwardModal(false);
        setForwardingMessage(null);
        }}
        className="mt-5 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-700 dark:border-gray-700 dark:text-gray-300"
      >
        Cancel
      </button>
    </div>
  </div>
    )}

      {showCreateGroup && (
            <div
        onClick={() => setShowCreateGroup(false)}
        className="fixed inset-0 z-99999 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm"
        >
       <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-900"
        >
        <div className="mb-5">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Create Group Chat
            </h2>
            <p className="mt-1 text-sm text-gray-500">
            Create a meeting or team group and add employees.
            </p>
        </div>

        <form onSubmit={handleCreateGroup}>
            <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Group Name
            </label>
            <input
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="e.g. Operations Meeting"
                className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-black dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
            </div>

            <div className="mt-5">
            <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Add Employees
            </p>

            <div className="max-h-64 space-y-2 overflow-y-auto rounded-xl border border-gray-200 p-3 dark:border-gray-700">
                {employees.length === 0 ? (
                <p className="text-sm text-gray-500">No employees found.</p>
                ) : (
                employees.map((employee) => (
                    <label
                    key={employee.id}
                    className="flex cursor-pointer items-center gap-3 rounded-lg p-2 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                    <input
                        type="checkbox"
                        checked={selectedMemberIds.includes(employee.id)}
                        onChange={() => toggleMember(employee.id)}
                    />

                    <div className="relative h-9 w-9 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                        {employee.avatar_url ? (
                        <Image
                            fill
                            src={employee.avatar_url}
                            alt={employee.full_name || "Employee"}
                            className="object-cover"
                        />
                        ) : (
                        <div className="flex h-full w-full items-center justify-center text-sm font-bold text-gray-600">
                            {(employee.full_name || "U").charAt(0)}
                        </div>
                        )}
                    </div>

                    <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                        {employee.full_name || "No name"}
                        </p>
                        <p className="truncate text-xs text-gray-500">
                        {employee.job_title || employee.email}
                        </p>
                    </div>
                    </label>
                ))
                )}
            </div>
            </div>

            <div className="mt-6 flex gap-3">
            <button
                type="button"
                onClick={() => setShowCreateGroup(false)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-700 dark:border-gray-700 dark:text-gray-300"
            >
                Cancel
            </button>

            <button
                type="submit"
                disabled={creatingGroup}
                className="w-full rounded-lg bg-black px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
            >
                {creatingGroup ? "Creating..." : "Create Group"}
            </button>
            </div>
        </form>
        </div>
    </div>
    )}

    {showManageGroup && selectedChat && (
    <div
    onClick={() => setShowManageGroup(false)}
    className="fixed inset-0 z-99999 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm"
    >
        <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-900"
        >
        <div className="mb-5 flex items-start justify-between gap-4">
            <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Manage Group
            </h2>
            <p className="mt-1 text-sm text-gray-500">
                Add or remove employees from{" "}
                <span className="font-semibold">{selectedChat.name}</span>.
            </p>
            </div>

            <button
            onClick={() => setShowManageGroup(false)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 dark:border-gray-700 dark:text-gray-300"
            >
            Close
            </button>
        </div>

        {loadingMembers ? (
            <p className="text-sm text-gray-500">Loading group members...</p>
        ) : (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Current Members */}
            <div>
                <h3 className="mb-3 text-sm font-semibold uppercase text-gray-500">
                Current Members
                </h3>

                <div className="max-h-[420px] space-y-3 overflow-y-auto rounded-xl border border-gray-200 p-3 dark:border-gray-700">
                {groupMembers.length === 0 ? (
                    <p className="text-sm text-gray-500">No members found.</p>
                ) : (
                    groupMembers.map((member) => (
                    <div
                        key={member.user_id}
                        className="flex items-center justify-between gap-3 rounded-xl bg-gray-50 p-3 dark:bg-gray-800"
                    >
                        <div className="flex min-w-0 items-center gap-3">
                        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                            {member.profile?.avatar_url ? (
                            <Image
                                fill
                                src={member.profile.avatar_url}
                                alt={member.profile.full_name || "Member"}
                                className="object-cover"
                            />
                            ) : (
                            <div className="flex h-full w-full items-center justify-center text-sm font-bold text-gray-600">
                                {(member.profile?.full_name || "U").charAt(0)}
                            </div>
                            )}
                        </div>

                        <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                            {member.profile?.full_name || "No name"}
                            </p>
                            <p className="truncate text-xs text-gray-500">
                            {member.profile?.job_title || member.profile?.email}
                            </p>
                        </div>
                        </div>

                        {member.member_role !== "owner" && (
                        <button
                            onClick={() => handleRemoveMember(member.user_id)}
                            disabled={memberActionLoading}
                            className="rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-60"
                        >
                            Remove
                        </button>
                        )}
                    </div>
                    ))
                )}
                </div>
            </div>

            {/* Add Employees */}
            <div>
                <h3 className="mb-3 text-sm font-semibold uppercase text-gray-500">
                Add Employees
                </h3>

                <div className="max-h-[420px] space-y-3 overflow-y-auto rounded-xl border border-gray-200 p-3 dark:border-gray-700">
                {employees
                    .filter(
                    (employee) =>
                        !groupMembers.some(
                        (member) => member.user_id === employee.id
                        )
                    )
                    .map((employee) => (
                    <div
                        key={employee.id}
                        className="flex items-center justify-between gap-3 rounded-xl bg-gray-50 p-3 dark:bg-gray-800"
                    >
                        <div className="flex min-w-0 items-center gap-3">
                        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                            {employee.avatar_url ? (
                            <Image
                                fill
                                src={employee.avatar_url}
                                alt={employee.full_name || "Employee"}
                                className="object-cover"
                            />
                            ) : (
                            <div className="flex h-full w-full items-center justify-center text-sm font-bold text-gray-600">
                                {(employee.full_name || "U").charAt(0)}
                            </div>
                            )}
                        </div>

                        <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                            {employee.full_name || "No name"}
                            </p>
                            <p className="truncate text-xs text-gray-500">
                            {employee.job_title || employee.email}
                            </p>
                        </div>
                        </div>

                        <button
                        onClick={() => handleAddMember(employee.id)}
                        disabled={memberActionLoading}
                        className="rounded-full bg-black px-3 py-1 text-xs font-semibold text-white hover:bg-gray-900 disabled:opacity-60"
                        >
                        Add
                        </button>
                    </div>
                    ))}

                {employees.filter(
                    (employee) =>
                    !groupMembers.some((member) => member.user_id === employee.id)
                ).length === 0 && (
                    <p className="text-sm text-gray-500">
                    All available employees are already in this group.
                    </p>
                )}
                </div>
            </div>
            </div>
        )}
        </div>
    </div>
    )}

    {showGroupInfo && selectedChat && (
  <div
    onClick={() => setShowGroupInfo(false)}
    className="fixed inset-0 z-99999 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm"
    >
    <div
    onClick={(e) => e.stopPropagation()}
    className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-900"
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Group Info
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {selectedChat.display_name || selectedChat.name || "Group Chat"}
          </p>
        </div>

        <button
          onClick={() => setShowGroupInfo(false)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 dark:border-gray-700 dark:text-gray-300"
        >
          Close
        </button>
      </div>

      {loadingMembers ? (
        <p className="text-sm text-gray-500">Loading members...</p>
      ) : (
        <div className="max-h-[520px] space-y-3 overflow-y-auto">
          {groupMembers.length === 0 ? (
            <p className="text-sm text-gray-500">
              No members found in this group.
            </p>
          ) : (
            groupMembers.map((member) => {
              const memberProfile = member.profile;

              if (!memberProfile) return null;

              const isMe = member.user_id === currentProfile?.id;

              return (
                <button
                  key={member.user_id}
                  onClick={() => {
                    if (isMe) return;

                   setSelectedEmployee({
                    id: memberProfile.id,
                    full_name: memberProfile.full_name,
                    email: memberProfile.email,
                    role: memberProfile.role || null,
                    job_title: memberProfile.job_title,
                    country: memberProfile.country || null,
                    city_state: memberProfile.city_state || null,
                    avatar_url: memberProfile.avatar_url,
                    is_online: memberProfile.is_online || null,
                    last_seen: memberProfile.last_seen || null,
                    status: null,
                    });

                    setShowEmployeeModal(true);
                  }}
                  className="flex w-full items-center justify-between gap-4 rounded-xl border border-gray-200 p-4 text-left hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                      {memberProfile.avatar_url ? (
                        <Image
                          fill
                          src={memberProfile.avatar_url}
                          alt={memberProfile.full_name || "Member"}
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center font-bold text-gray-600 dark:text-gray-300">
                          {(memberProfile.full_name || "U").charAt(0)}
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                        {memberProfile.full_name || "No name"}
                        {isMe && (
                          <span className="ml-2 text-xs font-normal text-gray-500">
                            You
                          </span>
                        )}
                      </p>

                      <p className="truncate text-xs text-gray-500">
                        {memberProfile.job_title || memberProfile.email}
                      </p>
                    </div>
                  </div>

                  {!isMe && (
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                      View
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  </div>
)}

    {showRequestsModal && (
  <div
  onClick={() => setShowRequestsModal(false)}
  className="fixed inset-0 z-99999 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm"
>
    <div
    onClick={(e) => e.stopPropagation()}
    className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-900"
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Private Chat Requests
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Review employee private chat requests.
          </p>
        </div>

        <button
          onClick={() => setShowRequestsModal(false)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 dark:border-gray-700 dark:text-gray-300"
        >
          Close
        </button>
      </div>

      <div className="max-h-[520px] space-y-3 overflow-y-auto">
        {privateRequests.length === 0 ? (
          <p className="text-sm text-gray-500">
            No private chat requests yet.
          </p>
        ) : (
          privateRequests.map((request) => (
            <div
              key={request.id}
              className="rounded-xl border border-gray-200 p-4 dark:border-gray-700"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {request.requester?.full_name || "Employee"} wants to chat with{" "}
                    {request.receiver?.full_name || "Employee"}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    {request.requester?.job_title || "No job title"} →{" "}
                    {request.receiver?.job_title || "No job title"}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    Requested: {formatDateTime(request.created_at)}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      request.status === "approved"
                        ? "bg-green-100 text-green-700"
                        : request.status === "rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {request.status}
                  </span>

                  {request.status === "pending" && (
                    <>
                      <button
                        onClick={() =>
                          handleReviewPrivateRequest(request.id, "approve")
                        }
                        className="rounded-full bg-green-600 px-3 py-1 text-xs font-semibold text-white hover:bg-green-700"
                      >
                        Approve
                      </button>

                      <button
                        onClick={() =>
                          handleReviewPrivateRequest(request.id, "reject")
                        }
                        className="rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white hover:bg-red-700"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  </div>
)}

    {showEmployeeModal && selectedEmployee && (
    <EmployeeInfoModal
        employee={selectedEmployee}
        currentProfile={currentProfile}
        isStaff={isStaff}
        hasPrivateChat={hasPrivateChatWith(selectedEmployee.id)}
        hasPendingRequest={hasPendingRequestWith(selectedEmployee.id)}
        onClose={() => setShowEmployeeModal(false)}
        onSendRequest={handleSendPrivateRequest}
        requestLoading={requestLoading}
    />
    )}

    {showRenameGroupModal && selectedChat?.type === "group" && (
  <div
    className="fixed inset-0 z-99999 flex items-center justify-center bg-black/50 p-4"
    onClick={() => {
      if (!renamingGroup) {
        setShowRenameGroupModal(false);
      }
    }}
  >
    <form
      onSubmit={handleRenameGroup}
      onClick={(e) => e.stopPropagation()}
      className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-900"
    >
      <h2 className="text-lg font-bold text-gray-900 dark:text-white">
        Rename Group Chat
      </h2>

      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Enter a new name for this group.
      </p>

      <input
        type="text"
        value={groupNameInput}
        onChange={(e) => setGroupNameInput(e.target.value)}
        maxLength={100}
        placeholder="Group name"
        className="mt-5 h-11 w-full rounded-lg border border-gray-300 px-4 text-sm outline-none focus:border-black dark:border-gray-700 dark:bg-gray-800 dark:text-white"
      />

      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          disabled={renamingGroup}
          onClick={() => setShowRenameGroupModal(false)}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 disabled:opacity-60 dark:border-gray-700 dark:text-gray-300"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={renamingGroup || !groupNameInput.trim()}
          className="rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {renamingGroup ? "Saving..." : "Save Name"}
        </button>
      </div>
    </form>
  </div>
)}
    </div>
  );
}

function getDateLabel(value: string) {
  const date = new Date(value);
  const today = new Date();
  const yesterday = new Date();

  yesterday.setDate(today.getDate() - 1);

  const dateOnly = date.toDateString();

  if (dateOnly === today.toDateString()) return "Today";
  if (dateOnly === yesterday.toDateString()) return "Yesterday";

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(dateString: string) {
  return new Date(dateString).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function ChatListItem({
  name,
  message,
  active,
  avatarUrl,
  unreadCount,
  isTyping,
  onClick,
}: {
  name: string;
  message: string;
  active?: boolean;
  avatarUrl?: string | null;
  unreadCount?: number;
  isTyping?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 border-b border-gray-100 px-4 py-4 text-left hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800 ${
        active ? "bg-gray-50 dark:bg-gray-800" : ""
      }`}
    >
      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
       {avatarUrl ? (
        <Image fill src={avatarUrl} alt={name} className="object-cover" />
        ) : (
        <div className="flex h-full w-full items-center justify-center font-bold text-gray-600 dark:text-gray-300">
            {name.charAt(0)}
        </div>
        )}

        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500 dark:border-gray-900" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between">
          <h3 className="truncate text-sm font-semibold text-gray-900 dark:text-white">
            {name}
          </h3>
          {unreadCount && unreadCount > 0 ? (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-green-600 px-1.5 text-[11px] font-bold text-white">
                {unreadCount}
            </span>
            ) : (
            <span className="text-[11px] text-gray-400"> </span>
            )}
        </div>

        <p
        className={`line-clamp-1 text-xs ${
          isTyping
            ? "font-semibold text-green-600"
            : "text-gray-500 dark:text-gray-400"
        }`}
      >
        {message}
      </p>
      </div>
    </button>
  );
}

function EmployeeInfoModal({
  employee,
  currentProfile,
  isStaff,
  hasPrivateChat,
  hasPendingRequest,
  onClose,
  onSendRequest,
  requestLoading,
}: {
  employee: UserProfile;
  currentProfile: UserProfile | null;
  isStaff: boolean;
  hasPrivateChat: boolean;
  hasPendingRequest: boolean;
  onClose: () => void;
  onSendRequest: (employeeId: string) => void;
  requestLoading: boolean;
}) 
{
const selectedUserIsStaff =
  employee.role === "admin" ||
  employee.role === "manager" ||
  employee.role === "supervisor";

const currentUserIsEmployee = currentProfile?.role === "employee";

const shouldShowRequestButton =
  currentUserIsEmployee &&
  !selectedUserIsStaff &&
  !hasPrivateChat &&
  !hasPendingRequest;

  return (
    <div
    onClick={onClose}
    className="fixed inset-0 z-99999 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm pt-24"
    >
       <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-900"
    >
        <div className="flex flex-col items-center text-center">
          <div className="relative h-24 w-24 overflow-hidden rounded-full bg-gray-200">
            {employee.avatar_url ? (
              <Image
                fill
                src={employee.avatar_url}
                alt={employee.full_name || "Employee"}
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-gray-600">
                {(employee.full_name || "U").charAt(0)}
              </div>
            )}
          </div>

          <h2 className="mt-4 text-xl font-bold text-gray-900 dark:text-white">
            {employee.full_name}
          </h2>

          <p className="text-sm text-gray-500">{employee.job_title}</p>
        </div>

        <div className="mt-6 space-y-3 text-sm">
          <Info label="Email" value={employee.email} />
          <Info label="Country" value={employee.country} />
          <Info label="City / State" value={employee.city_state} />
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button
            onClick={onClose}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-700 dark:border-gray-700 dark:text-gray-300"
        >
            Close
        </button>

        {shouldShowRequestButton && (
            <button
            onClick={() => onSendRequest(employee.id)}
            disabled={requestLoading}
            className="w-full rounded-lg bg-black px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
            >
            {requestLoading ? "Sending..." : "Send Chat Request"}
            </button>
        )}

        {hasPrivateChat && (
            <div className="w-full rounded-lg bg-green-50 px-4 py-3 text-center text-sm font-semibold text-green-700">
            Private chat already available
            </div>
        )}

        {hasPendingRequest && !hasPrivateChat && (
            <div className="w-full rounded-lg bg-yellow-50 px-4 py-3 text-center text-sm font-semibold text-yellow-700">
            Chat request pending approval
            </div>
        )}

        {currentUserIsEmployee && selectedUserIsStaff && (
            <div className="w-full rounded-lg bg-blue-50 px-4 py-3 text-center text-sm font-semibold text-blue-700">
            Staff chats are already available in your sidebar
            </div>
        )}

        {isStaff && (
            <div className="w-full rounded-lg bg-blue-50 px-4 py-3 text-center text-sm font-semibold text-blue-700">
            Staff users can chat with employees directly
            </div>
        )}
        </div>
      </div>
    </div>
  );
}

function MessageBubble({
  message,
  isMine,
  isActive,
  canManageMessages,
  onClick,
  onReply,
  onForward,
  onCopy,
  onStar,
  onPin,
  onDelete,
  onEdit,
  onReact,
}: {
  message: ChatMessage;
  isMine: boolean;
  isActive: boolean;
  canManageMessages: boolean;
  onClick: () => void;
  onReply: () => void;
  onForward: () => void;
  onCopy: () => void;
  onStar: () => void;
  onPin: () => void;
  onDelete: () => void;
  onEdit: () => void;
  onReact: (emoji: string) => void;
}) {
  return (
    <div className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
      <div className={`flex max-w-[85%] gap-2 ${isMine ? "flex-row-reverse" : ""}`}>
        <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
          {message.sender?.avatar_url ? (
            <Image
              fill
              src={message.sender.avatar_url}
              alt={message.sender.full_name || "User"}
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300">
              {(message.sender?.full_name || "U").charAt(0)}
            </div>
          )}
        </div>

        <div className="relative">
          {!isMine && (
            <p className="mb-1 text-xs font-semibold text-gray-500">
              {message.sender?.full_name || "User"}
            </p>
          )}

          <div
            onClick={(e) => {
                e.stopPropagation();
                onClick();
            }}
            className={`cursor-pointer rounded-2xl px-4 py-3 text-sm shadow-sm transition ${
                isActive ? "blur-[1px]" : ""
            } ${
              isMine
                ? "rounded-br-sm bg-black text-white"
                : "rounded-bl-sm bg-white text-gray-800 dark:bg-gray-800 dark:text-gray-200"
            }`}
          >
            {message.reply_message && (
            <div
                className={`mb-2 rounded-lg border-l-4 px-3 py-2 text-xs ${
                isMine
                    ? "border-white/60 bg-white/10 text-gray-200"
                    : "border-gray-400 bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                }`}
            >
                {message.reply_message.message || "Referenced message"}
            </div>
            )}

            {message.is_deleted ? (
            <i className="text-gray-400">This message was deleted</i>
          ) : message.message_type === "image" && message.file_url ? (
            <a href={message.file_url} target="_blank" rel="noreferrer">
              <Image
                src={message.file_url}
                alt={message.file_name || "Image"}
                width={260}
                height={180}
                className="max-h-64 rounded-xl object-cover"
              />
            </a>
            ) : message.message_type === "voice" && (message.voice_url || message.file_url) ? (
            <audio
              controls
              src={message.voice_url || message.file_url || ""}
              className="w-64 max-w-full"
            />
          ) : message.message_type === "file" && message.file_url ? (
            <a
              href={message.file_url}
              target="_blank"
              rel="noreferrer"
              className={`flex items-center gap-3 rounded-xl p-3 ${
                isMine ? "bg-white/10" : "bg-gray-100 dark:bg-gray-700"
              }`}
            >
              <span>📎</span>
              <span className="break-all text-sm">
                {message.file_name || "Download file"}
              </span>
            </a>
          ) : (
            <p className="whitespace-pre-wrap wrap-break-word">
              {message.message}
            </p>
          )}

            <div
              className={`mt-1 text-right text-[10px] ${
                isMine ? "text-gray-300" : "text-gray-400"
              }`}
            >
              {formatMessageTime(message.created_at)}
                {isMine && (
                <span className="ml-1">
                    {message.reads && message.reads.length > 0 ? "Seen" : "Sent"}
                </span>
                )}
            </div>
            {message.is_starred && (
            <div className="mt-1 text-xs">
                ⭐
            </div>
            )}
          </div>
         {message.reactions && message.reactions.length > 0 && (
        <div className="mt-1 flex justify-start">
            <div className="rounded-full bg-white px-2 py-1 text-xs shadow-sm dark:bg-gray-800">
            {message.reactions.map((reaction, index) => (
                <span key={`${reaction.user_id}-${index}`}>{reaction.emoji}</span>
            ))}
            </div>
        </div>
        )}

           {isActive && (
            <div
              onClick={(e) => e.stopPropagation()}
              className={`absolute top-full z-50 mt-2 w-44 rounded-xl border border-gray-200 bg-white p-2 shadow-xl dark:border-gray-700 dark:bg-gray-900 sm:top-1 sm:mt-0 ${
                isMine
                  ? "right-0 sm:right-full sm:mr-2"
                  : "left-0 sm:left-full sm:ml-2"
              }`}
            >
                <div className="mb-2 flex items-center justify-center gap-1 rounded-full bg-gray-50 px-2 py-1 dark:bg-gray-800">
                {["👍", "✅", "🙏", "🔥", "👀"].map((emoji) => (
                    <button
                    key={emoji}
                    onClick={(e) => {
                        e.stopPropagation();
                        onReact(emoji);
                    }}
                    className="text-base hover:scale-110"
                    >
                    {emoji}
                    </button>
                ))}

                <button
                    onClick={(e) => e.stopPropagation()}
                    className="flex h-6 w-6 items-center justify-center rounded-full border border-gray-300 text-xs dark:border-gray-600"
                >
                    +
                </button>
                </div>

                <div className="overflow-hidden rounded-lg border border-gray-100 dark:border-gray-800">
                <SmallMenuAction label="Reply" onClick={onReply} />
                <SmallMenuAction label="Forward" onClick={onForward} />
                <SmallMenuAction label="Copy" onClick={onCopy} />
                <SmallMenuAction
                    label={message.is_starred ? "Unstar" : "Star"}
                    onClick={onStar}
                />
                <SmallMenuAction
                    label={message.is_pinned ? "Unpin" : "Pin"}
                    onClick={onPin}
                />
                  {canManageMessages && (
                    <>
                      <SmallMenuAction label="Edit" onClick={onEdit} />
                      <SmallMenuAction label="Delete" onClick={onDelete} danger />
                    </>
                  )}
                </div>
            </div>
            )}
        </div>
      </div>
    </div>
  );
}

function formatMessageTime(value: string) {
  return new Date(value).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function SmallMenuAction({
  label,
  onClick,
  danger,
}: {
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`block w-full border-b border-gray-100 px-3 py-2 text-left text-xs font-medium last:border-b-0 dark:border-gray-800 ${
        danger
          ? "text-red-600 hover:bg-red-50"
          : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
      }`}
    >
      {label}
    </button>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  return (
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="mt-1 font-medium text-gray-900 dark:text-white">
        {value || "Not provided"}
      </p>
    </div>
  );
}

function getUserStatusText(user?: UserProfile | null) {
  if (!user) return "Private chat";

  if (user.is_online) return "Online";

  if (user.last_seen) {
    return `Last seen ${new Date(user.last_seen).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  }

  return "Offline";
}