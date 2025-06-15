
"use client"

import Logo from "./_components/logo"
import Form from "./_components/form"

export default function SignIn() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#e6f0fb] p-4 relative">
      <Logo />
      <Form />
      <div className="mt-6 text-center">
        <a href="/" className="text-sm text-primary hover:underline">
          ← Voltar para a página inicial
        </a>
      </div>
    </div>
  )
}
