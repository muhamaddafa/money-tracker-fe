/* eslint-disable @typescript-eslint/no-explicit-any */
import { useTransactions } from "@/services/transactions/transactions";
import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table"
import { formatRupiah } from "@/lib/formatRupiah";
import { useBalance } from "@/services/balance/balance";
import { Checkbox } from "@/components/ui/checkbox";

const useViewModel = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const { data: transactions, isLoading } = useTransactions({ pageSize, pageNumber });
  const { data: balance } = useBalance();

  console.log("Balance data:", balance);

  const columns: ColumnDef<any>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      size: 40,
      enableSorting: false,
      enableColumnFilter: false,
    },
    {
      accessorKey: "trxDate",
      header: "Tanggal Transaksi",
      size: 180,
      enableSorting: true,
    },
    { 
      accessorKey: "description", 
      header: "Deskripsi",
      size: 250
    },
    { 
      accessorKey: "jumlah", 
      header: "Jumlah",
      size: 150,
      cell: ({ row }) => {
        return (
          <div className="font-semibold">
            {formatRupiah(row.original.jumlah)}
          </div>
        )
      },
    },
    { 
      accessorKey: "kategori", 
      header: "Kategori",
      size: 150
    },
    { 
      accessorKey: "kantong", 
      header: "Kantong",
      size: 150
    },
    { 
      accessorKey: "trxType", 
      header: "Tipe Transaksi",
      size: 120,
      cell: ({ row }) => {
        const type = row.original.trxType;
        return (
            <div
              className={`w-max py-1 px-3 rounded border ${
              type === "income"
                ? "bg-[hsl(140.6,84.2%,92.5%)] border-green-400"
                : type === "expense"
                ? "bg-[hsl(355.6,100%,94.7%)] border-red-400"
                : "border-gray-300"
              }`}
            >
              {type === "income" ? (
              <span className="text-green-400 font-medium">Pemasukan</span>
              ) : type === "expense" ? (
              <span className="text-red-600 font-medium">Pengeluaran</span>
              ) : (
              <span>{type}</span>
              )}
            </div>
        );
      },
    },
  ];

  return {
    data: transactions?.data || [],
    balance: balance?.totalBalance || 0,
    isLoading,
    columns,
    pageNumber,
    setPageNumber,
    pageSize,
    setPageSize,
    transactionsLoading: isLoading,
  };
}

export default useViewModel;