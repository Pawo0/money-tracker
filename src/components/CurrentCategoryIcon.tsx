import type {LucideProps, LucideIcon} from "lucide-react"
import { getIconByName } from "@/lib/utils";

interface CurrentCategoryIconProps extends LucideProps{
  categoryName: string | undefined;
}

export default function CurrentCategoryIcon({categoryName, ...props}: CurrentCategoryIconProps) {
  if (!categoryName) {
    const DefaultIcon: LucideIcon = getIconByName("HelpCircle");
    return <DefaultIcon {...props} />
  }
  const Icon: LucideIcon = getIconByName(categoryName);
  return <Icon {...props} />
}