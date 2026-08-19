import { useEffect, useMemo, useState } from "react";
import { Loader2, CheckCircle2, Calendar, Clock, AlertCircle, ArrowUpDown } from "lucide-react";
import { fetchPendingAppointments, syncPendingAppointment, type PendingAppointment } from "@/services/api/api";
import { Button } from "@/shared/ui/button";

type SortKey = "created_at" | "start_time";

const WINNIPEG_TZ = "America/Winnipeg";

const parseDate = (dateStr: string) => new Date(dateStr);

const formatDate = (dateStr: string) =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: WINNIPEG_TZ,
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(parseDate(dateStr));

const formatTime = (dateStr: string) =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: WINNIPEG_TZ,
    hour: "2-digit",
    minute: "2-digit",
  }).format(parseDate(dateStr));

const formatDateTime = (dateStr: string) =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: WINNIPEG_TZ,
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(parseDate(dateStr));

const V2PendingAppointments = () => {
  const [appointments, setAppointments] = useState<PendingAppointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>("created_at");

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    setIsLoading(true);
    try {
      const data = await fetchPendingAppointments();
      setAppointments(data);
    } catch (error) {
      console.error("Failed to load pending appointments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSync = async (id: string) => {
    setSyncingId(id);
    try {
      await syncPendingAppointment(id);
      setAppointments((prev) => prev.filter((app) => app.id !== id));
    } catch (error) {
      console.error("Failed to sync appointment:", error);
    } finally {
      setSyncingId(null);
    }
  };

  const sortedAppointments = useMemo(() => {
    return [...appointments].sort((a, b) => {
      const dateA = parseDate(a[sortKey]).getTime();
      const dateB = parseDate(b[sortKey]).getTime();
      return dateB - dateA; // newest first
    });
  }, [appointments, sortKey]);

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#ff8f6a]" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-[2.25rem] font-bold leading-tight text-[#010817]">Pending Appointments</h2>
          <p className="mt-2 text-[1.15rem] font-medium text-[#6f7e95]">
            Appointments that failed to sync with CampusLogin
          </p>
        </div>

        {/* Sort controls */}
        <div className="flex shrink-0 items-center gap-2 self-start">
          <ArrowUpDown className="h-4 w-4 text-[#94a3b8]" />
          <span className="text-sm font-medium text-[#64748b]">Sort by:</span>
          <div className="inline-flex rounded-[7px] bg-[#f1f5f9] p-1">
            <button
              type="button"
              onClick={() => setSortKey("created_at")}
              className={`h-8 rounded-[5px] px-3.5 text-sm font-semibold transition-colors ${
                sortKey === "created_at"
                  ? "bg-white text-[#020817] shadow-sm"
                  : "text-[#66748a] hover:text-[#020817]"
              }`}
            >
              Created
            </button>
            <button
              type="button"
              onClick={() => setSortKey("start_time")}
              className={`h-8 rounded-[5px] px-3.5 text-sm font-semibold transition-colors ${
                sortKey === "start_time"
                  ? "bg-white text-[#020817] shadow-sm"
                  : "text-[#66748a] hover:text-[#020817]"
              }`}
            >
              Appointment Date
            </button>
          </div>
        </div>
      </div>

      {sortedAppointments.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-[8px] border border-[#dfe6ef] bg-white py-16 text-center shadow-sm">
          <CheckCircle2 className="mb-4 h-12 w-12 text-[#16a34a]" />
          <h3 className="text-xl font-bold text-[#010817]">All caught up!</h3>
          <p className="mt-2 text-[#64748b]">There are no pending appointments to sync.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {sortedAppointments.map((appointment) => (
            <div
              key={appointment.id}
              className="flex flex-col justify-between rounded-[8px] border border-[#dfe6ef] bg-white p-6 shadow-sm transition-shadow hover:shadow-md sm:flex-row sm:items-center"
            >
              <div className="flex-1">
                <div className="mb-2 flex items-center gap-3">
                  <h3 className="text-lg font-bold text-[#010817]">{appointment.title || "Untitled Appointment"}</h3>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 ring-1 ring-inset ring-amber-600/20">
                    <AlertCircle className="h-3.5 w-3.5" />
                    Pending Sync
                  </span>
                </div>

                <div className="mb-3 grid gap-2 text-sm text-[#64748b] sm:grid-cols-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 shrink-0 text-[#94a3b8]" />
                    <span>{formatDate(appointment.start_time)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 shrink-0 text-[#94a3b8]" />
                    <span>
                      {formatTime(appointment.start_time)}
                      {" - "}
                      {formatTime(appointment.end_time)}
                    </span>
                  </div>
                </div>

                <div className="text-sm text-[#475569]">
                  <p><span className="font-medium">Status:</span> {appointment.status}</p>
                  {appointment.description && (
                    <p className="mt-1"><span className="font-medium">Description:</span> {appointment.description}</p>
                  )}
                  <p className="mt-1"><span className="font-medium">Created:</span> {formatDateTime(appointment.created_at)}</p>
                </div>
              </div>

              <div className="mt-6 flex items-center sm:ml-6 sm:mt-0">
                <Button
                  onClick={() => handleSync(appointment.id)}
                  disabled={syncingId === appointment.id}
                  className="w-full bg-[#16a34a] font-semibold text-white shadow-none hover:bg-[#15803d] sm:w-auto"
                >
                  {syncingId === appointment.id ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                  )}
                  Mark as Synced
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default V2PendingAppointments;
