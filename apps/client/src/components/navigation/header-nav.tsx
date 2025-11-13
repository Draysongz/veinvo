import { ArrowLeft, ArrowRight, ChevronRight, UserRound } from "lucide-react";

export default function HeaderNavigation() {
  return (
    <header className="h-12 p-4 flex justify-between items-center ">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 hover:bg-purple-300 flex items-center justify-center rounded-full">
            <ArrowLeft className="w-4 hover:cursor-pointer" />
          </div>
          <div className="w-8 h-8 hover:bg-purple-300 flex items-center justify-center rounded-full">
            <ArrowRight className="w-4 hover:cursor-pointer" />
          </div>
        </div>
        <div className="flex items-center">
          <div className="flex items-center gap-3">
            <span className="text-sm">IMAGE</span>
            <ChevronRight className="w-4" />
            <span className="text-sm">DYNAMIC PATH</span>
          </div>
        </div>
      </div>
      <button className="w-8 h-8 flex justify-center items-center bg-gray-100 rounded-full hover:cursor-pointer">
        <UserRound className="w-4" />
      </button>
    </header>
  );
}
