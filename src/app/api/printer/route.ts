import { getLocaleCurrency } from "@/lib/utils";
import { Image, Printer } from "@node-escpos/core";
import NetworkAdapter from "@node-escpos/network-adapter";
import { Receipt, ShopCategory } from "@prisma/client";
import { format } from "date-fns";
import { join } from "path";

export const maxDuration = 60; // 60 seconds
export const dynamic = "force-dynamic";
export async function POST(req: Request) {
  const apiAddress = "192.168.28.38";
  try {
    const {
      id,
      amount,
      balance,
      client,
      contact,
      createdAt,
      name,
      serialNumber,
      updatedAt,
      category,
      model,
    }: Receipt = await req.json();
    const isMCP = category === ShopCategory.MCP;
    const shopSeller = "Oruk Oscar";
    const shopAddress = "Opp. KCB bank, 2nd Floor, Oyam Road";
    const ShopContact = "07750635211";
    const shopEmail = "libertycomputers@gmail.com";

    let device = new NetworkAdapter(apiAddress, 9100);
    const options = { encoding: "GB18030" /* default */ };
    let printer = new Printer(device, options);
    try {
      device.open(async function (error) {
        if (error) {
          console.error("Error occurred while opening the printer: ", error);
          return Response.json({
            error: "Failed to open the printer.",
            status: "5000",
            statusText: "Failed in printer",
          });
        }
        const filePath = join(
          process.cwd(),
          isMCP ? "src/app/assets/mcp.png" : "src/app/assets/liberty.png"
        );
        const image = await Image.load(filePath);
        // Logo
        printer.image(image, "s8");
        printer
          .beep(1, 1)
          .font("a")
          .size(2, 2)
          .text("") // Empty line for spacing
          .text("") // Empty line for spacing
          .text("") // Empty line for spacing
          .style("B")
          .align("CT")
          .text("SALES RECEIPT.")
          .text("") // Empty line for spacing
          .text("") // Empty line for spacing
          .text("") // Empty line for spacing
          .size(1, 1)
          .style("NORMAL")
          .align("LT")
          .style("B")
          .text("Buyer")
          .style("NORMAL")
          .text(client)
          .text(contact)
          .text("") // Empty line for spacing
          .align("LT")
          .style("B")
          .text("") // Empty line for spacing
          .text("") // Empty line for spacing
          .text("") // Empty line for spacing

          .text("Transaction items")
          .style("NORMAL");

        printer.text(`1 x ${name}`);
        printer.text(getLocaleCurrency(amount + balance));
        printer.text(serialNumber || "N/A");

        // Calculations
        printer
          .text("------------------------------------------------")
          .tableCustom([
            { text: "Total:", style: "B", width: 0.5 },
            {
              text: getLocaleCurrency(amount + balance),
              style: "B",
              align: "RIGHT",
              width: 0.5,
            },
          ])
          .tableCustom([
            { text: "Paid:", style: "B", width: 0.5 },
            {
              text: getLocaleCurrency(amount),
              style: "B",
              align: "RIGHT",
              width: 0.5,
            },
          ])
          .tableCustom([
            { text: "Balance", style: "B", width: 0.5 },
            {
              text: getLocaleCurrency(balance),
              style: "B",
              align: "RIGHT",
              width: 0.5,
            },
          ])
          // Payment details
          .text("------------------------------------------------")
          .style("B")
          .style("NORMAL");

        // Seller and store details
        printer
          .text("")
          .style("NORMAL")
          .align("CT")
          .text(`Served by: ${shopSeller}`)
          .text(`@ ${shopAddress}`)
          .text(`Kitgum stage`)
          .text(`${shopEmail} · ${ShopContact}`)
          .text(format(updatedAt, "PPPpp"));

        // Finalize
        printer.text("").cut().close();
      });
    } catch (error) {
      return Response.json("Printer error");
    }
    return Response.json("Printing receipt...");
  } catch (error) {
    console.error("Server error: ", error);
    return Response.json("Internal server error");
  }
}
