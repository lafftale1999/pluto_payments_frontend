"use client"

import api from "@/lib/axios"
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"

export default function Logout() {

    const router = useRouter();

    const logout = useMutation({
        mutationFn: () => api.logout(),
        onSuccess: () => {
            router.push("/")
        }
    })

    return(
        <div>
            <button onClick={() => logout.mutate()}>Sign out</button>
        </div>
    )
}