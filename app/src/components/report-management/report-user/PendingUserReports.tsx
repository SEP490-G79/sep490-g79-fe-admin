import { DataTable } from '@/components/data-table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import AppContext from '@/context/AppContext';
import type { UserReportDetailDialog } from '@/types/DetailDialog';
import type ReportTableData from '@/types/ReportTableData';
import useAuthAxios from '@/utils/authAxios';
import type { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown,  MoreHorizontal, NotebookText } from 'lucide-react';
import  { useContext, useEffect, useState } from 'react'
import Lightbox from "yet-another-react-lightbox";
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import UserReportDetailDialogUI from './UserReportDetailDialog';
import { toast } from 'sonner';


const PendingUserReports = () => {
      // const [userReports, setUserReports] = useState<ReportTableData[]>([]);
      const [filteredUserReports, setFilteredUserReports] = useState<ReportTableData[]>([]);
      const {reportAPI} = useContext(AppContext);
      const authAxios = useAuthAxios();
      const [loading, setLoading] = useState<boolean>(false);
      const [refresh, setRefresh] = useState<boolean>(false);
      const [isPreview, setIsPreview] = useState<boolean>(false);
      const [currentIndex, setCurrentIndex] = useState<number>(0);
      const [dialogDetail, setDialogDetail] = useState<UserReportDetailDialog>({
        isOpen: false,
        detail: {
          _id: "rpt001",
          reportType: "user",
          user: {
            _id: "user001",
            fullName: "Nguyễn Văn A",
            email: "vana@example.com",
            avatar: "https://example.com/avatar1.jpg",
            phoneNumber: "0901234567",
            bio: "Tôi yêu động vật",
            dob: "2000-05-20T00:00:00.000Z",
            address: "Hà Nội",
            location: { lat: 21.0278, lng: 105.8342 },
            createdAt: new Date("2024-12-01T10:00:00.000Z"),
            updatedAt: new Date("2025-01-01T10:00:00.000Z"),
            background: "https://example.com/bg1.jpg",
          },
          reportedBy: {
            _id: "user002",
            fullName: "Trần Thị B",
            email: "tranb@example.com",
            avatar: "https://example.com/avatar2.jpg",
          },
          reviewedBy: {
            _id: "admin001",
            fullName: "Admin Kiểm Duyệt",
            email: "admin@example.com",
            avatar: "https://example.com/admin.jpg",
          },
          reason: "Tài khoản có hành vi spam.",
          photos: [],
          status: "approved",
          createdAt: new Date("2025-07-01T08:00:00.000Z"),
          updatedAt: new Date("2025-07-01T09:00:00.000Z"),
        },
      });

      useEffect(() => {
        authAxios.get(`${reportAPI}/get-pending-user-reports`)
        .then(({data}) => {
          // console.log(data)
          // setUserReports(data);
          setFilteredUserReports(data);
        }) 
        .catch((err) => console.log(err?.response.data.message))
      }, [refresh])

      const columns: ColumnDef<ReportTableData>[] = [
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
          accessorKey: "user",
          header: ({ column }) => {
            return (
              <Button
                variant="ghost"
                onClick={() =>
                  column.toggleSorting(column.getIsSorted() === "asc")
                }
                className="cursor-pointer"
              >
                Tài khoản
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            );
          },
          cell: ({ row }) => {
            return <p className='flex gap-2'>
              {row.original.user && <>
                <Avatar className='ring ring-2 ring-primary'>
                  <AvatarImage src={row.original.user.avatar} alt={row.original.user.fullName} />
                  <AvatarFallback>{row.original.user?.fullName && row.original.user?.fullName[0]}</AvatarFallback>
                </Avatar>
                <span className='my-auto'>{row.original.user.fullName}</span>
              </>}
            </p>;
          },
        },
        {
          accessorKey: "reportedBy",
          header: ({ column }) => {
            return (
              <Button
                variant="ghost"
                onClick={() =>
                  column.toggleSorting(column.getIsSorted() === "asc")
                }
                className="cursor-pointer"
              >
                Báo cáo bởi
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            );
          },
          cell: ({ row }) => {
            return <p className='flex gap-2'>
              <Avatar className='ring ring-2 ring-primary'>
                <AvatarImage src={row.original.reportedBy.avatar} alt={row.original.reportedBy.fullName} />
                <AvatarFallback>{row.original.reportedBy?.fullName && row.original.reportedBy?.fullName[0]}</AvatarFallback>
              </Avatar>
              <span className='my-auto'>{row.original.reportedBy.fullName}</span>
            </p>;
          },
        },
        {
          accessorKey: "reason",
          header: ({ column }) => {
            return (
              <Button
                variant="ghost"
                onClick={() =>
                  column.toggleSorting(column.getIsSorted() === "asc")
                }
                className="cursor-pointer"
              >
                Lý do
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            );
          },
          cell: ({ row }) => {
            return <p className='px-2'>{row.original.reason}</p>;
          },
        },
        {
          accessorKey: "status",
          header: ({ column }) => {
            return (
              <Button
                variant="ghost"
                onClick={() =>
                  column.toggleSorting(column.getIsSorted() === "asc")
                }
                className="cursor-pointer"
              >
                Trạng thái
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            );
          },
          cell: ({ row }) => {
            if(row.original.status === "pending"){
                return <Badge variant="default">Chờ xử lý</Badge>;
            }else if(row.original.status === "approved"){
                return <Badge variant="outline" className='bg-green-500 text-white'>Chấp thuận</Badge>;
            }else{
                return <Badge variant="destructive">Từ chối</Badge>;
            }
            
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
                Ngày tạo
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
                    setDialogDetail({detail: {...row.original}, isOpen: true})
                  }}
                    className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-accent hover:text-accent-foreground rounded"
                  >
                    <NotebookText className="w-4 h-4" /> Xem/duyệt
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          ),
        },
      ];

  // hien thi preview anh
    if (isPreview) {
        return (
    dialogDetail.detail.photos &&
    dialogDetail.detail.photos.length > 0 && (
    <Lightbox
    open={isPreview}
    index={currentIndex}
    close={() => setIsPreview(false)}
    slides={dialogDetail.detail.photos.map((src) => ({ src }))}
    plugins={[Zoom]}
    />
    )
    );
    }

    const handleApproveUserReport = async (reportData: UserReportDetailDialog) => {
      try {
        setLoading(true);
        await authAxios.put(`${reportAPI}/review/user/${reportData.detail._id}/approve`)
        setDialogDetail({...dialogDetail, isOpen: false});
        setRefresh(prev => !prev)
        toast.success("Xử lý báo cáo thành công!")
      } catch (error: any) {
        toast.error(error?.response.data.message);
      } finally{
        setLoading(false)
      }
    };

    const handleRejectUserReport = async (reportData: UserReportDetailDialog) => {
      try {
        setLoading(true);
        await authAxios.put(`${reportAPI}/review/user/${reportData.detail._id}/reject`)
        setDialogDetail({...dialogDetail, isOpen: false});
        setRefresh(prev => !prev)
        toast.success("Xử lý báo cáo thành công!")
      } catch (error: any) {
        toast.error(error?.response.data.message);
      } finally{
        setLoading(false)
      }
    };


  return (
    <div className="flex flex-1 flex-col px-20 py-10">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="col-span-12 px-5 flex flex-col gap-5">
          <h4 className="scroll-m-20 min-w-40 text-xl font-semibold tracking-tight text-center">
            Danh sách báo cáo tài khoản chờ xử lý
          </h4>
        </div>
        <div className="col-span-12 px-5">
          <DataTable columns={columns} data={filteredUserReports ?? []} />
        </div>
      </div>

      <UserReportDetailDialogUI
        dialogDetail={dialogDetail}
        setDialogDetail={setDialogDetail}
        handleAprroveReport={handleApproveUserReport}
        handleRejectReport={handleRejectUserReport}
        loading={loading}
        setCurrentIndex={setCurrentIndex}
        setIsPreview={setIsPreview}
      />
    </div>
  );
}

export default PendingUserReports;