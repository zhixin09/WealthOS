import { NextResponse } from "next/server";
import portfolioData from "@/data/mock-portfolio.json";

export async function GET() {
    return NextResponse.json(portfolioData);
}
