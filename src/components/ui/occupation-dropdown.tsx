"use client"

import type React from "react"
import { useCallback, useState, forwardRef, useEffect } from "react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { ChevronDown, CheckIcon } from "lucide-react"
import { Country } from "./country-dropdown"

const occupations = [
    { id: "software-engineer", name: "Software Engineer" },
    { id: "doctor", name: "Doctor" },
    { id: "teacher", name: "Teacher" },
    { id: "designer", name: "Designer" },
    { id: "accountant", name: "Accountant" },
    { id: "lawyer", name: "Lawyer" },
    { id: "nurse", name: "Nurse" },
    { id: "marketing-manager", name: "Marketing Manager" },
    { id: "chef", name: "Chef" },
    { id: "architect", name: "Architect" },
    { id: "writer", name: "Writer" },
    { id: "sales-representative", name: "Sales Representative" },
    { id: "researcher", name: "Researcher" },
    { id: "consultant", name: "Consultant" },
    { id: "entrepreneur", name: "Entrepreneur" },
    { id: "mechanical-engineer", name: "Mechanical Engineer" },
    { id: "civil-engineer", name: "Civil Engineer" },
    { id: "electrical-engineer", name: "Electrical Engineer" },
    { id: "aerospace-engineer", name: "Aerospace Engineer" },
    { id: "biomedical-engineer", name: "Biomedical Engineer" },
    { id: "cybersecurity-analyst", name: "Cybersecurity Analyst" },
    { id: "data-scientist", name: "Data Scientist" },
    { id: "web-developer", name: "Web Developer" },
    { id: "ux-ui-designer", name: "UX/UI Designer" },
    { id: "product-manager", name: "Product Manager" },
    { id: "project-manager", name: "Project Manager" },
    { id: "network-administrator", name: "Network Administrator" },
    { id: "database-administrator", name: "Database Administrator" },
    { id: "ai-engineer", name: "AI Engineer" },
    { id: "blockchain-developer", name: "Blockchain Developer" },
    { id: "ethical-hacker", name: "Ethical Hacker" },
    { id: "graphic-designer", name: "Graphic Designer" },
    { id: "interior-designer", name: "Interior Designer" },
    { id: "fashion-designer", name: "Fashion Designer" },
    { id: "photographer", name: "Photographer" },
    { id: "videographer", name: "Videographer" },
    { id: "film-director", name: "Film Director" },
    { id: "musician", name: "Musician" },
    { id: "actor", name: "Actor" },
    { id: "voice-actor", name: "Voice Actor" },
    { id: "choreographer", name: "Choreographer" },
    { id: "journalist", name: "Journalist" },
    { id: "editor", name: "Editor" },
    { id: "public-relations-specialist", name: "Public Relations Specialist" },
    { id: "social-media-manager", name: "Social Media Manager" },
    { id: "event-planner", name: "Event Planner" },
    { id: "human-resources-specialist", name: "Human Resources Specialist" },
    { id: "real-estate-agent", name: "Real Estate Agent" },
    { id: "personal-trainer", name: "Personal Trainer" },
    { id: "fitness-coach", name: "Fitness Coach" },
    { id: "nutritionist", name: "Nutritionist" },
    { id: "psychologist", name: "Psychologist" },
    { id: "counselor", name: "Counselor" },
    { id: "social-worker", name: "Social Worker" },
    { id: "veterinarian", name: "Veterinarian" },
    { id: "pharmacist", name: "Pharmacist" },
    { id: "dentist", name: "Dentist" },
    { id: "radiologist", name: "Radiologist" },
    { id: "physical-therapist", name: "Physical Therapist" },
    { id: "speech-therapist", name: "Speech Therapist" },
    { id: "police-officer", name: "Police Officer" },
    { id: "firefighter", name: "Firefighter" },
    { id: "military-officer", name: "Military Officer" },
    { id: "airline-pilot", name: "Airline Pilot" },
    { id: "flight-attendant", name: "Flight Attendant" },
    { id: "customs-officer", name: "Customs Officer" },
    { id: "diplomat", name: "Diplomat" },
    { id: "judge", name: "Judge" },
    { id: "paralegal", name: "Paralegal" },
    { id: "legislative-assistant", name: "Legislative Assistant" },
    { id: "economist", name: "Economist" },
    { id: "statistician", name: "Statistician" },
    { id: "mathematician", name: "Mathematician" },
    { id: "epidemiologist", name: "Epidemiologist" },
    { id: "geologist", name: "Geologist" },
    { id: "astrophysicist", name: "Astrophysicist" },
    { id: "game-developer", name: "Game Developer" },
    { id: "robotics-engineer", name: "Robotics Engineer" },
    { id: "forensic-scientist", name: "Forensic Scientist" },
    { id: "zoologist", name: "Zoologist" }
  ];
  
export interface Occupation {
  id: string
  name: string
}

interface OccupationDropdownProps {
  options?: Occupation[]
  onChange?: (occupation: Occupation) => void
  defaultValue?: string
  disabled?: boolean
  placeholder?: string
  slim?: boolean
}

const OccupationDropdownComponent = (
  {
    options = occupations,
    onChange,
    defaultValue,
    disabled = false,
    placeholder = "Select an occupation",
    slim = false,
    ...props
  }: OccupationDropdownProps,
  ref: React.ForwardedRef<HTMLButtonElement>,
) => {
  const [open, setOpen] = useState(false)
  const [selectedOccupation, setSelectedOccupation] = useState<Occupation | undefined>(undefined)

  useEffect(() => {
    if (defaultValue) {
      const initialOccupation = options.find((occupation) => occupation.id === defaultValue)
      if (initialOccupation) {
        setSelectedOccupation(initialOccupation)
      } else {
        setSelectedOccupation(undefined)
      }
    } else {
      setSelectedOccupation(undefined)
    }
  }, [defaultValue, options])

  const handleSelect = useCallback(
    (occupation: Occupation) => {
      console.log("💼 OccupationDropdown value: ", occupation)
      setSelectedOccupation(occupation)
      onChange?.(occupation)
      setOpen(false)
    },
    [onChange],
  )

  const triggerClasses = cn(
    "flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
    slim === true && "w-20",
  )
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger ref={ref} className={triggerClasses} disabled={disabled} {...props}>
        {selectedOccupation ? (
          <span className="flex-grow overflow-hidden text-left">{selectedOccupation.name}</span>
        ) : (
          <span className="text-gray-600">{placeholder}</span>
        )}
        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </PopoverTrigger>
      <PopoverContent collisionPadding={10} side="bottom" className="min-w-[--radix-popper-anchor-width] p-0">
        <Command className="w-full max-h-[200px] sm:max-h-[270px]">
          <CommandList>
            <div className="sticky top-0 z-10 bg-popover">
              <CommandInput placeholder="Search occupation..." />
            </div>
            <CommandEmpty>No occupation found.</CommandEmpty>
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
                      option.id === selectedOccupation?.id ? "opacity-100" : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

OccupationDropdownComponent.displayName = "OccupationDropdownComponent"

export const OccupationDropdown = forwardRef(OccupationDropdownComponent)

