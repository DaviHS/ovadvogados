
"use client"

import Form from "./_components/form"

export default function SignIn() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFFAED] p-4 relative">
      <div className="w-full max-w-md mx-auto">
        <Form />
      </div>
      <div className="mt-6 text-center">
        <a href="/" className="text-sm text-secondary hover:underline">
          ← Voltar para a página inicial
        </a>
      </div>
    </div>
  )
}
