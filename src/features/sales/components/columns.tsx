import { ColumnDef } from "@tanstack/react-table";
import { SaleResponse, SaleStatus } from "../Sale.type";
import { Badge } from "@/components/ui/badge";
import { DataTableRowActions } from "./data-table-row-actions";

export const columns: ColumnDef<SaleResponse>[] = [
    {
        accessorKey: "id",
        header: "ID",
        cell: ({ row }) => (
            <div className="font-medium">
                #{row.getValue("id")}
            </div>
        ),
    },
    {
        accessorKey: "userVendor",
        header: "Vendor",
        cell: ({ row }) => {
            const vendor = row.getValue("userVendor") as SaleResponse["userVendor"];
            return (
                <div className="flex flex-col">
                    <span className="font-medium">{vendor.personalInfo?.firstName}</span>
                    <span className="text-sm text-gray-500">{vendor.email}</span>
                </div>
            );
        },
    },
    {
        accessorKey: "paymentMethod",
        header: "Payment method",
        cell: ({ row }) => {
            const paymentMethod = row.getValue("paymentMethod") as SaleResponse["paymentMethod"];
            return (
                <div className="text-sm">
                    {paymentMethod.description}
                </div>
            );
        },
    },
    {
        accessorKey: "total",
        header: "Total",
        cell: ({ row }) => {
            const total = parseFloat(row.getValue("total"));
            const currency = row.original.currency;

            return (
                <div className="font-medium">
                    {new Intl.NumberFormat("es-MX", {
                        style: "currency",
                        currency: currency.toString() === "MXN" ? "MXN" : "USD",
                    }).format(total)}
                </div>
            );
        },
    },
    {
        accessorKey: "discount",
        header: "Discount",
        cell: ({ row }) => {
            const discount = parseFloat(row.getValue("discount"));
            const currency = row.original.currency;

            return (
                <div className="text-sm">
                    {discount > 0 ? (
                        <span className="text-green-600">
                            -{new Intl.NumberFormat("es-MX", {
                                style: "currency",
                                currency: currency.toString() === "MXN" ? "MXN" : "USD",
                            }).format(discount)}
                        </span>
                    ) : (
                        <span className="text-gray-400">No discount</span>
                    )}
                </div>
            );
        },
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status") as SaleStatus;

            return (
                <Badge className="capitalize">
                    {status.toString().split("_").join("").toLowerCase()}
                </Badge>
            );
        },
    },
    {
        accessorKey: "createdAt",
        header: "Creation date",
        cell: ({ row }) => {
            const date = new Date(row.getValue("createdAt"));
            return (
                <div className="text-sm">
                    {date.toLocaleDateString("es-MX", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                    })}
                </div>
            );
        },
    },
    {
        accessorKey: "updatedAt",
        header: "Last update",
        cell: ({ row }) => {
            const date = new Date(row.getValue("updatedAt"));
            return (
                <div className="text-sm text-gray-500">
                    {date.toLocaleDateString("es-MX", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                    })}
                </div>
            );
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            return (
                <DataTableRowActions row={row} />
            );
        },
    },
];