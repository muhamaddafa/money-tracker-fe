export interface TransactionList {
  trxDate: string;
  description: string;
  amount: number;
  category: string;
  kantong: string;
  type: "income" | "expense";
}