import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal, Plus, Search } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import { useToast } from "@/shared/hooks/use-toast";
import {
  fetchAssistant,
  fetchChats,
  fetchChatsPagination,
  searchChats,
  type Chat,
} from "@/services/api/api";
import { V2_ASSISTANT_ID } from "../constants/v2";
import V2ChatView from "./V2ChatView";

const CHATS_PER_PAGE = 10;

const formatCreatedDate = (iso: string) => {
  if (!iso) {
    return "-";
  }

  try {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
};

const V2ConversationsPage = () => {
  const { toast } = useToast();
  const [agentName, setAgentName] = useState("AVA");
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchMode, setIsSearchMode] = useState(false);

  useEffect(() => {
    const loadAssistant = async () => {
      try {
        const assistant = await fetchAssistant(V2_ASSISTANT_ID);

        setAgentName(assistant.name || "AVA");
      } catch {
        setAgentName("AVA");
      }
    };

    void loadAssistant();
  }, []);

  const loadChats = useCallback(
    async (page: number) => {
      setIsLoading(true);

      try {
        const [nextChats, nextTotalPages] = await Promise.all([
          fetchChats(page, V2_ASSISTANT_ID),
          fetchChatsPagination(V2_ASSISTANT_ID),
        ]);

        setChats(nextChats);
        setTotalPages(Math.max(1, nextTotalPages));
        setTotalCount(Math.max(nextChats.length, nextTotalPages * CHATS_PER_PAGE));
        setCurrentPage(page);
      } catch (error) {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to load conversations",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [toast],
  );

  useEffect(() => {
    setIsSearchMode(false);
    setSearchQuery("");
    void loadChats(1);
  }, [loadChats]);

  const handleSearch = async () => {
    const query = searchQuery.trim();

    if (!query) {
      setIsSearchMode(false);
      setTotalCount(null);
      await loadChats(1);
      return;
    }

    setIsLoading(true);
    setIsSearchMode(true);

    try {
      const data = await searchChats(query, V2_ASSISTANT_ID, 1);

      setChats(data.answer);
      setTotalCount(data.total_count || data.answer.length);
      setTotalPages(Math.max(1, Math.ceil((data.total_count || data.answer.length) / CHATS_PER_PAGE)));
      setCurrentPage(1);
    } catch (error) {
      toast({
        title: "Search error",
        description: error instanceof Error ? error.message : "Search failed",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const goToPage = async (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) {
      return;
    }

    if (isSearchMode) {
      setIsLoading(true);

      try {
        const data = await searchChats(searchQuery.trim(), V2_ASSISTANT_ID, page);

        setChats(data.answer);
        setTotalCount(data.total_count || data.answer.length);
        setCurrentPage(page);
      } catch (error) {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to load page",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }

      return;
    }

    await loadChats(page);
  };

  const renderPageButtons = () => {
    if (totalPages <= 1) {
      return null;
    }

    const pages = Array.from({ length: Math.min(5, totalPages) }, (_, index) => {
      const start = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
      return start + index;
    }).filter((page) => page <= totalPages);

    return (
      <div className="mt-6 flex items-center justify-center gap-1">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => void goToPage(currentPage - 1)}
          disabled={currentPage <= 1 || isLoading}
          className="border-[#dfe6ef] bg-white"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        {pages.map((page) => (
          <Button
            key={page}
            type="button"
            variant="outline"
            size="sm"
            onClick={() => void goToPage(page)}
            className={
              page === currentPage
                ? "min-w-9 border-[#ff8f6a] bg-[#ff8f6a] text-white hover:bg-[#ff7d53]"
                : "min-w-9 border-[#dfe6ef] bg-white text-[#66748a] hover:bg-[#f7f8fa]"
            }
          >
            {page}
          </Button>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => void goToPage(currentPage + 1)}
          disabled={currentPage >= totalPages || isLoading}
          className="border-[#dfe6ef] bg-white"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  if (selectedChat) {
    return <V2ChatView agentName={agentName} chat={selectedChat} onBack={() => setSelectedChat(null)} />;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-[2.25rem] font-bold leading-tight text-[#071225]">Conversations</h1>
        <p className="mt-3 text-[1.45rem] font-medium text-[#465468]">
          Manage your AI-powered conversations through WebSocket
        </p>
      </div>

      <div className="mb-8 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-1 gap-3 xl:max-w-[570px]">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#9aa6b5]" />
            <Input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  void handleSearch();
                }
              }}
              placeholder="Search calls..."
              className="h-[50px] rounded-[6px] border-[#dfe6ef] pl-12 text-lg text-[#071225] placeholder:text-[#718199] focus-visible:ring-[#ff8f6a]/30"
            />
          </div>
          <Button
            type="button"
            onClick={() => void handleSearch()}
            className="h-[50px] rounded-[7px] bg-[#ffb39d] px-6 text-lg font-semibold text-white shadow-none hover:bg-[#ff9f82]"
          >
            Search
          </Button>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button
            type="button"
            className="h-[50px] rounded-[7px] bg-[#ff8f6a] px-6 text-lg font-semibold text-white shadow-none hover:bg-[#ff7d53]"
          >
            <Plus className="mr-3 h-5 w-5" />
            Create Conversation
          </Button>
          <span className="text-lg font-medium text-[#465468]">
            Total: {totalCount ?? chats.length} conversations
          </span>
        </div>
      </div>

      <div className="overflow-hidden rounded-[8px] border border-[#dfe6ef] bg-white">
        <Table>
          <TableHeader>
            <TableRow className="border-[#dfe6ef] bg-white hover:bg-white">
              <TableHead className="h-[60px] px-5 text-lg font-semibold text-[#465468]">Phone Number</TableHead>
              <TableHead className="h-[60px] px-5 text-lg font-semibold text-[#465468]">Agent</TableHead>
              <TableHead className="h-[60px] px-5 text-lg font-semibold text-[#465468]">Status</TableHead>
              <TableHead className="h-[60px] px-5 text-lg font-semibold text-[#465468]">Messages</TableHead>
              <TableHead className="h-[60px] px-5 text-lg font-semibold text-[#465468]">Created</TableHead>
              <TableHead className="h-[60px] w-14 px-5 text-right text-lg font-semibold text-[#465468]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-40 text-center">
                  <div className="flex items-center justify-center">
                    <div className="h-7 w-7 animate-spin rounded-full border-b-2 border-[#ff8f6a]" />
                  </div>
                </TableCell>
              </TableRow>
            ) : chats.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-40 text-center text-lg text-[#66748a]">
                  {isSearchMode ? "Nothing was found for your search." : "No conversations found."}
                </TableCell>
              </TableRow>
            ) : (
              chats.map((chat) => (
                <TableRow
                  key={chat.id}
                  onClick={() => setSelectedChat(chat)}
                  className="h-[82px] cursor-pointer border-[#eef1f5] hover:bg-[#fff8f5]"
                >
                  <TableCell className="px-5 text-lg font-semibold text-[#ff8f6a]">
                    {chat.customer_id || "-"}
                  </TableCell>
                  <TableCell className="px-5 text-lg font-medium text-[#1f2937]">{agentName || "AVA"}</TableCell>
                  <TableCell className="px-5">
                    <span className="rounded-full border border-[#b8f0c9] bg-[#d9fbe4] px-3 py-1 text-base font-semibold text-[#15803d]">
                      Active
                    </span>
                  </TableCell>
                  <TableCell className="px-5">
                    <span className="inline-flex h-9 min-w-9 items-center justify-center rounded-full bg-[#f3f4f6] px-3 text-lg font-medium text-[#1f2937]">
                      {chat.message_count}
                    </span>
                  </TableCell>
                  <TableCell className="px-5 text-lg font-medium text-[#66748a]">
                    {formatCreatedDate(chat.created_at)}
                  </TableCell>
                  <TableCell className="px-5 text-right">
                    <MoreHorizontal className="ml-auto h-5 w-5 text-[#071225]" />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {renderPageButtons()}
    </div>
  );
};

export default V2ConversationsPage;
