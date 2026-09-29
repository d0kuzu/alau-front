import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Loader2,
  MessageCircle,
  MessageSquare,
  Phone,
  User,
} from "lucide-react";

import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
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
import { formatDateTime } from "@/shared/lib/date";
import V2ChatView from "./V2ChatView";

type V2AnalyticsChatsPageProps = {
  assistantId: string;
  category: AnalyticsCategory;
  days: number;
  periodLabel: string;
  agentName?: string;
  onBack: () => void;
};

const CHATS_PER_PAGE = 10;

export const V2AnalyticsChatsPage: React.FC<V2AnalyticsChatsPageProps> = ({
  assistantId,
  category,
  days,
  periodLabel,
  agentName = "AVA",
  onBack,
}) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);

  useEffect(() => {
    setCurrentPage(1);
    setSelectedChat(null);
  }, [category, days, assistantId]);

  useEffect(() => {
    if (!category || !assistantId) return;

    let isMounted = true;
    const loadChats = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const resp = await fetchAnalyticsChatsByCategory(category, {
          assistantId,
          days,
          page: currentPage,
          limit: CHATS_PER_PAGE,
        });

        if (isMounted) {
          setChats(resp?.chats || []);
          setTotalCount(resp?.total_count || 0);
          setTotalPages(Math.max(1, resp?.total_pages || 1));
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err?.message || "Failed to load conversations");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadChats();

    return () => {
      isMounted = false;
    };
  }, [category, days, assistantId, currentPage]);

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
        return <Phone className="h-6 w-6 text-[#ff8f6a]" />;
      case "completed":
        return <MessageCircle className="h-6 w-6 text-[#3b82f6]" />;
      case "booked":
        return <CheckCircle2 className="h-6 w-6 text-[#10b981]" />;
      default:
        return <MessageSquare className="h-6 w-6 text-[#ff8f6a]" />;
    }
  };

  if (selectedChat) {
    return (
      <V2ChatView
        agentName={agentName}
        chat={selectedChat}
        onBack={() => setSelectedChat(null)}
      />
    );
  }

  const renderPageButtons = () => {
    if (totalPages <= 1) return null;

    const pages = Array.from({ length: Math.min(5, totalPages) }, (_, index) => {
      const start = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
      return start + index;
    }).filter((page) => page <= totalPages);

    return (
      <div className="mt-8 flex items-center justify-center gap-1.5">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage <= 1 || isLoading}
          className="border-[#dfe6ef] bg-white h-10 px-3 text-base text-[#465468] hover:bg-[#f7f8fa]"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        {pages.map((page) => (
          <Button
            key={page}
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(page)}
            className={
              page === currentPage
                ? "min-w-10 h-10 border-[#ff8f6a] bg-[#ff8f6a] text-white hover:bg-[#ff7d53] text-base font-semibold"
                : "min-w-10 h-10 border-[#dfe6ef] bg-white text-[#66748a] hover:bg-[#f7f8fa] text-base font-medium"
            }
          >
            {page}
          </Button>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage >= totalPages || isLoading}
          className="border-[#dfe6ef] bg-white h-10 px-3 text-base text-[#465468] hover:bg-[#f7f8fa]"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    );
  };

  return (
    <div>
      <div className="mb-6">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="h-10 px-3 gap-2 text-base font-medium text-[#465468] hover:text-[#071225] hover:bg-slate-100 rounded-[6px]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            {getCategoryIcon()}
            <h1 className="text-[2.25rem] font-bold leading-tight text-[#071225]">
              {getCategoryTitle()}
            </h1>
            <span className="rounded-[6px] bg-[#f1f5f9] px-3 py-1 text-sm font-semibold text-[#465468]">
              {periodLabel}
            </span>
          </div>
          <p className="mt-2 text-[1.25rem] font-medium text-[#465468]">
            Detailed list of conversations for the {periodLabel.toLowerCase()} timeframe
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold text-[#465468]">
            Total: {totalCount} conversations
          </span>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center rounded-[8px] border border-[#dfe6ef] bg-white py-32 text-[#64748b]">
          <Loader2 className="h-10 w-10 animate-spin text-[#ff8f6a] mb-4" />
          <p className="text-lg font-medium text-[#465468]">Loading conversations...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center rounded-[8px] border border-[#dfe6ef] bg-white py-20 text-center">
          <p className="text-lg text-red-600 font-semibold mb-4">{error}</p>
          <Button
            type="button"
            variant="outline"
            onClick={() => setCurrentPage(1)}
            className="border-[#dfe6ef] text-base"
          >
            Try Again
          </Button>
        </div>
      ) : chats.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-[8px] border border-[#dfe6ef] bg-white py-28 text-center text-[#64748b]">
          <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
            <MessageSquare className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-xl font-bold text-[#071225]">No conversations found</h3>
          <p className="text-base text-[#64748b] mt-2 max-w-md">
            There are no {category} conversations recorded for the {periodLabel.toLowerCase()} period.
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-hidden rounded-[8px] border border-[#dfe6ef] bg-white shadow-sm">
            <Table>
              <TableHeader>
                <TableRow className="border-[#dfe6ef] bg-white hover:bg-white">
                  <TableHead className="h-[60px] px-6 text-lg font-semibold text-[#465468]">
                    Phone Number / Customer
                  </TableHead>
                  <TableHead className="h-[60px] px-6 text-lg font-semibold text-[#465468]">
                    Started Date & Time
                  </TableHead>
                  <TableHead className="h-[60px] px-6 text-lg font-semibold text-[#465468]">
                    Status
                  </TableHead>
                  <TableHead className="h-[60px] px-6 text-lg font-semibold text-[#465468] text-center">
                    Messages
                  </TableHead>
                  <TableHead className="h-[60px] w-24 px-6 text-right text-lg font-semibold text-[#465468]">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {chats.map((chat) => (
                  <TableRow
                    key={chat.id}
                    onClick={() => setSelectedChat(chat)}
                    className="cursor-pointer border-[#dfe6ef] hover:bg-[#fafbfd] transition-colors group"
                  >
                    <TableCell className="h-[72px] px-6 text-lg font-medium text-[#071225]">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f1f5f9] text-[#64748b] group-hover:bg-[#ff8f6a]/15 group-hover:text-[#ff8f6a] transition-colors">
                          <Phone className="h-5 w-5" />
                        </div>
                        <span className="font-semibold">{chat.customer_id || "Anonymous Client"}</span>
                      </div>
                    </TableCell>
                    <TableCell className="h-[72px] px-6 text-lg text-[#465468]">
                      {formatDateTime(chat.started_at || chat.created_at)}
                    </TableCell>
                    <TableCell className="h-[72px] px-6 text-lg">
                      {chat.is_booked ? (
                        <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700 border border-emerald-200">
                          Booked
                        </span>
                      ) : chat.is_end ? (
                        <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700 border border-blue-200">
                          Completed
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-700 border border-amber-200">
                          In Progress
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="h-[72px] px-6 text-lg text-[#465468] text-center">
                      <span className="inline-block px-3 py-1 rounded-md bg-slate-100 text-slate-700 text-base font-semibold">
                        {chat.message_count}
                      </span>
                    </TableCell>
                    <TableCell className="h-[72px] px-6 text-right">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedChat(chat);
                        }}
                        className="h-9 px-4 text-base font-semibold text-[#ff8f6a] hover:bg-[#ff8f6a]/10 hover:text-[#ff784d] gap-1"
                      >
                        View
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {renderPageButtons()}
        </>
      )}
    </div>
  );
};

export default V2AnalyticsChatsPage;
