import { DataTable } from '@/components/data-table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import AppContext from '@/context/AppContext';
import { cn } from '@/lib/utils';
import type { Breed } from '@/types/Breed';
import { type Species } from '@/types/Species';
import useAuthAxios from '@/utils/authAxios';
import { zodResolver } from '@hookform/resolvers/zod';
import type { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Bone, Check, ChevronsUpDown, MoreHorizontal } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const breedSchema = z.object({
    speciesId: z.string().min(2, "Vui lòng chọn loài!"),
    name: z.string().min(2, "Tên giống không được để trống !").max(100, "Tên giống không được quá 100 kí tự !"),
    description: z.string().max(1000, "Miêu tả loài không được quá 1000 kí tự!")
    .optional()
    .or(z.literal("")), // cho phép chuỗi rỗng
  })

const BreedManagement = () => {
    const [breeds, setBreeds] = useState<Breed[]>([]);
    const [species, setSpecies] = useState<Species[]>([]);
    const [filteredBreeds, setFilteredBreeds] = useState<Breed[]>([]);
    const [search, setSearch] = useState<string>("");
    const authAxios = useAuthAxios();
    const {breedAPI, speciesAPI} = useContext(AppContext);
    const [refresh, setRefresh] = useState<boolean>(false);
    const [createDialog, setCreateDialog] = useState<boolean>(false);
    const [detailDialog, setDetailDialog] = useState<Breed | null>(null);

    const form = useForm<z.infer<typeof breedSchema>>({
      resolver: zodResolver(breedSchema),
      defaultValues: {
        speciesId: "",
        name: "",
        description: "",
      },
    });

      useEffect(() => {
        authAxios.get(`${breedAPI}/get-all`)
        .then(({data}) => {
            setBreeds(data);
            setFilteredBreeds(data)
        }) 
        .catch((err) => console.log(err?.response.data.message))

        authAxios.get(`${speciesAPI}/get-all`)
        .then(({data}) => {
            setSpecies(data);
        }) 
        .catch((err) => console.log(err?.response.data.message))
      }, [refresh])

      useEffect(() => {
        if (search.trim().length < 1) {
          setFilteredBreeds(breeds);
        } else {
          const searchedBreeds = breeds.filter((breed) => {
            if (
              breed.name.toLocaleLowerCase().includes(search.toLowerCase()) ||
              breed.description.toLowerCase().includes(search.toLowerCase())
            ) {
              return breed;
            }
          });
          setFilteredBreeds(searchedBreeds);
        }
      }, [search]);


      const handleCreate = async (values: z.infer<typeof breedSchema>) => {
        try {
            const {speciesId, name, description} = values;
            await authAxios.post(`${breedAPI}/create`, {
                speciesId: speciesId,
                name,
                description
            })

            toast.success("Tạo thêm giống thành công!")
            setCreateDialog(false);
            form.reset({
              speciesId: "",
              name: "",
              description: "",
            });
            setRefresh(prev => !prev)
        } catch (error : any) {
            toast.error(error?.response.data.message)
        }
      }

      const handleEdit = async (values: z.infer<typeof breedSchema>) => {
        try {
          const {description } = values;
          await authAxios.put(`${breedAPI}/edit`, {
            breedId: detailDialog?._id,
            description,
          });

          toast.success("Chỉnh sửa giống thành công!");
          setDetailDialog(null);
          form.reset({
            speciesId: "",
            name: "",
            description: "",
          });
          setRefresh((prev) => !prev);
        } catch (error: any) {
          toast.error(error?.response.data.message);
        }
      };

      const handleDelete = async (breedId: string) => {
        try {
            await authAxios.delete(`${breedAPI}/delete/${breedId}`)

            toast.success("Xóa giống thành công!")
            setRefresh(prev => !prev)
        } catch (error : any) {
            toast.error(error?.response.data.message)
        }
      }

      const columns: ColumnDef<Breed>[] = [
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
                Tên giống
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
          accessorKey: "species",
          header: ({ column }) => {
            return (
              <Button
                variant="ghost"
                onClick={() =>
                  column.toggleSorting(column.getIsSorted() === "asc")
                }
                className="cursor-pointer"
              >
                Thuộc loài
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            );
          },
          cell: ({ row }) => (
            <p className="ms-2">{row.original?.species.name}</p>
          ),
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
                      form.reset({
                        speciesId: row.original.species._id,
                        name: row.original.name,
                        description: row.original.description,
                      });
                      setDetailDialog(row.original);
                    }}
                  >
                    Chỉnh sửa
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={(e) => e.preventDefault()}
                    className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-accent hover:text-accent-foreground rounded"
                  >
                    <AlertDialog>
                      <AlertDialogTrigger className='cursor-pointer'>Xóa giống</AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Xác nhận xóa giống{" "}
                            <span className="text-destructive font-semibold">
                              {row.original.name}
                            </span>
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Chỉ được phép xóa giống nếu không có thú cưng nào hiện tại đang xử dụng giống
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className='cursor-pointer'>Hủy</AlertDialogCancel>
                          <AlertDialogAction
                          className='cursor-pointer'
                            onClick={() => {
                              handleDelete(row.original._id);
                            }}
                          >
                            Xác nhận xóa
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
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
            Danh sách giống thú cưng
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
                  form.reset(); // reset mỗi khi Dialog đóng
                }
              }}
            >
              <Button
                className="cursor-pointer"
                onClick={() => setCreateDialog(true)}
              >
                <Bone /> Thêm giống mới
              </Button>
              <DialogContent className="sm:max-w-[425px]">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleCreate)}>
                    <DialogHeader>
                      <DialogTitle>Thêm giống mới</DialogTitle>
                      <DialogDescription>
                        Tạo thêm giống mới cho thú cưng.
                      </DialogDescription>
                    </DialogHeader>
                    <FormField
                      control={form.control}
                      name="speciesId"
                      render={({ field }) => (
                        <FormItem className="py-4">
                          <FormLabel>
                            Loài<span className="text-destructive">*</span>
                          </FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  className={cn(
                                    "w-[15vw] justify-between",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value
                                    ? species.find(
                                        (item) => item._id === field.value
                                      )?.name
                                    : "Chọn loài"}
                                  <ChevronsUpDown className="opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>

                            <PopoverContent className="w-[200px] p-0">
                              <Command>
                                <CommandInput
                                  placeholder="Tìm loài..."
                                  className="h-9"
                                />
                                <CommandList>
                                  <CommandEmpty>
                                    Không tìm thấy loài
                                  </CommandEmpty>
                                  <CommandGroup>
                                    {species.map((item) => (
                                      <CommandItem
                                        key={item._id}
                                        value={item.name} // search theo name
                                        onSelect={() => {
                                          form.setValue("speciesId", item._id); // chọn _id
                                        }}
                                      >
                                        {item.name}
                                        <Check
                                          className={cn(
                                            "ml-auto",
                                            item._id === field.value
                                              ? "opacity-100"
                                              : "opacity-0"
                                          )}
                                        />
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className="py-4">
                          <FormLabel>
                            Tên giống<span className="text-destructive">*</span>
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
                            Miêu tả giống
                          </FormLabel>
                          <FormControl>
                            <Textarea {...field} placeholder="Miêu tả giống" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <DialogFooter>
                      <Button
                        variant="outline"
                        className="cursor-pointer"
                        onClick={() => setCreateDialog(false)}
                        type="button"
                      >
                        Đóng
                      </Button>
                      <Button type="submit" className="cursor-pointer">
                        Thêm giống
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <div>
          <DataTable columns={columns} data={filteredBreeds ?? []} />
        </div>
        <Dialog
          open={detailDialog !== null}
          onOpenChange={(isOpen) => {
            if (!isOpen) {
              setDetailDialog(null);
            }
          }}
        >
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Thông tin giống</DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleEdit)}>

                <FormField
                      control={form.control}
                      name="speciesId"
                      render={({ field }) => (
                        <FormItem className="py-4">
                          <FormLabel>
                            Loài<span className="text-destructive">*</span>
                          </FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  disabled
                                  variant="outline"
                                  role="combobox"
                                  className={cn(
                                    "w-[15vw] justify-between",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value
                                    ? species.find(
                                        (item) => item._id === field.value
                                      )?.name
                                    : "Chọn loài"}
                                  <ChevronsUpDown className="opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>

                            <PopoverContent className="w-[200px] p-0">
                              <Command>
                                <CommandInput
                                  placeholder="Tìm loài..."
                                  className="h-9"
                                />
                                <CommandList>
                                  <CommandEmpty>
                                    Không tìm thấy loài
                                  </CommandEmpty>
                                  <CommandGroup>
                                    {species.map((item) => (
                                      <CommandItem
                                        key={item._id}
                                        value={item.name} // search theo name
                                        onSelect={() => {
                                          form.setValue("speciesId", item._id); // chọn _id
                                        }}
                                      >
                                        {item.name}
                                        <Check
                                          className={cn(
                                            "ml-auto",
                                            item._id === field.value
                                              ? "opacity-100"
                                              : "opacity-0"
                                          )}
                                        />
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>

                          <FormMessage />
                        </FormItem>
                      )}
                    />

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="py-4">
                      <FormLabel>
                        Tên giống
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
                      <FormLabel>Miêu tả giống</FormLabel>
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
                      setDetailDialog(null);
                      form.reset({
                        speciesId: "",
                        name: "",
                        description: ""
                      });
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
      </div>
    </div>
  );
}

export default BreedManagement