import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { useState } from "react";

interface MultiSelectProps {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  className?: string;
  allowCustom?: boolean;
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Pasirinkite...",
  className,
  allowCustom = false,
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [customValue, setCustomValue] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);

  const handleToggle = (value: string) => {
    const newSelected = selected.includes(value)
      ? selected.filter(item => item !== value)
      : [...selected, value];
    onChange(newSelected);
  };

  const handleRemove = (value: string) => {
    onChange(selected.filter(item => item !== value));
  };

  const handleAddCustom = () => {
    if (customValue.trim() && !selected.includes(customValue.trim())) {
      onChange([...selected, customValue.trim()]);
      setCustomValue("");
      setShowCustomInput(false);
    }
  };

  const allOptions = [...new Set([...options, ...selected])];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
        >
          <div className="flex gap-1 flex-wrap">
            {selected.length === 0 ? (
              <span className="text-muted-foreground">{placeholder}</span>
            ) : (
              selected.slice(0, 3).map(value => (
                <Badge key={value} variant="secondary" className="mr-1">
                  {value}
                </Badge>
              ))
            )}
            {selected.length > 3 && <Badge variant="secondary">+{selected.length - 3}</Badge>}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <ScrollArea className="h-64">
          <div className="p-2">
            {allOptions.map(option => (
              <div
                key={option}
                className="flex items-center space-x-2 p-2 hover:bg-accent rounded-sm cursor-pointer"
                onClick={() => handleToggle(option)}
              >
                <Checkbox checked={selected.includes(option)} />
                <span className="flex-1">{option}</span>
                {selected.includes(option) && <Check className="h-4 w-4" />}
              </div>
            ))}
            {allowCustom && (
              <div className="border-t mt-2 pt-2">
                {!showCustomInput ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full"
                    onClick={() => setShowCustomInput(true)}
                  >
                    <em>Įvesti naują...</em>
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Input
                      placeholder="Nauja kategorija"
                      value={customValue}
                      onChange={e => setCustomValue(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddCustom();
                        }
                      }}
                    />
                    <Button size="sm" onClick={handleAddCustom}>
                      Pridėti
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </ScrollArea>
        {selected.length > 0 && (
          <div className="border-t p-2">
            <div className="flex flex-wrap gap-1">
              {selected.map(value => (
                <Badge key={value} variant="secondary" className="gap-1">
                  {value}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={e => {
                      e.stopPropagation();
                      handleRemove(value);
                    }}
                  />
                </Badge>
              ))}
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
