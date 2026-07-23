import React, { useEffect, useState } from "react";
import { Ban, Loader2, Plus } from "lucide-react";
import { getBlockedCustomers, blockCustomer, BlockedCustomer } from "@/services/api/api";
import { Button } from "@/shared/ui/button";

const V2BlockedCustomers = () => {
  const [customers, setCustomers] = useState<BlockedCustomer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newNumber, setNewNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      const data = await getBlockedCustomers();
      setCustomers(data);
    } catch (error) {
      console.error("Failed to load blocked customers", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleBlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNumber.trim()) return;

    setIsSubmitting(true);
    try {
      await blockCustomer(newNumber.trim());
      setNewNumber("");
      await fetchCustomers();
    } catch (error) {
      console.error("Failed to block customer", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-[2.25rem] font-bold leading-tight text-[#010817]">Blocked Customers</h2>
        <p className="text-[#6f7e95]">Manage phone numbers that are blocked from interacting with the assistant.</p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <form onSubmit={handleBlock} className="flex gap-4">
          <input
            type="text"
            placeholder="Enter phone number (e.g. +7701...)"
            value={newNumber}
            onChange={(e) => setNewNumber(e.target.value)}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-[#ff8f6a] focus:ring-1 focus:ring-[#ff8f6a]"
            disabled={isSubmitting}
          />
          <Button
            type="submit"
            disabled={isSubmitting || !newNumber.trim()}
            className="bg-[#ff8f6a] hover:bg-[#ff7d53]"
          >
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
            Block Number
          </Button>
        </form>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-[#010817]">Blocked Numbers List</h3>
        </div>
        <div className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center p-12">
              <Loader2 className="h-8 w-8 animate-spin text-[#ff8f6a]" />
            </div>
          ) : customers.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <Ban className="mb-4 h-12 w-12 text-gray-300" />
              <p className="text-lg font-medium text-gray-900">No blocked customers</p>
              <p className="mt-1 text-gray-500">You haven't blocked any numbers yet.</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {customers.map((c, i) => (
                <li key={i} className="flex items-center justify-between p-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-red-500">
                      <Ban className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{c.user_id}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default V2BlockedCustomers;
