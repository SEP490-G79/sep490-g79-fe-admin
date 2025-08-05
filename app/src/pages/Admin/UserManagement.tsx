
import { DataTable } from '@/components/data-table';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuGroup, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuCheckboxItem } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import AppContext from '@/context/AppContext';
import type { UserTableData } from '@/types/UserTableData';
import useAuthAxios from '@/utils/authAxios';
import type { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Ban, ChevronDown, MoreHorizontal, NotebookText, RotateCcwKey } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';

// type Checked = DropdownMenuCheckboxItemProps["checked"]

// const addUserSchema = z
//   .object({
//     fullName: z
//     .string()
//     .trim()
//     .min(6, "Họ và tên quá ngắn")
//     .regex(/^[\p{L}\s-]+$/u,"Tên chỉ được chứa chữ cái, khoảng trắng và dấu gạch nối"
//     )
//     .refine(
//       (val) => (val.match(/\p{L}/gu) || []).length >= 3,
//       "Tên phải có ít nhất 3 chữ cái"
//     ),
//     email: z.string().email("Email không hợp lệ"),
//     password: z.string().min(6, "Mật khẩu phải từ 6 ký tự"),
//     roles: z.array(z.string()).min(1, "Vui lòng chọn vai trò"),
//   })

type dialogDetail = {
  isOpen: boolean;
  detail: {
    fullName: string;
    email: string;
    roles: [string];
    avatar: string;
    status: string;
    phoneNumber: number;
    warningCount: number;
    createdAt: Date;
    updatedAt: Date;
  };
};

