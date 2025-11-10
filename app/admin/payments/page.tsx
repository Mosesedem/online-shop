"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"

interface Payment {
  id: string
  transactionId: string
  amount: number
  provider: string
  status: string
  createdAt: string
  order: {
    orderNumber: string
    email: string
  }
}

export default function PaymentsAdminPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchPayments()
  }, [])

  const fetchPayments = async () => {
    try {
      const res = await fetch("/api/admin/payments")
      if (res.ok) {
        const data = await res.json()
        setPayments(data)
      }
    } catch (error) {
      console.error("Failed to fetch payments:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Payments</h1>
        <p className="text-muted-foreground">Track all payment transactions</p>
      </div>

      {isLoading ? (
        <p className="text-center text-muted-foreground">Loading...</p>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold">Transaction ID</th>
                    <th className="text-left py-3 px-4 font-semibold">Order</th>
                    <th className="text-left py-3 px-4 font-semibold">Amount</th>
                    <th className="text-left py-3 px-4 font-semibold">Provider</th>
                    <th className="text-left py-3 px-4 font-semibold">Status</th>
                    <th className="text-left py-3 px-4 font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => (
                    <tr key={payment.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4 font-mono text-xs">{payment.transactionId?.slice(0, 12)}...</td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-semibold">#{payment.order.orderNumber}</p>
                          <p className="text-xs text-muted-foreground">{payment.order.email}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-semibold">₦{payment.amount.toLocaleString()}</td>
                      <td className="py-3 px-4 capitalize">{payment.provider}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            payment.status === "COMPLETED"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {payment.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {new Date(payment.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </main>
  )
}
