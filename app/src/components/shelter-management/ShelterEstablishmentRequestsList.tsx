import { DataTable } from '@/components/data-table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import AppContext from '@/context/AppContext';
import type { ShelterEstablishmentRequestTableData } from '@/types/ShelterEstablishmentRequest';
import useAuthAxios from '@/utils/authAxios';
import type { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Ellipsis, Loader2Icon, ScrollText } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import 'react-photo-view/dist/react-photo-view.css';
import { toast } from 'sonner';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import ShelterDetailDialog from './ShelterRequestDetailDialog';

// const examplePhoto = "https://images.squarespace-cdn.com/content/v1/54822a56e4b0b30bd821480c/45ed8ecf-0bb2-4e34-8fcf-624db47c43c8/Golden+Retrievers+dans+pet+care.jpeg";


const ShelterEstablishmentRequestsList = () => {
    const [shelterRequestData, setShelterRequestData] = useState<ShelterEstablishmentRequestTableData[]>([]);
    const [filteredShelterRequestData, setFilteredShelterRequestData] = useState<ShelterEstablishmentRequestTableData[]>([]);
    const [selectedShelterRequest, setSelectedShelterRequest] = useState<ShelterEstablishmentRequestTableData | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [buttonLoading, setButtonLoading] = useState<Boolean>(false);
    const authAxios = useAuthAxios();
    const {shelterAPI} = useContext(AppContext)
    const [rejectReason, setRejectReason] = useState("");
    const [openRejectDialog, setOpenRejectDialog] = useState(false);
    
        useEffect(() => {
          authAxios.get(`${shelterAPI}/get-shelter-requests-list`)
        .then(({data}) => {
            console.log(data)
            setShelterRequestData(data);
            setFilteredShelterRequestData(data);
        })
        .catch(error => {
          console.log(error?.response.data.message);
        })
        }, [])
    
    
        const columns: ColumnDef<ShelterEstablishmentRequestTableData>[] = [
        {
          header: "STT",
          cell: ({ row }) => row.index + 1,
        },
        {
          accessorKey: "name",
          header: ({ column }) => {
            return (
              <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                className="cursor-pointer"
              >
                Tên
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            );
          },
          cell: ({row}) => {
            return <p className='truncate whitespace-nowrap overflow-hidden max-w-[130px]'>{row.original.name}</p>
          }
        },
        {
          accessorKey: "address",
          header: ({ column }) => {
            return (
              <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                className="cursor-pointer"
              >
                Địa chỉ
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            );
          },
          cell: ({row}) => {
            return <p className='truncate whitespace-nowrap overflow-hidden max-w-[130px]'>{row.original.address}</p>
          }
        },
        {
          accessorKey: "createdBy",
          header: ({ column }) => {
            return (
              <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                className="cursor-pointer"
              >
                Tạo bởi
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            );
          },
          cell: ({ row }) => {
            return <div className='flex flex-row gap-2'><Avatar className='ring ring-2 ring-primary'>
              <AvatarImage src={row.original?.createdBy.avatar} alt={'avaar nguoi dung '+ row.original.createdBy.fullName}></AvatarImage>
              <AvatarFallback>{row.original?.createdBy.fullName} && {row.original?.createdBy.fullName[0]}</AvatarFallback>
            </Avatar> <span className='my-auto'>{row.original.createdBy.fullName}</span></div>
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
                const status = row.original.status as string;
        
                const statusMap: Record<
                  string,
                  {
                    label: string;
                    variant: "default" | "destructive" | "secondary";
                  }
                > = {
                  active: { label: "Chấp thuận", variant: "default" },
                  banned: { label: "Bị cấm", variant: "destructive" },
                  rejected: { label: "Từ chối", variant: "destructive" },
                  verifying: { label: "Đang chờ duyệt", variant: "secondary" },
                  cancelled: { label: "Hủy bỏ", variant: "destructive" },
                };
        
                const { label, variant } = statusMap[status] || {
                  label: "Không xác định",
                  variant: "outline",
                };
        
                return <Badge variant={variant}>{label}</Badge>;
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
          cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString("vi-vn"),
        },
        {
                id: "actions",
                cell: ({ row }) => {
        return <DropdownMenu>
          <DropdownMenuTrigger >
            <Ellipsis  className="h-4 w-4 cursor-pointer"/>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <ShelterDetailDialog shelter={row.original}/>
            {row.original.status === "verifying" &&
          <DropdownMenuItem className="cursor-pointer" onClick={() => {
            setSelectedShelterRequest({
              _id: row.original._id,
              avatar: row.original.avatar,
              shelterCode: row.original.shelterCode,
              name: row.original.name,
              status: row.original.status,
              email: row.original.email,
              hotline: row.original.hotline,
              address: row.original.address,
              aspiration: row.original.aspiration,
              shelterLicenseURL: row.original.shelterLicenseURL,
              createdBy: {
                fullName: row.original.createdBy.fullName,
                avatar: row.original.createdBy.avatar,
              },
              createdAt: row.original.createdAt,
              updatedAt: row.original.updatedAt,
            });
            setIsDialogOpen(true)
          }}>
             Duyệt
          </DropdownMenuItem>}
          </DropdownMenuContent>
        </DropdownMenu>
      },
          },
      ];
    
      function searchShelter(
        shelterData: ShelterEstablishmentRequestTableData[],
        keyword: string
      ) {
        const trimmedKeyword = keyword.trim().toLowerCase();
    
        // Nếu keyword rỗng thì trả về toàn bộ danh sách ban đầu
        if (trimmedKeyword === "") {
          setFilteredShelterRequestData(shelterData);
          return;
        }
    
        const result: ShelterEstablishmentRequestTableData[] = shelterData.filter((shelter) => {
          return (
            shelter.name.toLowerCase().includes(trimmedKeyword) ||
            // shelter.email.toLowerCase().includes(trimmedKeyword) ||
            shelter.address.toLowerCase().includes(trimmedKeyword)
            // shelter.hotline.toString().includes(trimmedKeyword)
          );
        });
        setFilteredShelterRequestData(result);
      }

      async function handleApprove(requestId : string = "No decision"){
        try {
          setButtonLoading(true);
          await authAxios.post(`${shelterAPI}/review-shelter-request`, {
            requestId: requestId,
            decision: "approve",
          });
          setTimeout(() => {
            setButtonLoading(false);
            setSelectedShelterRequest(null);
            setIsDialogOpen(false);
            toast.success("Duyệt chấp thuận thành công!");
            authAxios
              .get(`${shelterAPI}/get-shelter-requests-list`)
              .then(({ data }) => {
                // console.log(data)
                setShelterRequestData(data);
                setFilteredShelterRequestData(data);
              })
              .catch((error) => {
                console.log(error?.response.data.message);
              });
          }, 2000);
        } catch (error : any) {
          console.log(error?.response.data.message);
          setButtonLoading(false);
        }
        
      }

      async function handleReject(requestId : string = "No decision", rejectReason: string = "No reason given"){
        try {
          setButtonLoading(true);
          await authAxios.post(`${shelterAPI}/review-shelter-request`, {
            requestId: requestId,
            decision: "reject",
            rejectReason: rejectReason,
          });
          setTimeout(() => {
            setButtonLoading(false);
            setSelectedShelterRequest(null);
            setIsDialogOpen(false);
            toast.success("Duyệt từ chối thành công!");
            authAxios
              .get(`${shelterAPI}/get-shelter-requests-list`)
              .then(({ data }) => {
                // console.log(data)
                setShelterRequestData(data);
                setFilteredShelterRequestData(data);
              })
              .catch((error) => {
                console.log(error?.response.data.message);
              });
          }, 2000);
        } catch (error : any) {
          console.log(error?.response.data.message);
          setButtonLoading(false);
        }
      }

  return (
    <>
      <div className="col-span-12 px-5 flex flex-col gap-5">
        <h4 className="scroll-m-20 min-w-40 text-xl font-semibold tracking-tight text-center">
          Danh sách yêu cầu thành lập trạm cứu hộ
        </h4>
        <Input
          type="string"
          placeholder="Tìm kiếm theo tên, địa chỉ"
          className="max-w-1/3"
          onChange={(e) => searchShelter(shelterRequestData, e.target.value)}
        />
      </div>
      <div className="col-span-12 px-5 mt-2">
        <DataTable columns={columns} data={filteredShelterRequestData ?? []} />
      </div>

      <Dialog open={isDialogOpen}>
        <DialogContent className="w-full max-w-4xl !max-w-4xl">
          <DialogHeader>
            <DialogTitle>Chi tiết yêu cầu thành lập trạm cứu hộ</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 py-3">
            {/* Cột trái */}
            <div className="flex flex-col gap-3">
              <div>
                <p className="font-medium px-2 py-1">Tên trạm cứu hộ</p>
                <div className="border border-input bg-muted text-muted-foreground rounded-md px-3 py-2 min-h-[38px] flex items-center">
                  {selectedShelterRequest?.name ?? "No data"}
                </div>
              </div>

              <div>
                <p className="font-medium px-2 py-1">Email</p>
                <div className="border border-input bg-muted text-muted-foreground rounded-md px-3 py-2 min-h-[38px] flex items-center">
                  {selectedShelterRequest?.email ?? "No data"}
                </div>
              </div>

              <div>
                <p className="font-medium px-2 py-1">Hotline</p>
                <div className="border border-input bg-muted text-muted-foreground rounded-md px-3 py-2 min-h-[38px] flex items-center">
                  {selectedShelterRequest?.hotline ?? "No data"}
                </div>
              </div>

              <div>
                <p className="font-medium px-2 py-1">Địa chỉ</p>
                <div className="border border-input bg-muted text-muted-foreground rounded-md px-3 py-2 min-h-[38px] flex items-center">
                  {selectedShelterRequest?.address ?? "No data"}
                </div>
              </div>
            </div>

            {/* Cột phải */}
            <div className="flex flex-col gap-3">
              <div>
                <p className="font-medium px-2 py-1">Giấy phép hoạt động</p>
                <div className="px-2 py-2 min-h-[38px] flex items-center">
                  {selectedShelterRequest?.shelterLicenseURL ? (
                    <Button
                      onClick={() => window.open(selectedShelterRequest.shelterLicenseURL, "_blank")}
                      variant="outline"
                      className='cursor-pointer text-primary'
                    >
                      <ScrollText /> Xem giấy phép
                    </Button>
                  ) : (
                    "No data"
                  )}
                </div>
              </div>

              <div>
                <p className="font-medium px-2 py-1">Tạo bởi</p>
                <div className="px-3 py-2 min-h-[38px] flex items-center gap-2">
                  <Avatar className='ring ring-2 ring-primary'>
                    <AvatarImage
                      src={selectedShelterRequest?.createdBy?.avatar}
                    />
                    <AvatarFallback>{selectedShelterRequest?.createdBy?.fullName && selectedShelterRequest?.createdBy?.fullName[0]}</AvatarFallback>
                  </Avatar>
                  <span>
                    {selectedShelterRequest?.createdBy?.fullName ?? "No data"}
                  </span>
                </div>
              </div>

              <div>
                <p className="font-medium px-2 py-1">Ngày tạo</p>
                <div className="border border-input bg-muted text-muted-foreground rounded-md px-3 py-2 min-h-[38px] flex items-center">
                  {selectedShelterRequest?.createdAt
                    ? new Date(
                        selectedShelterRequest.createdAt
                      ).toLocaleString()
                    : "No data"}
                </div>
              </div>
              <div>
                <p className="font-medium px-2 py-1">Nguyện vọng thành lập</p>
                <div className="border border-input bg-muted text-muted-foreground rounded-md px-3 py-2 whitespace-pre-line">
                  {selectedShelterRequest?.aspiration ?? "No data"}
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              {buttonLoading ? (
                <Button disabled>
                  <Loader2Icon className="animate-spin" />
                  Vui lòng chờ
                </Button>
              ) : (
                <Button
                  variant="outline"
                  className="cursor-pointer"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Đóng
                </Button>
              )}
            </DialogClose>
            {buttonLoading ? (
              <Button variant="destructive" disabled>
                <Loader2Icon className="animate-spin" />
                Vui lòng chờ
              </Button>
            ) : (
              <Dialog
                open={openRejectDialog}
                onOpenChange={setOpenRejectDialog}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="destructive"
                    className="cursor-pointer"
                    onClick={() => setOpenRejectDialog(true)}
                  >
                    Từ chối
                  </Button>
                </DialogTrigger>

                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Lý do từ chối</DialogTitle>
                  </DialogHeader>
                  <DialogDescription></DialogDescription>

                  <Textarea
                    placeholder="Nhập lý do từ chối yêu cầu này..."
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    className="min-h-[100px]"
                  />

                  <DialogFooter className="pt-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setRejectReason("");
                        setOpenRejectDialog(false);
                      }}
                      className='cursor-pointer'
                    >
                      Hủy
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        handleReject(selectedShelterRequest?._id, rejectReason);
                        setRejectReason("");
                        setOpenRejectDialog(false);
                      }}
                      disabled={!rejectReason.trim()}
                      className='cursor-pointer'
                    >
                      Xác nhận từ chối
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
            {buttonLoading ? (
              <Button disabled>
                <Loader2Icon className="animate-spin" />
                Vui lòng chờ
              </Button>
            ) : (
              <Button
                className="cursor-pointer"
                onClick={() => handleApprove(selectedShelterRequest?._id)}
              >
                Chấp thuận
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ShelterEstablishmentRequestsList