const UserManagement = () => {
    const [userData, setUserData] = useState<UserTableData[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<UserTableData[]>([]);
    const {userAPI} = useContext(AppContext);
    const authAxios = useAuthAxios();
    const [dialogDetail, setDialogDetail] = useState<dialogDetail>({
      isOpen: false,
      detail: {
        fullName: "",
        email: "",
        roles: [""],
        avatar: "",
        status: "",
        phoneNumber: 123,
        warningCount: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });

        // const form = useForm<z.infer<typeof addUserSchema>>({
        //   resolver: zodResolver(addUserSchema),
        //   defaultValues: {
        //     fullName: "",
        //     email: "",
        //     password: "",
        //     roles: [],
        //   },
        // });

    useEffect(() => {
      authAxios.get(`${userAPI}/get-users-list`)
      .then(function({data}){
        // console.log(data)
        setUserData(data.usersList)
        setFilteredUsers(data.usersList)
      })
      .catch(function(error){
        console.log(error?.response?.data.message)
      })
    }, [])

    
    // const handleAddUser = async ({
    //   fullName,
    //   email,
    //   password,
    //   roles,
    // }: z.infer<typeof addUserSchema>) => {
    //   try {
    //     console.log("add user");
    //     console.log(fullName, email, password, roles);
    //     const response = await authAxios.post(`${coreAPI}/admin/add-user`, {
    //       fullName,
    //       email,
    //       password,
    //       roles,
    //     });
    //     console.log(response?.data.message);
    //     setTimeout(() => {
    //       toast.success("Tạo người dùng mới thành công!")
    //       authAxios
    //         .get(`${userAPI}/get-users-list`)
    //         .then(function ({ data }) {
    //           console.log(data);
    //           setUserData(data.usersList);
    //           setFilteredUsers(data.usersList);
    //         })
    //         .catch(function (error) {
    //           console.log(error?.response?.data.message);
    //         });
    //     }, 1000)
    //   } catch (error: any) {
    //     console.log(error?.response.data.message);
    //   }
    // };

    // const handleViewAccountDetail = async (userId:string) => {
    //   try {
    //     console.log(userId);
        
    //   } catch (error: any) {
    //     console.log(error)
    //   }
    // }

    const handleBanUser = async (userId : string) => {
      try {
        await authAxios.put(`${userAPI}/ban-user/${userId}`);
        toast.success("Ban người dùng thành công!")
        authAxios.get(`${userAPI}/get-users-list`)
      .then(function({data}){
        console.log(data)
        setUserData(data.usersList)
        setFilteredUsers(data.usersList)
      })
      .catch(function(error){
        console.log(error?.response?.data.message)
      })
      } catch (error: any) {
        console.log(error?.response.data.message);
      }
    };

    const handleUnbanUser = async (userId : string) => {
      try {
        await authAxios.put(`${userAPI}/unban-user/${userId}`);
        toast.success("Unban người dùng thành công!")

        authAxios.get(`${userAPI}/get-users-list`)
      .then(function({data}){
        console.log(data)
        setUserData(data.usersList)
        setFilteredUsers(data.usersList)
      })
      .catch(function(error){
        console.log(error?.response?.data.message)
      })
      } catch (error: any) {
        console.log(error?.response.data.message);
      }
    };

    const handleChangeUserRole = async (userId : string, roles: string[]) => {
      try {
        // console.log("change user role");
        // console.log(userId, roles);

        if(roles.length === 0){
          toast.error("Người dùng phải có ít nhất 1 vai trò")
          return;
        }
    
        await authAxios.put(`${userAPI}/change-roles/${userId}`, {roles});
        // console.log(response?.data.message);
        toast.success("Thay đổi vai trò người dùng thành công!")
        authAxios.get(`${userAPI}/get-users-list`)
      .then(function({data}){
        // console.log(data)
        setUserData(data.usersList)
        setFilteredUsers(data.usersList)
      })
      .catch(function(error){
        console.log(error?.response?.data.message)
      })
      } catch (error: any) {
        console.log(error?.response.data.message);
      }
    };

    const columns: ColumnDef<UserTableData>[] = [
      {
        header: "STT",
        cell: ({ row }) => <p className="text-center">{row.index + 1}</p>,
      },
      {
        accessorKey: "avatar",
        header: "Ảnh đại diện",
        cell: ({ row }) => (
          <img
            src={row.original.avatar}
            alt={row.original.fullName}
            className="h-10 w-10 rounded-full object-cover mx-auto"
          />
        ),
      },
      {
        accessorKey: "fullName",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className="cursor-pointer"
            >
              Họ và tên
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => {
          return <span className="px-2">{row.original.fullName}</span>;
        },
      },
      {
        accessorKey: "email",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className="cursor-pointer"
            >
              Email
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => {
          return <span className="px-2">{row.original.email}</span>;
        },
      },
      {
        accessorKey: "roles",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className="cursor-pointer"
            >
              Vai trò
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => {
          const currentRoles: string[] = [...row.original.roles];

          const isUser = currentRoles.includes("user");
          const isAdmin = currentRoles.includes("admin");

          const toggleRole = async (role: string) => {
            const updatedRoles = [...currentRoles];
            const index = updatedRoles.indexOf(role);

            if (index === -1) {
              updatedRoles.push(role);
            } else {
              updatedRoles.splice(index, 1);
            }

            await handleChangeUserRole(row.original._id, updatedRoles);
          };

          const dropdownButton = () => {
            if (isAdmin) {
              return (
                <Button
                  variant="destructive"
                  className=" mx-auto cursor-pointer w-full"
                >
                  Quản trị <ChevronDown />
                </Button>
              );
            } else if (isUser) {
              return (
                <Button variant="default" className="mx-auto cursor-pointer w-full">
                  Thông thường <ChevronDown />
                </Button>
              );
            } else {
              return (
                <Button variant="default" className="mx-auto cursor-pointer">
                  Vai trò không hợp lệ <ChevronDown />
                </Button>
              );
            }
          };

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                {dropdownButton()}
              </DropdownMenuTrigger>
              <DropdownMenuContent className="min-w-40">
                <DropdownMenuLabel>
                  Chọn vai trò của tài khoản
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                  className="cursor-pointer"
                  checked={isUser}
                  onCheckedChange={() => toggleRole("user")}
                >
                  Tài khoản thông thường
                </DropdownMenuCheckboxItem>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                  className="cursor-pointer"
                  checked={isAdmin}
                  onCheckedChange={() => toggleRole("admin")}
                >
                  Tài khoản quản trị viên
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
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
          const status = row.original.status;
          let statusTiengViet = "";
          if (status === "active") {
            statusTiengViet = "Đã kích hoạt";
            return <Badge variant="default">{statusTiengViet}</Badge>;
          } else if (status === "verifying") {
            statusTiengViet = "Chờ kích hoạt";
            return <Badge variant="secondary">{statusTiengViet}</Badge>;
          } else {
            statusTiengViet = "Bị cấm";
            return <Badge variant="destructive">{statusTiengViet}</Badge>;
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
                    setDialogDetail({
                      isOpen: true,
                      detail: {
                        fullName: row.original.fullName,
                        email: row.original.email,
                        roles: row.original.roles,
                        avatar: row.original.avatar,
                        status: row.original.status,
                        phoneNumber: row.original.phoneNumber,
                        warningCount: row.original.warningCount,
                        createdAt: row.original.createdAt,
                        updatedAt: row.original.updatedAt,
                      },
                    });
                  }}
                  className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-accent hover:text-accent-foreground rounded"
                >
                  <NotebookText className="w-4 h-4" /> Xem thông tin chi tiết
                </DropdownMenuItem>

                {!row.original.roles.includes("admin") &&
                  row.original.status !== "banned" && (
                    <DropdownMenuItem
                      onClick={() => {
                        handleBanUser(row.original._id);
                      }}
                      className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-accent hover:text-accent-foreground rounded"
                    >
                      <Ban className="w-4 h-4" /> Ban
                    </DropdownMenuItem>
                  )}
                {!row.original.roles.includes("admin") &&
                  row.original.status === "banned" && (
                    <DropdownMenuItem
                      onClick={() => {
                        handleUnbanUser(row.original._id);
                      }}
                      className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-accent hover:text-accent-foreground rounded"
                    >
                      <RotateCcwKey className="w-4 h-4" /> Unban
                    </DropdownMenuItem>
                  )}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ];

  function searchUsersByFullnameOrEmail(
    users: UserTableData[],
    keyword: string
  ) {
    if (keyword.trim() === "") {
      setFilteredUsers(userData);
    }
    const lowerKeyword = keyword.toLowerCase().trim();
    const result: UserTableData[] = users.filter((user) => {
      return (
        user.fullName.toLowerCase().includes(lowerKeyword) ||
        user.email.toLowerCase().includes(lowerKeyword)
      );
    });
    // console.log(result);
    setFilteredUsers(result);
  }


  return (
    <div className="flex flex-1 flex-col px-20 py-10">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="col-span-12 px-5 flex flex-col gap-5">
          <h4 className="scroll-m-20 min-w-40 text-xl font-semibold tracking-tight text-center">
            Danh sách các tài khoản
          </h4>
          <div className="flex flex-row gap-7">
            <Input
              className="max-w-1/3"
              type="string"
              placeholder="Tìm kiếm theo tên hoặc email"
              onChange={(e) =>
                searchUsersByFullnameOrEmail(userData, e.target.value)
              }
            />
            {/* <Dialog
              onOpenChange={(isOpen) => {
                if (!isOpen) {
                  form.reset(); // reset mỗi khi Dialog đóng
                }
              }}
            >
              <DialogTrigger asChild>
                <Button className="cursor-pointer">
                  <Users /> Thêm tài khoản
                </Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-[425px]">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleAddUser)}>
                    <DialogHeader>
                      <DialogTitle>Thêm tài khoản</DialogTitle>
                      <DialogDescription>
                        Tạo thêm tài khoản hệ thống mới.
                      </DialogDescription>
                    </DialogHeader>
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem className="py-4">
                          <FormLabel>
                            Họ và tên<span className="text-destructive">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Nguyễn Văn A" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="py-4">
                          <FormLabel>
                            Email<span className="text-destructive">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="nguyenvana@gmail.com"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem className="py-4">
                          <FormLabel>
                            Mật khẩu<span className="text-destructive">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="roles"
                      render={({ field }) => (
                        <FormItem className="py-4">
                          <FormLabel>
                            Vai trò<span className="text-destructive">*</span>
                          </FormLabel>
                          <div className="flex flex-col space-y-2">
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  id="user"
                                  checked={field.value?.includes("user")}
                                  onCheckedChange={(checked) => {
                                    const isChecked = checked === true;
                                    if (isChecked) {
                                      field.onChange([...field.value, "user"]);
                                    } else {
                                      field.onChange(
                                        field.value.filter((v) => v !== "user")
                                      );
                                    }
                                  }}
                                />
                              </FormControl>
                              <FormLabel htmlFor="user">
                                Người dùng thông thường
                              </FormLabel>
                            </FormItem>

                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  id="admin"
                                  checked={field.value?.includes("admin")}
                                  onCheckedChange={(checked) => {
                                    const isChecked = checked === true;
                                    if (isChecked) {
                                      field.onChange([...field.value, "admin"]);
                                    } else {
                                      field.onChange(
                                        field.value.filter((v) => v !== "admin")
                                      );
                                    }
                                  }}
                                />
                              </FormControl>
                              <FormLabel htmlFor="admin">
                                Quản trị viên
                              </FormLabel>
                            </FormItem>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline" className="cursor-pointer">
                          Đóng
                        </Button>
                      </DialogClose>
                      <Button type="submit" className="cursor-pointer">
                        Thêm người dùng
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog> */}
          </div>
        </div>
        <div className="col-span-12 px-5">
          <DataTable columns={columns} data={filteredUsers ?? []} />
        </div>
      </div>

      <Dialog open={dialogDetail.isOpen}>
              <DialogContent className="max-w-[70vw]">
                <DialogHeader>
                  <DialogTitle>Chi tiết tài khoản</DialogTitle>
                  <DialogDescription></DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-3 py-3">
                                   <div className="flex flex-col">
                    <p className="font-medium px-2 py-1 h-fit">Avatar</p>
                    <p className="px-2 flex flex-row gap-2">
                      <Avatar>
                        <AvatarImage
                          src={dialogDetail.detail.avatar}
                        ></AvatarImage>
                      </Avatar>
                    </p>
                  </div>
                  <div>
                    <p className="font-medium px-2 py-1">Họ và tên</p>
                    <p className="px-2">
                      {dialogDetail.detail !== null
                        ? dialogDetail.detail.fullName
                        : "No data"}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium px-2 py-1">Email</p>
                    <p className="px-2">
                      {dialogDetail.detail !== null
                        ? dialogDetail.detail.email
                        : "No data"}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium px-2 py-1">Số điện thoại</p>
                    <p className="px-2">
                      {dialogDetail.detail.phoneNumber
                        ? dialogDetail.detail.phoneNumber
                        : "Không có dữ liệu"}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium px-2 py-1">Vai trò</p>
                    <p className="px-2">
                      {dialogDetail.detail !== null
                        ? dialogDetail.detail.roles.map(role => {
                          if(role === "admin"){
                            return <Badge className='destructive'>Quản trị viên</Badge>
                          }else if(role === "user"){
                            return <Badge>Tài khoản thường</Badge>
                          }
                        })
                        : "No data"}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium px-2 py-1">Trạng thái</p>
                    <p className="px-2">
                      <a
                        href={
                          dialogDetail.detail !== null
                            ? dialogDetail.detail.status
                            : "No data"
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline"
                      >
                        Xem tài liệu
                      </a>
                    </p>
                  </div>
                  <div className="flex flex-col">
                    <p className="font-medium px-2 py-1 h-fit">Ngày tạo</p>
                    <p className="px-2 flex flex-row gap-2">
                      {dialogDetail.detail !== null
                        ? new Date(dialogDetail.detail.createdAt).toLocaleDateString("vi-VN")
                        : "No data"}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium px-2 py-1">Lần cuối cập nhập</p>
                    <p className="px-2">
                      {dialogDetail.detail !== null
                        ? new Date(dialogDetail.detail.updatedAt).toLocaleDateString("vi-VN")
                        : "No data"}
                    </p>
                  </div>
                </div>
      
                <DialogFooter>
                  <DialogClose asChild>
                      <Button
                        variant="outline"
                        className="cursor-pointer"
                        onClick={() => setDialogDetail({...dialogDetail, isOpen: false})}
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

export default UserManagement