import { DataTable } from '@/components/data-table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import AppContext from '@/context/AppContext';
import type { DonationTableData } from '@/types/DonationTableData';
import type { Donor} from '@/types/User';
import useAuthAxios from '@/utils/authAxios';
import type { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown,  MoreHorizontal, NotebookText } from 'lucide-react';
import { useContext, useEffect, useMemo, useState } from 'react'

// const rankColors = ["text-yellow-400", "text-sky-400", "text-green-400"];

type dialogDetail = {
  isOpen: boolean;
  detail: {
    donor?: Donor | null;
    amount: number,
    message: string,
    createdAt: Date,
    updatedAt: Date,
  };
};

type summaryDialogDetail = {
  isOpen: boolean;
  detail: {
    donor?: Donor | null;
    amount: number,
    createdAt: Date,
    updatedAt: Date,
  };
};

type DonationSummary = {
  _id: string; 
  donor?: Donor | null;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
};

const DonationDetails = () => {
      // const [donationData, setDonationData] = useState<DonationTableData[]>([]);
      const [filteredDonations, setFilteredDonations] = useState<DonationTableData[]>([]);
      // const [monthlyDonations, setMonthlyDonations] = useState<
      //   {
      //     month: string;
      //     amount: number;
      //   }[]
      // >([]);
      const {donationAPI} = useContext(AppContext);
      const authAxios = useAuthAxios();
      // const [donationRefresh, setDonationRefresh] = useState<boolean>(false);
      const [dialogDetail, setDialogDetail] = useState<dialogDetail>({
        isOpen: false,
        detail: {
          donor: {
            _id: "u5",
            fullName: "Hoàng Thị E",
            avatar: "https://example.com/avatar/u5.jpg",
          },
          amount: 300000,
          message: "Tiếp tục sứ mệnh tuyệt vời!",
          createdAt: new Date("2025-07-04T16:20:00Z"),
          updatedAt: new Date("2025-07-04T16:20:00Z"),
        },
      });
      const [summaryDialogDetail, setSummaryDialogDetail] = useState<summaryDialogDetail>({
        isOpen: false,
        detail: {
          donor: {
            _id: "u5",
            fullName: "Hoàng Thị E",
            avatar: "https://example.com/avatar/u5.jpg",
          },
          amount: 300000,
          createdAt: new Date("2025-07-04T16:20:00Z"),
          updatedAt: new Date("2025-07-04T16:20:00Z"),
        },
      });


      useEffect(() => {
        authAxios.get(`${donationAPI}/get-all-donations`)
        .then(({data}) => {
          // setDonationData(data);
          setFilteredDonations(data)
        })
        .catch((err:any) => {
          console.log(err?.response.data.message)
        })

      }, [])

      const totalDonationAmount = useMemo(() => {
        return filteredDonations.reduce((acc, current) => acc += current.amount, 0);
      }, [filteredDonations])

      const donationSummary: DonationSummary[] = useMemo(() => {
        const grouped: Record<string, DonationSummary> = {};

        filteredDonations.forEach((donation) => {
          const donorId = donation.donor?._id || "anonymous";
          if (!grouped[donorId]) {
            grouped[donorId] = {
              _id: donorId,
              donor: donation.donor,
              amount: 0,
              createdAt: donation.createdAt,
              updatedAt: donation.updatedAt,
            };
          }
          grouped[donorId].amount += donation.amount;

          // Optional: cập nhật thời gian gần nhất
          if (donation.updatedAt > grouped[donorId].updatedAt) {
            grouped[donorId].updatedAt = donation.updatedAt;
          }
        });

        return Object.values(grouped);
      }, [filteredDonations]);



        // const top3Donors = useMemo(() => {
        //   return [...donationSummary]
        //     .sort((a, b) => b.amount - a.amount)
        //     .slice(0, 3);
        // }, [donationSummary]);

      const columns: ColumnDef<DonationTableData>[] = [
        {
          header: "STT",
          cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex;
            const pageSize = table.getState().pagination.pageSize;
            return (
              <p className="text-center">
                {pageIndex * pageSize + row.index + 1}
              </p>
            );
          },
        },
        {
          accessorKey: "donor",
          header: ({ column }) => {
            return (
              <Button
                variant="ghost"
                onClick={() =>
                  column.toggleSorting(column.getIsSorted() === "asc")
                }
                className="cursor-pointer"
              >
                Người quyên góp
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            );
          },
          cell: ({ row }) => (
            row.original.donor ?
            <p className='flex gap-2'>
              <Avatar className='ring ring-2 ring-primary'>
                <AvatarImage src={row.original.donor.avatar || "https://png.pngtree.com/png-vector/20190820/ourmid/pngtree-no-avatar-vector-isolated-on-white-background-png-image_1694546.jpg"} alt={row.original.donor.fullName} />
                <AvatarFallback>Avt</AvatarFallback>
              </Avatar>
              <span className='my-auto'>{row.original.donor.fullName}</span>
            </p> : <div className='flex flex-row gap-2'>
              <Avatar className='ring-2 ring-primary'>
                  <AvatarFallback>MTQ</AvatarFallback>
                </Avatar>
                <p className='my-auto'>Mạnh thường quân</p>
            </div>
          ),
        },
        {
          accessorKey: "amount",
          header: ({ column }) => {
            return (
              <Button
                variant="ghost"
                onClick={() =>
                  column.toggleSorting(column.getIsSorted() === "asc")
                }
                className="cursor-pointer"
              >
                Số tiền (VND)
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            );
          },
          cell: ({ row }) => {
            return <span className="px-2">{row.original.amount.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}</span>;
          },
        },
        {
          accessorKey: "message",
          header: ({ column }) => {
            return (
              <Button
                variant="ghost"
                onClick={() =>
                  column.toggleSorting(column.getIsSorted() === "asc")
                }
                className="cursor-pointer"
              >
                Lời nhắn
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            );
          },
          cell: ({ row }) => {
            return <p className='max-w-[10vw] overflow-hidden text-ellipsis'>{row.original.message}</p>;
          },
        },
        {
          accessorKey: "createdAt",
          header: ({ column }) => {
            return (
              <Button
                variant="ghost"
                onClick={() =>
                  column.toggleSorting(column.getIsSorted() === "asc")
                }
                className="cursor-pointer"
              >
                Ngày quyên góp
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            );
          },
          cell: ({ row }) => (
            <span className="px-2">
              {new Date(row.original.createdAt).toLocaleDateString("vi-VN")}
            </span>
          ),
        },
        {
          id: "actions",
          cell: ({ row }) => (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-40 rounded-md border bg-background shadow-lg p-1"
              >
                <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() => {
                      setDialogDetail({
                        isOpen: true,
                        detail: {
                          donor: row.original.donor,
                          amount: row.original.amount,
                          message: row.original.message,
                          createdAt: row.original.createdAt,
                          updatedAt: row.original.updatedAt,
                        },
                      });
                    }}
                    className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-accent hover:text-accent-foreground rounded"
                  >
                    <NotebookText className="w-4 h-4" /> Xem thông tin chi tiết
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          ),
        },
      ];

      const TopDonatorColumns: ColumnDef<DonationSummary>[] = [
        {
          header: "STT",
          cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex;
            const pageSize = table.getState().pagination.pageSize;
            return (
              <p className="text-center">
                {pageIndex * pageSize + row.index + 1}
              </p>
            );
          },
        },
        {
          accessorKey: "donor",
          header: ({ column }) => {
            return (
              <Button
                variant="ghost"
                onClick={() =>
                  column.toggleSorting(column.getIsSorted() === "asc")
                }
                className="cursor-pointer"
              >
                Người quyên góp
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            );
          },
          cell: ({ row }) =>
            row.original.donor ? (
              <p className="flex gap-2">
                <Avatar className='ring ring-2 ring-primary'>
                  <AvatarImage
                    src={
                      row.original.donor.avatar ||
                      "https://png.pngtree.com/png-vector/20190820/ourmid/pngtree-no-avatar-vector-isolated-on-white-background-png-image_1694546.jpg"
                    }
                    alt={row.original.donor.fullName}
                  />
                  <AvatarFallback>{row.original.donor?.fullName && row.original.donor?.fullName[0]}</AvatarFallback>
                </Avatar>
                <span className="my-auto">{row.original.donor.fullName}</span>
              </p>
            ) : (
              <div className='flex flex-row gap-2'>
              <Avatar className='ring ring-2 ring-primary'>
                  <AvatarFallback>MTQ</AvatarFallback>
                </Avatar>
                <p className='my-auto'>Mạnh thường quân</p>
            </div>
            ),
        },
        {
          accessorKey: "amount",
          header: ({ column }) => {
            return (
              <Button
                variant="ghost"
                onClick={() =>
                  column.toggleSorting(column.getIsSorted() === "asc")
                }
                className="cursor-pointer"
              >
                Tổng số tiền (VND)
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            );
          },
          cell: ({ row }) => {
            return (
              <span className="px-2">
                {row.original.amount.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </span>
            );
          },
        },
        {
          id: "actions",
          cell: ({ row }) => (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-40 rounded-md border bg-background shadow-lg p-1"
              >
                <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() => {
                      setSummaryDialogDetail({
                        isOpen: true,
                        detail: {
                          donor: row.original.donor,
                          amount: row.original.amount,
                          createdAt: row.original.createdAt,
                          updatedAt: row.original.updatedAt,
                        },
                      });
                    }}
                    className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-accent hover:text-accent-foreground rounded"
                  >
                    <NotebookText className="w-4 h-4" /> Xem thông tin chi tiết
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          ),
        },
      ];

  return (
    <div className="flex flex-1 flex-col px-20">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="col-span-12 px-5 mt-3 flex flex-col gap-2">
          <Badge className='w-full text-2xl' variant="secondary">
            Tổng quyên góp
            <span className="ms-2 text-green-500">
              {totalDonationAmount.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })}
            </span>
          </Badge>
        </div>

        <div className="col-span-12 px-5 mt-3">
          <DataTable
            columns={TopDonatorColumns}
            data={
              donationSummary.sort((a, b) => {
                const nameA = a.amount;
                const nameB = b.amount;
                if (nameA < nameB) {
                  return 1;
                }
                if (nameA > nameB) {
                  return -1;
                }

                // names must be equal
                return 0;
              }) ?? []
            }
          />
        </div>
      </div>
      <div className="col-span-12 px-5 flex flex-col gap-5">
        <h4 className="scroll-m-20 min-w-40 text-xl font-semibold tracking-tight text-center">
          Quyên góp theo từng giao dịch
        </h4>
        <DataTable columns={columns} data={filteredDonations ?? []} />
      </div>

      <Dialog
        open={dialogDetail.isOpen}
        onOpenChange={(open) => {
          if (!open) {
            setDialogDetail({
              ...dialogDetail,
              isOpen: false,
            });
            close();
          }
        }}
      >
        <DialogContent className="max-w-[70vw]">
          <DialogHeader>
            <DialogTitle>Chi tiết ủng hộ</DialogTitle>
            <DialogDescription>
              Thông tin chi tiết về khoản đóng góp
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-3">
            {/* Cột trái: Thông tin người ủng hộ */}
            {dialogDetail.detail?.donor ? (
              <div className="space-y-4">
                <div>
                  <p className="font-medium mb-1">Ảnh đại diện</p>
                  <Avatar className="w-16 h-16 ring ring-2 ring-primary">
                    <AvatarImage src={dialogDetail.detail.donor.avatar} />
                    <AvatarFallback>{dialogDetail.detail.donor?.fullName && dialogDetail.detail.donor?.fullName[0]}</AvatarFallback>
                  </Avatar>
                </div>

                <div>
                  <p className="font-medium mb-1">Họ và tên</p>
                  <p>
                    {dialogDetail.detail.donor.fullName || "Không có dữ liệu"}
                  </p>
                </div>
              </div>
            ) : null}

            {/* Cột phải: Thông tin ủng hộ */}
            <div className="space-y-4">
              <div>
                <p className="font-medium mb-1">Số tiền ủng hộ</p>
                <p className="text-green-600 font-semibold">
                  {dialogDetail.detail?.amount?.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }) || "0 VND"}
                </p>
              </div>

              <div>
                <p className="font-medium mb-1">Lời nhắn</p>
                <p className="italic max-h-[20vh] overflow-y-scroll">
                  {dialogDetail.detail?.message || "Không có lời nhắn"}
                </p>
              </div>

              <div>
                <p className="font-medium mb-1">Ngày quyên góp</p>
                <p>
                  {dialogDetail.detail?.createdAt
                    ? new Date(dialogDetail.detail.createdAt).toLocaleString(
                        "vi-VN"
                      )
                    : "Không có dữ liệu"}
                </p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button
                variant="outline"
                className="cursor-pointer"
                onClick={() =>
                  setDialogDetail({ ...dialogDetail, isOpen: false })
                }
              >
                Đóng
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={summaryDialogDetail.isOpen}
        onOpenChange={(open) => {
          if (!open) {
            setSummaryDialogDetail({
              ...summaryDialogDetail,
              isOpen: false,
            });
            close();
          }
        }}
      >
        <DialogContent className="max-w-[70vw]">
          <DialogHeader>
            <DialogTitle>Chi tiết ủng hộ</DialogTitle>
            <DialogDescription>
              Thông tin chi tiết về khoản đóng góp
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-6 py-3 px-2">
            {/* Cột trái: Thông tin người ủng hộ */}
            {summaryDialogDetail.detail?.donor ? (
              <>
                <div>
                  <p className="font-medium mb-1">Ảnh đại diện</p>
                  <Avatar className="w-16 h-16 ring ring-2 ring-primary">
                    <AvatarImage
                      src={summaryDialogDetail.detail.donor.avatar}
                    />
                    <AvatarFallback>{summaryDialogDetail.detail.donor?.fullName && summaryDialogDetail.detail.donor?.fullName[0]}</AvatarFallback>
                  </Avatar>
                </div>

                <div>
                  <p className="font-medium mb-1">Họ và tên</p>
                  <p>
                    {summaryDialogDetail.detail.donor.fullName ||
                      "Không có dữ liệu"}
                  </p>
                </div>
              </>
            ) : (
              <div>
                <p className="font-medium mb-1">Người ủng hộ</p>
                <p>Mạnh Thường quân (ẩn danh)</p>
              </div>
            )}

            <div>
              <p className="font-medium mb-1">Tổng số tiền ủng hộ</p>
              <p className="text-green-600 font-semibold">
                {summaryDialogDetail.detail?.amount?.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }) || "0 VND"}
              </p>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button
                variant="outline"
                className="cursor-pointer"
                onClick={() =>
                  setSummaryDialogDetail({
                    ...summaryDialogDetail,
                    isOpen: false,
                  })
                }
              >
                Đóng
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default DonationDetails