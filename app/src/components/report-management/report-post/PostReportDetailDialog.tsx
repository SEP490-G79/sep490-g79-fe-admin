import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { PostReportDetailDialog } from '@/types/DetailDialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Loader2Icon } from 'lucide-react';
import { useState } from 'react';

const PostReportDetailDialogUI = ({
  dialogDetail,
  setDialogDetail,
  handleAprroveReport,
  handleRejectReport,
  loading,
  setCurrentIndex,
  setIsPreview,

}: {
  dialogDetail: PostReportDetailDialog;
  setDialogDetail: Function;
  handleAprroveReport : Function;
  handleRejectReport: Function;
  loading: boolean;
  setCurrentIndex: Function;
  setIsPreview: Function;
}) => {
    const [isFullVisionLength, setIsFullVisionLength] = useState<boolean>(false);

    const postPhotos = dialogDetail.detail?.post?.photos ?? [] //anh tu post
      const evidencePhotos = dialogDetail.detail?.photos ?? []  //anh tu bang chung
      // const allPhotos = [...postPhotos, ...evidencePhotos] //tat ca anh

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
      <DialogContent className="!max-w-[60vw] !max-h-[80vh] overflow-y-auto border border-8 border-white">
        <DialogHeader>
          <DialogTitle>Chi tiết báo cáo bài viết post</DialogTitle>
          <DialogDescription>
            Thông tin chi tiết về báo cáo bài viết post
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-12 gap-6 py-4 text-sm">
          {/* Bài viết bị báo cáo */}
          <div className="col-span-12">
            <h3 className="text-base font-semibold mb-2">
              Bài viết bị báo cáo
            </h3>
            <div className="grid grid-cols-12 gap-4 p-4 rounded-lg border border-2">
              <div className="col-span-12 space-y-3 flex flex-row gap-2 justify-between">
                <div>
                  <p className="font-medium">Người đăng</p>
                  <div className="flex items-center gap-2">
                    <Avatar className="w-8 h-8 ring ring-2 ring-primary">
                      <AvatarImage
                        src={dialogDetail.detail?.post?.createdBy?.avatar}
                        alt={dialogDetail.detail?.post?.createdBy?.fullName + " avatar"}
                      />
                      <AvatarFallback>{dialogDetail.detail?.post?.createdBy?.fullName && dialogDetail.detail?.post?.createdBy?.fullName[0]}</AvatarFallback>
                    </Avatar>
                    <p>{dialogDetail.detail?.post?.createdBy?.fullName}</p>
                  </div>
                </div>
                <div>
                  <p className="font-medium">Trạng thái</p>
                  <p className="font-semibold text-blue-600">
                    {dialogDetail.detail?.post?.status === "active"
                      ? "Đã đăng"
                      : dialogDetail.detail?.post?.status === "deleted"
                      ? "Đã xóa"
                      : "Đã ẩn"}
                  </p>
                </div>
                <div>
                  <p className="font-medium">Chế độ hiển thị</p>
                  <p>
                    {dialogDetail.detail.post?.privacy === "public"
                      ? "Công khai"
                      : "Riêng tư"}
                  </p>
                </div>
              </div>
              <div className="col-span-12 space-y-3 text-start">
                <div>
                  <p className="font-medium">Nội dung</p>
                  {dialogDetail.detail?.post?.title &&
                    dialogDetail.detail?.post?.title.length >= 300 &&
                    !isFullVisionLength && (
                      <>
                        <p className='my-2'>{dialogDetail.detail?.post?.title.slice(0, 300)}</p>
                        <a
                          className="text-blue-500 underline cursor-pointer"
                          onClick={() => {
                            setIsFullVisionLength(true);
                          }}
                        >
                          Đọc thêm
                        </a>
                      </>
                    )}
                  {dialogDetail.detail?.post?.title &&
                    dialogDetail.detail?.post?.title.length >= 300 &&
                    isFullVisionLength && (
                      <>
                        <p className='my-2'>{dialogDetail.detail?.post?.title}</p>
                        <a
                          className="text-blue-500 underline cursor-pointer"
                          onClick={() => {
                            setIsFullVisionLength(false);
                          }}
                        >
                          Rút gọn
                        </a>
                      </>
                    )}
                  {dialogDetail.detail?.post?.title &&
                    dialogDetail.detail?.post?.title.length < 300 && (
                      <p>{dialogDetail.detail?.post?.title}</p>
                    )}
                </div>
                <div className="flex flex-col">
                  <p className="font-medium">Ảnh bài viết</p>
                  <div className="flex gap-2 mt-1">
                    {postPhotos?.map((photo, idx) => (
                      <img
                        key={idx}
                        src={photo}
                        alt={`post-photo-${idx}`}
                        className="h-24 w-36 object-cover rounded border cursor-pointer hover:scale-105 transition-transform"
                        onClick={() => {
                          setCurrentIndex(idx);
                          setIsPreview(true);
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Chi tiết báo cáo */}
          <div className="col-span-12">
            <h3 className="text-base font-semibold mb-2">Chi tiết báo cáo</h3>
            <div className="grid grid-cols-12 gap-4 p-4 rounded-lg border border-2">
              <div className="col-span-12 space-y-3 text-start flex flex-row justify-between">
                <div>
                  <p className="font-medium">Người báo cáo</p>
                  <div className="flex items-center gap-2">
                    <Avatar className="w-8 h-8 ring ring-2 ring-primary">
                      <AvatarImage
                        src={dialogDetail.detail?.reportedBy?.avatar}
                        alt={dialogDetail.detail?.reportedBy?.fullName + " avatar"}
                      />
                      <AvatarFallback>{dialogDetail.detail?.reportedBy?.fullName && dialogDetail.detail?.reportedBy?.fullName[0]}</AvatarFallback>
                    </Avatar>
                    <p>{dialogDetail.detail?.reportedBy?.fullName}</p>
                  </div>
                </div>
                <div>
                  <p className="font-medium">Trạng thái xử lý</p>
                  {statusTiengViet(dialogDetail.detail?.status)}
                </div>
                <div>
                  <p className="font-medium">Ngày báo cáo</p>
                  <p>
                    {new Date(dialogDetail.detail?.createdAt).toLocaleString(
                      "vi-VN"
                    )}
                  </p>
                </div>
                {dialogDetail.detail.status !== "pending" &&
                  dialogDetail.detail?.reviewedBy &&
                  dialogDetail.detail?.reviewedBy._id && (
                    <div className="col-span-6 space-y-3 text-end">
                      <div>
                        <p className="font-medium">Duyệt bởi</p>
                        <div className="flex gap-2 justify-end">
                          <Avatar className="w-8 h-8 ring ring-2 ring-primary">
                            <AvatarImage
                              src={dialogDetail.detail?.reviewedBy?.avatar}
                              alt={dialogDetail.detail?.reviewedBy?.fullName + " avatar"}
                            />
                            <AvatarFallback>{dialogDetail.detail?.reviewedBy?.fullName && dialogDetail.detail?.reviewedBy?.fullName[0]}</AvatarFallback>
                          </Avatar>
                          <p className="my-auto">
                            {dialogDetail.detail?.reviewedBy?.fullName ||
                              "Không có"}
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className="font-medium">Duyệt vào</p>
                        <p>
                          {new Date(
                            dialogDetail.detail?.updatedAt
                          ).toLocaleString("vi-VN")}
                        </p>
                      </div>
                    </div>
                  )}
              </div>
              <div className="col-span-12 space-y-3">
                <div>
                  <p className="font-medium">Lý do báo cáo</p>
                  {dialogDetail.detail?.reason.length >= 300 &&
                    !isFullVisionLength && (
                      <>
                        <p>{dialogDetail.detail?.reason.slice(0, 300)}</p>
                        <a
                          onClick={() => {
                            setIsFullVisionLength(true);
                          }}
                        >
                          Đọc thêm
                        </a>
                      </>
                    )}
                  {dialogDetail.detail?.reason.length >= 300 &&
                    isFullVisionLength && (
                      <>
                        <p>{dialogDetail.detail?.reason}</p>
                        <a
                          onClick={() => {
                            setIsFullVisionLength(false);
                          }}
                        >
                          Rút gọn
                        </a>
                      </>
                    )}
                  {dialogDetail.detail?.reason.length < 300 && (
                    <p>{dialogDetail.detail?.reason}</p>
                  )}

                  {/* Ảnh bằng chứng */}
                  {dialogDetail.detail.photos &&
                    dialogDetail.detail.photos?.length > 0 && (
                      <div className="col-span-12 max-w-[32vw]">
                        <p className="text-base font-semibold mb-2">
                          Ảnh bằng chứng
                        </p>
                        <div className="flex flex-wrap gap-3">
                          {evidencePhotos?.map((photo, idx) => (
                            <img
                              key={idx}
                              src={photo}
                              alt={`evidence-${idx}`}
                              onClick={() => {
                                setCurrentIndex(postPhotos.length + idx);
                                setIsPreview(true);
                              }}
                              className="h-24 w-36 object-cover rounded cursor-pointer border hover:scale-105 transition-transform"
                            />
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              </div>
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

export default PostReportDetailDialogUI;