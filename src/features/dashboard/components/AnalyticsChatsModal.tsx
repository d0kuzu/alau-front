import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  ExternalLink,
  Loader2,
  MessageCircle,
  MessageSquare,
  Phone,
  Sparkles,
  User,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import {
  fetchAnalyticsChatsByCategory,
  type AnalyticsCategory,
  type Chat,
} from "@/services/api/api";
import { formatDateTime, formatShortDate } from "@/shared/lib/date";
import V2ChatView from "./V2ChatView";

type AnalyticsChatsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  assistantId: string;
  category: AnalyticsCategory | null;
  days: number;
  periodLabel: string;
  agentName?: string;
};

export const AnalyticsChatsModal: React.FC<AnalyticsChatsModalProps> = ({
  isOpen,
  onClose,
  assistantId,
  category,
  days,
  periodLabel,
  agentName = "AVA",
}) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);

  // Reset pagination and selected chat whenever modal opens or category/days change
  useEffect(() => {
    if (isOpen) {
      setCurrentPage(1);
      setSelectedChat(null);
    }
  }, [isOpen, category, days, assistantId]);

  useEffect(() => {
    if (!isOpen || !category || !assistantId) return;

    let isMounted = true;
    const loadChats = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const resp = await fetchAnalyticsChatsByCategory(category, {
          assistantId,
          days,
          page: currentPage,
          limit: 10,
        });

        if (isMounted) {
          setChats(resp?.chats || []);
          setTotalCount(resp?.total_count || 0);
          setTotalPages(resp?.total_pages || 1);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err?.message || "Failed to load chats");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadChats();

    return () => {
      isMounted = false;
    };
  }, [isOpen, category, days, assistantId, currentPage]);

  const getCategoryTitle = () => {
    switch (category) {
      case "started":
        return "Started Conversations";
      case "completed":
        return "Completed Conversations";
      case "booked":
        return "Booked Appointments";
      default:
        return "Analytics Conversations";
    }
  };

  const getCategoryIcon = () => {
    switch (category) {
      case "started":
        return <Phone className="h-5 w-5 text-[#ff8f6a]" />;
      case "completed":
        return <MessageCircle className="h-5 w-5 text-[#3b82f6]" />;
      case "booked":
        return <CheckCircle2 className="h-5 w-5 text-[#10b981]" />;
      default:
        return <MessageSquare className="h-5 w-5 text-[#ff8f6a]" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden sm:rounded-2xl max-h-[90vh] flex flex-col bg-white border border-[#e2e8f0] shadow-2xl">
        {selectedChat ? (
          <div className="flex flex-col h-full overflow-hidden min-h-[500px]">
            <div className="flex items-center justify-between border-b border-[#e2e8f0] px-6 py-4 bg-[#fbfbfc]">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedChat(null)}
                className="gap-2 text-sm font-semibold text-[#0f172a] hover:bg-slate-100"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to conversation list
              </Button>
              <div className="flex items-center gap-2 text-xs text-[#64748b]">
                <Clock className="h-3.5 w-3.5" />
                <span>
                  Started: {formatDateTime(selectedChat.started_at || selectedChat.created_at)}
                </span>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <V2ChatView
                agentName={agentName}
                chat={selectedChat}
                onBack={() => setSelectedChat(null)}
              />
            </div>
          </div>
        ) : (
          <>
            <DialogHeader className="px-7 pt-7 pb-4 border-b border-[#f1f5f9] bg-gradient-to-b from-[#fafbfc] to-white">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2.5">
                    {getCategoryIcon()}
                    <DialogTitle className="text-xl font-bold text-[#0f172a]">
                      {getCategoryTitle()}
                    </DialogTitle>
                    <Badge variant="secondary" className="font-semibold text-xs bg-[#f1f5f9] text-[#475569]">
                      {periodLabel}
                    </Badge>
                    <Badge variant="outline" className="font-semibold text-xs border-[#e2e8f0] text-[#0f172a]">
                      {totalCount} total
                    </Badge>
                  </div>
                  <DialogDescription className="mt-1.5 text-sm text-[#64748b]">
                    Chats that contributed to this metric during the selected {periodLabel.toLowerCase()} period.
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto p-6 min-h-[360px]">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 text-[#64748b]">
                  <Loader2 className="h-8 w-8 animate-spin text-[#ff8f6a] mb-3" />
                  <p className="text-sm font-medium">Loading conversations...</p>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <p className="text-sm text-red-600 font-semibold mb-3">{error}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setCurrentPage(1);
                    }}
                  >
                    Try Again
                  </Button>
                </div>
              ) : chats.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center text-[#64748b]">
                  <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                    <MessageSquare className="h-6 w-6 text-slate-400" />
                  </div>
                  <h4 className="text-base font-semibold text-[#0f172a]">No conversations found</h4>
                  <p className="text-sm text-[#64748b] mt-1 max-w-sm">
                    There are no {category} conversations recorded for the {periodLabel.toLowerCase()} timeframe.
                  </p>
                </div>
              ) : (
                <div className="rounded-xl border border-[#e2e8f0] overflow-hidden bg-white shadow-sm">
                  <Table>
                    <TableHeader className="bg-[#f8fafc]">
                      <TableRow className="border-b border-[#e2e8f0] hover:bg-transparent">
                        <TableHead className="font-semibold text-xs text-[#64748b] py-3.5 pl-5">Customer</TableHead>
                        <TableHead className="font-semibold text-xs text-[#64748b] py-3.5">Started At</TableHead>
                        <TableHead className="font-semibold text-xs text-[#64748b] py-3.5 text-center">Messages</TableHead>
                        <TableHead className="font-semibold text-xs text-[#64748b] py-3.5">Status</TableHead>
                        <TableHead className="font-semibold text-xs text-[#64748b] py-3.5 pr-5 text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {chats.map((chat) => (
                        <TableRow
                          key={chat.id}
                          onClick={() => setSelectedChat(chat)}
                          className="cursor-pointer border-b border-[#f1f5f9] hover:bg-[#f8fafc] transition-colors group"
                        >
                          <TableCell className="py-3.5 pl-5 font-semibold text-sm text-[#0f172a]">
                            <div className="flex items-center gap-2.5">
                              <div className="h-8 w-8 rounded-full bg-[#f1f5f9] flex items-center justify-center text-[#64748b] group-hover:bg-[#ff8f6a]/10 group-hover:text-[#ff8f6a] transition-colors">
                                <Phone className="h-4 w-4" />
                              </div>
                              <span>{chat.customer_id || "Anonymous"}</span>
                            </div>
                          </TableCell>
                          <TableCell className="py-3.5 text-sm text-[#64748b]">
                            {formatDateTime(chat.started_at || chat.created_at)}
                          </TableCell>
                          <TableCell className="py-3.5 text-sm text-[#64748b] text-center font-medium">
                            <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold">
                              {chat.message_count}
                            </span>
                          </TableCell>
                          <TableCell className="py-3.5 text-sm">
                            {chat.is_booked ? (
                              <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50 font-medium text-xs">
                                Booked
                              </Badge>
                            ) : chat.is_end ? (
                              <Badge className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-50 font-medium text-xs">
                                Completed
                              </Badge>
                            ) : (
                              <Badge className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50 font-medium text-xs">
                                In Progress
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="py-3.5 pr-5 text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedChat(chat);
                              }}
                              className="text-xs font-semibold text-[#ff8f6a] hover:bg-[#ff8f6a]/10 hover:text-[#ff784d] gap-1 h-8"
                            >
                              <span>View</span>
                              <ChevronRight className="h-3.5 w-3.5" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-[#f1f5f9] bg-[#fbfbfc]">
                <div className="text-xs text-[#64748b] font-medium">
                  Showing page <span className="font-semibold text-[#0f172a]">{currentPage}</span> of{" "}
                  <span className="font-semibold text-[#0f172a]">{totalPages}</span> ({totalCount} total)
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage <= 1 || isLoading}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="h-8 px-3 text-xs font-semibold gap-1 text-[#0f172a]"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage >= totalPages || isLoading}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className="h-8 px-3 text-xs font-semibold gap-1 text-[#0f172a]"
                  >
                    Next
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AnalyticsChatsModal;
