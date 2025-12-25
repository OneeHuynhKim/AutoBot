"use client";

import React, { useState, useEffect, useRef, JSX } from "react";
import Image from "next/image";
import {
  Search, Send, Paperclip,
  Smile, Image as ImageIcon, Search as SearchIcon, CheckCheck,
  Lock,
} from "lucide-react";
import axios from "axios";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { GetAccessToken } from "@/components/shared/token/accessToken";
import { addHours, format } from "date-fns";
import { FaCirclePlus } from "react-icons/fa6";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import * as signalR from "@microsoft/signalr";
import { createChatConnection } from "@/components/shared/signalR/connection";
import { handleDownload } from "@/components/shared/cloudinary/download";
import handleUploadMessage from "@/components/shared/cloudinary/upload-message";
import { BsFileEarmarkPpt, BsFileEarmarkZip, BsFiletypeTxt, BsLayoutSidebarReverse } from "react-icons/bs";
import { AnimatePresence, motion } from "framer-motion";
import { FaRegFileExcel, FaRegFilePdf, FaRegFileWord } from "react-icons/fa";
import { AiOutlineFile } from "react-icons/ai";

const ChatAdmin = () => {
  const [activeTab, setActiveTab] = useState("chat");
  const userInfo = useSelector((state: RootState) => state.user.userInfo);
  const [selectedContact, setSelectedContact] = useState<any>('');
  const [messages, setMessages] = useState<any>([]);
  const [inputMsg, setInputMsg] = useState("");
  const [accessToken, setAccessToken] = useState<string>('');
  const [chatRooms, setChatRooms] = useState<any>([]);
  const connection = useRef<signalR.HubConnection | null>(null);
  const chatBoxRef = useRef<HTMLDivElement>(null);
  const [openIcon, setOpenIcon] = useState<boolean>(false);
  const popupRef = useRef<HTMLDivElement | null>(null);
  const [openSecondScreen, setOpenSecondScreen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<"image" | "file">("image");
  const [listResources, setListResources] = useState<any>([]);
  const [openDelete, setOpenDelete] = useState<boolean>(false);

  const smileTypes = ['😃', '😃', '😄', '😁', '😆', '🥹', '😅', '😂', '🤣', '🥲', '😊', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🥸', '🤩', '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '🥺', '😢', '😭', '😠', '😳', '😱', '😨', '😥', '🤔', '🫣', '🫢', '🫡', '🤫', '😶', '😑', '😬', '🙄', '🥱', '😴', '🥴', '🤤', '🤧'];
  const animalTypes = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐻‍❄️', '🐨', '🐯', '🦁', '🐮', '🐷', '🐽', '🐸', '🐵', '🙈', '🙉', '🙊', '🐒', '🐔', '🐧', '🐦', '🐤', '🐣', '🐥', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🫎', '🫏', '🦄', '🐝', '🪱', '🐛', '🦋', '🐌', '🐞', '🐜', '🪰', '🪲', '🪳', '🦟', '🦗', '🕷', '🕸', '🦂', '🐢', '🐍', '🦎', '🦖', '🦕', '🐙', '🦑', '🦐', '🦞', '🦀', '🐡', '🐠', '🐟', '🐬', '🐳', '🐋', '🦈', '🦭', '🐊', '🐅', '🐆', '🦓', '🦍', '🦧', '🦣', '🐘', '🦛', '🦏', '🐪', '🐫', '🦒', '🦘', '🦬', '🐃', '🐂', '🐄', '🐎', '🐖', '🐏', '🐑', '🦙', '🐐', '🦌', '🐕', '🐩', '🦮', '🐕‍🦺', '🐈', '🐈‍⬛', '🪶', '🐓', '🦃', '🦤', '🦚', '🦜', '🪽', '🐦‍⬛', '🪿', '🦢', '🦩', '🕊', '🐇', '🦝', '🦨', '🦡', '🦫', '🦦', '🦥', '🐁', '🐀', '🐿', '🦔', '🐾', '🐉', '🐲'];
  const treeTypes = ['🌵', '🎄', '🌲', '🌳', '🌴', '🪵', '🌱', '🌿', '☘️', '🍀', '🎍', '🪴', '🎋', '🍃', '🍂', '🍁', '🪺', '🪹', '🍄', '🐚', '🪸', '🪼', '🪨', '🌾', '💐', '🌷', '🪻', '🌹', '🥀', '🪷', '🌺', '🌸', '🌼', '🌻'];

  useEffect(() => {
    if (!userInfo?.Id) return;
    loadData();
    if (accessToken) {
      handleGetAllRooms();
    }
  }, [userInfo?.Id, accessToken]);

  // useEffect(() => {
  //   if (!userInfo?.Id) return;

  //   const initAdminGlobalConnection = async () => {
  //     const token = await GetAccessToken(userInfo.Id);
  //     setAccessToken(token);

  //     const conn = createChatConnection(userInfo.Id, false);
  //     await conn.start();

  //     // Join tất cả room
  //     chatRooms.forEach((room: any) => {
  //       conn.invoke("JoinRoom", room.id);
  //     });

  //     conn.on("ReceiveMessage", (msg: any) => {
  //       const roomKey = msg.groupId;

  //       // Cập nhật chatRooms
  //       // setChatRooms((prevRooms: any) =>
  //       //   prevRooms.map((room: any) => {
  //       //     if (room.id !== roomKey) return room;
  //       //     return {
  //       //       ...room,
  //       //       lastMessage: msg.type === "text" ? msg.message : "[file/image]",
  //       //       lastMessageTime: new Date(),
  //       //       isAdminLastSender: true,
  //       //       unread: 0,
  //       //     };
  //       //   })
  //       // );
  //       setChatRooms((prevRooms: any) =>
  //         prevRooms.map((room: any) => {
  //           if (room.id !== roomKey) return room;
  //           return {
  //             ...room,
  //             lastMessage: msg.type === "text" ? msg.message : "[file/image]",
  //             isAdminLastSender: msg.isAdminSender,
  //             lastMessageTime: msg.time,
  //             unread: selectedContact?.id === roomKey ? 0 : (room.unread ?? 0) + 1,
  //           };
  //         })
  //       );


  //       setMessages((prevMsgs: any) => {
  //         if (selectedContact?.id !== roomKey) return prevMsgs;

  //         return [
  //           ...prevMsgs,
  //           {
  //             id: Date.now(),
  //             sender: msg.isAdminSender ? "me" : "user",
  //             text: msg.message,
  //             type: msg.type,
  //             time: msg.time,
  //           },
  //         ];
  //       });
  //     });

  //     conn.on("NewMessageNotification", (data: any) => {
  //       console.log("Admin nhận tin nhắn:", data);
  //       setChatRooms((prevRooms: any) => {
  //         const exists = prevRooms.some((r: any) => r.id === data.from);
  //         if (!exists) {
  //           return [
  //             ...prevRooms,
  //             {
  //               id: data.from,
  //               name: data.isGuest ? "Khách lạ" : "User",
  //               lastMessage: data.message,
  //               unread: 1,
  //               isAdminLastSender: false,
  //               lastMessageTime: new Date(),
  //             }
  //           ];
  //         }
  //         return prevRooms.map((r: any) => {
  //           if (r.id !== data.from) return r;
  //           return {
  //             ...r,
  //             lastMessage: data.message,
  //             unread: (r.unread ?? 0) + 1,
  //             lastMessageTime: new Date(),
  //           };
  //         });
  //       });
  //     });

  //     connection.current = conn;
  //   };

  //   initAdminGlobalConnection();
  // }, [chatRooms, messages]);

  useEffect(() => {
    if (!userInfo?.Id) return;

    const initAdminGlobalConnection = async () => {
      const token = await GetAccessToken(userInfo.Id);
      setAccessToken(token);

      const conn = createChatConnection(userInfo.Id, false);
      await conn.start();

      await conn.invoke("JoinRoom", "AdminGroup");

      conn.on("ReceiveMessage", (msg: any) => {
        const roomKey = msg.groupId;

        let parsedContent: any;
        try {
          parsedContent = JSON.parse(msg.message);
        } catch {
          parsedContent = msg.message;
        }

        const isImage = parsedContent?.url?.match(/\.(jpeg|jpg|gif|png|webp)$/i);
        const isFile = parsedContent?.url && !isImage;

        const newMsg = {
          id: Date.now(), // hoặc msg.id nếu server có
          sender: msg.isAdminSender ? "me" : "user",
          text: isImage || isFile ? parsedContent.name || "" : parsedContent,
          url: parsedContent?.url || null,
          fileName: parsedContent?.name || "",
          type: isImage ? "image" : isFile ? "file" : "text",
          time: format(new Date(msg.time || Date.now()), "HH:mm"),
        };

        if (selectedContact?.id === roomKey) {
          setMessages((prev: any[]) => [...prev, newMsg]);
        }

        setChatRooms((prev: any[]) =>
          prev.map((room: any) => {
            if (room.id !== roomKey) return room;
            return {
              ...room,
              lastMessage:
                newMsg.type === "text"
                  ? newMsg.text
                  : newMsg.type === "image"
                    ? "🖼️ Hình ảnh"
                    : "📄 File",
              lastMessageTime: new Date(msg.time || Date.now()),
              isAdminLastSender: msg.isAdminSender,
              unread:
                selectedContact?.id === roomKey
                  ? 0
                  : (room.unread ?? 0) + 1,
            };
          })
        );
      });

      conn.on("NewMessageNotification", (data: any) => {
        const roomId = data.from;

        let parsedContent: any;
        try {
          parsedContent = JSON.parse(data.message);
        } catch {
          parsedContent = data.message;
        }

        const isImage = parsedContent?.url?.match(/\.(jpeg|jpg|gif|png|webp)$/i);
        const isFile = parsedContent?.url && !isImage;
        const shortId = String(roomId).slice(0, 5);
        const displayName = data.isGuest
          ? `Khách (${shortId})`
          : data.fullName || "User";

        const lastMessage = typeof parsedContent === "string"
          ? parsedContent
          : isImage
            ? "🖼️ Hình ảnh"
            : isFile
              ? "📄 File"
              : parsedContent.name || "";

        setChatRooms((prevRooms: any) => {
          const exists = prevRooms.some((r: any) => r.id === roomId);
          console.log(exists);
          if (!exists) {
            return [
              ...prevRooms,
              {
                id: roomId,
                name: displayName,
                lastMessage,
                typeMessage: isImage ? "image" : isFile ? "file" : "text",
                unread: selectedContact?.id === roomId ? 0 : 1,
                isAdminLastSender: false,
                lastMessageTime: new Date(),
              },
            ];
          }

          return prevRooms.map((r: any) => {
            if (r.id !== roomId) return r;
            return {
              ...r,
              lastMessage,
              typeMessage: isImage ? "image" : isFile ? "file" : "text",
              unread: selectedContact?.id === roomId ? r.unread : (r.unread ?? 0) + 1,
              lastMessageTime: new Date(),
            };
          });
        });
      });

      connection.current = conn;
    };

    initAdminGlobalConnection();
  }, []);

  useEffect(() => {
    console.log("📌 chatRooms thay đổi:", chatRooms);
  }, [chatRooms]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setOpenIcon(false);
      }
    };

    if (openIcon) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openIcon]);

  useEffect(() => {
    if (!chatBoxRef.current) return;
    chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
  }, [selectedContact]);

  useEffect(() => {
    if (!chatBoxRef.current) return;
    chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
  }, [messages]);

  useEffect(() => {
    if (!selectedContact?.id || !connection.current) return;
    connection.current.invoke("JoinRoom", selectedContact.id);
  }, [selectedContact]);

  useEffect(() => {
    if (openSecondScreen && selectedContact && accessToken) {
      handleGetResources(selectedContact.roomId, activeMenu);
    }
  }, [openSecondScreen, selectedContact, accessToken]);

  const handleGetResources = async (chatroomId: string, type: string) => {
    await axios.get(`${process.env.NEXT_PUBLIC_URL_API}Chat/GetResources?ChatRoomId=${chatroomId}&TypeResource=${type}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }).then(res => {
      setListResources(res.data.data);
    }).catch(err => {
      console.log(err);
    })
  }

  const loadData = async () => {
    const token = await GetAccessToken(userInfo?.Id);
    if (token) setAccessToken(token);
  }

  const handleSendMessage = async (
    e?: React.FormEvent,
    content?: string | { url: string; name?: string },
    typeMessage?: "text" | "image" | "file"
  ) => {
    if (e) e.preventDefault();
    if (!connection.current) return;

    let messageToSend;
    let type: "text" | "image" | "file" = typeMessage || "text";

    if (typeof content === "string") {
      if (!content.trim()) return;
      messageToSend = content;
    } else if (content && typeof content === "object") {
      messageToSend = JSON.stringify(content);
      if (!typeMessage) {
        type = content.url?.match(/\.(jpeg|jpg|gif|png|webp)$/i)
          ? "image"
          : "file";
      }
    } else if (!inputMsg.trim()) {
      return;
    }
    try {
      const roomKey = selectedContact.guestId ?? selectedContact.userId;

      const payload = {
        message: messageToSend || inputMsg,
        targetId: roomKey,
        guestId: selectedContact.isGuest ? roomKey : null,
        typeMessage: type,
        sender: "me",
      };

      await axios.post(
        `${process.env.NEXT_PUBLIC_URL_API}Chat/SendMessage`,
        payload,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      // connection.current?.invoke(
      //   "SendMessage",
      //   accessToken ? userInfo.Id :selectedContact.guestId,
      //   payload.message,
      //   type
      // );
      const payloadMessage = messageToSend || inputMsg;

      setChatRooms((prevRooms: any) =>
        prevRooms.map((room: any) => {
          if (room.id !== roomKey) return room;
          return {
            ...room,
            lastMessage:
              type === "text"
                ? payloadMessage
                : type === "image"
                  ? "🖼️ Hình ảnh"
                  : "📄 File",
            lastMessageTime: new Date(),
            typeMessage: type,
            isAdminLastSender: true,
            unread: 0,
          };
        })
      );


      if (!content) setInputMsg("");
    } catch (err) {
      console.log("Send message error:", err);
    }
  };

  const handleSelectContact = async (contact: any) => {
    setSelectedContact(contact);
    const currentRoom = chatRooms.find((r: any) => r.id === contact.id);
    const currentUnread = currentRoom?.unread || 0;

    if (currentUnread > 0) {
      setChatRooms((prev: any) =>
        prev.map((r: any) => r.id === contact.id ? { ...r, unread: 0 } : r)
      );

      await handleReadChat(contact);
    }
    handleGetChatByRoomId(contact);
  };

  const handleReadChat = async (contact: any) => {
    await axios.post(`${process.env.NEXT_PUBLIC_URL_API}Chat/SeenMessage`, {
      chatRoomId: contact.roomId
    }, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
  }

  const handleGetAllRooms = async () => {
    await axios.get(`${process.env.NEXT_PUBLIC_URL_API}ChatRoom/GetChatRooms`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }).then(res => {
        setChatRooms(res.data.data.map((room: any) => ({
          ...room,
          unread: room.unreadCount
        })));
      }).catch(err => {
        console.log(err);
      })
  }

  const handleGetChatByRoomId = async (contact: any) => {
    try {
      let url = "";
      if (contact.isGuest) {
        url = `${process.env.NEXT_PUBLIC_URL_API}Chat/GetHistory?GuestId=${contact.id}`;
      } else {
        url = `${process.env.NEXT_PUBLIC_URL_API}Chat/GetHistory?TargetId=${contact.id}`;
      }

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      const chatData = res.data.data || [];
      const messagesFormatted = chatData.map((msg: any) => {
        let parsedContent;
        try {
          parsedContent = JSON.parse(msg.message);
        } catch {
          parsedContent = msg.message;
        }

        const isImage = parsedContent.url?.match(/\.(jpeg|jpg|gif|png|webp)$/i);
        const isFile = parsedContent.url && !isImage;

        return {
          id: msg.id,
          sender: msg.isAdminSender ? "me" : "user",
          text: isImage || isFile ? parsedContent.name || "" : parsedContent,
          url: parsedContent.url || null,
          fileName: parsedContent.name || "",
          type: isImage ? "image" : isFile ? "file" : "text",
          time: format(addHours(msg.timestamp, 7), "HH:mm"),
        };
      });

      setMessages(messagesFormatted);
    } catch (err) {
      console.log(err);
    }
  }

  const isImageFile = (url: string) => {
    const ext = url.split(".").pop()?.toLowerCase();

    return ["jpg", "jpeg", "png", "webp", "gif", "svg"].includes(ext ?? "");
  };

  const getFileIcon = (filename: string) => {
    const ext = filename.split(".").pop()?.toLowerCase() ?? "";

    const icons: Record<string, JSX.Element> = {
      pdf: <FaRegFilePdf className="text-red-600" size={20} />,
      doc: <FaRegFileWord className="text-blue-600" size={20} />,
      docx: <FaRegFileWord className="text-blue-600" size={20} />,
      xls: <FaRegFileExcel className="text-green-600" size={20} />,
      xlsx: <FaRegFileExcel className="text-green-600" size={20} />,
      ppt: <BsFileEarmarkPpt className="text-orange-600" size={20} />,
      pptx: <BsFileEarmarkPpt className="text-orange-600" size={20} />,
      txt: <BsFiletypeTxt className="text-gray-600" size={20} />,
      zip: <BsFileEarmarkZip className="text-yellow-600" size={20} />,
      rar: <BsFileEarmarkZip className="text-yellow-600" size={20} />,
    };

    return icons[ext] ?? <AiOutlineFile className="text-gray-500" size={20} />;
  };

  const handleDeleteChatRoom = async (chatroomId: string) => {
    if (!selectedContact && !accessToken) return;

    await axios.delete(`${process.env.NEXT_PUBLIC_URL_API}ChatRoom/DeleteChatRoom?chatroomId=${chatroomId}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }).then(res => {
      setOpenDelete(false);
      setOpenSecondScreen(false);
      setSelectedContact("");
      setMessages("");
      handleGetAllRooms();
    }).catch(err => {
      console.log(err);
    })
  }

  return (
    <div className="flex h-[750px] font-sans overflow-hidden">
      <main className="flex-1 flex h-full">
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
          <div className="p-4 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Đoạn chat</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Tìm kiếm trên Messenger..."
                className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto relative">
            {chatRooms.length ? (
              chatRooms.map((contact: any, index: number) => (
                <div
                  key={`${contact.id}-${index}`}
                  onClick={() => handleSelectContact(contact)}
                  className={`flex items-center gap-3 p-3 mx-2 mt-1 rounded-lg cursor-pointer transition-colors ${selectedContact.id === contact.id
                    ? "bg-blue-50"
                    : "hover:bg-gray-100"
                    }`}
                >
                  <div className="relative">
                    <Image
                      src={contact.avatar || "https://res.cloudinary.com/drpxjqd47/image/upload/v1763051875/xusxceivnufh4ncc8peb.jpg"}
                      alt={contact.name || "Guest"}
                      width={48} height={48}
                      className="rounded-full object-cover"
                    />
                    {contact.online && (
                      <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <h3 className={`text-sm truncate ${selectedContact.id === contact.id ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>
                        {contact.name || "Guest"}
                      </h3>
                      <span className="text-xs text-gray-400">{contact.time}</span>
                      {contact.unread > 0 && (
                        <span className="min-w-2.5 h-2.5 flex items-center justify-center mr-1.5 bg-red-500 text-white text-[10px] font-bold rounded-full px-1"></span>
                      )}
                    </div>
                    <div className="flex justify-between items-center">
                      <p
                        className={`text-sm truncate ${contact.unreadCount > 0 ? "text-gray-900" : "text-gray-500"
                          }`}
                      >
                        {contact.isAdminLastSender ? "Bạn: " : ""}

                        {(() => {
                          let lastMsg = contact.lastMessage;
                          try {
                            const parsed = JSON.parse(lastMsg);
                            if (parsed.url) {
                              const isImage = parsed.url.match(/\.(jpeg|jpg|gif|png|webp)$/i);
                              return isImage ? "🖼️ Hình ảnh" : "📄 File";
                            }
                          } catch {
                          }
                          return lastMsg;
                        })()}
                      </p>
                      <div className="flex flex-col items-end">
                        {contact.lastMessageTime && (
                          <span className="text-[10px] text-gray-400 mt-1">
                            {contact.lastMessageTime
                              ? format(addHours(new Date(contact.lastMessageTime), 7), "HH:mm")
                              : ""}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center mt-5">Chưa có phòng chat</div>
            )}
          </div>
        </div>

        {selectedContact ? (
          <div className="flex-1 flex flex-col bg-white h-full relative">
            <div className="h-16 border-b border-gray-200 flex items-center justify-between px-6 bg-white shrink-0 z-10">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Image
                    src={selectedContact?.avatar}
                    alt={selectedContact?.name}
                    width={40} height={40}
                    className="rounded-full object-cover"
                  />
                  {selectedContact?.online && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">{selectedContact.name}</h3>
                  <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                    {selectedContact.online ? "Đang hoạt động" : "Hoạt động 5 phút trước"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-blue-600">
                <button onClick={() => setOpenSecondScreen(!openSecondScreen)} className="p-2 hover:bg-gray-100 text-gray-500 rounded-full transition cursor-pointer"><BsLayoutSidebarReverse size={20} /></button>
              </div>
            </div>

            <div ref={chatBoxRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-white scrollbar-thin scrollbar-thumb-gray-200">
              <div className="text-center text-xs text-gray-400 my-4">
                {new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-2">
                {messages.length === 0 ? (
                  <div className="text-gray-400 text-center mt-20">Chưa có tin nhắn</div>
                ) : (
                  messages.map((msg: any, index: number) => {
                    const isMe = msg.sender === "me";
                    const nextMsg = messages[index + 1];
                    const isLastFromSender = !nextMsg || nextMsg.sender !== msg.sender;

                    let messageContent;

                    switch (msg.type) {
                      case "image":
                        messageContent = (
                          <Image
                            width={1000}
                            height={500}
                            src={msg.url}
                            alt={msg.fileName || "image"}
                            className="max-w-xs max-h-40 rounded-xl object-cover"
                          />
                        );
                        break;
                      case "file":
                        messageContent = (
                          <button
                            onClick={() => handleDownload(msg.url, msg.fileName)}
                            className="flex items-center gap-2 rounded-lg cursor-pointer"
                          >
                            <Paperclip size={16} /> {msg.fileName}
                          </button>
                        );
                        break;
                      default:
                        messageContent = msg.text;
                    }
                    return (
                      <div key={index} className={`flex ${isMe ? "justify-end" : "justify-start items-center"}`}>
                        {!isMe && (
                          <div className={`mr-3 ${!isLastFromSender ? "invisible" : ""}`}>
                            <Image
                              src={selectedContact.avatar}
                              width={32}
                              height={32}
                              alt="avatar"
                              className="w-full h-full max-h-50 rounded-full mb-2 border border-gray-300"
                            />
                          </div>
                        )}
                        <div className="flex flex-col items-start">
                          <div className={`${msg.type !== "image" && 'px-3 py-2'} rounded-2xl text-sm leading-relaxed shadow-sm 
                            ${msg.type === "image"
                              ? ""
                              : isMe
                                ? "bg-blue-600 text-white rounded-tr-sm self-end"
                                : "bg-gray-100 text-gray-800 rounded-tl-sm"
                            }`}
                          >
                            {messageContent}
                          </div>
                          {isLastFromSender && (
                            <div className={`w-full flex mt-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
                              <span className="text-[10px] text-gray-400">{msg.time}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })

                )}
              </div>
            </div>
            <div className="p-4 bg-white border-t border-gray-100 shrink-0">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-blue-600">
                  <button type="button" className="p-2 hover:bg-gray-100 rounded-full transition"><FaCirclePlus size={20} /></button>
                  <input
                    type="file"
                    accept="image/*"
                    id="imageInput"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;

                      const uploaded = await handleUploadMessage(file);
                      if (!uploaded) return;

                      handleSendMessage(undefined, { url: uploaded.url, name: uploaded.originalName }, "image");
                    }}
                  />
                  <label htmlFor="imageInput" className="p-2 hover:bg-gray-100 rounded-full cursor-pointer">
                    <ImageIcon size={20} />
                  </label>

                  <input
                    type="file"
                    id="fileInput"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;

                      const uploaded = await handleUploadMessage(file);
                      if (!uploaded) return;

                      handleSendMessage(undefined, { url: uploaded.url, name: uploaded.originalName }, "file");
                    }}
                  />
                  <label htmlFor="fileInput" className="p-2 hover:bg-gray-100 rounded-full cursor-pointer">
                    <Paperclip size={20} />
                  </label>
                </div>

                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={inputMsg}
                    autoFocus={true}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    onChange={(e) => setInputMsg(e.target.value)}
                    placeholder="Nhập tin nhắn..."
                    className="w-full pl-4 pr-10 py-2.5 bg-gray-100 rounded-full text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white transition"
                  />
                  <div className="relative">
                    <div
                      onClick={() => setOpenIcon(!openIcon)}
                      className="absolute right-3 top-0 -translate-y-7.5 text-gray-400 hover:text-yellow-500 transition cursor-pointer"
                    >
                      <Smile size={20} />
                    </div>

                    {openIcon && (
                      <div
                        ref={popupRef}
                        className="absolute right-0 -top-92 z-90 bg-white border rounded-lg shadow-xl p-4 w-75 max-h-82 overflow-y-auto"
                      >
                        <div className="text-sm font-semibold mb-1 text-gray-500">
                          Biểu cảm
                        </div>
                        <div className="grid grid-cols-8 gap-2 mb-2">
                          {smileTypes.map((item, index) => (
                            <button
                              key={index}
                              onClick={() => {
                                setInputMsg(prev => prev + item);
                              }}
                              className="text-xl hover:scale-125 transition"
                            >
                              {item}
                            </button>
                          ))}
                        </div>

                        <div className="text-sm font-semibold mb-1 text-gray-500">
                          Động vật
                        </div>
                        <div className="grid grid-cols-8 gap-2 mb-2">
                          {animalTypes.map((item, index) => (
                            <button
                              key={index}
                              onClick={() => {
                                setInputMsg(prev => prev + item);
                              }}
                              className="text-xl hover:scale-125 transition"
                            >
                              {item}
                            </button>
                          ))}
                        </div>

                        <div className="text-sm font-semibold mb-1 text-gray-500">
                          Cây cối / Thiên nhiên
                        </div>
                        <div className="grid grid-cols-8 gap-2">
                          {treeTypes.map((item, index) => (
                            <button
                              key={index}
                              onClick={() => {
                                setInputMsg(prev => prev + item);
                              }}
                              className="text-xl hover:scale-125 transition"
                            >
                              {item}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div
                  onClick={handleSendMessage}
                  className={`p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 ${!inputMsg.trim() && 'opacity-50 cursor-not-allowed'} cursor-pointer transition shadow-md shadow-blue-200`}
                >
                  <Send size={18} className="ml-0.5" />
                </div>
              </div>
            </div>
            <AnimatePresence>
              {openSecondScreen && (
                <>
                  <motion.div
                    className="absolute inset-0 bg-black/0 z-40 cursor-pointer"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setOpenSecondScreen(false)}
                  />
                  <motion.div
                    className="absolute top-0 right-0 h-full w-[350px] bg-white shadow-xl z-40"
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "100%" }}
                    transition={{ type: "spring", stiffness: 200, damping: 25 }}
                  >
                    <div className="p-4">
                      <h2 className="font-semibold">Thông tin khách hàng</h2>
                      <div className="flex flex-col items-center justify-center mt-10">
                        <Image
                          src={selectedContact?.avatar}
                          alt={selectedContact?.name}
                          width={40} height={40}
                          className="w-30 h-30 border border-gray-100 shadow rounded-full object-cover"
                        />
                        <div className="mt-2 font-semibold text-gray-700">
                          {selectedContact?.name}
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 space-y-4 flex items-center justify-center">
                      <div className="flex justify-center gap-4">
                        <button
                          onClick={() => {
                            setActiveMenu("image");
                            handleGetResources(selectedContact.roomId, "image");
                          }}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition cursor-pointer ${activeMenu === "image"
                            ? "bg-gray-200 text-gray-800"
                            : "bg-gray-100 text-gray-500"
                            }`}
                        >
                          <ImageIcon size={18} />
                          <span className="text-sm">Ảnh</span>
                        </button>

                        <button
                          onClick={() => {
                            setActiveMenu("file");
                            handleGetResources(selectedContact.roomId, "file");
                          }}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition cursor-pointer ${activeMenu === "file"
                            ? "bg-gray-200 text-gray-800"
                            : "bg-gray-100 text-gray-500"
                            }`}
                        >
                          <Paperclip size={18} />
                          <span className="text-sm">Tệp</span>
                        </button>
                      </div>
                    </div>
                    <div className="mt-5 px-4 max-h-[350px] overflow-y-auto">
                      {listResources?.length ? (
                        <div className="grid grid-cols-3 gap-2">
                          {listResources?.map((item: any, index: number) => {
                            const { url, name } = JSON.parse(item.message);

                            if (!isImageFile(url)) return null;

                            return (
                              <div
                                key={index}
                                className="w-full h-24 bg-gray-100 rounded overflow-hidden"
                              >
                                <Image
                                  loading="lazy"
                                  width={1000}
                                  height={500}
                                  src={url}
                                  alt={name}
                                  className="w-full h-full object-cover border"
                                />
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-center">Không có dữ liệu</div>
                      )}

                      {activeMenu === "file" && (
                        <div>
                          {listResources?.map((item: any, index: number) => {
                            const { url, name } = JSON.parse(item.message);
                            const fileName = url.split("/").pop();

                            return (
                              <a
                                key={index}
                                href={url.replace("/upload/", "/upload/fl_attachment/")}
                                target="_blank"
                                download={fileName}
                                className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-100 cursor-pointer"
                              >
                                {getFileIcon(fileName)}
                                <span className="text-gray-700 text-sm truncate flex-1">
                                  {name}
                                </span>
                              </a>
                            );
                          })}
                        </div>
                      )}

                    </div>

                    <div className="flex justify-center">
                      <div
                        onClick={() => setOpenDelete(true)}
                        className="w-fit mt-5 flex items-center justify-center rounded-2xl gap-3 py-2 px-10 bg-[rgb(230,0,18)] font-semibold text-white transition cursor-pointer"
                      >
                        <Lock size={18} />
                        <span className="text-sm">Xoá lịch sử trò chuyện</span>
                      </div>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center gap-2 text-2xl font-medium font-mono">
            <IoChatboxEllipsesOutline />
            Đoạn chat AutoBot</div>
        )}
        <AnimatePresence>
          {openDelete && (
            <>
              <motion.div
                className="fixed inset-0 bg-black bg-opacity-50 z-70"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                onClick={() => setOpenDelete(false)}
              />

              <motion.div
                className="fixed inset-0 z-70 flex items-center justify-center"
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                exit={{ y: "100%", opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
                  <h2 className="text-lg font-semibold mb-4">Xác nhận xóa cuộc trò chuyện</h2>
                  <p className="mb-6">Bạn có chắc chắn muốn xóa cuộc trò chuyện?</p>
                  <div className="flex justify-end gap-3">
                    <button
                      className="px-4 py-2 rounded-md border border-blue-400 cursor-pointer hover:bg-blue-500 hover:text-white transition-all duration-200"
                      onClick={() => handleDeleteChatRoom(selectedContact.roomId)}
                    >
                      Xóa cuộc hội thoại
                    </button>
                    <button
                      className="px-4 py-2 rounded-md bg-blue-400 hover:bg-blue-500 text-white cursor-pointer transition-all duration-200"
                      onClick={() => setOpenDelete(false)}
                    >
                      Không
                    </button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default ChatAdmin;