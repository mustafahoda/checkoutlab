"use server";

import Formula from "@/schema/Formula";
import dbConnect from "@/lib/db";

export async function getFormulas() {
  try {
    await dbConnect();

    const formulas = await Formula.find({
      public: true,
    })
      .select("title description integrationType txVariant _id public")
      .sort({ title: 1 })
      .lean();

    return formulas.map((formula) => ({
      ...formula,
      title: formula.title || "No title provided",
      description: formula.description || "No description provided",
      icon: formula.icon || "Calculator",
      // TODO: Implement builtBy either community or Adyen
      builtBy: "Adyen",
    }));
  } catch (error) {
    console.error("Error fetching formulas:", error);
    throw new Error("Failed to fetch formulas");
  }
}
