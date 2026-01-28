
import { NextResponse } from "next/server";
import { createCustomTripInquiry } from "@/lib/mongo/custom-trips";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Basic validation
        if (!body.email || !body.fullName) {
            return NextResponse.json(
                { error: "Name and Email are required" },
                { status: 400 }
            );
        }

        const result = await createCustomTripInquiry(body);

        // Fetch recommendations
        let recommendations: any[] = [];
        try {
            const { getRecommendations } = await import("@/lib/mongo/trips");
            recommendations = await getRecommendations(body);
        } catch (err) {
            console.error("Failed to fetch recommendations", err);
        }

        return NextResponse.json(
            {
                message: "Inquiry submitted successfully",
                id: result._id,
                recommendations
            },
            { status: 201 }
        );
    } catch (error: any) {
        console.error("Error submitting custom trip inquiry:", error);
        return NextResponse.json(
            { error: "Failed to submit inquiry" },
            { status: 500 }
        );
    }
}
