"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { OrderStatus } from "@prisma/client"
import { useMutation } from "@tanstack/react-query"
import { Check, ChevronsUpDown } from "lucide-react"
import { changeOrderStatus } from "./action"
import { useRouter } from "next/navigation"

const LABLE_MAP: Record<keyof typeof OrderStatus, string> = {
  awaiting_shipment: "Awaiting Shipment",
  shipped: "Shipped",
  fulfilled: "Fulfilled"
}


const StatusDropDown = ({id, orderStatus}: {
  id: string,
  orderStatus: OrderStatus
}) => {
  const router = useRouter()
const { mutate } = useMutation({
  mutationKey: ["updateOrderStatus"],
  mutationFn: changeOrderStatus,
  onSuccess: () => router.refresh()
})

 return (
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button 
    variant='outline' 
    className="w-52 flex justify-between items-center">
  {LABLE_MAP[orderStatus]}
<ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50"/>
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    {Object.keys(OrderStatus).map((status)=>(
   <DropdownMenuItem key={status} className={cn("flex text-sm gap-1 items-center p-2.5 cursor-default hover:bg-zinc-100",
   {
    "bg-zinc-100": status === orderStatus
   }
   )}
   onClick={() => mutate({id, newStatus: status as OrderStatus})}
   >
    <Check
    className={cn('mr-2 size-4 text-primary',
        orderStatus === status ? "opacity-100" : "opacity-0"
    )}/>
    {LABLE_MAP[status as OrderStatus]}
   </DropdownMenuItem>
    ))}
  </DropdownMenuContent>
</DropdownMenu>
 )
}

export default StatusDropDown