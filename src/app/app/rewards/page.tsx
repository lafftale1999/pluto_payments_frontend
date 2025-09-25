"use client"

import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export default function rewards() {

    const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["invoices"],
    queryFn: () => api.getInvoices()
  });

  if(isSuccess) {
    console.log(data)
  }

    return(
        <div className="flex justify-center bg-amber-300">Hey</div>
    )
}