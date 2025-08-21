import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { BlogReportDetailDialog } from '@/types/DetailDialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Loader2Icon } from 'lucide-react';
import { useState } from 'react';
import parse from "html-react-parser";

const BlogReportDetailDialogUI = ({
  dialogDetail,
  setDialogDetail,
  handleAprroveReport,
  handleRejectReport,
  loading,
  setCurrentIndex,
  setIsPreview,

}: {
  dialogDetail: BlogReportDetailDialog;
  setDialogDetail: Function;
  handleAprroveReport : Function;
  handleRejectReport: Function;
  loading: boolean;
  setCurrentIndex: Function;
  setIsPreview: Function;
}) => {

  const [showFullContent, setShowFullContent] = useState(false);

  const statusTiengViet = (statusName: string) => {
    if (statusName === "approved") {
      return (
        <p className="uppercase font-semibold text-green-600">Chấp thuận</p>
      );
    } else if (statusName === "rejected") {
      return <p className="uppercase font-semibold text-red-600">Từ chối</p>;
    } else {
      return (
        <p className="uppercase font-semibold text-amber-600">Chờ xử lý</p>
      );
    }
  };
  
  return (
    <Dialog
      open={dialogDetail.isOpen}
      onOpenChange={(open) => {
        if (!open) {
          setDialogDetail({ ...dialogDetail, isOpen: false });
        }
      }}
    >
      <DialogContent className="!max-w-[40vw] !max-h-[80vh] overflow-y-auto border border-8 border-white">
        <DialogHeader>
          <DialogTitle>Chi tiết báo cáo bài viết blog</DialogTitle>
          <DialogDescription>
            Thông tin chi tiết về báo cáo bài viết blog
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-12 gap-6 py-4 text-sm">
          {/* Blog bị báo cáo */}
          <div className="col-span-12">
            <h3 className="text-base font-semibold mb-2">Blog bị báo cáo</h3>
            <div className="p-4 rounded-lg space-y-3 border border-2">
              <div className="flex items-center gap-4">
                <img
                  src={dialogDetail.detail?.blog?.thumbnail_url}
                  alt="thumbnail"
                  className="w-28 h-20 object-cover rounded border"
                />
                <div className="space-y-1">
                  <p className="font-semibold text-base">
                    {dialogDetail.detail?.blog?.title || "Không có tiêu đề"}
                  </p>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {dialogDetail.detail?.blog?.description || "Không có mô tả"}
                  </p>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                <div
                  className={
                    showFullContent
                      ? ""
                      : "line-clamp-3 max-h-[6em] overflow-hidden relative"
                  }
                >
                  {dialogDetail.detail?.blog?.content
                    ? parse(dialogDetail.detail.blog.content)
                    : "Không có nội dung"}
                </div>

                {dialogDetail.detail?.blog?.content &&
                  dialogDetail.detail.blog.content.length > 100 && (
                    <button
                      onClick={() => setShowFullContent(!showFullContent)}
                      className="mt-1 text-blue-500 hover:underline text-sm"
                    >
                      {showFullContent ? "Rút gọn" : "Xem chi tiết"}
                    </button>
                  )}
              </div>
            </div>
          </div>

          {/* Chi tiết báo cáo */}
          <div className="col-span-12">
            <h3 className="text-base font-semibold mb-2">Chi tiết báo cáo</h3>
            <div className="grid grid-cols-12 gap-4 p-4 rounded-lg border border-2">
              <div className="col-span-12 space-y-3 flex flex-row justify-between">
                <div>
                  <p className="font-medium">Tài khoản báo cáo</p>
                  <div className="flex items-center gap-2">
                    <Avatar className="w-8 h-8 ring ring-2 ring-primary">
                      <AvatarImage
                        src={dialogDetail.detail?.reportedBy?.avatar}
                      />
                      <AvatarFallback>{dialogDetail.detail?.reportedBy?.fullName && dialogDetail.detail?.reportedBy?.fullName[0]}</AvatarFallback>
                    </Avatar>
                    <p>
                      {dialogDetail.detail?.reportedBy?.fullName || "Không có"}
                    </p>
                  </div>
                </div>
                               <div>
                  <p className="font-medium">Trạng thái</p>
                  {dialogDetail?.detail?.status &&
                    statusTiengViet(dialogDetail?.detail?.status)}
                </div>
                <div>
                  <p className="font-medium">Ngày báo cáo</p>
                  <p>
                    {new Date(dialogDetail.detail?.createdAt).toLocaleString(
                      "vi-VN"
                    )}
                  </p>
                </div>

              </div>
                {dialogDetail.detail.status !== "pending" && dialogDetail.detail?.reviewedBy && dialogDetail.detail?.reviewedBy._id &&
                <div className="col-span-12 space-y-3 flex flex-row justify-between">
                  <div >
                    <p className="font-medium">Duyệt bởi</p>
                    <div className="flex gap-2 justify-end">
                      <Avatar className="w-8 h-8 ring ring-2 ring-primary">
                        <AvatarImage
                          src={dialogDetail.detail?.reviewedBy?.avatar}
                        />
                        <AvatarFallback>{dialogDetail.detail?.reviewedBy?.fullName && dialogDetail.detail?.reviewedBy?.fullName[0]}</AvatarFallback>
                      </Avatar>
                      <p className='my-auto'>
                        {dialogDetail.detail?.reviewedBy?.fullName || "Không có"}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="font-medium">Duyệt vào</p>
                    <p>
                      {new Date(dialogDetail.detail?.updatedAt).toLocaleString(
                        "vi-VN"
                      )}
                    </p>
                  </div>
                </div>
                }
                                                <div className='col-span-12'>
                  <p className="font-medium">Lý do báo cáo</p>
                  <p>{dialogDetail.detail?.reason || "Không có"}</p>
                </div>
            </div>
          </div>

          {/* Ảnh bằng chứng */}
          {dialogDetail.detail.photos &&
            dialogDetail.detail.photos.length > 0 && (
              <div className="col-span-12">
                <p className="text-base font-semibold mb-2">Ảnh bằng chứng</p>
                <div className="flex flex-wrap gap-3 p-2 border rounded-md">
                  {dialogDetail.detail.photos.slice(0, 2).map((photo, idx) => (
                    <img
                      key={idx}
                      src={photo}
                      alt={`photo-${idx}`}
                      onClick={() => {
                        setCurrentIndex(idx);
                        setIsPreview(true);
                      }}
                      className="h-24 w-36 object-cover rounded cursor-pointer border hover:scale-105 transition-transform"
                    />
                  ))}
                </div>
              </div>
            )}
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
          {dialogDetail.detail.status === "pending" && (
            <>
              {loading ? (
                <Button>
                  <Loader2Icon /> Vui lòng chờ
                </Button>
              ) : (
                <Button
                  variant="default"
                  className="cursor-pointer"
                  onClick={() => handleAprroveReport(dialogDetail)}
                >
                  Chấp thuận
                </Button>
              )}

              {loading ? (
                <Button>
                  <Loader2Icon /> Vui lòng chờ
                </Button>
              ) : (
                <Button
                  variant="destructive"
                  className="cursor-pointer"
                  onClick={() => handleRejectReport(dialogDetail)}
                >
                  Từ chối
                </Button>
              )}
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BlogReportDetailDialogUI;