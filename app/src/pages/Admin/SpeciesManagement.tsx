import { DataTable } from '@/components/data-table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import AppContext from '@/context/AppContext';
import { type Species } from '@/types/Species';
import useAuthAxios from '@/utils/authAxios';
import { zodResolver } from '@hookform/resolvers/zod';
import { type ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Bone, MoreHorizontal } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const speciesSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Tên loài không được để trống!")
    .max(100, "Tên loài không được quá 100 kí tự!"),

  description: z
    .string()
    .trim()
    .max(1000, "Miêu tả loài không được quá 1000 kí tự!")
    .optional()
    .or(z.literal("")), // cho phép chuỗi rỗng
});

const SpeciesManagement = () => {
    const [species, setSpecies] = useState<Species[]>([]);
    const [filteredSpecies, setFilteredSpecies] = useState<Species[]>([]);
    const [search, setSearch] = useState<string>("");
    const authAxios = useAuthAxios();
    const {speciesAPI} = useContext(AppContext);
    const [refresh, setRefresh] = useState<boolean>(false);
    const [createDialog, setCreateDialog] = useState<boolean>(false);
    const [detailDialog, setDetailDialog] = useState<Species | null>(null);
    const [selectedSpecies, setSelectedSpecies] = useState<Species | null>(null);
    const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);

    const form = useForm<z.infer<typeof speciesSchema>>({
      resolver: zodResolver(speciesSchema),
      defaultValues: {
        name: "",
        description: "",
      },
    });

      useEffect(() => {
        authAxios.get(`${speciesAPI}/get-all`)
        .then(({data}) => {
            setSpecies(data);
            setFilteredSpecies(data);
        }) 
        .catch((err) => console.log(err?.response.data.message))
      }, [refresh])

      useEffect(() => {
        if (search.trim().length < 1) {
          setFilteredSpecies(species);
        } else {
          const searchedSpecies = species.filter((item) => {
            if (
              item.name.toLocaleLowerCase().includes(search.toLowerCase()) ||
              item.description &&
              item.description.toLowerCase().includes(search.toLowerCase())
            ) {
              return item;
            }
          });
          setFilteredSpecies(searchedSpecies);
        }
      }, [search]);


      const handleCreate = async (values: z.infer<typeof speciesSchema>) => {
        try {
            const {name, description} = values;
            await authAxios.post(`${speciesAPI}/create`, {
                name,
                description
            })

            toast.success("Tạo thêm loài thành công!")
            setCreateDialog(false);
            setRefresh(prev => !prev)
        } catch (error : any) {
            toast.error(error?.response.data.message)
        }
      }

      const handleEdit = async (values: z.infer<typeof speciesSchema>) => {
        try {
            const {description} = values;
            await authAxios.put(`${speciesAPI}/edit`, {
                speciesId: detailDialog?._id,
                description
            })

            toast.success("Chỉnh sửa loài thành công!")
            setDetailDialog(null);
            form.reset();
            setRefresh(prev => !prev)
        } catch (error : any) {
            toast.error(error?.response.data.message)
        }
      }

      const handleDelete = async (speciesId: string) => {
        try {
            await authAxios.delete(`${speciesAPI}/delete/${speciesId}`);
            toast.success("Xóa loài thành công!")
            setSelectedSpecies(null);
            setRefresh(prev => !prev)
        } catch (error : any) {
            toast.error(error?.response.data.message)
        }
      }

      const columns: ColumnDef<Species>[] = [
        {
          header: "STT",
          cell: ({ row }) => {
            return <p className="text-left ms-2">{row.index + 1}</p>;
          },
        },
        {
          accessorKey: "name",
          header: ({ column }) => {
            return (
              <Button
                variant="ghost"
                onClick={() =>
                  column.toggleSorting(column.getIsSorted() === "asc")
                }
                className="cursor-pointer"
              >
                Tên loài
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            );
          },
          cell: ({ row }) => <p className="ms-2">{row.original?.name}</p>,
        },
        {
          accessorKey: "description",
          header: ({ column }) => {
            return (
              <Button
                variant="ghost"
                onClick={() =>
                  column.toggleSorting(column.getIsSorted() === "asc")
                }
                className="cursor-pointer"
              >
                Miêu tả
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            );
          },
          cell: ({ row }) => {
            return (
              <p className="max-w-[10vw] overflow-hidden text-ellipsis">
                {row.original.description}
              </p>
            );
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
                    className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-accent hover:text-accent-foreground rounded"
                    onClick={() => {
                      setDetailDialog(row.original)
                      form.reset({
                        name: row.original.name,
                        description: row.original.description
                      })
                    }}
                  >
                    Chỉnh sửa
                  </DropdownMenuItem>
                  
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedSpecies(row.original);
                        setOpenDeleteDialog(true)
                      }}
                      className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-accent hover:text-accent-foreground rounded"
                    >
                      Xóa loài
                    </DropdownMenuItem>
                 
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          ),
        },
      ];

      
  return (
    <div className="flex flex-1 flex-col px-20 py-10">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="col-span-12 flex flex-col gap-5">
          <h4 className="scroll-m-20 min-w-40 text-xl font-semibold tracking-tight text-center">
            Danh sách loài thú cưng
          </h4>
          <div className="flex gap-2">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm kiếm..."
            />
            <Dialog
              open={createDialog}
              onOpenChange={(isOpen) => {
                if (!isOpen) {
                  setCreateDialog(false);
                  form.reset();
                }
              }}
            >
              <Button
                className="cursor-pointer"
                onClick={() => {
                  form.reset({ name: "", description: "" });
                  setCreateDialog(true)
                }}
              >
                <Bone /> Thêm loài mới
              </Button>
              <DialogContent className="sm:max-w-[425px]">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleCreate)}>
                    <DialogHeader>
                      <DialogTitle>Thêm loài mới</DialogTitle>
                      <DialogDescription>
                        Tạo thêm loài mới cho thú cưng.
                      </DialogDescription>
                    </DialogHeader>
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className="py-4">
                          <FormLabel>
                            Tên loài<span className="text-destructive">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Fox sóc" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem className="py-4">
                          <FormLabel>
                            Miêu tả loài
                          </FormLabel>
                          <FormControl>
                            <Textarea {...field} placeholder="Miêu tả loài" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <DialogFooter>
                      <Button
                        variant="outline"
                        className="cursor-pointer"
                        type="button"
                        onClick={() => setCreateDialog(false)}
                      >
                        Đóng
                      </Button>
                      <Button type="submit" className="cursor-pointer">
                        Thêm loài
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <div>
          <DataTable columns={columns} data={filteredSpecies ?? []} />
        </div>
        <Dialog
          open={detailDialog !== null}
          onOpenChange={(isOpen) => {
            if (!isOpen) {
              setDetailDialog(null);
            }
          }}
        >
          <DialogContent className="sm:min-w-xl">
            <DialogHeader>
              <DialogTitle>Thông tin loài</DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>

            <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleEdit)}>
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className="py-4">
                          <FormLabel>
                            Tên loài
                          </FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Fox sóc" disabled/>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem className="py-4">
                          <FormLabel>
                            Miêu tả loài
                          </FormLabel>
                          <FormControl>
                            <Textarea {...field} placeholder="Miêu tả loài" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <DialogFooter>
                      <Button
                        variant="outline"
                        className="cursor-pointer"
                        type="button"
                        onClick={() => {
                          setDetailDialog(null)
                          form.reset();
                        }}
                      >
                        Đóng
                      </Button>
                      <Button type="submit" className="cursor-pointer">
                        Lưu thay đổi
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
          </DialogContent>
        </Dialog>

        <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Xác nhận xóa loài <span className='text-destructive font-semibold'>{selectedSpecies?.name}</span></AlertDialogTitle>
              <AlertDialogDescription>
                Chỉ được phép xóa loài mà không có thú cưng hoặc giống nào đang sử dụng! Vui lòng xác nhận trước khi xóa
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Hủy</AlertDialogCancel>
              <AlertDialogAction onClick={() => {
                selectedSpecies && handleDelete(selectedSpecies?._id);
              }}>
                Xác nhận xóa
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}

export default SpeciesManagement