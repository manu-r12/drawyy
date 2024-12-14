"use client";
import Dashboard from "@/components/dashboard/dashboard";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }

        // Once status is checked, stop loading
        if (status === "authenticated" || status === "unauthenticated") {
            setIsLoading(false);
        }
    }, [status, router]);


    if (isLoading) {
       return null
    }

    console.log(session?.user.id)

    return (
        <div>
            <Dashboard />
        </div>
    );
}
