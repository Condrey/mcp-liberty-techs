"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCustomSearchParams } from "@/hooks/use-custom-search-params";
import { PARAM_NAME_CATEGORY } from "@/lib/constants";
import { allCategories, shopCategories } from "@/lib/enums";
import { Loader2Icon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useTransition } from "react";

export default function BtnChooseCategory() {
  const searchParams = useSearchParams();
  const categorySearchParams = searchParams.get(PARAM_NAME_CATEGORY);
  const { updateSearchParamsAndNavigate } = useCustomSearchParams();
  const [isPending, startTransition] = useTransition();
  return (
    <Select
      defaultValue={decodeURIComponent(categorySearchParams || allCategories[0])}
      onValueChange={(value) =>
        startTransition(() =>
          updateSearchParamsAndNavigate(PARAM_NAME_CATEGORY, value)
        )
      }
      
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select shop category" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Categories</SelectLabel>

          {allCategories.map((c) => {
            const category = shopCategories[c];
            const Icon = category.icon;
            return (
              <SelectItem value={c} key={c}>
                <div className="flex gap-2">
                  {isPending ? (
                    <Loader2Icon className="animate-spin size-4" />
                  ) : (
                    <Icon className="size-4" />
                  )}
                  <span>{category.name}</span>
                </div>
              </SelectItem>
            );
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
