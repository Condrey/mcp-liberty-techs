import Image from "next/image";
import AddReceipt from "./add-receipt";

export default function Home() {
  return (
   <div className="flex flex-col gap-4 min-h-dvh items-center justify-center">

<div className="w-full max-w-7xl max-w-auto ">
  <AddReceipt/>
  {/* logo  */}
  <h1 className="text-xl max-w-fit w-full mx-auto font-bold uppercase">MCP & Liberty computers</h1>
{/* Graph  */}
{/* Previous receipts  */}
<h1>Previous receipts</h1>
</div>
   </div>
  );
}
