"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";


export default function app() {
    const router = useRouter();

    const {data, error, isLoading } = useQuery({
        queryKey: ["me"],
        queryFn: () => api.getAuth()
    });

    if(isLoading) {
        return (
            <p>Loading...</p>
        )
    }
    if(error) {
        router.push("/")
    }

return(
    <div>
        <p>Hello</p>
    </div>
)
}