import { DataTable } from '@/components/data-table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import AppContext from '@/context/AppContext';
import type { PostReportDetailDialog } from '@/types/DetailDialog';
import type { ReportPost, ReportUser } from '@/types/ReportTableData';
import type ReportTableData from '@/types/ReportTableData';
import useAuthAxios from '@/utils/authAxios';
import type { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal, NotebookText } from 'lucide-react';
import { useContext, useEffect, useState } from 'react'
import { toast } from 'sonner';
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import PostReportDetailDialogUI from './PostReportDetailDialog';


type dialogDetail = {
  isOpen: boolean;
  detail: {
    _id: string;
      reportType: string;
      post?: ReportPost;   
      reportedBy: ReportUser;
      reviewedBy?: ReportUser;
      reason: string;
      photos?: string[];
      status: string;
      createdAt: Date; 
      updatedAt: Date;
  };
};

// const statusTiengViet = (statusName: string) => {
//     if (statusName === "approved") {
//       return (
//         <p className="uppercase font-semibold text-green-600">Chấp thuận</p>
//       );
//     } else if (statusName === "rejected") {
//       return <p className="uppercase font-semibold text-red-600">Từ chối</p>;
//     } else {
//       return (
//         <p className="uppercase font-semibold text-amber-600">Chờ xử lý</p>
//       );
//     }
//   };

const AllPostReports = () => {
  // const [postReports, setPostReports] = useState<ReportTableData[]>([]);
  const [filteredPostReports, setFilteredPostReports] = useState<
    ReportTableData[]
  >([]);
  const { reportAPI } = useContext(AppContext);
  const authAxios = useAuthAxios();
  const [loading, setLoading] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [isPreview, setIsPreview] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  // const [isFullVisionLength, setIsFullVisionLength] = useState<boolean>(false);
  const [dialogDetail, setDialogDetail] = useState<dialogDetail>({
    isOpen: false,
    detail: {
      _id: "rpt004",
      reportType: "post",
      post: {
        _id: "post567",
        title: "Bán mèo giá rẻ",
        photos: ["https://example.com/post2.jpg"],
        privacy: "public",
        createdBy: {
          _id: "user006",
          fullName: "Lý Thị F",
          email: "lyf@example.com",
          avatar: "https://example.com/avatar6.jpg",
        },
        status: "active",
      },
      reportedBy: {
        _id: "user007",
        fullName: "Đặng Văn G",
        email: "dangvg@example.com",
        avatar: "https://example.com/avatar7.jpg",
      },
      reason: "Nội dung nghi ngờ lừa đảo.",
      photos: ["https://example.com/evidence2.jpg"],
      status: "pending",
      createdAt: new Date("2025-07-04T09:00:00.000Z"),
      updatedAt: new Date("2025-07-04T09:00:00.000Z"),
    },
  });
  const postPhotos = dialogDetail.detail?.post?.photos ?? []; //anh tu post
  const evidencePhotos = dialogDetail.detail?.photos ?? []; //anh tu bang chung
  const allPhotos = [...postPhotos, ...evidencePhotos]; //tat ca anh

  useEffect(() => {
    authAxios
      .get(`${reportAPI}/get-post-reports`)
      .then(({ data }) => {
        // console.log(data)
        // setPostReports(data);
        setFilteredPostReports(data);
      })
      .catch((err) => console.log(err?.response.data.message));
  }, [refresh]);

  const columns: ColumnDef<ReportTableData>[] = [
    {
      header: "STT",
      cell: ({ row, table }) => {
        const pageIndex = table.getState().pagination.pageIndex;
        const pageSize = table.getState().pagination.pageSize;
        return (
          <p className="text-center">{pageIndex * pageSize + row.index + 1}</p>
        );
      },
    },
    {
      accessorKey: "post",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="cursor-pointer"
          >
            Bài viết
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return (
          <p className="flex gap-2">
            <Avatar className='ring ring-2 ring-primary'>
              <AvatarImage
                src={row.original.post?.photos[0]}
                alt={row.original.post?.title}
              />
              <AvatarFallback>{row.original.post?.title && row.original.post?.title[0]}</AvatarFallback>
            </Avatar>
            <span className="my-auto max-w-25 truncate">
              {row.original.post?.title}
            </span>
          </p>
        );
      },
    },
    {
      accessorKey: "reason",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="cursor-pointer"
          >
            Lý do
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return <p className="px-2">{row.original.reason}</p>;
      },
    },
    {
      accessorKey: "reportedBy",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="cursor-pointer"
          >
            Báo cáo bởi
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return (
          <p className="flex gap-2">
            <Avatar className='ring ring-2 ring-primary'>
              <AvatarImage
                src={row.original.reportedBy.avatar}
                alt={row.original.reportedBy.fullName}
              />
              <AvatarFallback>{row.original.reportedBy?.fullName && row.original.reportedBy?.fullName[0]}</AvatarFallback>
            </Avatar>
            <span className="my-auto max-w-20 truncate">
              {row.original.reportedBy.fullName}
            </span>
          </p>
        );
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="cursor-pointer"
          >
            Trạng thái
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        if (row.original.status === "pending") {
          return <Badge variant="default">Chờ xử lý</Badge>;
        } else if (row.original.status === "approved") {
          return (
            <Badge variant="outline" className="bg-green-500 text-white">
              Chấp thuận
            </Badge>
          );
        } else {
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
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
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
                  setDialogDetail({
                    detail: { ...row.original },
                    isOpen: true,
                  });
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

  const handleApprovePostReport = async (
    reportData: PostReportDetailDialog
  ) => {
    try {
      setLoading(true);
      await authAxios.put(
        `${reportAPI}/review/post/${reportData.detail._id}/approve`
      );
      setDialogDetail({ ...dialogDetail, isOpen: false });
      setRefresh((prev) => !prev);
      toast.success("Xử lý báo cáo thành công!");
    } catch (error: any) {
      toast.error(error?.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRejectPostReport = async (reportData: PostReportDetailDialog) => {
    try {
      setLoading(true);
      await authAxios.put(
        `${reportAPI}/review/post/${reportData.detail._id}/reject`
      );
      setDialogDetail({ ...dialogDetail, isOpen: false });
      setRefresh((prev) => !prev);
      toast.success("Xử lý báo cáo thành công!");
    } catch (error: any) {
      toast.error(error?.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  // hien thi preview anh
  if (isPreview) {
    return (
      <Lightbox
        open={isPreview}
        close={() => setIsPreview(false)}
        index={currentIndex}
        slides={allPhotos.map((src) => ({ src }))}
        plugins={[Zoom]}
      />
    );
  }

  return (
    <div className="flex flex-1 flex-col px-20 py-10">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="col-span-12 px-5 flex flex-col gap-5">
          <h4 className="scroll-m-20 min-w-40 text-xl font-semibold tracking-tight text-center">
            Danh sách báo cáo post
          </h4>
        </div>
        <div className="col-span-12 px-5">
          <DataTable columns={columns} data={filteredPostReports ?? []} />
        </div>
      </div>

      <PostReportDetailDialogUI
        dialogDetail={dialogDetail}
        setDialogDetail={setDialogDetail}
        handleAprroveReport={handleApprovePostReport}
        handleRejectReport={handleRejectPostReport}
        loading={loading}
        setCurrentIndex={setCurrentIndex}
        setIsPreview={setIsPreview}
      />
    </div>
  );
}

export default AllPostReports;