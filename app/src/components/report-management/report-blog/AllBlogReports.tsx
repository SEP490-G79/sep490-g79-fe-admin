import { DataTable } from '@/components/data-table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import AppContext from '@/context/AppContext';
import type { BlogReportDetailDialog, UserReportDetailDialog } from '@/types/DetailDialog';
import type ReportTableData from '@/types/ReportTableData';
import useAuthAxios from '@/utils/authAxios';
import type { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal, NotebookText } from 'lucide-react';
import  { useContext, useEffect, useState } from 'react'
import Lightbox from "yet-another-react-lightbox";
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import { toast } from 'sonner';
import BlogReportDetailDialogUI from './BlogReportDetailDialog';


const AllBlogReports = () => {
      // const [blogReports, setBlogReports] = useState<ReportTableData[]>([]);
      const [filteredBlogReports, setFilteredBlogReports] = useState<ReportTableData[]>([]);
      const {reportAPI} = useContext(AppContext);
      const authAxios = useAuthAxios();
      const [loading, setLoading] = useState<boolean>(false);
      const [refresh, setRefresh] = useState<boolean>(false);
      const [isPreview, setIsPreview] = useState<boolean>(false);
      const [currentIndex, setCurrentIndex] = useState<number>(0);
      const [dialogDetail, setDialogDetail] = useState<BlogReportDetailDialog>({
        isOpen: false,
        detail: {
          _id: "64fde012a8f6e7001c42abcd",
          reportType: "blog",
          reason: "Blog đăng thông tin sai lệch về thú cưng",
          photos: [
            "https://res.cloudinary.com/demo/image/upload/v1692401100/report_photos/evidence1.jpg",
            "https://res.cloudinary.com/demo/image/upload/v1692401101/report_photos/evidence2.jpg",
          ],
          status: "approved",
          createdAt: new Date("2024-07-01T13:00:00.000Z"),
          updatedAt: new Date("2024-07-02T08:30:00.000Z"),

          blog: {
            _id: "64fde112a8f6e7001c42abcf",
            title: "Thú cưng có thể ăn sô cô la?",
            description:
              "Bài viết chia sẻ trải nghiệm cho thú cưng ăn đồ ngọt.",
            content:
              "<p>Sô cô la không nguy hiểm với chó nếu dùng đúng cách...</p>",
            thumbnail_url:
              "https://res.cloudinary.com/demo/image/upload/v1692401123/blog_thumbnails/blog1.jpg",
            status: "published",
            createdAt: new Date("2024-06-29T14:00:00.000Z"),
            updatedAt: new Date("2024-06-30T15:00:00.000Z"),
            shelter: {
              _id: "64fcaa887f7f6a001d23aaaa",
              name: "Paws & Claws Rescue",
              avatar:
                "https://res.cloudinary.com/demo/image/upload/v1692400000/shelters/avatar1.jpg",
              shelterCode: "ABC123",
            },
            createdBy: {
              _id: "64fcaab07f7f6a001d23aaab",
              fullName: "Lê Văn C",
              email: "levanc@example.com",
              avatar:
                "https://res.cloudinary.com/demo/image/upload/v1692400000/avatars/user3.jpg",
            },
          },

          reportedBy: {
            _id: "64fcaac57f7f6a001d23aaac",
            fullName: "Phạm Thị D",
            email: "phamthid@example.com",
            avatar:
              "https://res.cloudinary.com/demo/image/upload/v1692400000/avatars/user4.jpg",
          },

          reviewedBy: {
            _id: "64fcaad57f7f6a001d23aaad",
            fullName: "Admin PawShelter",
            email: "admin@pawshelter.org",
            avatar:
              "https://res.cloudinary.com/demo/image/upload/v1692400000/avatars/admin.jpg",
          },
        },
      });

      useEffect(() => {
        authAxios.get(`${reportAPI}/get-blog-reports`)
        .then(({data}) => {
          // console.log(data)
          // setBlogReports(data);
          setFilteredBlogReports(data);
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
          accessorKey: "blog",
          header: ({ column }) => {
            return (
              <Button
                variant="ghost"
                onClick={() =>
                  column.toggleSorting(column.getIsSorted() === "asc")
                }
                className="cursor-pointer"
              >
                Bài viết blog
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            );
          },
          cell: ({ row }) => {
            return <p className='flex gap-2'>
              {row.original.blog && <>
                <Avatar className='ring ring-1 ring-primary'>
                  <AvatarImage src={row.original.blog?.thumbnail_url} alt={row.original.blog?.title} />
                  <AvatarFallback>{row.original.blog?.title && row.original.blog?.title[0]}</AvatarFallback>
                </Avatar>
                <span className='my-auto max-w-20 truncate'>{row.original.blog?.title}</span>
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
              <Avatar className='ring ring-1 ring-primary'>
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
            return <p className='px-2 max-w-70 truncate'>{row.original.reason}</p>;
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
    dialogDetail && dialogDetail.detail.photos &&
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

    const handleApproveBlogReport = async (reportData: UserReportDetailDialog) => {
      try {
        setLoading(true);
        await authAxios.put(`${reportAPI}/review/blog/${reportData.detail._id}/approve`)
        setDialogDetail({...dialogDetail, isOpen: false});
        setRefresh(prev => !prev)
        toast.success("Xử lý báo cáo thành công!")
      } catch (error: any) {
        toast.error(error?.response.data.message);
      } finally{
        setLoading(false)
      }
    };

    const handleRejectBlogReport = async (reportData: UserReportDetailDialog) => {
      try {
        setLoading(true);
        await authAxios.put(`${reportAPI}/review/blog/${reportData.detail._id}/reject`)
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
            Danh sách báo cáo blog
          </h4>
        </div>
        <div className="col-span-12 px-5">
          <DataTable columns={columns} data={filteredBlogReports ?? []} />
        </div>
      </div>
      <BlogReportDetailDialogUI
        dialogDetail={dialogDetail}
        setDialogDetail={setDialogDetail}
        handleAprroveReport={handleApproveBlogReport}
        handleRejectReport={handleRejectBlogReport}
        loading={loading}
        setCurrentIndex={setCurrentIndex}
        setIsPreview={setIsPreview}
      />
    </div>
  );
}

export default AllBlogReports;