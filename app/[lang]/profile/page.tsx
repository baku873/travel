import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import ProfileClient from "./ProfileClient";

export default async function ProfilePage({
    params,
}: {
    params: Promise<{ lang: "mn" | "en" | "ko" | "de" }>;
}) {
    const { userId } = await auth();

    if (!userId) {
        redirect("/sign-in?redirect_url=/profile");
    }

    const { lang } = await params;

    return <ProfileClient lang={lang} />;
}
