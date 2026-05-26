import { useCallback, useEffect, useRef, useState } from "react";
import { Check, ChevronLeft, ChevronRight, Search, SlidersHorizontal, Trash2 } from "lucide-react";

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
import { useLanguage } from "@/shared/contexts/LanguageContext";
import {
  fetchAssistants,
  fetchChats,
  fetchChatsPagination,
  searchChats,
  clearAllChats,
  type Assistant,
  type Chat,
} from "@/services/api/api";
import ChatView from "./ChatView";

const CHATS_PER_PAGE = 10;

const gradientStyle = {
  background: "linear-gradient(90deg, rgba(113, 181, 234, 1) 0%, rgba(81, 194, 251, 1) 80%)",
};

const formatDate = (iso: string, locale: string) => {
  if (!iso) {
    return "-";
  }

  try {
    return new Date(iso).toLocaleString(locale, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
};

const ConversationsPage = () => {
  const { toast } = useToast();
  const { t, dateLocale } = useLanguage();
  const [assistants, setAssistants] = useState<Assistant[]>([]);
  const [selectedAssistantIds, setSelectedAssistantIds] = useState<Set<string>>(new Set());
  const [assistantsLoaded, setAssistantsLoaded] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  const getAssistantIdsString = useCallback(
    () => Array.from(selectedAssistantIds).join(","),
    [selectedAssistantIds],
  );

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setFilterOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  useEffect(() => {
    const loadAssistants = async () => {
      try {
        const data = await fetchAssistants();

        setAssistants(data);
        setSelectedAssistantIds(new Set(data.map((assistant) => assistant.id)));
      } catch (error) {
        toast({
          title: t.dashboard.assistantList.errors.title,
          description: error instanceof Error ? error.message : t.dashboard.conversationsPage.loadAssistantsError,
          variant: "destructive",
        });
      } finally {
        setAssistantsLoaded(true);
      }
    };

    void loadAssistants();
  }, [toast]);

  const loadChats = useCallback(
    async (page: number, idsOverride?: string) => {
      setIsLoading(true);
      const assistantIds = idsOverride ?? getAssistantIdsString();

      try {
        const [nextChats, nextTotalPages] = await Promise.all([
          fetchChats(page, assistantIds),
          fetchChatsPagination(assistantIds),
        ]);

        setChats(nextChats);
        setTotalPages(Math.max(1, nextTotalPages));
        setCurrentPage(page);
      } catch (error) {
        toast({
          title: t.dashboard.assistantList.errors.title,
          description: error instanceof Error ? error.message : t.dashboard.conversationsPage.loadConversationsError,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [getAssistantIdsString, toast],
  );

  useEffect(() => {
    if (!assistantsLoaded) {
      return;
    }

    setIsSearchMode(false);
    setSearchQuery("");
    void loadChats(1);
  }, [assistantsLoaded, loadChats, selectedAssistantIds]);

  const toggleAssistant = (id: string) => {
    setSelectedAssistantIds((currentIds) => {
      const nextIds = new Set(currentIds);

      if (nextIds.has(id)) {
        nextIds.delete(id);
      } else {
        nextIds.add(id);
      }

      return nextIds;
    });
  };

  const selectAll = () => {
    setSelectedAssistantIds(new Set(assistants.map((assistant) => assistant.id)));
  };

  const deselectAll = () => {
    setSelectedAssistantIds(new Set());
  };

  const handleSearch = async () => {
    const query = searchQuery.trim();

    if (!query) {
      setIsSearchMode(false);
      await loadChats(1);
      return;
    }

    setIsLoading(true);
    setIsSearchMode(true);

    try {
      const data = await searchChats(query, getAssistantIdsString(), 1);

      setChats(data.answer);
      setTotalPages(Math.max(1, Math.ceil((data.total_count || data.answer.length) / CHATS_PER_PAGE)));
      setCurrentPage(1);
    } catch (error) {
      toast({
        title: t.dashboard.conversationsPage.searchErrorTitle,
        description: error instanceof Error ? error.message : t.dashboard.conversationsPage.searchError,
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
        const data = await searchChats(searchQuery.trim(), getAssistantIdsString(), page);

        setChats(data.answer);
        setCurrentPage(page);
      } catch (error) {
        toast({
          title: t.dashboard.assistantList.errors.title,
          description: error instanceof Error ? error.message : t.dashboard.conversationsPage.loadPageError,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }

      return;
    }

    await loadChats(page);
  };

  const handleClearAll = async () => {
    if (!window.confirm("Are you sure you want to delete all conversations? This action cannot be undone.")) {
      return;
    }

    setIsClearing(true);
    try {
      await clearAllChats();
      toast({
        title: "Success",
        description: "All conversations have been deleted.",
      });
      void loadChats(1);
    } catch (error) {
      toast({
        title: t.dashboard.assistantList.errors.title,
        description: error instanceof Error ? error.message : "Failed to delete conversations",
        variant: "destructive",
      });
    } finally {
      setIsClearing(false);
    }
  };

  const renderPageButtons = () => {
    const pages: Array<number | "ellipsis"> = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
      for (let page = 1; page <= totalPages; page += 1) {
        pages.push(page);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push("ellipsis");
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let page = start; page <= end; page += 1) {
        pages.push(page);
      }

      if (currentPage < totalPages - 2) {
        pages.push("ellipsis");
      }

      pages.push(totalPages);
    }

    return pages.map((page, index) =>
      page === "ellipsis" ? (
        <span key={`ellipsis-${index}`} className="px-2 py-1 text-sm text-slate-400">
          ...
        </span>
      ) : (
        <Button
          key={page}
          type="button"
          variant={page === currentPage ? "default" : "outline"}
          size="sm"
          onClick={() => void goToPage(page)}
          className={
            page === currentPage
              ? "min-w-9 text-white hover:opacity-90"
              : "min-w-9 border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
          }
          style={page === currentPage ? gradientStyle : undefined}
        >
          {page}
        </Button>
      ),
    );
  };

  if (selectedChat) {
    return (
      <ChatView
        chat={selectedChat}
        onBack={() => {
          setSelectedChat(null);
          void loadChats(currentPage);
        }}
      />
    );
  }

  return (
    <div>
      <div className="mb-6 md:mb-8">
        <h1 className="mb-1 text-2xl font-bold text-slate-900 md:text-3xl">{t.dashboard.conversations}</h1>
        <p className="text-sm text-slate-600 md:text-base">{t.dashboard.conversationsPage.subtitle}</p>
      </div>

      <div className="mb-4 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder={t.dashboard.conversationsPage.searchPlaceholder}
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                void handleSearch();
              }
            }}
            className="border-slate-200 bg-white pl-9"
          />
        </div>
        <Button type="button" variant="outline" onClick={() => void handleSearch()} className="border-slate-200">
          <Search className="mr-2 h-4 w-4" />
          {t.common.search}
        </Button>
        <Button type="button" variant="destructive" onClick={handleClearAll} disabled={isClearing}>
          <Trash2 className="mr-2 h-4 w-4" />
          Delete All
        </Button>
      </div>

      {assistants.length > 0 && (
        <div ref={filterRef} className="relative mb-6">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setFilterOpen((isOpen) => !isOpen)}
            className="border-slate-200 bg-white text-slate-700"
          >
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            {t.dashboard.conversationsPage.filterByAssistants}
            <span className="ml-2 text-xs text-slate-400">
              ({selectedAssistantIds.size}/{assistants.length})
            </span>
          </Button>

          {filterOpen && (
            <div className="absolute left-0 top-full z-20 mt-1 w-72 rounded-lg border border-slate-200 bg-white shadow-lg">
              <div className="flex items-center justify-between border-b border-slate-100 px-3 py-2">
                <span className="text-xs font-semibold uppercase text-slate-500">{t.dashboard.assistants}</span>
                <div className="flex gap-2">
                  <button type="button" onClick={selectAll} className="text-xs text-[#1896d4] hover:underline">
                    {t.dashboard.conversationsPage.all}
                  </button>
                  <button type="button" onClick={deselectAll} className="text-xs text-slate-400 hover:underline">
                    {t.dashboard.conversationsPage.clear}
                  </button>
                </div>
              </div>
              <div className="max-h-52 overflow-y-auto py-1">
                {assistants.map((assistant) => {
                  const isSelected = selectedAssistantIds.has(assistant.id);

                  return (
                    <button
                      key={assistant.id}
                      type="button"
                      onClick={() => toggleAssistant(assistant.id)}
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-slate-50"
                    >
                      <span
                        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${
                          isSelected ? "border-[#51C2FB] bg-[#51C2FB]" : "border-slate-300 bg-white"
                        }`}
                      >
                        {isSelected && <Check className="h-3 w-3 text-white" />}
                      </span>
                      <span className="truncate text-slate-700">{assistant.name || assistant.id}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="font-semibold text-slate-700">Assistant ID</TableHead>
              <TableHead className="font-semibold text-slate-700">Customer ID</TableHead>
              <TableHead className="font-semibold text-slate-700">{t.common.platform}</TableHead>
              <TableHead className="font-semibold text-slate-700">{t.common.created}</TableHead>
              <TableHead className="font-semibold text-slate-700">{t.common.updated}</TableHead>
              <TableHead className="text-right font-semibold text-slate-700">{t.common.messages}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center">
                  <div className="flex items-center justify-center">
                    <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-[#51C2FB]" />
                  </div>
                </TableCell>
              </TableRow>
            ) : chats.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-slate-500">
                  {isSearchMode
                    ? t.dashboard.conversationsPage.emptySearch
                    : selectedAssistantIds.size === 0
                      ? t.dashboard.conversationsPage.selectOneAssistant
                      : t.dashboard.conversationsPage.empty}
                </TableCell>
              </TableRow>
            ) : (
              chats.map((chat) => (
                <TableRow key={chat.id} onClick={() => setSelectedChat(chat)} className="cursor-pointer hover:bg-slate-50">
                  <TableCell className="max-w-[150px] truncate font-mono text-xs text-slate-600">
                    {chat.assistant_id || "-"}
                  </TableCell>
                  <TableCell className="font-medium text-slate-900">{chat.customer_id || "-"}</TableCell>
                  <TableCell className="text-slate-600">{chat.platform || "-"}</TableCell>
                  <TableCell className="text-slate-600">{formatDate(chat.created_at, dateLocale)}</TableCell>
                  <TableCell className="text-slate-600">{formatDate(chat.updated_at, dateLocale)}</TableCell>
                  <TableCell className="text-right">
                    <span className="inline-flex min-w-7 items-center justify-center rounded-full bg-[#51C2FB]/10 px-2 py-0.5 text-xs font-semibold text-[#1896d4]">
                      {chat.message_count}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => void goToPage(currentPage - 1)}
            disabled={currentPage <= 1 || isLoading}
            className="border-slate-200 bg-white"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {renderPageButtons()}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => void goToPage(currentPage + 1)}
            disabled={currentPage >= totalPages || isLoading}
            className="border-slate-200 bg-white"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default ConversationsPage;
