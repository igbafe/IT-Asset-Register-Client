import type { Control } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import DatePicker from "react-datepicker";
import { FormFieldType } from "@/validation/laptopDetailsvalidation";
import "react-datepicker/dist/react-datepicker.css";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Calendar } from "lucide-react";
import type { SelectOption } from "@/types/types";

interface CustomFormField {
  control: Control<any>;
  fieldType: FormFieldType;
  name: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  dateFormat?: string;
  options?: SelectOption[];
  children?: React.ReactNode;
  showTimeSelect?: boolean;
  renderSkeleton?: (field: any) => React.ReactNode;
}

const RenderField = ({
  field,
  props,
}: {
  field: any;
  props: CustomFormField;
}) => {
  const { fieldType, placeholder, showTimeSelect, dateFormat, renderSkeleton } =
    props;
  switch (fieldType) {
    case FormFieldType.INPUT:
      return (
        <div className="flex rounded-lg border border-gray-300 dark:border-gray-600 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
          <FormControl>
            <Input
              placeholder={placeholder}
              {...field}
              className="bg-white dark:bg-gray-800 placeholder:text-gray-400 dark:placeholder:text-gray-500 border-0 h-11 focus-visible:ring-0 focus-visible:ring-offset-0 text-gray-900 dark:text-gray-100"
            />
          </FormControl>
        </div>
      );
    case FormFieldType.DATE_PICKER:
      return (
        <div className="relative w-full">
          <div
            className="flex items-center gap-3 rounded-xl border border-gray-300 dark:border-gray-700 
        bg-white dark:bg-gray-900 px-3 py-2 transition-all 
        focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20"
          >
            {/* Calendar Icon */}
            <Calendar className="h-5 w-5 text-gray-400 dark:text-gray-500 flex-shrink-0" />

            {/* Date Picker Field */}
            <FormControl>
              <DatePicker
                selected={field.value}
                onChange={(date) => field.onChange(date)}
                dateFormat={dateFormat ?? "MM/dd/yyyy"}
                showTimeSelect={showTimeSelect ?? false}
                timeInputLabel="Time:"
                wrapperClassName="w-full"
                className="w-full bg-transparent text-gray-900 dark:text-gray-100 
              placeholder:text-gray-400 dark:placeholder:text-gray-500 
              focus:outline-none cursor-pointer"
                calendarClassName="rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 scale-105"
                popperClassName="z-50"
              />
            </FormControl>
          </div>
        </div>
      );
    case FormFieldType.SELECT:
      return (
        <FormControl>
          <Select onValueChange={field.onChange} value={field.value}>
            <SelectTrigger className="h-11 w-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all text-gray-900 dark:text-gray-100">
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent
              className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-50 max-h-[300px] overflow-y-auto"
              position="popper"
              sideOffset={5}
            >
              {props.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
              {props.children}
            </SelectContent>
          </Select>
        </FormControl>
      );
    case FormFieldType.SKELETON:
      return renderSkeleton ? renderSkeleton(field) : null;
    default:
      break;
  }
};

const CustomFormField = (props: CustomFormField) => {
  const { control, name, label } = props;
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex-1">
          <FormLabel className="text-gray-700 dark:text-gray-300 font-medium">
            {label}
          </FormLabel>

          <RenderField field={field} props={props} />

          <FormMessage className="text-red-500 dark:text-red-400" />
        </FormItem>
      )}
    />
  );
};

export default CustomFormField;
