import { Loader2 } from "lucide-react";
export default function Spinner() {
  return (
    <div className="flex justify-center items-center py-20">
      <Loader2 className="animate-spin text-ytred" size={40} />
    </div>
  );
}
