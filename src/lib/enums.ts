import { ShopCategory } from "@prisma/client";
import { MobileIcon } from "@radix-ui/react-icons";
import { ComputerIcon, LucideIcon, PhoneIcon } from "lucide-react";

export const allCategories = Object.values(ShopCategory)
export const shopCategories:Record<ShopCategory,{name:string,icon:LucideIcon}>={
    LIBERTY_COMPUTERS: {
        name: "Liberty Computers",
        icon: ComputerIcon
    },
    MCP: {
        name: "Mr Clean Piece",
        icon: PhoneIcon
    }
}