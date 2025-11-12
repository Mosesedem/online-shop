import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import * as XLSX from "xlsx";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ message: "No file provided" }, { status: 400 });
    }

    // Read the Excel file
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(worksheet);

    const products = [];
    const errors = [];

    for (let i = 0; i < data.length; i++) {
      const row: any = data[i];
      
      try {
        // Validate required fields
        if (!row["Product Name"] || !row["Description"] || !row["Price"] || !row["Stock"] || !row["Category Name"]) {
          errors.push(`Row ${i + 2}: Missing required fields`);
          continue;
        }

        // Find category by name
        const category = await prisma.category.findFirst({
          where: { name: row["Category Name"] },
        });

        if (!category) {
          errors.push(`Row ${i + 2}: Category "${row["Category Name"]}" not found`);
          continue;
        }

        // Parse images
        const images = row["Image URLs"] 
          ? row["Image URLs"].split(",").map((url: string) => url.trim())
          : [];

        // Generate slug
        const slug = row["Product Name"]
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");

        // Create product
        const product = await prisma.product.create({
          data: {
            name: row["Product Name"],
            slug: `${slug}-${Date.now()}`, // Add timestamp to ensure uniqueness
            description: row["Description"],
            price: parseFloat(row["Price"]),
            stock: parseInt(row["Stock"]),
            sku: row["SKU"] || null,
            categoryId: category.id,
            ageCategory: row["Age Category"] || "ADULT_18",
            images,
          },
        });

        products.push(product);
      } catch (error) {
        console.error(`Error processing row ${i + 2}:`, error);
        errors.push(`Row ${i + 2}: ${error instanceof Error ? error.message : "Unknown error"}`);
      }
    }

    return NextResponse.json({
      message: "Import completed",
      count: products.length,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error("Failed to import products:", error);
    return NextResponse.json(
      { message: "Failed to import products", error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
