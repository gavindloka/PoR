"use client"

import type React from "react"
import { useCallback, useState, forwardRef, useEffect } from "react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { ChevronDown, CheckIcon } from "lucide-react"

const categories = [
    { id: "technology", name: "Technology" },
    { id: "healthcare", name: "Healthcare" },
    { id: "education", name: "Education" },
    { id: "business", name: "Business" },
    { id: "finance", name: "Finance" },
    { id: "marketing", name: "Marketing" },
    { id: "entertainment", name: "Entertainment" },
    { id: "sports", name: "Sports" },
    { id: "travel", name: "Travel" },
    { id: "food", name: "Food" },
    { id: "fashion", name: "Fashion" },
    { id: "lifestyle", name: "Lifestyle" },
    { id: "social-issues", name: "Social Issues" },
    { id: "politics", name: "Politics" },
    { id: "environment", name: "Environment" },
    { id: "science", name: "Science" },
    { id: "psychology", name: "Psychology" },
    { id: "consumer-behavior", name: "Consumer Behavior" },
    { id: "education-research", name: "Education Research" },
    { id: "economics", name: "Economics" },
    { id: "job-satisfaction", name: "Job Satisfaction" },
    { id: "customer-feedback", name: "Customer Feedback" },
    { id: "product-research", name: "Product Research" },
    { id: "market-trends", name: "Market Trends" },
    { id: "real-estate", name: "Real Estate" },
    { id: "public-opinion", name: "Public Opinion" },
    { id: "self-improvement", name: "Self-Improvement" },
    { id: "parenting", name: "Parenting" },
    { id: "mental-health", name: "Mental Health" },
    { id: "relationships", name: "Relationships" },
    { id: "career-development", name: "Career Development" },
    { id: "finance-investment", name: "Finance & Investment" },
    { id: "technology-adoption", name: "Technology Adoption" },
    { id: "online-shopping", name: "Online Shopping" },
    { id: "workplace-culture", name: "Workplace Culture" },
    { id: "media-consumption", name: "Media Consumption" },
    { id: "gaming", name: "Gaming" },
    { id: "transportation", name: "Transportation" },
    { id: "sustainability", name: "Sustainability" },
    { id: "government-policy", name: "Government Policy" },
    { id: "cryptocurrency", name: "Cryptocurrency" },
    { id: "blockchain", name: "Blockchain" },
    { id: "artificial-intelligence", name: "Artificial Intelligence" },
    { id: "space-exploration", name: "Space Exploration" },
    { id: "pet-care", name: "Pet Care" },
    { id: "fitness-wellness", name: "Fitness & Wellness" },
    { id: "human-rights", name: "Human Rights" },
    { id: "volunteering", name: "Volunteering" }
];

  
export interface Category {
  id: string
  name: string
}

interface CategoryDropdownProps {
  options?: Category[]
  onChange?: (category: Category) => void
  defaultValue?: string
  disabled?: boolean
  placeholder?: string
  slim?: boolean
}

const CategoryDropdownComponent = (
  {
    options = categories,
    onChange,
    value, 
    disabled = false,
    placeholder = "Select an category",
    slim = false,
    ...props
  }: CategoryDropdownProps & { value?: string }, 
  ref: React.ForwardedRef<HTMLButtonElement>,
) => {
  const [open, setOpen] = useState(false);

  const selectedCategory = options.find((category) => category.id === value);

  const handleSelect = useCallback(
    (category: Category) => {
      console.log("💼 Selected Category:", category);
      onChange?.(category);
      setOpen(false);
    },
    [onChange],
  );

  const triggerClasses = cn(
    "flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
    slim === true && "w-20",
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger ref={ref} className={triggerClasses} disabled={disabled} {...props}>
        {selectedCategory ? (
          <span className="flex-grow overflow-hidden text-left">{selectedCategory.name}</span>
        ) : (
          <span className="text-gray-600">{placeholder}</span>
        )}
        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </PopoverTrigger>
      <PopoverContent collisionPadding={10} side="bottom" className="min-w-[--radix-popper-anchor-width] p-0">
        <Command className="w-full max-h-[200px] sm:max-h-[270px]">
          <CommandList>
            <div className="sticky top-0 z-10 bg-popover">
              <CommandInput placeholder="Search category..." />
            </div>
            <CommandEmpty>No category found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.id}
                  className="flex items-center justify-between"
                  onSelect={() => handleSelect(option)}
                >
                  <span>{option.name}</span>
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      option.id === selectedCategory?.id ? "opacity-100" : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

CategoryDropdownComponent.displayName = "CategoryDropdownComponent";
export const CategoryDropdown = forwardRef(CategoryDropdownComponent);


