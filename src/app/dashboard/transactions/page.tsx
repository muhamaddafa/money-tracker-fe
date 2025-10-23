"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, ListFilter, Plus, Search } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import useViewModel from "./viewModel";
import { useEffect, useMemo, useState } from "react";
import { DataTable } from "../components/DataTable";
import { formatRupiah } from "@/lib/formatRupiah";
import { Card } from "@/components/ui/card";

// --- Custom Hook for Debouncing ---
// (You can move this to a separate file, e.g., /hooks/useDebounce.ts)
/**
 * A custom hook to debounce a value.
 * @param value The value to debounce
 * @param delay The delay in milliseconds
 * @returns The debounced value
 */
const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set debouncedValue to value (passed in) after the specified delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Return a cleanup function that will be called ...
    // ... if value or delay changes (or if component unmounts)
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Only re-call effect if value or delay changes

  return debouncedValue;
};

// --- Reusable SummaryCard Component ---
type SummaryCardProps = {
  title: string;
  value: number;
  valueClassName?: string;
  badge?: React.ReactNode;
};

const SummaryCard = ({
  title,
  value,
  valueClassName = "",
  badge,
}: SummaryCardProps) => (
  <Card className="mt-6 p-6 flex-auto min-w-[200px]">
    <div className="flex flex-col">
      <h3 className="text-sm font-medium">{title}</h3>
      <div className="mt-2 flex items-center gap-3">
        <div className={`font-semibold text-2xl ${valueClassName}`}>
          {formatRupiah(value)}
        </div>
        {badge}
      </div>
    </div>
  </Card>
);

/**
 * Helper to get the class names for the percentage badge.
 */
const getPercentageBadgeClass = (variant: "positive" | "negative" | "default") => {
  switch (variant) {
    case "positive":
      return "bg-[hsl(140.6,84.2%,92.5%)] border-green-400 text-green-700";
    case "negative":
      return "bg-[hsl(355.6,100%,94.7%)] border-red-400 text-red-700";
    default:
      return "border-gray-300 bg-gray-50 text-gray-600";
  }
};

// --- Main Page Component ---
const TransactionPage = () => {
  const { control, watch } = useForm({
    defaultValues: {
      search: "",
    },
  });

  // 1. Watch the search input from react-hook-form
  const search = watch("search", "");

  // 2. Debounce the search value to prevent excessive re-renders/API calls
  const debouncedSearch = useDebounce(search, 300); // 300ms delay

  // 3. Pass the debounced search term to the view model
  // (Assuming useViewModel accepts an object with a search key)
  const viewModel = useViewModel();

  // 4. Memoize expensive calculations
  // This object is only recalculated when viewModel.data changes
  const summary = useMemo(() => {
    const incomeTrx = viewModel.data.filter(
      (trx: { trxType: string }) => trx.trxType === "income"
    );
    const expenseTrx = viewModel.data.filter(
      (trx: { trxType: string }) => trx.trxType === "expense"
    );

    const totalIncome = incomeTrx.reduce(
      (sum: number, trx: { jumlah: number }) => sum + trx.jumlah,
      0
    );
    const totalExpense = expenseTrx.reduce(
      (sum: number, trx: { jumlah: number }) => sum + trx.jumlah,
      0
    );
    const netBalance = totalIncome - totalExpense;

    // --- Calculate Total Flow and Percentages ---
    const totalFlow = totalIncome + totalExpense;
    let incomePercent: number | null = null;
    let expensePercent: number | null = null;

    if (totalFlow > 0) {
      incomePercent = (totalIncome / totalFlow) * 100;
      expensePercent = (totalExpense / totalFlow) * 100;
    }
    // --- END ---

    let percentageText: string | null = null;
    let percentageVariant: "positive" | "negative" | "default" = "default";

    if (viewModel.data.length > 0 && (totalIncome > 0 || totalExpense > 0)) {
      // Preserving your original percentage logic
      const percent =
        totalExpense === 0
          ? 100
          : ((totalIncome - totalExpense) / totalExpense) * 100;

      percentageText = `${percent > 0 ? "+" : ""}${percent.toFixed(2)}%`;
      if (percent > 0) percentageVariant = "positive";
      else if (percent < 0) percentageVariant = "negative";
    }

    return {
      totalIncome,
      totalExpense,
      netBalance,
      percentageText,
      percentageVariant,
      incomePercent,
      expensePercent,
    };
  }, [viewModel.data]);

  // 5. Create the badge elements
  const netBalanceBadge = (
    <span
      className={`w-max py-1 px-3 rounded border text-xs font-medium ${getPercentageBadgeClass(
        summary.percentageVariant
      )}`}
    >
      {summary.percentageText ?? "-"}
    </span>
  );

  const incomeBadge =
    summary.incomePercent !== null ? (
      <span
        className={`w-max py-1 px-3 rounded border text-xs font-medium ${getPercentageBadgeClass(
          "positive"
        )}`}
      >
        {`${summary.incomePercent.toFixed(2)}%`}
      </span>
    ) : null;

  const expenseBadge =
    summary.expensePercent !== null ? (
      <span
        className={`w-max py-1 px-3 rounded border text-xs font-medium ${getPercentageBadgeClass(
          "negative"
        )}`}
      >
        {`${summary.expensePercent.toFixed(2)}%`}
      </span>
    ) : null;

  return (
    // Root container: Full height flex column
    <div className="h-screen flex flex-col p-4">
      <div>
        <h2 className="text-3xl font-semibold tracking-tight first:mt-0">
          Transactions
        </h2>

        {/* Summary */}
        <div className="flex flex-col md:flex-row gap-4">
          <SummaryCard
            title="Total Income"
            value={summary.totalIncome}
            valueClassName="text-green-800"
            badge={incomeBadge}
          />
          <SummaryCard
            title="Total Expense"
            value={summary.totalExpense}
            valueClassName="text-red-800"
            badge={expenseBadge}
          />
          <SummaryCard
            title="Net Balance"
            value={summary.netBalance}
            badge={netBalanceBadge}
          />
        </div>
        {/* End Summary */}

        <div className="mt-6 flex flex-col md:flex-row gap-2">
          <form className="relative flex-1">
            <Controller
              control={control}
              name="search"
              render={({ field }) => (
                <Input
                  {...field}
                  className="py-6 pl-10"
                  placeholder="Search transactions..."
                />
              )}
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Search size={20} />
            </span>
          </form>
          <Button className="py-6" variant={"outline"}>
            <ListFilter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button className="py-6" variant={"outline"}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button className="py-6">
            <Plus className="mr-2 h-4 w-4" />
            New Transaction
          </Button>
        </div>
        <h3 className="mt-6 mb-6 text-lg font-medium">
          Total Balance: {formatRupiah(viewModel.balance)}
        </h3>
      </div>

      <div className="flex-1 min-h-0">
        <DataTable
          columns={viewModel.columns}
          data={viewModel.data}
          isLoading={viewModel.transactionsLoading}
          setPageSize={viewModel.setPageSize}
          setPageNumber={viewModel.setPageNumber}
        />
      </div>
      
    </div>
  );
};

export default TransactionPage;